/**
 * Migration compat shims.
 *
 * Thin re-exports for typed mapper responses consumed by code not yet moved to
 * generated models directly.
 */

export type {
	OnboardingDataResponse,
	OnboardingStatusResponse,
	PreferencesResponse,
	ProfileResponse,
	UserMeResponse,
} from "@/lib/api/mappers";
