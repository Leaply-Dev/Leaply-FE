/**
 * Re-export Orval-generated hook for current user data
 * This maintains backward compatibility while using generated hooks
 */

import { useGetCurrentUser } from "@/lib/generated/api/endpoints/authentication/authentication";

/**
 * React Query hook for fetching current user complete info
 * @returns Query result with user data (account + profile + preferences)
 */
export function useUserMe() {
	return useGetCurrentUser({
		query: {
			staleTime: 5 * 60 * 1000, // 5 minutes - user data doesn't change frequently
			retry: 1, // Retry once if failed
		},
	});
}
