"use client";

import { create } from "zustand";

export interface TourStep {
	id: string;
	route: string;
	targetSelector: string;
	titleKey: string;
	descriptionKey: string;
	placement: "top" | "bottom" | "left" | "right";
}

export interface TourState {
	isActive: boolean;
	currentStepIndex: number;
	targetRect: DOMRect | null;
	isNavigating: boolean;
	isTransitioning: boolean;

	start: () => void;
	next: () => void;
	skip: () => void;
	restart: () => void;
	setTargetRect: (rect: DOMRect | null) => void;
	setIsNavigating: (val: boolean) => void;
	setIsTransitioning: (val: boolean) => void;
	goToStep: (index: number) => void;
}

export const TOUR_STEPS: TourStep[] = [
	{
		id: "explore",
		route: "/explore",
		targetSelector: '[data-tour="explore-hero"]',
		titleKey: "step1Title",
		descriptionKey: "step1Desc",
		placement: "bottom",
	},
	{
		id: "persona-lab",
		route: "/persona-lab",
		targetSelector: '[data-tour="persona-canvas"]',
		titleKey: "step2Title",
		descriptionKey: "step2Desc",
		placement: "right",
	},
	{
		id: "essays",
		route: "/dashboard/applications",
		targetSelector: '[data-tour="essays-new"]',
		titleKey: "step3Title",
		descriptionKey: "step3Desc",
		placement: "right",
	},
];

export const TOUR_LOCAL_STORAGE_KEY = "leaply-app-tour-done";

export const useTourStore = create<TourState>((set) => ({
	isActive: false,
	currentStepIndex: 0,
	targetRect: null,
	isNavigating: false,
	isTransitioning: false,

	start: () =>
		set({
			isActive: true,
			currentStepIndex: 0,
			targetRect: null,
			isNavigating: false,
			isTransitioning: false,
		}),

	next: () =>
		set((state) => {
			const nextIndex = state.currentStepIndex + 1;
			if (nextIndex >= TOUR_STEPS.length) {
				// Tour complete
				localStorage.setItem(TOUR_LOCAL_STORAGE_KEY, "true");
				return {
					isActive: false,
					currentStepIndex: 0,
					targetRect: null,
					isNavigating: false,
					isTransitioning: false,
				};
			}
			return {
				currentStepIndex: nextIndex,
				targetRect: null,
				isNavigating: false,
				isTransitioning: false,
			};
		}),

	skip: () => {
		localStorage.setItem(TOUR_LOCAL_STORAGE_KEY, "true");
		set({
			isActive: false,
			currentStepIndex: 0,
			targetRect: null,
			isNavigating: false,
			isTransitioning: false,
		});
	},

	restart: () =>
		set({
			isActive: true,
			currentStepIndex: 0,
			targetRect: null,
			isNavigating: false,
			isTransitioning: false,
		}),

	setTargetRect: (rect) => set({ targetRect: rect }),
	setIsNavigating: (val) => set({ isNavigating: val }),
	setIsTransitioning: (val) => set({ isTransitioning: val }),
	goToStep: (index) =>
		set({
			currentStepIndex: index,
			targetRect: null,
			isNavigating: false,
			isTransitioning: false,
		}),
}));
