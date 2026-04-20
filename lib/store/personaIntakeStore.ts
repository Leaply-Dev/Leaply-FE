/**
 * Persona Lab intake form — local draft state.
 *
 * TanStack Query owns server state (useGetIntake/useSaveIntake/useSaveSection);
 * this store only holds the in-progress form draft, autosave status, and the
 * section the user is currently on. Persisted to localStorage so a half-finished
 * intake survives a refresh.
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { PersonaIntakeRequest } from "@/lib/generated/api/models";

export type IntakeSection = 1 | 2 | 3;
export type AutosaveStatus = "idle" | "saving" | "saved" | "error";

export type IntakeDraft = PersonaIntakeRequest;

interface PersonaIntakeState {
	draft: IntakeDraft;
	currentSection: IntakeSection;
	autosaveStatus: AutosaveStatus;
	lastSavedAt: number | null;
	hasHydrated: boolean;

	setDraft: (updates: Partial<IntakeDraft>) => void;
	replaceDraft: (draft: IntakeDraft) => void;
	setCurrentSection: (section: IntakeSection) => void;
	setAutosaveStatus: (status: AutosaveStatus) => void;
	markSaved: () => void;
	resetDraft: () => void;
	setHasHydrated: (v: boolean) => void;
}

const emptyDraft: IntakeDraft = {};

export const usePersonaIntakeStore = create<PersonaIntakeState>()(
	persist(
		(set) => ({
			draft: emptyDraft,
			currentSection: 1,
			autosaveStatus: "idle",
			lastSavedAt: null,
			hasHydrated: false,

			setDraft: (updates) =>
				set((state) => ({ draft: { ...state.draft, ...updates } })),
			replaceDraft: (draft) => set({ draft }),
			setCurrentSection: (section) => set({ currentSection: section }),
			setAutosaveStatus: (status) => set({ autosaveStatus: status }),
			markSaved: () =>
				set({ autosaveStatus: "saved", lastSavedAt: Date.now() }),
			resetDraft: () =>
				set({
					draft: emptyDraft,
					currentSection: 1,
					autosaveStatus: "idle",
					lastSavedAt: null,
				}),
			setHasHydrated: (v) => set({ hasHydrated: v }),
		}),
		{
			name: "leaply-persona-intake-v1",
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				draft: state.draft,
				currentSection: state.currentSection,
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);

if (typeof window !== "undefined") {
	if (usePersonaIntakeStore.persist.hasHydrated()) {
		usePersonaIntakeStore.getState().setHasHydrated(true);
	}
	usePersonaIntakeStore.persist.onFinishHydration(() => {
		usePersonaIntakeStore.getState().setHasHydrated(true);
	});
}
