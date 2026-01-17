/**
 * API Response Unwrap Utilities
 *
 * Orval-generated hooks return responses that are double-wrapped:
 * 1. Orval wrapper: { data: {...}, status: 200, headers }
 * 2. Backend API wrapper: { success: true, data: {...}, timestamp }
 * 3. Actual data: The typed response (e.g., GraphMessageResponse)
 *
 * These utilities extract the actual data cleanly.
 */

type OrvalResponse<T> = {
	data?: {
		success?: boolean;
		data?: T;
		timestamp?: string;
	};
	status?: number;
	headers?: Headers;
};

/**
 * Unwrap an Orval response to get the actual data.
 * Handles both double-wrapped and single-wrapped responses gracefully.
 *
 * @example
 * const graphData = unwrapResponse(conversationStart);
 * if (graphData?.message) { ... }
 */
export function unwrapResponse<T>(response: unknown): T | undefined {
	if (!response) return undefined;

	// biome-ignore lint/suspicious/noExplicitAny: Response structure varies
	const orvalData = (response as any)?.data;
	if (!orvalData) return undefined;

	// Check if it's the backend wrapper (has success/data/timestamp)
	if (orvalData.success !== undefined || orvalData.timestamp !== undefined) {
		// Double-wrapped: return the inner data
		return orvalData.data as T | undefined;
	}

	// Single-wrapped or already unwrapped
	return orvalData as T;
}

/**
 * Type-safe version for when you know the response structure.
 * Useful in typed contexts where TypeScript can infer T.
 */
export function unwrap<T>(response: OrvalResponse<T>): T | undefined {
	return unwrapResponse<T>(response);
}
