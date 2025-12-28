import { apiClient } from "./client";
import type {
	AiMatchResponse,
	FilterOptionsResponse,
	ProgramDetailResponse,
	ProgramListParams,
	ProgramListResponse,
	SaveProgramResponse,
} from "./types";

// ============================================
// Explore API Endpoints
// ============================================

/**
 * Get list of programs with optional filters
 * GET /v1/explore/programs
 */
export async function getPrograms(
	params?: ProgramListParams,
): Promise<ProgramListResponse> {
	const searchParams = new URLSearchParams();

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				searchParams.append(key, String(value));
			}
		});
	}

	const queryString = searchParams.toString();
	const endpoint = `/v1/explore/programs${queryString ? `?${queryString}` : ""}`;

	return apiClient.get<ProgramListResponse>(endpoint);
}

/**
 * Get program detail by ID
 * GET /v1/explore/programs/:id
 */
export async function getProgramDetail(
	id: string,
): Promise<ProgramDetailResponse> {
	return apiClient.get<ProgramDetailResponse>(`/v1/explore/programs/${id}`);
}

/**
 * Get AI-matched programs (categorized by reach/target/safety)
 * GET /v1/explore/programs/matched
 */
export async function getAiMatch(
	limitPerCategory?: number,
): Promise<AiMatchResponse> {
	const params = limitPerCategory
		? `?limit_per_category=${limitPerCategory}`
		: "";
	return apiClient.get<AiMatchResponse>(
		`/v1/explore/programs/matched${params}`,
	);
}

/**
 * Get user's saved programs
 * GET /v1/explore/programs/saved
 */
export async function getSavedPrograms(): Promise<ProgramListResponse> {
	return apiClient.get<ProgramListResponse>("/v1/explore/programs/saved");
}

/**
 * Get filter options for explore page
 * GET /v1/explore/filters
 */
export async function getFilterOptions(): Promise<FilterOptionsResponse> {
	return apiClient.get<FilterOptionsResponse>("/v1/explore/filters");
}

/**
 * Save a program to user's list
 * POST /v1/explore/programs/:id/save
 */
export async function saveProgram(id: string): Promise<SaveProgramResponse> {
	return apiClient.post<SaveProgramResponse>(
		`/v1/explore/programs/${id}/save`,
		{},
	);
}

/**
 * Remove a program from user's saved list
 * DELETE /v1/explore/programs/:id/save
 */
export async function unsaveProgram(id: string): Promise<SaveProgramResponse> {
	return apiClient.delete<SaveProgramResponse>(
		`/v1/explore/programs/${id}/save`,
	);
}

// ============================================
// React Query Hooks (if using React Query)
// ============================================

// Export all functions as a namespace for easier imports
export const exploreApi = {
	getPrograms,
	getProgramDetail,
	getAiMatch,
	getFilterOptions,
	saveProgram,
	unsaveProgram,
	getSavedPrograms,
};
