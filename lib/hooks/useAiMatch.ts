import { useQuery } from "@tanstack/react-query";
import { exploreApi } from "@/lib/api/exploreApi";
import type { AiMatchResponse } from "@/lib/api/types";

/**
 * React Query hook for fetching AI-matched programs
 * @param initialData - Optional initial data from SSR
 * @param limitPerCategory - Optional limit per category (reach/target/safety)
 * @returns Query result with AI match data, loading, and error states
 */
export function useAiMatch(
	initialData?: AiMatchResponse,
	limitPerCategory?: number,
) {
	return useQuery({
		queryKey: ["aiMatch", limitPerCategory],
		queryFn: () => exploreApi.getAiMatch(limitPerCategory),
		initialData,
		staleTime: 10 * 60 * 1000, // 10 minutes - AI match data changes less frequently
	});
}
