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
	setProfile: (profile: UserProfile) => void;
	updateProfile: (updates: Partial<UserProfile>) => void;
	setPreferences: (preferences: UserPreferences) => void;
	updatePreferences: (updates: Partial<UserPreferences>) => void;
	setJourneyType: (journeyType: JourneyType) => void;
	setLastActivity: (activity: { type: string; path: string; title: string }) => void;
	completeOnboarding: () => void;
	login: (profile: UserProfile) => void;
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

			login: (profile) => set({ profile, isAuthenticated: true }),

			logout: () =>
				set({
					profile: null,
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
				preferences: state.preferences,
				journeyType: state.journeyType,
				isOnboardingComplete: state.isOnboardingComplete,
				isAuthenticated: state.isAuthenticated,
				lastActivity: state.lastActivity,
			}),
		}
	)
);
