import { apiClient } from "@/lib/api/client";
import type {
	AuthResponse,
	GoogleAuthRequest,
	LoginRequest,
	RegisterRequest,
	UserContextResponse,
} from "@/lib/api/types";

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
};
