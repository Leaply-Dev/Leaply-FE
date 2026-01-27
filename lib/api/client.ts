import type { AuthResponse, ErrorDetails } from "@/lib/generated/api/models";
import { performLogout } from "../auth/logout";
import { useUserStore } from "../store/userStore";

// Generic ApiResponse type to match OpenAPI schema structure
export interface ApiResponse<T> {
	success?: boolean;
	message?: string;
	data?: T;
	error?: ErrorDetails;
	timestamp?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const isDev = process.env.NODE_ENV === "development";

// Special marker for cookie-based authentication (OAuth)
const COOKIE_AUTH_TOKEN = "COOKIE_AUTH";

// Token lifetime in seconds (matches backend JWT config)
export const TOKEN_LIFETIME_SECONDS = 900; // 15 minutes

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

// Refresh timeout in milliseconds (prevents hanging indefinitely)
const REFRESH_TIMEOUT_MS = 10000;

// Retry configuration for token refresh
const MAX_REFRESH_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 1000; // 1s, 2s, 4s exponential backoff

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if an error is retryable (network errors, 5xx server errors)
 * 4xx errors (like invalid token) should not be retried
 */
function isRetryableError(error: unknown, status?: number): boolean {
	// Network errors are retryable
	if (error instanceof TypeError && error.message.includes("fetch")) {
		return true;
	}
	// 5xx server errors are retryable
	if (status && status >= 500) {
		return true;
	}
	// Timeout errors are retryable
	if (error instanceof Error && error.message.includes("timeout")) {
		return true;
	}
	return false;
}

function subscribeTokenRefresh(callback: (token: string | null) => void) {
	refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken: string | null) {
	for (const callback of refreshSubscribers) {
		callback(newToken);
	}
	refreshSubscribers = [];
}

function clearRefreshSubscribers() {
	for (const callback of refreshSubscribers) {
		callback(null);
	}
	refreshSubscribers = [];
}

export function isCookieAuth(): boolean {
	const { accessToken, refreshToken } = useUserStore.getState();
	return (
		accessToken === COOKIE_AUTH_TOKEN || refreshToken === COOKIE_AUTH_TOKEN
	);
}

/**
 * Attempt to refresh the access token using the refresh token
 * Returns the new access token on success, null on failure
 * For cookie-based auth, validates session and returns special marker
 * Includes retry logic with exponential backoff for transient failures
 */
export async function refreshAccessToken(
	retryCount = 0,
): Promise<string | null> {
	const { refreshToken, setTokens } = useUserStore.getState();

	// For cookie-based auth, validate session with backend
	// Backend may have refreshed the httpOnly cookie automatically
	if (isCookieAuth()) {
		if (isDev)
			console.log("Cookie-based auth: validating session with backend");
		try {
			const response = await fetch(`${API_URL}/v1/auth/me`, {
				credentials: "include",
			});
			if (response.ok) {
				// Session is still valid, update local expiry tracking
				const { login, profile, isOnboardingComplete } =
					useUserStore.getState();
				if (profile) {
					login(
						profile,
						COOKIE_AUTH_TOKEN,
						COOKIE_AUTH_TOKEN,
						TOKEN_LIFETIME_SECONDS,
						isOnboardingComplete,
					);
				}
				if (isDev) console.log("OAuth session validated and extended");
				return COOKIE_AUTH_TOKEN;
			}
			// Session expired
			if (isDev) console.warn("OAuth session expired");
			return null;
		} catch (error) {
			if (retryCount < MAX_REFRESH_RETRIES && isRetryableError(error)) {
				const delay = RETRY_BASE_DELAY_MS * 2 ** retryCount;
				if (isDev)
					console.log(
						`OAuth validation failed, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_REFRESH_RETRIES})`,
					);
				await sleep(delay);
				return refreshAccessToken(retryCount + 1);
			}
			if (isDev) console.error("OAuth session validation error:", error);
			return null;
		}
	}

	if (!refreshToken) {
		if (isDev) console.warn("No refresh token available");
		return null;
	}

	try {
		const response = await fetch(`${API_URL}/v1/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		// Check if error is retryable (5xx server errors)
		if (!response.ok) {
			if (
				retryCount < MAX_REFRESH_RETRIES &&
				isRetryableError(null, response.status)
			) {
				const delay = RETRY_BASE_DELAY_MS * 2 ** retryCount;
				if (isDev)
					console.log(
						`Token refresh failed with ${response.status}, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_REFRESH_RETRIES})`,
					);
				await sleep(delay);
				return refreshAccessToken(retryCount + 1);
			}
			if (isDev)
				console.warn("Token refresh failed with status:", response.status);
			return null;
		}

		const data = (await response.json()) as ApiResponse<AuthResponse>;

		if (data.success && data.data) {
			const {
				accessToken,
				refreshToken: newRefreshToken,
				expiresIn,
			} = data.data;
			// OpenAPI schema has these as optional, but they should exist if success is true
			if (accessToken && newRefreshToken && expiresIn) {
				setTokens(accessToken, newRefreshToken, expiresIn);
				if (isDev) console.log("Token refreshed successfully");
				return accessToken;
			}
		}

		return null;
	} catch (error) {
		// Retry on network/transient errors
		if (retryCount < MAX_REFRESH_RETRIES && isRetryableError(error)) {
			const delay = RETRY_BASE_DELAY_MS * 2 ** retryCount;
			if (isDev)
				console.log(
					`Token refresh error, retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_REFRESH_RETRIES})`,
				);
			await sleep(delay);
			return refreshAccessToken(retryCount + 1);
		}
		if (isDev) console.error("Token refresh error:", error);
		return null;
	}
}

/**
 * Handle 401 Unauthorized - attempt token refresh before logging out
 * Includes timeout to prevent hanging indefinitely on network issues
 * Added safeguard: Don't logout if token was just issued (within 10 seconds)
 */
async function handleUnauthorized(): Promise<string | null> {
	if (typeof window === "undefined") return null;

	const { isAuthenticated, tokenExpiresAt } = useUserStore.getState();
	if (!isAuthenticated) return null;

	// For cookie-based auth, don't try to refresh or logout
	// The backend manages session via httpOnly cookies
	// If session is truly expired, let the error propagate and handle in UI
	if (isCookieAuth()) {
		if (isDev) console.log("Cookie-based auth 401: session may be expired");
		// Don't logout here - let AuthProvider or the calling code decide
		return null;
	}

	// Safeguard: Check if token was just issued (within last 10 seconds)
	// This prevents logout immediately after login due to race conditions
	if (tokenExpiresAt) {
		const tokenAge = Date.now() - (tokenExpiresAt - 900000); // 15 minute token lifetime
		if (tokenAge < 10000) {
			if (isDev)
				console.log(
					"Token was just issued, skipping refresh to avoid race condition",
				);
			return null; // Don't logout, let the caller retry or handle error
		}
	}

	// If already refreshing, wait for it to complete
	if (isRefreshing) {
		return new Promise<string | null>((resolve) => {
			subscribeTokenRefresh((token) => resolve(token));
		});
	}

	isRefreshing = true;

	try {
		// Add timeout to prevent hanging indefinitely
		const newToken = await Promise.race([
			refreshAccessToken(),
			new Promise<null>((_, reject) =>
				setTimeout(
					() => reject(new Error("Token refresh timeout")),
					REFRESH_TIMEOUT_MS,
				),
			),
		]);

		if (newToken && newToken !== COOKIE_AUTH_TOKEN) {
			onTokenRefreshed(newToken);
			return newToken;
		}

		// Refresh failed - clear subscribers and logout synchronously
		console.warn("Token refresh failed. Logging out...");
		clearRefreshSubscribers();
		performLogout({ redirect: "/?expired=true" });
		return null;
	} catch (error) {
		// Handle timeout or network errors
		console.error("Token refresh error:", error);
		clearRefreshSubscribers();
		performLogout({ redirect: "/?expired=true" });
		return null;
	} finally {
		isRefreshing = false;
	}
}

function handleForbidden() {
	if (isDev) console.warn("Access denied (403 Forbidden)");
	// Don't logout on 403 - user is authenticated but lacks permission
}

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
	token?: string;
	_retry?: boolean; // Internal flag to prevent infinite retry loops
}

export class ApiError extends Error {
	constructor(
		public message: string,
		public status: number,
		public code?: string,
		public field?: string,
		public details?: Record<string, unknown>,
		public endpoint?: string,
		public timestamp?: string,
	) {
		super(message);
		this.name = "ApiError";
	}

	/** Get a user-friendly error message */
	getUserMessage(): string {
		switch (this.status) {
			case 400:
				return this.message || "Invalid request. Please check your input.";
			case 401:
				return "Please log in to continue.";
			case 403:
				return "You don't have permission to perform this action.";
			case 404:
				return "The requested resource was not found.";
			case 500:
				return "Something went wrong on our end. Please try again later.";
			default:
				return this.message || "An unexpected error occurred.";
		}
	}

	/** Log detailed error info for debugging */
	logDetails(): void {
		const errorInfo = {
			message: this.message,
			code: this.code || "N/A",
			field: this.field || "N/A",
			details: this.details || {},
			timestamp: this.timestamp || "N/A",
		};

		// Build comprehensive error message
		let logMessage = `API Error [${this.status}] - ${this.endpoint}`;

		// Additional context for 500 errors
		if (this.status >= 500) {
			logMessage += "\n⚠️ Server Error - Check backend logs for details";
			logMessage += `\n   Endpoint: ${this.endpoint}`;
			logMessage += `\n   Message: ${this.message}`;

			if (Object.keys(errorInfo.details).length === 0) {
				logMessage +=
					"\n   ℹ️ No error details provided by backend (empty response)";
				logMessage += "\n   💡 Possible causes:";
				logMessage +=
					"\n      - Backend server crashed or encountered unhandled exception";
				logMessage += "\n      - Database connection failure";
				logMessage += "\n      - Missing required configuration";
				logMessage += "\n      - Authentication/authorization setup issue";
			}
		}

		console.error(logMessage, errorInfo);
	}
}

async function apiFetch<T>(
	endpoint: string,
	method: RequestMethod = "GET",
	body?: unknown,
	options: FetchOptions = {},
): Promise<T> {
	const { token, headers, _retry, ...customConfig } = options;

	const requestHeaders: HeadersInit = {
		"Content-Type": "application/json",
		...((headers as Record<string, string>) || {}),
	};

	if (token && token !== COOKIE_AUTH_TOKEN) {
		// Token explicitly provided and is a real JWT
		requestHeaders.Authorization = `Bearer ${token}`;
	} else if (!token) {
		// Get access token from userStore
		// Note: The store must be hydrated before making authenticated requests.
		// Components should wait for store hydration using _hasHydrated flag.
		const storeToken = useUserStore.getState().accessToken;

		// Only set Bearer header if token is a real JWT (not the cookie-auth marker)
		if (storeToken && storeToken !== COOKIE_AUTH_TOKEN) {
			requestHeaders.Authorization = `Bearer ${storeToken}`;
		}
		// If storeToken is COOKIE_AUTH or undefined, don't set Authorization header
		// The backend will read the token from httpOnly cookie instead
	}
	// If token === COOKIE_AUTH_TOKEN, don't set Authorization header - rely on cookies

	const config: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: "include", // Include cookies for OAuth
		...customConfig,
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	// Ensure endpoint starts with / if not present
	const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = `${API_URL}${path}`;

	// Development logging
	if (isDev) {
		const hasAuth = !!requestHeaders.Authorization;
		console.log(
			`📡 [${method}] ${path}${hasAuth ? " 🔑" : " 🔓"}`,
			body ? { body } : "",
		);
	}

	const startTime = performance.now();

	try {
		const response = await fetch(url, config);

		// Try to parse JSON, handle non-JSON responses
		let data: ApiResponse<T> | null = null;
		const contentType = response.headers.get("content-type");

		if (contentType?.includes("application/json")) {
			try {
				data = (await response.json()) as ApiResponse<T>;
			} catch (parseError) {
				if (isDev) console.error("Failed to parse JSON response:", parseError);
				throw new ApiError(
					"Invalid response from server",
					response.status,
					"PARSE_ERROR",
					undefined,
					{ parseError: String(parseError) },
					path,
				);
			}
		} else {
			// Non-JSON response
			const textBody = await response.text();
			if (isDev) console.error("Non-JSON response:", textBody);
			throw new ApiError(
				"Unexpected response format from server",
				response.status,
				"INVALID_CONTENT_TYPE",
				undefined,
				{ contentType, body: textBody.slice(0, 500) },
				path,
			);
		}

		// Development: Log response timing
		if (isDev) {
			const duration = (performance.now() - startTime).toFixed(0);
			console.log(
				`${response.ok ? "✅" : "❌"} [${method}] ${path} - ${response.status} (${duration}ms)`,
			);
		}

		if (!response.ok || !data?.success) {
			// Handle 401 Unauthorized - attempt token refresh and retry
			if (response.status === 401 && !_retry) {
				if (isDev) console.log("401 received, attempting token refresh...");
				const newToken = await handleUnauthorized();

				if (newToken) {
					// Retry the original request with the new token
					if (isDev) console.log("Retrying request with new token...");
					return apiFetch<T>(endpoint, method, body, {
						...options,
						token: newToken,
						_retry: true, // Prevent infinite loops
					});
				}
				// If refresh failed, handleUnauthorized already logged out
			}

			// Handle 403 Forbidden - access denied, do NOT trigger refresh or logout
			if (response.status === 403) {
				handleForbidden();
				// Just throw the error, don't logout
			}

			const apiError = new ApiError(
				data?.message || "An error occurred",
				response.status,
				data?.error?.code,
				data?.error?.field,
				// OpenAPI schema has details as 'object', cast to Record<string, unknown>
				data?.error?.details as Record<string, unknown> | undefined,
				path,
				data?.timestamp,
			);

			// Auto-log in development
			if (isDev) apiError.logDetails();

			// Send 5xx server errors to console
			if (response.status >= 500) {
				console.error("Server Error:", apiError, {
					endpoint: path,
					status: response.status,
					code: data?.error?.code,
				});
			}

			throw apiError;
		}

		// OpenAPI schema has data as optional, but if request succeeded it should be present
		// Type assertion needed because generic T doesn't allow undefined
		return data.data as T;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		// Network errors (no response from server)
		const isNetworkError =
			error instanceof TypeError && error.message.includes("fetch");

		if (isDev) {
			console.error(`🌐 Network Error [${method}] ${path}:`, error);
		}

		// Log network errors (may indicate infrastructure issues)
		console.error("Network Error:", error, {
			endpoint: path,
			method,
			isNetworkError,
		});

		throw new ApiError(
			isNetworkError
				? "Unable to connect to server. Please check your connection."
				: error instanceof Error
					? error.message
					: "Network error",
			0, // Status 0 indicates network/connection error
			isNetworkError ? "NETWORK_ERROR" : "UNKNOWN_ERROR",
			undefined,
			{ originalError: String(error) },
			path,
		);
	}
}

/**
 * Buffer time in ms to proactively refresh token before it expires
 * Used by long-running requests (like AI chat) to ensure token won't expire mid-request
 */
const PRE_REQUEST_REFRESH_BUFFER_MS = 180000; // 3 minutes

/**
 * Ensure token is fresh before starting a long-running request.
 * Call this before making requests that may take 30+ seconds (like AI chat responses).
 * Returns true if token is fresh or was successfully refreshed, false if refresh failed.
 */
export async function ensureFreshToken(): Promise<boolean> {
	const { isAuthenticated, tokenExpiresAt } = useUserStore.getState();

	if (!isAuthenticated) return false;

	// For cookie-based auth, we can't pre-check - rely on backend session
	if (isCookieAuth()) return true;

	// If no expiry info, assume it's okay
	if (!tokenExpiresAt) return true;

	const timeUntilExpiry = tokenExpiresAt - Date.now();

	// If token expires within buffer time, refresh it proactively
	if (timeUntilExpiry <= PRE_REQUEST_REFRESH_BUFFER_MS) {
		if (isDev)
			console.log(
				`Token expires in ${Math.round(timeUntilExpiry / 1000)}s, refreshing before long request...`,
			);
		const newToken = await refreshAccessToken();
		return newToken !== null;
	}

	return true;
}

export const apiClient = {
	get: <T>(endpoint: string, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "GET", undefined, options),
	post: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "POST", body, options),
	put: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "PUT", body, options),
	delete: <T>(endpoint: string, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "DELETE", undefined, options),
	patch: <T>(endpoint: string, body: unknown, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "PATCH", body, options),
};
