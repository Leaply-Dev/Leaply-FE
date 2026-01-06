import { apiClient } from "@/lib/api/client";
import type {
	AuthResponse,
	GoogleAuthRequest,
	LoginRequest,
	RegisterRequest,
	UserContextResponse,
} from "@/lib/api/types";

export interface VerifyEmailRequest {
	token: string;
}

export interface ResendVerificationRequest {
	email: string;
}

export interface ForgotPasswordRequest {
	email: string;
}

export interface ResetPasswordRequest {
	token: string;
	newPassword: string;
}

export const authService = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/login", credentials);
	},

	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/register", data);
	},

	googleAuth: async (idToken: string): Promise<AuthResponse> => {
		const payload: GoogleAuthRequest = { idToken };
		return apiClient.post<AuthResponse>("/v1/auth/google", payload);
	},

	getCurrentUser: async (): Promise<UserContextResponse> => {
		return apiClient.get<UserContextResponse>("/v1/auth/me");
	},

	// Email verification
	verifyEmail: async (token: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/verify-email", { token });
	},

	resendVerification: async (email: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/resend-verification", { email });
	},

	// Password reset
	forgotPassword: async (email: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/forgot-password", { email });
	},

	resetPassword: async (token: string, newPassword: string): Promise<string> => {
		return apiClient.post<string>("/v1/auth/reset-password", { token, newPassword });
	},
};
