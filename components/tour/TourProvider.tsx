"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useUserStore } from "@/lib/store/userStore";
import {
	getStatus,
	updateOnboarding,
} from "@/lib/generated/api/endpoints/onboarding/onboarding";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import type { OnboardingStatusResponse } from "@/lib/generated/api/models";
import {
	TOUR_LOCAL_STORAGE_KEY,
	TOUR_STEPS,
	useTourStore,
} from "@/lib/store/tourStore";
import { TourSpotlight } from "./TourSpotlight";
import { TourTooltip } from "./TourTooltip";

const TARGET_FIND_RETRIES = 10;
const TARGET_FIND_INTERVAL = 300;
const NAVIGATION_DELAY = 400;

export function TourProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const pathname = usePathname();
	const {
		isActive,
		currentStepIndex,
		targetRect,
		setTargetRect,
		next,
		skip,
		start,
		setIsNavigating,
	} = useTourStore();

	const isOnboardingComplete = useUserStore((s) => s.isOnboardingComplete);
	const hasHydrated = useUserStore((s) => s._hasHydrated);

	const [mounted, setMounted] = useState(false);
	const [shouldAutoStart, setShouldAutoStart] = useState(false);
	const retryCountRef = useRef(0);
	const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const navTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Check on mount if we should auto-start the tour
	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!hasHydrated) return;
		if (!isOnboardingComplete) return;
		if (localStorage.getItem(TOUR_LOCAL_STORAGE_KEY) === "true") return;

		// Check backend flag
		const checkBackend = async () => {
			try {
				const response = await getStatus();
				const status = unwrapResponse<OnboardingStatusResponse>(response);
				if (status?.appTutorialCompleted) {
					localStorage.setItem(TOUR_LOCAL_STORAGE_KEY, "true");
					return;
				}
				setShouldAutoStart(true);
			} catch {
				// If backend fails, still allow auto-start via local check
				setShouldAutoStart(true);
			}
		};

		checkBackend();
	}, [hasHydrated, isOnboardingComplete]);

	// Auto-start when conditions are met
	useEffect(() => {
		if (!shouldAutoStart || isActive) return;
		// Small delay to let page settle
		const timer = setTimeout(() => start(), 800);
		return () => clearTimeout(timer);
	}, [shouldAutoStart, isActive, start]);

	// Handle step changes: navigate to correct route, then find target
	useEffect(() => {
		if (!isActive) {
			setTargetRect(null);
			return;
		}

		const step = TOUR_STEPS[currentStepIndex];
		if (!step) return;

		// Cancel any pending retries
		if (retryTimerRef.current) {
			clearInterval(retryTimerRef.current);
			retryTimerRef.current = null;
		}
		if (navTimerRef.current) {
			clearTimeout(navTimerRef.current);
			navTimerRef.current = null;
		}

		const navigateAndFindTarget = () => {
			// Check if we need to navigate
			const needsNavigation =
				pathname !== step.route && !pathname.startsWith(step.route);

			if (needsNavigation) {
				setIsNavigating(true);
				setTargetRect(null);
				router.push(step.route);
			}

			// Wait for navigation + DOM settle, then find target
			const delay = needsNavigation ? NAVIGATION_DELAY : 100;

			navTimerRef.current = setTimeout(() => {
				retryCountRef.current = 0;

				const tryFindTarget = () => {
					const el = document.querySelector(step.targetSelector) as HTMLElement;
					if (el) {
						const rect = el.getBoundingClientRect();
						setTargetRect(rect);
						setIsNavigating(false);
						// Scroll into view if needed
						el.scrollIntoView({ behavior: "smooth", block: "center" });
						if (retryTimerRef.current) {
							clearInterval(retryTimerRef.current);
							retryTimerRef.current = null;
						}
						return true;
					}
					return false;
				};

				// Try immediately
				if (tryFindTarget()) return;

				// Retry periodically
				retryTimerRef.current = setInterval(() => {
					retryCountRef.current++;
					if (tryFindTarget()) return;

					if (retryCountRef.current >= TARGET_FIND_RETRIES) {
						if (retryTimerRef.current) {
							clearInterval(retryTimerRef.current);
							retryTimerRef.current = null;
						}
						// Show centered tooltip as fallback
						setTargetRect(null);
						setIsNavigating(false);
					}
				}, TARGET_FIND_INTERVAL);
			}, delay);
		};

		navigateAndFindTarget();

		return () => {
			if (retryTimerRef.current) clearInterval(retryTimerRef.current);
			if (navTimerRef.current) clearTimeout(navTimerRef.current);
		};
	}, [isActive, currentStepIndex, pathname, router, setTargetRect, setIsNavigating]);

	// Keep target rect updated on scroll/resize
	useEffect(() => {
		if (!isActive || !targetRect) return;

		const step = TOUR_STEPS[currentStepIndex];
		if (!step) return;

		const updateRect = () => {
			const el = document.querySelector(step.targetSelector) as HTMLElement;
			if (el) {
				setTargetRect(el.getBoundingClientRect());
			}
		};

		window.addEventListener("scroll", updateRect, true);
		window.addEventListener("resize", updateRect);

		return () => {
			window.removeEventListener("scroll", updateRect, true);
			window.removeEventListener("resize", updateRect);
		};
	}, [isActive, currentStepIndex, targetRect, setTargetRect]);

	// Keyboard: Escape to skip
	useEffect(() => {
		if (!isActive) return;

		const handleKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleSkip();
			}
		};

		window.addEventListener("keydown", handleKey);
		return () => window.removeEventListener("keydown", handleKey);
	}, [isActive]);

	const handleNext = () => {
		const step = TOUR_STEPS[currentStepIndex];
		if (!step) return;

		if (currentStepIndex >= TOUR_STEPS.length - 1) {
			// Finish tour
			handleSkip();
			return;
		}

		next();
	};

	const handleSkip = async () => {
		skip();
		localStorage.setItem(TOUR_LOCAL_STORAGE_KEY, "true");
		try {
			await updateOnboarding({ appTutorialCompleted: true });
		} catch {
			// Ignore backend errors on skip
		}
	};

	const step = isActive ? TOUR_STEPS[currentStepIndex] : null;

	return (
		<>
			{children}
			{mounted &&
				isActive &&
				createPortal(
					<AnimatePresence mode="wait">
						{isActive && (
							<div key="tour-overlay">
								<TourSpotlight targetRect={targetRect} />
								{step && (
									<TourTooltip
										key={step.id}
										step={step}
										stepIndex={currentStepIndex}
										totalSteps={TOUR_STEPS.length}
										targetRect={targetRect}
										onNext={handleNext}
										onSkip={handleSkip}
									/>
								)}
							</div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</>
	);
}
