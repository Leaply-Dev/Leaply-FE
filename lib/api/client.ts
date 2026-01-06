import { useUserStore } from "../store/userStore";
import type { ApiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const isDev = process.env.NODE_ENV === "development";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions extends RequestInit {
	token?: string;
}

export class ApiError extends Error {
	constructor(
		public message: string,
		public status: number,
		public code?: string,
		public field?: string,
		public details?: Record<string, any>,
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
		console.group(`🚨 API Error [${this.status}] - ${this.endpoint}`);
		console.error("Message:", this.message);
		console.error("Code:", this.code || "N/A");
		console.error("Field:", this.field || "N/A");
		console.error("Details:", this.details || "N/A");
		console.error("Timestamp:", this.timestamp || "N/A");
		console.groupEnd();
	}
}

async function apiFetch<T>(
	endpoint: string,
	method: RequestMethod = "GET",
	body?: any,
	options: FetchOptions = {},
): Promise<T> {
	const { token, headers, ...customConfig } = options;

	const requestHeaders: HeadersInit = {
		"Content-Type": "application/json",
		...((headers as Record<string, string>) || {}),
	};

	if (token) {
		requestHeaders["Authorization"] = `Bearer ${token}`;
	} else {
		// Attempt to get token from userStore
		try {
			const storeToken = useUserStore.getState().token;
			if (storeToken) {
				requestHeaders["Authorization"] = `Bearer ${storeToken}`;
			}
		} catch (e) {
			// Fallback or ignore if store access fails
			if (isDev) console.warn("Failed to retrieve token from store", e);
		}
	}

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
			const apiError = new ApiError(
				data?.message || "An error occurred",
				response.status,
				data?.error?.code,
				data?.error?.field,
				data?.error?.details,
				path,
				data?.timestamp,
			);

			// Auto-log in development
			if (isDev) apiError.logDetails();

			throw apiError;
		}

		return data.data;
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
	post: <T>(endpoint: string, body: any, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "POST", body, options),
	put: <T>(endpoint: string, body: any, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "PUT", body, options),
	delete: <T>(endpoint: string, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "DELETE", undefined, options),
	patch: <T>(endpoint: string, body: any, options?: FetchOptions) =>
		apiFetch<T>(endpoint, "PATCH", body, options),
};
