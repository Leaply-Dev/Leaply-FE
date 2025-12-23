"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { PageTransition } from "@/components/PageTransition";
import { type JourneyType, useUserStore } from "@/lib/store/userStore";
import { OnboardingHeader } from "./OnboardingHeader";
import {
	Step1BasicInfo,
	Step2Preferences,
	Step3Plan,
	Step4JourneySelection,
	Step5Completion,
} from "./steps";
import type { BasicInfo, OnboardingConstants, OnboardingTranslations, Preferences } from "./types";

interface OnboardingClientProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	lang: string;
}

export function OnboardingClient({
	translations,
	constants,
	lang,
}: OnboardingClientProps) {
	const router = useRouter();
	const {
		profile,
		updateProfile,
		preferences,
		updatePreferences,
		completeOnboarding,
		setJourneyType,
		login,
	} = useUserStore();

	const [currentStep, setCurrentStep] = useState(0);

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

	const [selectedJourney, setSelectedJourney] = useState<JourneyType | null>(null);

	// --- Handlers ---

	const handleBasicInfoChange = (field: keyof BasicInfo, value: string) => {
		setBasicInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handlePrefsChange = (updates: Partial<Preferences>) => {
		setPrefs((prev) => ({ ...prev, ...updates }));
	};

	const handleStep1Next = () => {
		updateProfile({
			currentEducationLevel: basicInfo.educationLevel,
			targetDegree: basicInfo.targetDegree,
		});
		setCurrentStep(1);
	};

	const handleStep2Next = () => {
		updatePreferences({
			fieldOfInterest: prefs.fields,
			preferredRegions: prefs.regions,
		});
		setCurrentStep(2);
	};

	const handleStep3Next = () => {
		const formattedTimeline = `${prefs.startYear} ${prefs.startTerm}`;
		const budgetLabel = constants.budgetOptions[prefs.budgetIndex].label;

		updatePreferences({
			intendedStartTerm: formattedTimeline,
			budgetLabel: budgetLabel,
		});
		setCurrentStep(3);
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleJourneySelect = (type: JourneyType) => {
		setSelectedJourney(type);
		setJourneyType(type);
		completeOnboarding();
		if (profile) login(profile);
		setCurrentStep(4);
	};

	const handleCompletion = () => {
		const redirectPath = selectedJourney === "targeted" ? "/explore" : "/persona-lab";
		router.push(`/${lang}${redirectPath}`);
	};

	return (
		<PageTransition>
			<div className="min-h-screen bg-background flex flex-col">
				<OnboardingHeader lang={lang} />

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
