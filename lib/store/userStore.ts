import { create } from 'zustand';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth?: string;
  nationality?: string;
  currentEducationLevel?: string;
  gpa?: number;
  testScores?: {
    type: string;
    score: string;
  }[];
  intendedStartYear?: number;
  profilePicture?: string;
}

export interface UserPreferences {
  desiredMajor?: string;
  preferredRegions?: string[];
  budgetRange?: {
    min: number;
    max: number;
  };
  campusSetting?: 'urban' | 'suburban' | 'rural';
  languagesOfInstruction?: string[];
  interests?: string[];
}

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  isOnboardingComplete: boolean;
  isAuthenticated: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  completeOnboarding: () => void;
  login: (profile: UserProfile) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: null,
  preferences: {},
  isOnboardingComplete: false,
  isAuthenticated: false,

  setProfile: (profile) => set({ profile }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),

  setPreferences: (preferences) => set({ preferences }),

  updatePreferences: (updates) =>
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    })),

  completeOnboarding: () => set({ isOnboardingComplete: true }),

  login: (profile) =>
    set({ profile, isAuthenticated: true }),

  logout: () =>
    set({
      profile: null,
      isAuthenticated: false,
      isOnboardingComplete: false,
      preferences: {},
    }),
}));

