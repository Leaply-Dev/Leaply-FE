import { useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "@/lib/api/types";
import { authService } from "@/lib/services/auth";

/**
 * React Query mutation hook for user login
 * No retry on failed login attempts
 *
 * @returns Mutation function and state (isPending, error, data, etc.)
 */
export function useLogin() {
	return useMutation({
		mutationFn: (credentials: LoginRequest) => authService.login(credentials),
		retry: false, // Don't retry failed logins
	});
}
