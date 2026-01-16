"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import for OnboardingClient (415 lines - large multi-step component)
const OnboardingClient = dynamic(
	() =>
		import("@/components/onboarding/OnboardingClient").then(
			(mod) => mod.OnboardingClient,
		),
	{
		ssr: false, // Complex form state and navigation
		loading: () => <OnboardingPageSkeleton />,
	},
);

// Loading skeleton for onboarding
function OnboardingPageSkeleton() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
			<div className="container mx-auto px-4 py-8">
				{/* Progress bar skeleton */}
				<div className="max-w-2xl mx-auto mb-8">
					<div className="flex items-center gap-4 mb-4">
						{[1, 2, 3, 4, 5].map((step) => (
							<div key={step} className="flex items-center flex-1">
								<div className="w-8 h-8 rounded-full bg-muted border-2 flex items-center justify-center">
									<Skeleton className="w-4 h-4 rounded-full" />
								</div>
								{step < 5 && <div className="flex-1 h-0.5 bg-muted ml-2" />}
							</div>
						))}
					</div>
					<Skeleton className="h-4 w-32 mx-auto" />
				</div>

				{/* Main content skeleton */}
				<div className="max-w-2xl mx-auto">
					<div className="bg-card border border-border rounded-xl p-8">
						{/* Header */}
						<div className="text-center mb-8">
							<Skeleton className="h-8 w-64 mx-auto mb-3" />
							<Skeleton className="h-5 w-80 mx-auto" />
						</div>

						{/* Form content */}
						<div className="space-y-6">
							<div>
								<Skeleton className="h-4 w-32 mb-3" />
								<div className="grid grid-cols-2 gap-3">
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className="p-4 border border-border rounded-lg"
										>
											<Skeleton className="h-4 w-24" />
										</div>
									))}
								</div>
							</div>

							<div>
								<Skeleton className="h-4 w-28 mb-3" />
								<div className="grid grid-cols-2 gap-3">
									{[1, 2].map((i) => (
										<div
											key={i}
											className="p-4 border border-border rounded-lg"
										>
											<Skeleton className="h-4 w-20" />
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Navigation buttons */}
						<div className="flex justify-between pt-8 mt-8 border-t border-border">
							<Skeleton className="h-10 w-20" />
							<Skeleton className="h-10 w-24" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const START_YEARS = ["2026", "2027", "2028", "2029"];

export default function OnboardingPage() {
	const t = useTranslations("onboarding");

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
		{
			name: t("step2.regions.southeastAsia"),
			countries: t("step2.regions.southeastAsiaCountries"),
		},
		{
			name: t("step2.regions.westernEurope"),
			countries: t("step2.regions.westernEuropeCountries"),
		},
		{
			name: t("step2.regions.centralEurope"),
			countries: t("step2.regions.centralEuropeCountries"),
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

	return (
		<Suspense fallback={<OnboardingPageSkeleton />}>
			<OnboardingClient translations={translations} constants={constants} />
		</Suspense>
	);
}
