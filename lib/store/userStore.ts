import Cookies from "js-cookie";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Simplified user store for cookie-based authentication.
 *
 * After backend migration to HttpOnly cookies:
 * - Tokens are no longer stored in localStorage (security improvement)
 * - Browser manages auth cookies automatically
 * - This store only tracks UI state (profile, preferences, onboarding)
 */

// Cookie for Next.js middleware (non-HttpOnly, just for routing)
const AUTH_COOKIE_NAME = "leaply-auth-state";
const AUTH_COOKIE_OPTIONS = {
	expires: 7,
	path: "/",
	sameSite: "lax" as const,
};

/**
 * Sync auth state to middleware cookie.
 * This is a non-HttpOnly cookie just to tell Next.js middleware
 * whether the user is authenticated (for route protection).
 */
function syncAuthCookie(
	isAuthenticated: boolean,
	isOnboardingComplete: boolean,
) {
	if (isAuthenticated) {
		Cookies.set(
			AUTH_COOKIE_NAME,
			JSON.stringify({ isAuthenticated, isOnboardingComplete }),
			AUTH_COOKIE_OPTIONS,
		);
	} else {
		Cookies.remove(AUTH_COOKIE_NAME, { path: "/" });
	}
}

export interface UserProfile {
	id: string;
	email: string;
	fullName: string;
	dateOfBirth?: string;
	nationality?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: string;
	currentMajor?: string;
	testScores?: {
		type: string;
		score: string;
	}[];
	intendedStartYear?: number;
	profilePicture?: string;
	avatarNum?: number;
}

export interface UserPreferences {
	desiredMajor?: string;
	desiredMajors?: string[];
	preferredRegions?: string[];
	targetCountries?: string[];
	budgetRange?: {
		min: number;
		max: number;
	};
	budgetLabel?: string;
	timeline?: string;
	campusSetting?: "urban" | "suburban" | "rural";
	languagesOfInstruction?: string[];
	interests?: string[];
	priorities?: string[];
	selfDescription?: string;
	programType?: string;
	fieldOfInterest?: string[];
	intendedStartTerm?: string;
	journeyType?: string;
}

export type JourneyType = "exploring" | "targeted" | null;

interface UserState {
	profile: UserProfile | null;
	preferences: UserPreferences;
	journeyType: JourneyType;
	isOnboardingComplete: boolean;
	isAuthenticated: boolean;
	lastActivity?: {
		type: string;
		path: string;
		title: string;
		timestamp: number;
	};
	_hasHydrated: boolean;

	// Actions
	setHasHydrated: (state: boolean) => void;
	setProfile: (profile: UserProfile) => void;
	updateProfile: (updates: Partial<UserProfile>) => void;
	setPreferences: (preferences: UserPreferences) => void;
	updatePreferences: (updates: Partial<UserPreferences>) => void;
	setJourneyType: (journeyType: JourneyType) => void;
	setLastActivity: (activity: {
		type: string;
		path: string;
		title: string;
	}) => void;
	completeOnboarding: () => void;
	/**
	 * Mark user as logged in.
	 * Tokens are now managed by HttpOnly cookies - we just update UI state.
	 */
	login: (profile: UserProfile, isOnboardingComplete?: boolean) => void;
	logout: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			profile: null,
			preferences: {},
			journeyType: null,
			isOnboardingComplete: false,
			isAuthenticated: false,
			lastActivity: undefined,
			_hasHydrated: false,

			setHasHydrated: (state: boolean) => {
				set({ _hasHydrated: state });
			},

			setProfile: (profile) => set({ profile }),

			updateProfile: (updates) =>
				set((state) => ({
					profile: state.profile
						? { ...state.profile, ...updates }
						: { id: crypto.randomUUID(), email: "", fullName: "", ...updates },
				})),

			setPreferences: (preferences) => set({ preferences }),

			updatePreferences: (updates) =>
				set((state) => ({
					preferences: { ...state.preferences, ...updates },
				})),

			setJourneyType: (journeyType) => set({ journeyType }),

			setLastActivity: (activity) =>
				set({
					lastActivity: {
						...activity,
						timestamp: Date.now(),
					},
				}),

			completeOnboarding: () => {
				syncAuthCookie(true, true);
				set({ isOnboardingComplete: true });
			},

			login: (profile, isOnboardingComplete = false) => {
				// Sync middleware cookie
				syncAuthCookie(true, isOnboardingComplete);

				// Mark auth as validated in session
				if (typeof window !== "undefined") {
					sessionStorage.setItem("leaply-auth-validated", "true");
				}

				set({
					profile,
					isAuthenticated: true,
					isOnboardingComplete,
				});
			},

			logout: () => {
				// Clear middleware cookie
				Cookies.remove(AUTH_COOKIE_NAME, { path: "/" });

				// Clear session validation marker
				if (typeof window !== "undefined") {
					sessionStorage.removeItem("leaply-auth-validated");
				}

				// Also call backend logout to clear HttpOnly cookies
				fetch(
					`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/v1/auth/logout`,
					{
						method: "POST",
						credentials: "include",
					},
				).catch(() => {
					// Ignore errors - we're logging out anyway
				});

				set({
					profile: null,
					isAuthenticated: false,
					isOnboardingComplete: false,
					preferences: {},
					journeyType: null,
					lastActivity: undefined,
				});
			},
		}),
		{
			name: "leaply-user-store",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				profile: state.profile,
				preferences: state.preferences,
				journeyType: state.journeyType,
				isOnboardingComplete: state.isOnboardingComplete,
				isAuthenticated: state.isAuthenticated,
				lastActivity: state.lastActivity,
				// Note: _hasHydrated is intentionally NOT persisted
			}),
			onRehydrateStorage: () => (state, error) => {
				if (error) {
					console.error("Zustand hydration error:", error);
				}
				state?.setHasHydrated(true);
			},
		},
	),
);

// Register hydration listener
if (typeof window !== "undefined") {
	if (useUserStore.persist.hasHydrated()) {
		useUserStore.getState().setHasHydrated(true);
	}

	useUserStore.persist.onFinishHydration(() => {
		useUserStore.getState().setHasHydrated(true);
	});
}
