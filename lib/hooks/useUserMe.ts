/**
 * Re-export Orval-generated hook for current user data
 * This maintains backward compatibility while using generated hooks
 */

import { useGetCurrentUser } from "@/lib/generated/api/endpoints/authentication/authentication";
import type { ApiResponseUserContextResponse } from "@/lib/generated/api/models";

/**
 * React Query hook for fetching current user complete info
 * @param initialData - Optional initial data from SSR
 * @returns Query result with user data (account + profile + preferences)
 */
export function useUserMe(initialData?: ApiResponseUserContextResponse) {
	return useGetCurrentUser({
		query: {
			initialData,
			staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
			retry: 1, // Retry once if failed
		},
	});
}
