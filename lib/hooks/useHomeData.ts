import { useQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/api/homeApi";
import type { HomeResponse } from "@/lib/api/types";

/**
 * React Query hook for fetching home dashboard data
 * @param initialData - Optional initial data from SSR
 * @returns Query result with home data, loading, and error states
 */
export function useHomeData(initialData?: HomeResponse) {
	return useQuery({
		queryKey: ["homeData"],
		queryFn: getHomeData,
		initialData,
		staleTime: 5 * 60 * 1000, // 5 minutes - consider data fresh
	});
}
