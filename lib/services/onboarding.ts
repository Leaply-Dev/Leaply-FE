import { apiClient } from "../api/client";
import type {
	OnboardingResponse,
	OnboardingStatusResponse,
	Step1Request,
	Step2Request,
	Step3Request,
} from "../api/types";

export const onboardingService = {
	saveStep1: async (data: Step1Request): Promise<OnboardingResponse> => {
		return apiClient.post<OnboardingResponse>("/v1/onboarding/step/1", data);
	},

	saveStep2: async (data: Step2Request): Promise<OnboardingResponse> => {
		return apiClient.post<OnboardingResponse>("/v1/onboarding/step/2", data);
	},

	saveStep3: async (data: Step3Request): Promise<OnboardingResponse> => {
		return apiClient.post<OnboardingResponse>("/v1/onboarding/step/3", data);
	},

	completeOnboarding: async (): Promise<OnboardingResponse> => {
		return apiClient.post<OnboardingResponse>("/v1/onboarding/complete", {});
	},

	getStatus: async (): Promise<OnboardingStatusResponse> => {
		return apiClient.get<OnboardingStatusResponse>("/v1/onboarding/status");
	},
};
