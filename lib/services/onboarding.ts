import { apiClient } from "@/lib/api/client";
import type {
	OnboardingDataResponse,
	UpdateOnboardingRequest,
} from "@/lib/api/types";

export const onboardingService = {
	// ============================================
	// Update onboarding data progressively
	// ============================================

	updateOnboarding: async (
		data: UpdateOnboardingRequest,
	): Promise<OnboardingDataResponse> => {
		return apiClient.patch<OnboardingDataResponse>("/v1/onboarding", data);
	}
};
