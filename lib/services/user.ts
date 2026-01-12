import { apiClient } from "@/lib/api/client";
import type {
	PreferencesResponse,
	ProfileResponse,
	UpdatePreferencesRequest,
	UpdateProfileRequest,
	UserMeResponse,
} from "@/lib/generated/api/models";

export const userService = {
	// ============================================
	// Combined User Info
	// ============================================

	/**
	 * Get current user complete info (account + profile + preferences)
	 */
	getMe: async (): Promise<UserMeResponse> => {
		return apiClient.get<UserMeResponse>("/v1/user/me");
	},

	// ============================================
	// Profile Management
	// ============================================

	/**
	 * Get current user profile
	 */
	getProfile: async (): Promise<ProfileResponse> => {
		return apiClient.get<ProfileResponse>("/v1/user/profile");
	},

	/**
	 * Update user profile (Onboarding Step 1)
	 */
	updateProfile: async (
		data: UpdateProfileRequest,
	): Promise<ProfileResponse> => {
		return apiClient.patch<ProfileResponse>("/v1/user/profile", data);
	},

	// ============================================
	// Preferences Management
	// ============================================

	/**
	 * Get current user preferences
	 */
	getPreferences: async (): Promise<PreferencesResponse> => {
		return apiClient.get<PreferencesResponse>("/v1/user/preferences");
	},

	/**
	 * Update user preferences (Onboarding Steps 2 & 3)
	 */
	updatePreferences: async (
		data: UpdatePreferencesRequest,
	): Promise<PreferencesResponse> => {
		return apiClient.patch<PreferencesResponse>("/v1/user/preferences", data);
	},
};
