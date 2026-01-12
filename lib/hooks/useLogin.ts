/**
 * Re-export Orval-generated hook for user login
 * This maintains backward compatibility while using generated hooks
 */
import { useLogin as useGeneratedLogin } from "@/lib/generated/api/endpoints/authentication/authentication";

/**
 * React Query mutation hook for user login
 * No retry on failed login attempts
 *
 * @returns Mutation function and state (isPending, error, data, etc.)
 */
export function useLogin() {
	return useGeneratedLogin({
		mutation: {
			retry: false, // Don't retry failed logins
		},
	});
}
