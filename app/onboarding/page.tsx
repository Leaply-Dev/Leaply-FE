import { getTranslations } from "next-intl/server";
import { OnboardingClient } from "@/components/onboarding/OnboardingClient";

const START_YEARS = ["2026", "2027", "2028", "2029"];

export default async function OnboardingPage() {
	const t = await getTranslations("onboarding");

	// Build translation-aware constants
	const educationLevels = [
		{ value: "high_school", label: t("step1.levels.highSchool") },
		{
			value: "undergrad",
			label: t("step1.levels.undergraduate"),
		},
		{ value: "graduate", label: t("step1.levels.graduate") },
		{
			value: "working",
			label: t("step1.levels.working"),
		},
	];

	const programTypes = [
		{
			value: "bachelors",
			label: t("step1.programs.bachelors"),
			disabled: true,
		},
		{ value: "masters", label: t("step1.programs.masters") },
		{ value: "mba", label: t("step1.programs.mba") },
		{ value: "phd", label: t("step1.programs.phd") },
	];

	const fieldsOfStudy = [
		t("step2.fields.cs"),
		t("step2.fields.business"),
		t("step2.fields.finance"),
		t("step2.fields.engineering"),
		t("step2.fields.dataScience"),
		t("step2.fields.design"),
		t("step2.fields.health"),
		t("step2.fields.other"),
	];

	const regions = [
		{
			name: t("step2.regions.eastAsia"),
			countries: t("step2.regions.eastAsiaCountries"),
		},
		// Note: Southeast Asia intentionally excluded - not supported by backend
		{
			name: t("step2.regions.westernEurope"),
			countries: t("step2.regions.westernEuropeCountries"),
		},
		{
			name: t("step2.regions.northernEurope"),
			countries: t("step2.regions.northernEuropeCountries"),
		},
		{
			name: t("step2.regions.northAmerica"),
			countries: t("step2.regions.northAmericaCountries"),
		},
		{
			name: t("step2.regions.oceania"),
			countries: t("step2.regions.oceaniaCountries"),
		},
	];

	const budgetOptions = [
		{ value: 0, label: t("step2.budgetOptions.low") },
		{ value: 1, label: t("step2.budgetOptions.medium") },
		{ value: 2, label: t("step2.budgetOptions.high") },
		{ value: 3, label: t("step2.budgetOptions.scholarship") },
	];

	const startTerms = [t("step2.terms.spring"), t("step2.terms.fall")];

	const journeyOptions = [
		{
			id: "exploring" as const,
			iconName: "compass" as const,
			title: t("step3.exploring.title"),
			description: t("step3.exploring.description"),
			redirect: "/persona-lab",
			color: "chart-2",
		},
		{
			id: "targeted" as const,
			iconName: "target" as const,
			title: t("step3.targeted.title"),
			description: t("step3.targeted.description"),
			redirect: "/explore",
			color: "primary",
		},
	];

	const translations = {
		steps: [
			t("steps.basicInfo"),
			t("steps.preferences"),
			t("steps.plan"),
			t("steps.journey"),
			t("steps.complete"),
		],
		step1: {
			title: t("step1.title"),
			subtitle: t("step1.subtitle"),
			educationLevel: t("step1.educationLevel"),
			educationLevelRequired: t("step1.educationLevelRequired"),
			targetDegree: t("step1.targetDegree"),
			targetDegreeRequired: t("step1.targetDegreeRequired"),
		},
		step2: {
			title: t("step2.title"),
			subtitle: t("step2.subtitle"),
			fieldsOfInterest: t("step2.fieldsOfInterest"),
			fieldsOfInterestMax: t("step2.fieldsOfInterestMax"),
			fieldsRequired: t("step2.fieldsRequired"),
			regionsOfInterest: t("step2.regionsOfInterest"),
			regionsOptional: t("step2.regionsOptional"),
		},
		step2b: {
			title: t("step2b.title"),
			subtitle: t("step2b.subtitle"),
			timeline: t("step2b.timeline"),
			timelineRequired: t("step2b.timelineRequired"),
			selectYear: t("step2b.selectYear"),
			selectYearPlaceholder: t("step2b.selectYearPlaceholder"),
			selectTerm: t("step2b.selectTerm"),
			selectTermPlaceholder: t("step2b.selectTermPlaceholder"),
			budget: t("step2b.budget"),
			budgetRequired: t("step2b.budgetRequired"),
		},
		step3: {
			title: t("step3.title"),
			subtitle: t("step3.subtitle"),
			startNow: t("step3.startNow"),
		},
		step4: {
			title: t("step4.title"),
			subtitle: t("step4.subtitle"),
			ctaExploring: t("step4.ctaExploring"),
			ctaTargeted: t("step4.ctaTargeted"),
		},
		buttons: {
			back: t("buttons.back"),
			continue: t("buttons.continue"),
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

	return <OnboardingClient translations={translations} constants={constants} />;
}
