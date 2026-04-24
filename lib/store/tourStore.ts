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
		id: "persona-header",
		route: "/persona-lab",
		targetSelector: '[data-tour="persona-header"]',
		titleKey: "step1Title",
		descriptionKey: "step1Desc",
		placement: "bottom",
	},
	{
		id: "persona-chat-panel",
		route: "/persona-lab",
		targetSelector: '[data-tour="persona-chat-panel"]',
		titleKey: "step2Title",
		descriptionKey: "step2Desc",
		placement: "left",
	},
	{
		id: "persona-chat-input",
		route: "/persona-lab",
		targetSelector: '[data-tour="persona-chat-input"]',
		titleKey: "step3Title",
		descriptionKey: "step3Desc",
		placement: "top",
	},
	{
		id: "persona-graph",
		route: "/persona-lab",
		targetSelector: '[data-tour="persona-graph"]',
		titleKey: "step4Title",
		descriptionKey: "step4Desc",
		placement: "left",
	},
	{
		id: "persona-progress",
		route: "/persona-lab",
		targetSelector: '[data-tour="persona-progress"]',
		titleKey: "step5Title",
		descriptionKey: "step5Desc",
		placement: "bottom",
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
