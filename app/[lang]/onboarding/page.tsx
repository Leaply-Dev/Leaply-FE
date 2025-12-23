import { notFound } from "next/navigation";
import {
	getDictionary,
	hasLocale,
	type Locale,
} from "@/app/[lang]/dictionaries";
import { OnboardingClient } from "@/components/OnboardingClient";

const START_YEARS = ["2026", "2027", "2028", "2029"];

export default async function OnboardingPage({
	params,
}: {
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	// Validate locale
	if (!hasLocale(lang)) {
		notFound();
	}

	// Get dictionary
	const dict = await getDictionary(lang as Locale);

	// Build translation-aware constants
	const educationLevels = [
		{ value: "High School", label: dict.onboarding.step1.levels.highSchool },
		{
			value: "Undergraduate",
			label: dict.onboarding.step1.levels.undergraduate,
		},
		{ value: "Graduate", label: dict.onboarding.step1.levels.graduate },
		{
			value: "Working Professional",
			label: dict.onboarding.step1.levels.working,
		},
	];

	const programTypes = [
		{
			value: "Bachelor's",
			label: dict.onboarding.step1.programs.bachelors,
			disabled: true,
		},
		{ value: "Master's", label: dict.onboarding.step1.programs.masters },
		{ value: "MBA", label: dict.onboarding.step1.programs.mba },
		{ value: "PhD", label: dict.onboarding.step1.programs.phd },
	];

	const fieldsOfStudy = [
		dict.onboarding.step2.fields.cs,
		dict.onboarding.step2.fields.business,
		dict.onboarding.step2.fields.finance,
		dict.onboarding.step2.fields.engineering,
		dict.onboarding.step2.fields.dataScience,
		dict.onboarding.step2.fields.design,
		dict.onboarding.step2.fields.health,
		dict.onboarding.step2.fields.other,
	];

	const regions = [
		{
			name: dict.onboarding.step2.regions.eastAsia,
			countries: dict.onboarding.step2.regions.eastAsiaCountries,
		},
		{
			name: dict.onboarding.step2.regions.southeastAsia,
			countries: dict.onboarding.step2.regions.southeastAsiaCountries,
		},
		{
			name: dict.onboarding.step2.regions.westernEurope,
			countries: dict.onboarding.step2.regions.westernEuropeCountries,
		},
		{
			name: dict.onboarding.step2.regions.northernEurope,
			countries: dict.onboarding.step2.regions.northernEuropeCountries,
		},
		{
			name: dict.onboarding.step2.regions.northAmerica,
			countries: dict.onboarding.step2.regions.northAmericaCountries,
		},
		{
			name: dict.onboarding.step2.regions.oceania,
			countries: dict.onboarding.step2.regions.oceaniaCountries,
		},
	];

	const budgetOptions = [
		{ value: 0, label: dict.onboarding.step2.budgetOptions.low },
		{ value: 1, label: dict.onboarding.step2.budgetOptions.medium },
		{ value: 2, label: dict.onboarding.step2.budgetOptions.high },
		{ value: 3, label: dict.onboarding.step2.budgetOptions.scholarship },
	];

	const startTerms = [
		dict.onboarding.step2.terms.spring,
		dict.onboarding.step2.terms.fall,
	];

	const journeyOptions = [
		{
			id: "exploring" as const,
			iconName: "compass" as const,
			title: dict.onboarding.step3.exploring.title,
			description: dict.onboarding.step3.exploring.description,
			redirect: "/persona-lab",
			color: "chart-2",
		},
		{
			id: "targeted" as const,
			iconName: "target" as const,
			title: dict.onboarding.step3.targeted.title,
			description: dict.onboarding.step3.targeted.description,
			redirect: "/explore",
			color: "primary",
		},
	];

	const translations = {
		steps: [
			dict.onboarding.steps.basicInfo,
			dict.onboarding.steps.preferences,
			dict.onboarding.steps.plan,
			dict.onboarding.steps.journey,
			dict.onboarding.steps.complete,
		],
		step1: {
			title: dict.onboarding.step1.title,
			subtitle: dict.onboarding.step1.subtitle,
			educationLevel: dict.onboarding.step1.educationLevel,
			educationLevelRequired: dict.onboarding.step1.educationLevelRequired,
			targetDegree: dict.onboarding.step1.targetDegree,
			targetDegreeRequired: dict.onboarding.step1.targetDegreeRequired,
		},
		step2: {
			title: dict.onboarding.step2.title,
			subtitle: dict.onboarding.step2.subtitle,
			fieldsOfInterest: dict.onboarding.step2.fieldsOfInterest,
			fieldsOfInterestMax: dict.onboarding.step2.fieldsOfInterestMax,
			fieldsRequired: dict.onboarding.step2.fieldsRequired,
			regionsOfInterest: dict.onboarding.step2.regionsOfInterest,
			regionsOptional: dict.onboarding.step2.regionsOptional,
		},
		step2b: {
			title: dict.onboarding.step2b.title,
			subtitle: dict.onboarding.step2b.subtitle,
			timeline: dict.onboarding.step2b.timeline,
			timelineRequired: dict.onboarding.step2b.timelineRequired,
			selectYear: dict.onboarding.step2b.selectYear,
			selectYearPlaceholder: dict.onboarding.step2b.selectYearPlaceholder,
			selectTerm: dict.onboarding.step2b.selectTerm,
			selectTermPlaceholder: dict.onboarding.step2b.selectTermPlaceholder,
			budget: dict.onboarding.step2b.budget,
			budgetRequired: dict.onboarding.step2b.budgetRequired,
		},
		step3: {
			title: dict.onboarding.step3.title,
			subtitle: dict.onboarding.step3.subtitle,
			startNow: dict.onboarding.step3.startNow,
		},
		step4: {
			title: dict.onboarding.step4.title,
			subtitle: dict.onboarding.step4.subtitle,
			ctaExploring: dict.onboarding.step4.ctaExploring,
			ctaTargeted: dict.onboarding.step4.ctaTargeted,
		},
		buttons: {
			back: dict.onboarding.buttons.back,
			continue: dict.onboarding.buttons.continue,
		},
	};

	const constants = {
		educationLevels,
		programTypes,
		fieldsOfStudy,
		regions,
		startYears: START_YEARS,
		startTerms,
		budgetOptions,
		journeyOptions,
	};

	return (
		<OnboardingClient
			translations={translations}
			constants={constants}
			lang={lang}
		/>
	);
}
