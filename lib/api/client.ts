import { useUserStore } from "../store/userStore";
import type { ApiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

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
	) {
		super(message);
		this.name = "ApiError";
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
		// We access the store directly to avoid hook rules in non-component functions
		try {
			const storeToken = useUserStore.getState().token;
			if (storeToken) {
				requestHeaders["Authorization"] = `Bearer ${storeToken}`;
			}
		} catch (e) {
			// Fallback or ignore if store access fails (e.g. server-side without proper setup)
			console.warn("Failed to retrieve token from store", e);
		}
	}

	const config: RequestInit = {
		method,
		headers: requestHeaders,
		...customConfig,
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	// Ensure endpoint starts with / if not present
	const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
	const url = `${API_URL}${path}`;

	try {
		const response = await fetch(url, config);
		const data = (await response.json()) as ApiResponse<T>;

		if (!response.ok) {
			throw new ApiError(
				data.message || "An error occurred",
				response.status,
				data.error?.code,
				data.error?.field,
			);
		}

		return data.data;
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new Error(error instanceof Error ? error.message : "Network error");
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
