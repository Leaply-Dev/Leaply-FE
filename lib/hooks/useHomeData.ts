/**
 * Re-export Orval-generated hook for home dashboard data
 * This maintains backward compatibility while using generated hooks
 */

import { useGetHomeData } from "@/lib/generated/api/endpoints/home/home";

/**
 * React Query hook for fetching home dashboard data
 * @returns Query result with home data, loading, and error states
 */
export function useHomeData() {
	return useGetHomeData({
		query: {
			staleTime: 5 * 60 * 1000, // 5 minutes - consider data fresh
		},
	});
}
