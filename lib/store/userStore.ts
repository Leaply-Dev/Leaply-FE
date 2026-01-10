import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
	setTokens: (accessToken: string, refreshToken: string, expiresIn: number) => void;
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

			completeOnboarding: () => set({ isOnboardingComplete: true }),

			login: (profile, accessToken, refreshToken, expiresIn, isOnboardingComplete = false) =>
				set({
					profile,
					accessToken,
					refreshToken,
					tokenExpiresAt: Date.now() + expiresIn * 1000,
					isAuthenticated: true,
					isOnboardingComplete,
				}),

			setTokens: (accessToken, refreshToken, expiresIn) =>
				set({
					accessToken,
					refreshToken,
					tokenExpiresAt: Date.now() + expiresIn * 1000,
				}),

			logout: () =>
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
				}),
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
			}),
		},
	),
);

// Subscribe to store changes to sync auth state to cookie for middleware
useUserStore.subscribe((state) => {
	const authState = {
		isAuthenticated: state.isAuthenticated,
		isOnboardingComplete: state.isOnboardingComplete,
	};
	Cookies.set("leaply-auth-state", JSON.stringify(authState), {
		expires: 7, // 7 days
		path: "/",
		sameSite: "lax",
	});
});
