import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Cookie configuration constants
const AUTH_COOKIE_NAME = "leaply-auth-state";
const AUTH_COOKIE_OPTIONS = {
	expires: 7, // 7 days
	path: "/",
	sameSite: "lax" as const,
};

/**
 * Sync auth state to cookie - called SYNCHRONOUSLY within actions
 * This ensures cookie and store are always in sync and prevents race conditions
 *
 * When authenticated: Sets cookie with auth state
 * When not authenticated: Removes cookie entirely (prevents stale cookie issues)
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
		// When not authenticated, remove cookie entirely
		// This prevents the "2 refresh" problem where stale cookies cause routing issues
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
	// New fields for onboarding
	programType?: string;
	fieldOfInterest?: string[];
	intendedStartTerm?: string;
	journeyType?: string;
}

export type JourneyType = "exploring" | "targeted" | null;

interface UserState {
	profile: UserProfile | null;
	accessToken: string | null;
	refreshToken: string | null;
	tokenExpiresAt: number | null; // Unix timestamp in ms
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
	// Hydration state - set by onRehydrateStorage callback
	_hasHydrated: boolean;
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
	login: (
		profile: UserProfile,
		accessToken: string,
		refreshToken: string,
		expiresIn: number,
		isOnboardingComplete?: boolean,
	) => void;
	setTokens: (
		accessToken: string,
		refreshToken: string,
		expiresIn: number,
	) => void;
	logout: () => void;
	// Legacy support for components still using 'token'
	get token(): string | null;
}

export const useUserStore = create<UserState>()(
	persist(
		(set, get) => ({
			profile: null,
			accessToken: null,
			refreshToken: null,
			tokenExpiresAt: null,
			preferences: {},
			journeyType: null,
			isOnboardingComplete: false,
			isAuthenticated: false,
			lastActivity: undefined,
			// Hydration state - starts false, set to true by onRehydrateStorage
			_hasHydrated: false,

			setHasHydrated: (state: boolean) => {
				set({ _hasHydrated: state });
			},

			// Legacy getter for 'token' - returns accessToken for backwards compatibility
			get token() {
				return get().accessToken;
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
				// Sync cookie SYNCHRONOUSLY with new onboarding status
				syncAuthCookie(true, true);
				set({ isOnboardingComplete: true });
			},

			login: (
				profile,
				accessToken,
				refreshToken,
				expiresIn,
				isOnboardingComplete = false,
			) => {
				if (process.env.NODE_ENV === "development") {
					console.log("Login: Storing tokens", {
						hasAccessToken: !!accessToken,
						hasRefreshToken: !!refreshToken,
						isOnboardingComplete,
					});
				}

				// Sync cookie SYNCHRONOUSLY before updating state
				// This ensures middleware sees correct auth state immediately
				syncAuthCookie(true, isOnboardingComplete);

				// Mark auth as validated in session to prevent AuthProvider from re-validating
				// This prevents the race condition where AuthProvider tries to validate
				// before tokens are properly synced
				if (typeof window !== "undefined") {
					sessionStorage.setItem("leaply-auth-validated", "true");
				}

				set({
					profile,
					accessToken,
					refreshToken,
					tokenExpiresAt: Date.now() + expiresIn * 1000,
					isAuthenticated: true,
					isOnboardingComplete,
				});
			},

			setTokens: (accessToken, refreshToken, expiresIn) =>
				set({
					accessToken,
					refreshToken,
					tokenExpiresAt: Date.now() + expiresIn * 1000,
				}),

			logout: () => {
				// Clear cookie SYNCHRONOUSLY inside the action
				// This ensures cookie is cleared before any redirect happens
				// The subscription below runs asynchronously and may not clear in time
				Cookies.remove("leaply-auth-state", { path: "/" });

				// Clear session validation marker
				if (typeof window !== "undefined") {
					sessionStorage.removeItem("leaply-auth-validated");
				}

				set({
					profile: null,
					accessToken: null,
					refreshToken: null,
					tokenExpiresAt: null,
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
			partialize: (state) => ({
				profile: state.profile,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
				tokenExpiresAt: state.tokenExpiresAt,
				preferences: state.preferences,
				journeyType: state.journeyType,
				isOnboardingComplete: state.isOnboardingComplete,
				isAuthenticated: state.isAuthenticated,
				lastActivity: state.lastActivity,
				// Note: _hasHydrated is intentionally NOT persisted
			}),
			onRehydrateStorage: () => (state, error) => {
				// This callback is called when hydration finishes
				if (error) {
					console.error("Zustand hydration error:", error);
				}
				// Note: Calling setHasHydrated here may not trigger React re-renders reliably
				// due to how persist merges state. The onFinishHydration listener below
				// is the primary mechanism. This serves as a fallback.
				state?.setHasHydrated(true);
			},
		},
	),
);

// Register hydration listener using persist API
// This is more reliable than onRehydrateStorage for triggering React updates
// because it uses getState() which properly notifies subscribers
// See: https://zustand.docs.pmnd.rs/integrations/persisting-store-data
if (typeof window !== "undefined") {
	// Handle case where hydration already completed before this code runs
	// This covers the race condition where components subscribe after hydration
	if (useUserStore.persist.hasHydrated()) {
		useUserStore.getState().setHasHydrated(true);
	}

	// Listen for future hydration completions (e.g., after rehydrate() is called)
	useUserStore.persist.onFinishHydration(() => {
		useUserStore.getState().setHasHydrated(true);
	});
}

// NOTE: We removed the useUserStore.subscribe() block that was here.
// It was causing a race condition where:
// 1. logout() clears the cookie synchronously
// 2. The async subscription fires and recreates the cookie
// 3. Middleware reads stale cookie before it's properly cleared
//
// Cookie sync is now done SYNCHRONOUSLY inside login(), completeOnboarding(), and logout() actions.
// This ensures the cookie is always in sync with the store state.
