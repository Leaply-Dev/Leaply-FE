/**
 * Re-export Orval-generated hook for user registration
 * This maintains backward compatibility while using generated hooks
 */
import { useRegister as useGeneratedRegister } from "@/lib/generated/api/endpoints/authentication/authentication";

/**
 * React Query mutation hook for user registration
 * No retry on failed registration attempts
 *
 * @returns Mutation function and state (isPending, error, data, etc.)
 */
export function useRegister() {
	return useGeneratedRegister({
		mutation: {
			retry: false, // Don't retry failed registrations
		},
	});
}
