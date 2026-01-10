import { useMutation } from "@tanstack/react-query";
import type { RegisterRequest } from "@/lib/api/types";
import { authService } from "@/lib/services/auth";

/**
 * React Query mutation hook for user registration
 * No retry on failed registration attempts
 *
 * @returns Mutation function and state (isPending, error, data, etc.)
 */
export function useRegister() {
	return useMutation({
		mutationFn: (data: RegisterRequest) => authService.register(data),
		retry: false, // Don't retry failed registrations
	});
}
