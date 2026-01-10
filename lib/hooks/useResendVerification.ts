import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/services/auth";

/**
 * React Query mutation hook for resending verification email
 * Includes retry logic for network errors
 *
 * @returns Mutation function and state (isPending, error, etc.)
 */
export function useResendVerification() {
	return useMutation({
		mutationFn: (email: string) => authService.resendVerification(email),
		retry: 1, // Retry once on network error
	});
}
