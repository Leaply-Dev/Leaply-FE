/**
 * Re-export Orval-generated hook for home dashboard data
 * This maintains backward compatibility while using generated hooks
 */

import { useGetHomeData } from "@/lib/generated/api/endpoints/home/home";
import type { ApiResponseHomeResponse } from "@/lib/generated/api/models";

/**
 * React Query hook for fetching home dashboard data
 * @param initialData - Optional initial data from SSR
 * @returns Query result with home data, loading, and error states
 */
export function useHomeData(initialData?: ApiResponseHomeResponse) {
	return useGetHomeData({
		query: {
			initialData,
			staleTime: 5 * 60 * 1000, // 5 minutes - consider data fresh
		},
	});
}
