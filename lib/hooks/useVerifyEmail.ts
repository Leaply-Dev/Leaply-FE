import { useQuery } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth";

/**
 * React Query hook for email verification with token
 * Uses useQuery (not useMutation) for automatic deduplication in React Strict Mode
 * This prevents duplicate verification emails from being sent
 *
 * @param token - Verification token from URL
 * @returns Query result with verification status, loading, and error states
 */
export function useVerifyEmail(token: string | null) {
	return useQuery({
		queryKey: ["verifyEmail", token],
		queryFn: () => {
			if (!token) throw new Error("Token is required");
			return authService.verifyEmail(token);
		},
		enabled: !!token, // Only run if token exists
		staleTime: Number.POSITIVE_INFINITY, // Never refetch (one-time verification)
		gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
		retry: false, // Don't retry failed verifications
	});
}
