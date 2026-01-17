"use client";

import { AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { PageTransition } from "@/components/PageTransition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	mapBudgetIndexToKey,
	mapFieldsToKeys,
	mapRegionsToKeys,
} from "@/lib/constants/onboardingMappings";
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
	const [error, setError] = useState<string | null>(null);

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
						return { completedSteps: 0, isComplete: false };
					});

				// If onboarding is complete, redirect to dashboard
				if (status?.isComplete) {
					completeOnboarding();
					router.push("/dashboard");
					return;
				}

				// Set the current step based on completed steps
				// Ensure it's within bounds (0 to 4)
				const startingStep = Math.min(
					Math.max(status?.completedSteps || 0, 0),
					4,
				);
				setCurrentStep(startingStep);

				// Load user profile and preferences
				const [profileData, preferencesData] = await Promise.all([
					userService.getProfile().catch((_e) => {
						return null;
					}),
					userService.getPreferences().catch((_e) => {
						return null;
					}),
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
					const parts = timeline.split(" ");
					const year = parts[0] || "";
					const term = parts.slice(1).join(" ") || "";

					setPrefs({
						fields: preferencesData.fieldOfInterest || [],
						regions: preferencesData.preferredRegions || [],
						startYear: year,
						startTerm: term,
						budgetIndex:
							constants.budgetOptions.findIndex(
								(opt) => opt.label === preferencesData.budgetLabel,
							) === -1
								? 1
								: constants.budgetOptions.findIndex(
										(opt) => opt.label === preferencesData.budgetLabel,
									),
					});
				}
			} catch (error) {
				console.error(
					"OnboardingClient: Critical failure loading data:",
					error,
				);
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
			// Update local store
			updateProfile({
				currentEducationLevel: basicInfo.educationLevel,
				targetDegree: basicInfo.targetDegree,
			});

			// Update onboarding progress (this also persists profile data on backend)
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
			setError(null);
		} catch (error) {
			console.error("Failed to save step 1:", error);
			setError("Failed to save your information. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleStep2Next = async () => {
		try {
			// Update local store with display labels (for UI consistency)
			updatePreferences({
				fieldOfInterest: prefs.fields,
				preferredRegions: prefs.regions,
			});

			// Transform labels to enum keys for API
			const fieldKeys = mapFieldsToKeys(prefs.fields);
			const regionKeys = mapRegionsToKeys(prefs.regions);

			// Update onboarding progress with enum keys
			await onboardingService.updateOnboarding({
				targetFields: fieldKeys,
				targetRegions: regionKeys,
			});

			setCurrentStep(2);
			setError(null);
		} catch (error) {
			console.error("Failed to save step 2:", error);
			setError("Failed to save your preferences. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};
	const handleStep3Next = async () => {
		try {
			const formattedTimeline = `${prefs.startYear} ${prefs.startTerm}`;
			const budgetLabel = constants.budgetOptions[prefs.budgetIndex].label;

			// Update local store with display labels (for UI consistency)
			updatePreferences({
				intendedStartTerm: formattedTimeline,
				budgetLabel: budgetLabel,
			});

			// Transform budget index to enum key for API
			const budgetKey = mapBudgetIndexToKey(prefs.budgetIndex);

			// Update onboarding progress with enum key
			await onboardingService.updateOnboarding({
				targetIntake: formattedTimeline,
				budgetRange: budgetKey,
			});

			setCurrentStep(3);
			setError(null);
		} catch (error) {
			console.error("Failed to save step 3:", error);
			setError("Failed to save your plan. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};
	const handleJourneySelect = async (type: JourneyType) => {
		try {
			setSelectedJourney(type);
			setJourneyType(type);

			// Update local store
			updatePreferences({
				journeyType: type || undefined,
			});

			// Mark onboarding as complete (this also persists journey selection)
			await onboardingService.updateOnboarding({
				direction: type === "exploring" ? "exploring" : "has_target",
			});

			completeOnboarding();
			setCurrentStep(4);
			setError(null);
		} catch (error) {
			console.error("Failed to save journey selection:", error);
			setError("Failed to save your journey selection. Please try again.");
		} finally {
			setIsLoading(false);
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
					<div className="w-full max-w-3xl mx-auto px-6 py-8 space-y-4">
						<AnimatePresence>
							{error && (
								<PageTransition>
									<Alert variant="destructive" className="relative pr-10">
										<AlertCircle className="h-4 w-4" />
										<AlertTitle>Error</AlertTitle>
										<AlertDescription>{error}</AlertDescription>
										<button
											type="button"
											onClick={() => setError(null)}
											className="absolute right-3 top-3 text-destructive/60 hover:text-destructive"
										>
											<X className="h-4 w-4" />
										</button>
									</Alert>
								</PageTransition>
							)}
						</AnimatePresence>

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
