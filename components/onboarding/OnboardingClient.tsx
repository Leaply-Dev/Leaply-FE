"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { PageTransition } from "@/components/PageTransition";
import { onboardingService } from "@/lib/services/onboarding";
import { userService } from "@/lib/services/user";
import { type JourneyType, useUserStore } from "@/lib/store/userStore";
import { OnboardingHeader } from "./OnboardingHeader";
import {
	Step1BasicInfo,
	Step2Preferences,
	Step3Plan,
	Step4JourneySelection,
	Step5Completion,
} from "./steps";
import type {
	BasicInfo,
	OnboardingConstants,
	OnboardingTranslations,
	Preferences,
} from "./types";

interface OnboardingClientProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
}

export function OnboardingClient({
	translations,
	constants,
}: OnboardingClientProps) {
	const router = useRouter();
	const {
		profile,
		updateProfile,
		preferences,
		updatePreferences,
		completeOnboarding,
		setJourneyType,
	} = useUserStore();

	const [currentStep, setCurrentStep] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);

	// Form State
	const [basicInfo, setBasicInfo] = useState<BasicInfo>({
		educationLevel: profile?.currentEducationLevel || "",
		targetDegree: profile?.targetDegree || "",
	});

	const [prefs, setPrefs] = useState<Preferences>({
		fields: preferences?.fieldOfInterest || [],
		regions: preferences?.preferredRegions || [],
		startYear: "",
		startTerm: "",
		budgetIndex: 1,
	});

	const [selectedJourney, setSelectedJourney] = useState<JourneyType | null>(
		null,
	);

	// --- Load Initial Data ---
	useEffect(() => {
		const loadOnboardingData = async () => {
			try {
				setIsLoading(true);

				// Get onboarding status to determine starting step
				const status = await onboardingService
					.getOnboardingStatus()
					.catch((error) => {
						// If user has no onboarding data yet (404), start from step 0
						if (error?.status === 404 || error?.message?.includes("404")) {
							return { completedSteps: 0, isComplete: false };
						}
						throw error;
					});

				// If onboarding is complete, redirect to dashboard
				if (status.isComplete) {
					completeOnboarding();
					router.push(`/dashboard`);
					return;
				}

				// Set the current step based on completed steps
				// completedSteps: 0 = start at step 0, 1 = start at step 1, etc.
				setCurrentStep(status.completedSteps);

				// Load user profile and preferences
				const [profileData, preferencesData] = await Promise.all([
					userService.getProfile().catch(() => null),
					userService.getPreferences().catch(() => null),
				]);

				// Populate form with existing data
				if (profileData) {
					setBasicInfo({
						educationLevel: profileData.currentEducationLevel || "",
						targetDegree: profileData.targetDegree || "",
					});
				}

				if (preferencesData) {
					// Parse timeline if it exists
					const timeline = preferencesData.intendedStartTerm || "";
					const [year, term] = timeline.split(" ");

					setPrefs({
						fields: preferencesData.fieldOfInterest || [],
						regions: preferencesData.preferredRegions || [],
						startYear: year || "",
						startTerm: term || "",
						budgetIndex:
							constants.budgetOptions.findIndex(
								(opt) => opt.label === preferencesData.budgetLabel,
							) || 1,
					});
				}
			} catch (error) {
				console.error("Failed to load onboarding data:", error);
				// Start from step 0 if there's an error
				setCurrentStep(0);
			} finally {
				setIsLoading(false);
			}
		};

		loadOnboardingData();
	}, [router, completeOnboarding, constants.budgetOptions]);

	// --- Handlers ---

	const handleBasicInfoChange = (field: keyof BasicInfo, value: string) => {
		setBasicInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handlePrefsChange = (updates: Partial<Preferences>) => {
		setPrefs((prev) => ({ ...prev, ...updates }));
	};

	const handleStep1Next = async () => {
		try {
			setIsSaving(true);

			// Update profile via API
			await userService.updateProfile({
				currentEducationLevel: basicInfo.educationLevel,
				targetDegree: basicInfo.targetDegree,
			});

			// Update local store
			updateProfile({
				currentEducationLevel: basicInfo.educationLevel,
				targetDegree: basicInfo.targetDegree,
			});

			// Update onboarding progress
			await onboardingService.updateOnboarding({
				currentLevel: basicInfo.educationLevel as
					| "high_school"
					| "undergrad"
					| "graduate"
					| "working",
				targetDegree: basicInfo.targetDegree as
					| "bachelors"
					| "masters"
					| "mba"
					| "phd",
			});

			setCurrentStep(1);
		} catch (error) {
			console.error("Failed to save step 1:", error);
			alert("Failed to save your information. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleStep2Next = async () => {
		try {
			setIsSaving(true);

			// Update preferences via API
			await userService.updatePreferences({
				fieldOfInterest: prefs.fields,
				preferredRegions: prefs.regions,
			});

			// Update local store
			updatePreferences({
				fieldOfInterest: prefs.fields,
				preferredRegions: prefs.regions,
			});

			// Update onboarding progress
			await onboardingService.updateOnboarding({
				targetFields: prefs.fields,
				targetRegions: prefs.regions,
			});

			setCurrentStep(2);
		} catch (error) {
			console.error("Failed to save step 2:", error);
			alert("Failed to save your preferences. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleStep3Next = async () => {
		try {
			setIsSaving(true);

			const formattedTimeline = `${prefs.startYear} ${prefs.startTerm}`;
			const budgetLabel = constants.budgetOptions[prefs.budgetIndex].label;

			// Update preferences via API
			await userService.updatePreferences({
				intendedStartTerm: formattedTimeline,
				budgetLabel: budgetLabel,
			});

			// Update local store
			updatePreferences({
				intendedStartTerm: formattedTimeline,
				budgetLabel: budgetLabel,
			});

			// Update onboarding progress
			await onboardingService.updateOnboarding({
				targetIntake: formattedTimeline,
				budgetRange: budgetLabel,
			});

			setCurrentStep(3);
		} catch (error) {
			console.error("Failed to save step 3:", error);
			alert("Failed to save your plan. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleJourneySelect = async (type: JourneyType) => {
		try {
			setIsSaving(true);
			setSelectedJourney(type);
			setJourneyType(type);

			// Update preferences with journey type via API
			await userService.updatePreferences({
				journeyType: type || undefined,
			});

			// Update local store
			updatePreferences({
				journeyType: type || undefined,
			});

			// Mark onboarding as complete
			await onboardingService.updateOnboarding({
				direction: type === "exploring" ? "exploring" : "has_target",
			});

			completeOnboarding();
			setCurrentStep(4);
		} catch (error) {
			console.error("Failed to save journey selection:", error);
			alert("Failed to save your journey selection. Please try again.");
		} finally {
			setIsSaving(false);
		}
	};

	const handleCompletion = () => {
		const redirectPath =
			selectedJourney === "targeted" ? "/explore" : "/persona-lab";
		router.push(`${redirectPath}`);
	};

	// Show loading screen while fetching initial data
	if (isLoading) {
		return (
			<PageTransition>
				<div className="min-h-screen bg-background flex items-center justify-center">
					<div className="text-center space-y-4">
						<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
						<p className="text-muted-foreground">Loading your onboarding...</p>
					</div>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-background flex flex-col">
				<OnboardingHeader />

				{currentStep < 4 && (
					<div className="w-full max-w-3xl mx-auto px-6 py-8">
						<OnboardingProgress
							steps={translations.steps}
							currentStep={currentStep}
						/>
					</div>
				)}

				<div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 sm:px-6 pb-12 w-full max-w-2xl mx-auto">
					<AnimatePresence mode="wait">
						{currentStep === 0 && (
							<Step1BasicInfo
								translations={translations}
								constants={constants}
								basicInfo={basicInfo}
								onBasicInfoChange={handleBasicInfoChange}
								onNext={handleStep1Next}
								onBack={handleBack}
							/>
						)}

						{currentStep === 1 && (
							<Step2Preferences
								translations={translations}
								constants={constants}
								prefs={prefs}
								onPrefsChange={handlePrefsChange}
								onNext={handleStep2Next}
								onBack={handleBack}
							/>
						)}

						{currentStep === 2 && (
							<Step3Plan
								translations={translations}
								constants={constants}
								prefs={prefs}
								onPrefsChange={handlePrefsChange}
								onNext={handleStep3Next}
								onBack={handleBack}
							/>
						)}

						{currentStep === 3 && (
							<Step4JourneySelection
								translations={translations}
								constants={constants}
								onJourneySelect={handleJourneySelect}
								onBack={handleBack}
							/>
						)}

						{currentStep === 4 && (
							<Step5Completion
								translations={translations}
								selectedJourney={selectedJourney}
								onComplete={handleCompletion}
							/>
						)}
					</AnimatePresence>
				</div>
			</div>
		</PageTransition>
	);
}
