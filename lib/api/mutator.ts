import { performLogout } from "../auth/logout";
import { useUserStore } from "../store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
		return COOKIE_AUTH_TOKEN;
	}

	if (!refreshToken) {
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
				return accessToken;
			}
		}

		return null;
	} catch (_error) {
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
		return null;
	}

	// Safeguard: Check if token was just issued (within last 10 seconds)
	// This prevents logout immediately after login due to race conditions
	if (tokenExpiresAt) {
		const tokenAge = Date.now() - (tokenExpiresAt - 900000); // 15 minute token lifetime
		if (tokenAge < 10000) {
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

export const customInstance = async <T>(
	url: string,
	options: RequestInit = {},
): Promise<T> => {
	const { method = "GET", headers, signal, body } = options;

	// Build full URL
	const fullUrl = `${API_URL}${url}`;

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
			}
		} catch (_e) {}
	}

	if (accessToken && accessToken !== COOKIE_AUTH_TOKEN) {
		requestHeaders.Authorization = `Bearer ${accessToken}`;
	}

	const fetchConfig: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: "include", // Include cookies for OAuth
		signal,
	};

	if (body) {
		fetchConfig.body = typeof body === "string" ? body : JSON.stringify(body);
	}

	const response = await fetch(fullUrl, fetchConfig);

	// Handle 401 with token refresh
	if (response.status === 401) {
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
			return {
				data: retryData,
				status: retryResponse.status,
				headers: retryResponse.headers,
			} as T;
		}
	}

	if (!response.ok) {
		const errorData = await response.json();

		throw new Error(errorData.message || "Request failed");
	}

	const jsonData = await response.json();
	return {
		data: jsonData,
		status: response.status,
		headers: response.headers,
	} as T;
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
