import { apiClient } from "../api/client";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../api/types";

export const authService = {
	login: async (credentials: LoginRequest): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/login", credentials);
	},

	register: async (data: RegisterRequest): Promise<AuthResponse> => {
		return apiClient.post<AuthResponse>("/v1/auth/register", data);
	},
};
