/**
 * Re-export Orval-generated hook for resending verification email
 * This maintains backward compatibility while using generated hooks
 */
import { useResendVerification as useGeneratedResendVerification } from "@/lib/generated/api/endpoints/authentication/authentication";

/**
 * React Query mutation hook for resending verification email
 * Includes retry logic for network errors
 *
 * @returns Mutation function and state (isPending, error, etc.)
 */
export function useResendVerification() {
	return useGeneratedResendVerification({
		mutation: {
			retry: 1, // Retry once on network error
		},
	});
}
