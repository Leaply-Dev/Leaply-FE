import type { JourneyType } from "@/lib/store/userStore";

export interface OnboardingTranslations {
	steps: string[];
	step1: {
		title: string;
		subtitle: string;
		educationLevel: string;
		educationLevelRequired: string;
		targetDegree: string;
		targetDegreeRequired: string;
	};
	step2: {
		title: string;
		subtitle: string;
		fieldsOfInterest: string;
		fieldsOfInterestMax: string;
		fieldsRequired: string;
		regionsOfInterest: string;
		regionsOptional: string;
	};
	step2b: {
		title: string;
		subtitle: string;
		timeline: string;
		timelineRequired: string;
		selectYear: string;
		selectYearPlaceholder: string;
		selectTerm: string;
		selectTermPlaceholder: string;
		budget: string;
		budgetRequired: string;
	};
	step3: {
		title: string;
		subtitle: string;
		startNow: string;
	};
	step4: {
		title: string;
		subtitle: string;
		ctaExploring: string;
		ctaTargeted: string;
	};
	buttons: {
		back: string;
		continue: string;
	};
}

export interface OnboardingConstants {
	educationLevels: Array<{ value: string; label: string }>;
	programTypes: Array<{ value: string; label: string; disabled?: boolean }>;
	fieldsOfStudy: string[];
	regions: Array<{ name: string; countries: string }>;
	startYears: string[];
	startTerms: string[];
	budgetOptions: Array<{ value: number; label: string }>;
	journeyOptions: Array<{
		id: "exploring" | "targeted";
		iconName: "compass" | "target";
		title: string;
		description: string;
		redirect: string;
		color: string;
	}>;
}

export interface BasicInfo {
	educationLevel: string;
	targetDegree: string;
}

export interface Preferences {
	fields: string[];
	regions: string[];
	startYear: string;
	startTerm: string;
	budgetIndex: number;
}

export interface StepProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	onNext: () => void;
	onBack: () => void;
}

export interface StepContainerProps {
	title: string;
	subtitle: string;
	children: React.ReactNode;
}

export interface StepNavigationProps {
	backLabel: string;
	continueLabel: string;
	onBack: () => void;
	onNext: () => void;
	isBackDisabled?: boolean;
	isNextDisabled?: boolean;
	showContinue?: boolean;
}
