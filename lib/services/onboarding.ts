import { apiClient } from "@/lib/api/client";
import type {
	OnboardingDataResponse,
	UpdateOnboardingRequest,
} from "@/lib/api/types";

export const onboardingService = {
	// ============================================
	// Get onboarding status
	// ============================================

	/**
	 * Get the current onboarding status and progress
	 * Returns completedSteps (0-4) and isComplete flag
	 */
	getOnboardingStatus: async (): Promise<OnboardingDataResponse> => {
		return apiClient.get<OnboardingDataResponse>("/v1/onboarding/status");
	},

	// ============================================
	// Update onboarding data progressively
	// ============================================

	/**
	 * Update onboarding data progressively
	 * Can be called at each step to save progress
	 */
	updateOnboarding: async (
		data: UpdateOnboardingRequest,
	): Promise<OnboardingDataResponse> => {
		return apiClient.patch<OnboardingDataResponse>("/v1/onboarding", data);
	},
};
