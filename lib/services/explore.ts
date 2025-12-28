import { apiClient } from "@/lib/api/client";
import type {
	AiMatchResponse,
	FilterOptionsResponse,
	ProgramDetailResponse,
	ProgramListParams,
	ProgramListResponse,
	SaveProgramResponse,
} from "@/lib/api/types";

/**
 * Build query string from params object
 */
function buildQueryString(params: ProgramListParams): string {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null && value !== "") {
			searchParams.append(key, String(value));
		}
	}

	const queryString = searchParams.toString();
	return queryString ? `?${queryString}` : "";
}

export const exploreService = {
	// ============================================
	// Program Listing & Details
	// ============================================

	/**
	 * List programs with filters, sorting, and pagination
	 */
	listPrograms: async (
		params: ProgramListParams = {},
	): Promise<ProgramListResponse> => {
		const query = buildQueryString(params);
		return apiClient.get<ProgramListResponse>(`/v1/explore/programs${query}`);
	},

	/**
	 * Get full program details
	 */
	getProgramDetail: async (id: string): Promise<ProgramDetailResponse> => {
		return apiClient.get<ProgramDetailResponse>(`/v1/explore/programs/${id}`);
	},

	// ============================================
	// Saved Programs
	// ============================================

	/**
	 * Get list of programs saved by the user
	 */
	getSavedPrograms: async (): Promise<ProgramListResponse> => {
		return apiClient.get<ProgramListResponse>("/v1/explore/programs/saved");
	},

	/**
	 * Save a program to bookmarks
	 */
	saveProgram: async (id: string): Promise<SaveProgramResponse> => {
		return apiClient.post<SaveProgramResponse>(
			`/v1/explore/programs/${id}/save`,
			{},
		);
	},

	/**
	 * Unsave a program from bookmarks
	 */
	unsaveProgram: async (id: string): Promise<SaveProgramResponse> => {
		return apiClient.delete<SaveProgramResponse>(
			`/v1/explore/programs/${id}/save`,
		);
	},

	// ============================================
	// AI Matching
	// ============================================

	/**
	 * Get AI-matched programs grouped by fit category
	 */
	getMatchedPrograms: async (
		limitPerCategory = 5,
	): Promise<AiMatchResponse> => {
		const query =
			limitPerCategory !== 5 ? `?limit_per_category=${limitPerCategory}` : "";
		return apiClient.get<AiMatchResponse>(
			`/v1/explore/programs/matched${query}`,
		);
	},

	// ============================================
	// Filter Options
	// ============================================

	/**
	 * Get available filter options with counts
	 */
	getFilterOptions: async (): Promise<FilterOptionsResponse> => {
		return apiClient.get<FilterOptionsResponse>("/v1/explore/filters");
	},
};
