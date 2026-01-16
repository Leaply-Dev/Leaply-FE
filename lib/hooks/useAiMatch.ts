/**
 * Re-export Orval-generated hook for AI-matched programs
 * This maintains backward compatibility while using generated hooks
 */

import { useGetMatchedPrograms } from "@/lib/generated/api/endpoints/explore/explore";
import type { GetMatchedProgramsParams } from "@/lib/generated/api/models";

/**
 * React Query hook for fetching AI-matched programs
 * @param limitPerCategory - Optional limit per category (reach/target/safety)
 * @returns Query result with AI match data, loading, and error states
 */
export function useAiMatch(limitPerCategory?: number) {
	const params: GetMatchedProgramsParams = limitPerCategory
		? { limitPerCategory }
		: {};

	return useGetMatchedPrograms(params, {
		query: {
			staleTime: 10 * 60 * 1000, // 10 minutes - AI match data changes less frequently
		},
	});
}
