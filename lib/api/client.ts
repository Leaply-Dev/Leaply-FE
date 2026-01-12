import * as Sentry from "@sentry/nextjs";
import { performLogout } from "../auth/logout";
import { useUserStore } from "../store/userStore";
import type { AuthResponse, ErrorDetails } from "./types";

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

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

// Refresh timeout in milliseconds (prevents hanging indefinitely)
const REFRESH_TIMEOUT_MS = 10000;

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback: (token: string | null) => void) {
	refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers when token refresh completes (success or failure)
 */
function onTokenRefreshed(newToken: string | null) {
	for (const callback of refreshSubscribers) {
		callback(newToken);
	}
	refreshSubscribers = [];
}

/**
 * Clear all subscribers (used on failure to prevent memory leaks)
 */
function clearRefreshSubscribers() {
	for (const callback of refreshSubscribers) {
		callback(null);
	}
	refreshSubscribers = [];
}

/**
 * Check if using cookie-based authentication (OAuth)
 */
function isCookieAuth(): boolean {
	const { accessToken, refreshToken } = useUserStore.getState();
	return (
		accessToken === COOKIE_AUTH_TOKEN || refreshToken === COOKIE_AUTH_TOKEN
	);
}

/**
 * Attempt to refresh the access token using the refresh token
 * Returns the new access token on success, null on failure
 * For cookie-based auth, returns special marker to indicate backend handles refresh
 */
async function refreshAccessToken(): Promise<string | null> {
	const { refreshToken, setTokens } = useUserStore.getState();

	// For cookie-based auth, return special marker
	// Backend handles cookie refresh via httpOnly cookies
	// We should NOT logout - let the backend decide if session is expired
	if (isCookieAuth()) {
		if (isDev)
			console.log("Cookie-based auth: backend handles session refresh");
		return COOKIE_AUTH_TOKEN; // Return marker, not null - prevents logout
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

		if (!response.ok) {
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
		if (isDev) console.error("Token refresh error:", error);
		return null;
	}
}

/**
 * Handle 401 Unauthorized - attempt token refresh before logging out
 * Includes timeout to prevent hanging indefinitely on network issues
 */
async function handleUnauthorized(): Promise<string | null> {
	if (typeof window === "undefined") return null;

	const { isAuthenticated } = useUserStore.getState();
	if (!isAuthenticated) return null;

	// For cookie-based auth, don't try to refresh or logout
	// The backend manages session via httpOnly cookies
	// If session is truly expired, let the error propagate and handle in UI
	if (isCookieAuth()) {
		if (isDev) console.log("Cookie-based auth 401: session may be expired");
		// Don't logout here - let AuthProvider or the calling code decide
		return null;
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

/**
 * Handle 403 Forbidden - show access denied, do NOT trigger refresh or logout
 */
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

		console.error(`API Error [${this.status}] - ${this.endpoint}`, errorInfo);

		// Additional context for 500 errors
		if (this.status >= 500) {
			console.error("⚠️ Server Error - Check backend logs for details:");
			console.error(`   Endpoint: ${this.endpoint}`);
			console.error(`   Message: ${this.message}`);
			if (Object.keys(errorInfo.details).length === 0) {
				console.error(
					"   ℹ️ No error details provided by backend (empty response)",
				);
				console.error("   💡 Possible causes:");
				console.error(
					"      - Backend server crashed or encountered unhandled exception",
				);
				console.error("      - Database connection failure");
				console.error("      - Missing required configuration");
				console.error("      - Authentication/authorization setup issue");
			}
		}
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
		// Attempt to get access token from userStore
		try {
			const storeToken = useUserStore.getState().accessToken;
			// Only set Bearer header if token is a real JWT (not the cookie-auth marker)
			if (storeToken && storeToken !== COOKIE_AUTH_TOKEN) {
				requestHeaders.Authorization = `Bearer ${storeToken}`;
			}
			// If storeToken is COOKIE_AUTH, don't set Authorization header
			// The backend will read the token from httpOnly cookie instead
		} catch (e) {
			// Fallback or ignore if store access fails
			if (isDev) console.warn("Failed to retrieve token from store", e);
		}
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
		console.log(`📡 [${method}] ${path}`, body ? { body } : "");
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

			// Send 5xx server errors to Sentry (indicates backend issues)
			if (response.status >= 500) {
				Sentry.captureException(apiError, {
					extra: {
						endpoint: path,
						status: response.status,
						code: data?.error?.code,
					},
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

		// Send network errors to Sentry (may indicate infrastructure issues)
		Sentry.captureException(error, {
			extra: {
				endpoint: path,
				method,
				isNetworkError,
			},
			tags: {
				errorType: isNetworkError ? "network" : "unknown",
			},
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
