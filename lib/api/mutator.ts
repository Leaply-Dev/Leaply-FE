import { performLogout } from "../auth/logout";
import { useUserStore } from "../store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const isDev = process.env.NODE_ENV === "development";

// Special marker for cookie-based authentication (OAuth)
const COOKIE_AUTH_TOKEN = "COOKIE_AUTH";

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

// Refresh timeout in milliseconds
const REFRESH_TIMEOUT_MS = 10000;

/**
 * Subscribe to token refresh completion
 */
function subscribeTokenRefresh(callback: (token: string | null) => void) {
	refreshSubscribers.push(callback);
}

/**
 * Notify all subscribers when token refresh completes
 */
function onTokenRefreshed(newToken: string | null) {
	for (const callback of refreshSubscribers) {
		callback(newToken);
	}
	refreshSubscribers = [];
}

/**
 * Clear all subscribers
 */
function clearRefreshSubscribers() {
	for (const callback of refreshSubscribers) {
		callback(null);
	}
	refreshSubscribers = [];
}

/**
 * Check if using cookie-based authentication
 */
function isCookieAuth(): boolean {
	const { accessToken, refreshToken } = useUserStore.getState();
	return (
		accessToken === COOKIE_AUTH_TOKEN || refreshToken === COOKIE_AUTH_TOKEN
	);
}

/**
 * Refresh access token
 */
async function refreshAccessToken(): Promise<string | null> {
	const { refreshToken, setTokens } = useUserStore.getState();

	// For cookie-based auth, return special marker
	if (isCookieAuth()) {
		if (isDev)
			console.log("Cookie-based auth: backend handles session refresh");
		return COOKIE_AUTH_TOKEN;
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

		const data = await response.json();

		if (data.success && data.data) {
			const {
				accessToken,
				refreshToken: newRefreshToken,
				expiresIn,
			} = data.data;

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
 * Handle 401 Unauthorized
 * Added safeguard: Don't logout if token was just issued (within 10 seconds)
 */
async function handleUnauthorized(): Promise<string | null> {
	if (typeof window === "undefined") return null;

	const { isAuthenticated, tokenExpiresAt } = useUserStore.getState();
	if (!isAuthenticated) return null;

	// For cookie-based auth, don't try to refresh
	if (isCookieAuth()) {
		if (isDev) console.log("Cookie-based auth 401: session may be expired");
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

		console.warn("Token refresh failed. Logging out...");
		clearRefreshSubscribers();
		performLogout({ redirect: "/?expired=true" });
		return null;
	} catch (error) {
		console.error("Token refresh error:", error);
		clearRefreshSubscribers();
		performLogout({ redirect: "/?expired=true" });
		return null;
	} finally {
		isRefreshing = false;
	}
}

/**
 * Custom fetch instance for Orval-generated hooks
 * This wraps the native fetch API with authentication and error handling
 */
export interface CustomInstanceConfig {
	url: string;
	method: string;
	params?: Record<string, unknown>;
	data?: unknown;
	headers?: HeadersInit;
	signal?: AbortSignal;
}

export const customInstance = async <T>(
	config: CustomInstanceConfig,
): Promise<T> => {
	const { url, method, params, data, headers, signal } = config;

	// Build query string from params
	let fullUrl = `${API_URL}${url}`;
	if (params) {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		}
		const queryString = searchParams.toString();
		if (queryString) {
			fullUrl += `?${queryString}`;
		}
	}

	// Build headers
	const requestHeaders: Record<string, string> = {
		"Content-Type": "application/json",
	};

	// Merge custom headers
	if (headers) {
		const headersObj =
			headers instanceof Headers
				? Object.fromEntries(headers.entries())
				: Array.isArray(headers)
					? Object.fromEntries(headers)
					: headers;
		Object.assign(requestHeaders, headersObj);
	}

	// Add authentication token
	let { accessToken } = useUserStore.getState();

	// Fallback: If store token is not available, try reading from localStorage directly
	// This handles the case where Zustand hasn't hydrated yet after page navigation
	if (!accessToken) {
		try {
			const persistedState = localStorage.getItem("leaply-user-store");
			if (persistedState) {
				const parsed = JSON.parse(persistedState);
				accessToken = parsed.state?.accessToken;
				if (isDev && accessToken) {
					console.log("Retrieved token from localStorage fallback (mutator)");
				}
			}
		} catch (e) {
			if (isDev) console.warn("Failed to read from localStorage (mutator)", e);
		}
	}

	if (accessToken && accessToken !== COOKIE_AUTH_TOKEN) {
		requestHeaders.Authorization = `Bearer ${accessToken}`;
	} else if (isDev && !accessToken) {
		console.warn(
			"No access token available for authenticated request (mutator)",
		);
	}

	if (isDev) {
		const authStatus = requestHeaders.Authorization ? "🔒" : "🔓";
		// Compact log style: 🚀 [METHOD] /url 🔒
		console.log(`🚀 [${method}] ${url} ${authStatus}`);
	}

	const fetchConfig: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: "include", // Include cookies for OAuth
		signal,
	};

	if (data) {
		fetchConfig.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(fullUrl, fetchConfig);

		if (isDev) {
			console.log(
				`${
					response.ok ? "✅" : response.status === 401 ? "⚠️" : "❌"
				} [${response.status}] ${url}`,
			);
		}

		// Handle 401 with token refresh
		if (response.status === 401) {
			if (isDev) console.log("401 received, attempting token refresh...");
			const newToken = await handleUnauthorized();

			if (newToken && newToken !== COOKIE_AUTH_TOKEN) {
				// Retry with new token
				const retryHeaders = {
					...requestHeaders,
					Authorization: `Bearer ${newToken}`,
				};
				const retryResponse = await fetch(fullUrl, {
					...fetchConfig,
					headers: retryHeaders,
				});

				if (!retryResponse.ok) {
					const errorData = await retryResponse.json();
					throw new Error(errorData.message || "Request failed");
				}

				const retryData = await retryResponse.json();
				// Unwrap ApiResponse wrapper if present
				if (retryData && typeof retryData === "object" && "data" in retryData) {
					return retryData.data as T;
				}
				return retryData as T;
			}
		}

		// Handle 403
		if (response.status === 403) {
			if (isDev) console.warn("Access denied (403 Forbidden)");
		}

		if (!response.ok) {
			const errorData = await response.json();

			throw new Error(errorData.message || "Request failed");
		}

		const jsonData = await response.json();
		// Unwrap ApiResponse wrapper if present: { success: true, data: T } -> T
		if (jsonData && typeof jsonData === "object" && "data" in jsonData) {
			return jsonData.data as T;
		}
		return jsonData as T;
	} catch (error) {
		const isNetworkError =
			error instanceof TypeError && error.message.includes("fetch");

		if (isDev) {
			// Compact error logging to avoid clutter
			const status = isNetworkError ? "Network Error" : "Error";
			console.log(`💥 ${status} [${method}] ${url}:`, error);
		}

		throw error;
	}
};

export default customInstance;

/**
 * Error type for Orval-generated hooks
 */
export type ErrorType<Error> = Error;

/**
 * Body type for Orval-generated hooks
 */
export type BodyType<BodyData> = BodyData;
