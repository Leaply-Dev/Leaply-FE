import { performLogout } from "../auth/logout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

/**
 * Custom fetch instance for Orval-generated hooks.
 * On 401, session has expired — redirect to login.
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

	// Handle 401 - bad credentials.
	const isAuthEndpoint = url.includes("/v1/auth/");
	if (response.status === 401 && !isAuthEndpoint) {
		if (typeof window !== "undefined") {
			performLogout({ redirect: "/?expired=true" });
		}
		throw new Error("Failed to continue session. Logging out.");
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
