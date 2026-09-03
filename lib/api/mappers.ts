import { useMemo } from "react";
import { z } from "zod";
import {
	useAppsProfilingApiGetStatus,
	useAppsProfilingApiUpdateOnboarding,
} from "@/lib/generated/api/endpoints/onboarding/onboarding";
import {
	useAppsAccountsApiUserGetMe,
	useAppsAccountsApiUserGetPreferences,
	useAppsAccountsApiUserGetProfile,
	useAppsAccountsApiUserUpdatePreferences,
	useAppsAccountsApiUserUpdateProfile,
} from "@/lib/generated/api/endpoints/user/user";
import type {
	UpdateOnboardingRequest,
	UpdatePreferencesRequest,
	UpdateProfileRequest,
} from "@/lib/generated/api/models";

// ─── Zod schemas for ApiResponse[dict] responses ─────────────────────────────
// These mirror the Python Pydantic schemas in apps/accounts/schemas.py and
// apps/profiling/schemas.py. Parsing the inner `data` field lets backend drift
// surface as a runtime error instead of a silent type mismatch.

// Django serializes Decimal fields (gpa, gpaScale) as strings — accept either
// and coerce to number, without turning a genuine null into 0.
const decimalField = z
	.union([z.number(), z.string()])
	.transform(Number)
	.nullable()
	.optional();

export const UserMeResponseSchema = z.object({
	userId: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	createdAt: z.string().datetime().or(z.date()),
	fullName: z.string().nullable().optional(),
	currentEducationLevel: z.string().nullable().optional(),
	currentMajor: z.string().nullable().optional(),
	targetDegree: z.string().nullable().optional(),
	gpa: decimalField,
	gpaScale: decimalField,
	testScores: z.record(z.string(), z.string()).nullable().optional(),
	workExperienceYears: z.number().nullable().optional(),
	profileCompletion: z.number().int().default(0),
	fieldOfInterest: z.array(z.string()).nullable().optional(),
	preferredRegions: z.array(z.string()).nullable().optional(),
	intendedStartTerm: z.string().nullable().optional(),
	budgetLabel: z.string().nullable().optional(),
	journeyType: z.string().nullable().optional(),
	programType: z.string().nullable().optional(),
	campusSetting: z.string().nullable().optional(),
	interests: z.array(z.string()).nullable().optional(),
});

export type UserMeResponse = z.infer<typeof UserMeResponseSchema>;

export const ProfileResponseSchema = z.object({
	userId: z.string(),
	fullName: z.string().nullable().optional(),
	currentEducationLevel: z.string().nullable().optional(),
	currentMajor: z.string().nullable().optional(),
	targetDegree: z.string().nullable().optional(),
	gpa: decimalField,
	gpaScale: decimalField,
	testScores: z.record(z.string(), z.string()).nullable().optional(),
	workExperienceYears: z.number().nullable().optional(),
	profileCompletion: z.number().int().default(0),
});

export type ProfileResponse = z.infer<typeof ProfileResponseSchema>;

export const PreferencesResponseSchema = z.object({
	userId: z.string(),
	fieldOfInterest: z.array(z.string()).nullable().optional(),
	preferredRegions: z.array(z.string()).nullable().optional(),
	intendedStartTerm: z.string().nullable().optional(),
	budgetLabel: z.string().nullable().optional(),
	journeyType: z.string().nullable().optional(),
	programType: z.string().nullable().optional(),
	campusSetting: z.string().nullable().optional(),
	interests: z.array(z.string()).nullable().optional(),
});

export type PreferencesResponse = z.infer<typeof PreferencesResponseSchema>;

export const OnboardingDataResponseSchema = z.object({
	completedSteps: z.number().int(),
	isComplete: z.boolean(),
});

export type OnboardingDataResponse = z.infer<
	typeof OnboardingDataResponseSchema
>;

export const OnboardingStatusResponseSchema = z.object({
	currentStep: z.number().int(),
	completed: z.boolean(),
	appTutorialCompleted: z.boolean(),
	data: z.record(z.string(), z.unknown()),
});

export type OnboardingStatusResponse = z.infer<
	typeof OnboardingStatusResponseSchema
>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseData<T>(
	schema: z.ZodType<T>,
	response?: { data: { data?: unknown } },
) {
	if (!response) return undefined;
	return schema.parse(response.data.data) as T;
}

// ─── Typed mappers ───────────────────────────────────────────────────────────

export function useUserMe(options?: { enabled?: boolean }) {
	const query = useAppsAccountsApiUserGetMe({
		query: { enabled: options?.enabled },
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: query.data is the only input that should re-trigger parsing
	const data = useMemo(
		() => parseData(UserMeResponseSchema, query.data),
		[query.data],
	);
	return { ...query, data };
}

export function useUserProfile(options?: { enabled?: boolean }) {
	const query = useAppsAccountsApiUserGetProfile({
		query: { enabled: options?.enabled },
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: query.data is the only input that should re-trigger parsing
	const data = useMemo(
		() => parseData(ProfileResponseSchema, query.data),
		[query.data],
	);
	return { ...query, data };
}

export function useUpdateUserProfile() {
	return useAppsAccountsApiUserUpdateProfile();
}

export function useUserPreferences(options?: { enabled?: boolean }) {
	const query = useAppsAccountsApiUserGetPreferences({
		query: { enabled: options?.enabled },
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: query.data is the only input that should re-trigger parsing
	const data = useMemo(
		() => parseData(PreferencesResponseSchema, query.data),
		[query.data],
	);
	return { ...query, data };
}

export function useUpdateUserPreferences() {
	return useAppsAccountsApiUserUpdatePreferences();
}

export function useOnboardingStatus(options?: { enabled?: boolean }) {
	const query = useAppsProfilingApiGetStatus({
		query: { enabled: options?.enabled },
	});
	// biome-ignore lint/correctness/useExhaustiveDependencies: query.data is the only input that should re-trigger parsing
	const data = useMemo(
		() => parseData(OnboardingStatusResponseSchema, query.data),
		[query.data],
	);
	return { ...query, data };
}

export function useUpdateOnboarding() {
	return useAppsProfilingApiUpdateOnboarding();
}

// ─── Re-export request types for convenience ─────────────────────────────────
export type {
	UpdateProfileRequest,
	UpdatePreferencesRequest,
	UpdateOnboardingRequest,
};
