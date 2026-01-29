import { performLogout } from "../auth/logout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Simplified mutator for cookie-based authentication.
 *
 * After backend migration to HttpOnly cookies:
 * - No more localStorage token storage
 * - Browser automatically sends cookies with credentials: 'include'
 * - 401 triggers silent cookie refresh via /oauth/refresh
 *
 * This removes ~200 lines of complex token refresh logic.
 */

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Attempt to refresh authentication via cookie-based endpoint.
 * Returns true if refresh succeeded, false otherwise.
 */
async function refreshAuth(): Promise<boolean> {
	// Deduplicate concurrent refresh attempts
	if (isRefreshing && refreshPromise) {
		return refreshPromise;
	}

	isRefreshing = true;
	refreshPromise = (async () => {
		try {
			const response = await fetch(`${API_URL}/oauth/refresh`, {
				method: "POST",
				credentials: "include",
			});
			return response.ok;
		} catch {
			return false;
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	})();

	return refreshPromise;
}

/**
 * Custom fetch instance for Orval-generated hooks.
 * Uses cookie-based authentication with automatic refresh on 401.
 */
export const customInstance = async <T>(
	url: string,
	options: RequestInit = {},
): Promise<T> => {
	const { method = "GET", headers, signal, body } = options;

	const fullUrl = `${API_URL}${url}`;
	const isFormData = body instanceof FormData;

	// Build headers
	const requestHeaders: Record<string, string> = {};

	if (!isFormData) {
		requestHeaders["Content-Type"] = "application/json";
	}

	// Merge custom headers
	if (headers) {
		const headersObj =
			headers instanceof Headers
				? Object.fromEntries(headers.entries())
				: Array.isArray(headers)
					? Object.fromEntries(headers)
					: headers;

		if (isFormData) {
			const { "Content-Type": _contentType, ...restHeaders } =
				headersObj as Record<string, string>;
			Object.assign(requestHeaders, restHeaders);
		} else {
			Object.assign(requestHeaders, headersObj);
		}
	}

	const fetchConfig: RequestInit = {
		method,
		headers: requestHeaders,
		credentials: "include", // Browser sends cookies automatically
		signal,
	};

	if (body) {
		if (body instanceof FormData) {
			fetchConfig.body = body;
		} else {
			fetchConfig.body = typeof body === "string" ? body : JSON.stringify(body);
		}
	}

	let response = await fetch(fullUrl, fetchConfig);

	// Handle 401 with silent refresh
	if (response.status === 401) {
		const refreshed = await refreshAuth();

		if (refreshed) {
			// Retry original request with fresh cookies
			response = await fetch(fullUrl, fetchConfig);
		} else {
			// Refresh failed → session expired
			if (typeof window !== "undefined") {
				performLogout({ redirect: "/?expired=true" });
			}
			throw new Error("Session expired");
		}
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
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
