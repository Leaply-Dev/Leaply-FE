/**
 * Re-export Orval-generated hook for AI-matched scholarships
 * This maintains backward compatibility while using generated hooks
 */

import { useGetMatchedScholarships } from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type { GetMatchedScholarshipsParams } from "@/lib/generated/api/models";

/**
 * React Query hook for fetching AI-matched scholarships
 * @param limitPerCategory - Optional limit per category (reach/target/safety)
 * @returns Query result with AI match data, loading, and error states
 */
export function useScholarshipAiMatch(limitPerCategory?: number) {
	const params: GetMatchedScholarshipsParams = limitPerCategory
		? { limitPerCategory }
		: {};

	return useGetMatchedScholarships(params, {
		query: {
			staleTime: 10 * 60 * 1000, // 10 minutes - AI match data changes less frequently
		},
	});
}
