"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Compass, PartyPopper, Target } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type JourneyType, useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

interface OnboardingClientProps {
	translations: {
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
	};
	constants: {
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
	};
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
	const [basicInfo, setBasicInfo] = useState({
		educationLevel: profile?.currentEducationLevel || "",
		targetDegree: profile?.targetDegree || "",
	});

	const [prefs, setPrefs] = useState({
		fields: preferences?.fieldOfInterest || [],
		regions: preferences?.preferredRegions || [],
		startYear: "",
		startTerm: "",
		budgetIndex: 1, // Default to 500tr-1tỷ
	});

	const [selectedJourney, setSelectedJourney] = useState<JourneyType | null>(
		null,
	);

	// --- Handlers ---

	const handleBasicInfoChange = (field: string, value: string) => {
		setBasicInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleNext = () => {
		if (currentStep === 0) {
			// Save step 1 data
			updateProfile({
				currentEducationLevel: basicInfo.educationLevel,
				targetDegree: basicInfo.targetDegree,
			});
			setCurrentStep(1);
		} else if (currentStep === 1) {
			// Save step 2 data (Fields & Regions)
			updatePreferences({
				fieldOfInterest: prefs.fields,
				preferredRegions: prefs.regions,
			});
			setCurrentStep(2);
		} else if (currentStep === 2) {
			// Save step 3 data (Timeline & Budget)
			const formattedTimeline = `${prefs.startYear} ${prefs.startTerm}`;
			const budgetLabel = constants.budgetOptions[prefs.budgetIndex].label;

			updatePreferences({
				intendedStartTerm: formattedTimeline,
				budgetLabel: budgetLabel,
			});
			setCurrentStep(3);
		}
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
		if (profile) login(profile); // Ensure authed
		setCurrentStep(4);
	};

	const handleCompletion = () => {
		const redirectPath =
			selectedJourney === "targeted" ? "/explore" : "/persona-lab";
		router.push(`/${lang}${redirectPath}`);
	};

	// --- Validation ---

	const isStep1Valid =
		basicInfo.educationLevel.length > 0 && basicInfo.targetDegree.length > 0;

	const isStep2Valid = prefs.fields.length > 0;

	const isStep3Valid = prefs.startYear.length > 0 && prefs.startTerm.length > 0;

	return (
		<PageTransition>
			<div className="min-h-screen bg-background flex flex-col">
				{/* Header with Logo and Language Switcher */}
				<div className="w-full border-b border-border">
					<div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
						<div className="flex items-center justify-between">
							{/* Logo */}
							<Link href={`/${lang}`} className="flex items-center">
								<Image
									src="/Logo.png"
									alt="Leaply"
									width={120}
									height={40}
									className="h-8 w-auto"
								/>
							</Link>

							{/* Language Switcher */}
							<LanguageSwitcher currentLocale={lang as "en" | "vi"} />
						</div>
					</div>
				</div>

				{/* Progress Header - Only show for first 4 steps */}
				{currentStep < 4 && (
					<div className="w-full max-w-3xl mx-auto px-6 py-8">
						<OnboardingProgress
							steps={translations.steps}
							currentStep={currentStep}
						/>
					</div>
				)}

				{/* Main Content Area */}
				<div className="flex-1 flex flex-col items-center justify-start pt-4 px-4 sm:px-6 pb-12 w-full max-w-2xl mx-auto">
					<AnimatePresence mode="wait">
						{/* STEP 1: BASIC INFO */}
						{currentStep === 0 && (
							<motion.div
								key="step1"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="w-full space-y-8"
							>
								<div className="text-center space-y-2">
									<h1 className="text-3xl font-bold tracking-tight">
										{translations.step1.title}
									</h1>
									<p className="text-muted-foreground text-lg">
										{translations.step1.subtitle}
									</p>
								</div>

								<FieldGroup className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
									<FieldSet>
										<FieldLegend>
											{translations.step1.educationLevel}{" "}
											<span className="text-red-500">
												{translations.step1.educationLevelRequired}
											</span>
										</FieldLegend>
										<ToggleGroup
											type="single"
											variant="outline"
											spacing={2}
											size="sm"
											value={basicInfo.educationLevel}
											onValueChange={(value: string) => {
												if (value)
													handleBasicInfoChange("educationLevel", value);
											}}
											className="flex flex-wrap gap-2"
										>
											{constants.educationLevels.map((level) => (
												<ToggleGroupItem
													key={level.value}
													value={level.value}
													className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
												>
													<span className="text-sm font-medium">
														{level.label}
													</span>
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</FieldSet>

									<FieldSet>
										<FieldLegend>
											{translations.step1.targetDegree}{" "}
											<span className="text-red-500">
												{translations.step1.targetDegreeRequired}
											</span>
										</FieldLegend>
										<ToggleGroup
											type="single"
											variant="outline"
											spacing={2}
											size="sm"
											value={basicInfo.targetDegree}
											onValueChange={(value: string) => {
												if (value) handleBasicInfoChange("targetDegree", value);
											}}
											className="flex flex-wrap gap-2"
										>
											{constants.programTypes.map((prog) => (
												<ToggleGroupItem
													key={prog.value}
													value={prog.value}
													disabled={prog.disabled}
													className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary disabled:opacity-50 transition-all"
												>
													<span className="text-sm font-medium">
														{prog.label}
													</span>
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</FieldSet>

									<div className="pt-6 flex justify-between border-t border-border mt-6">
										<Button
											variant="outline"
											size="lg"
											disabled
											onClick={handleBack}
											className="px-8"
										>
											{translations.buttons.back}
										</Button>
										<Button
											size="lg"
											disabled={!isStep1Valid}
											onClick={handleNext}
											className="px-8"
										>
											{translations.buttons.continue}
										</Button>
									</div>
								</FieldGroup>
							</motion.div>
						)}

						{/* STEP 2: PREFERENCES (Fields & Regions) */}
						{currentStep === 1 && (
							<motion.div
								key="step2"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="w-full space-y-8"
							>
								<div className="text-center space-y-2">
									<h1 className="text-3xl font-bold tracking-tight">
										{translations.step2.title}
									</h1>
									<p className="text-muted-foreground text-lg">
										{translations.step2.subtitle}
									</p>
								</div>

								<FieldGroup className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
									{/* Fields of Interest */}
									<FieldSet>
										<FieldLegend className="flex items-center justify-between w-full">
											<span>
												{translations.step2.fieldsOfInterest}{" "}
												<span className="text-red-500">
													{translations.step2.fieldsRequired}
												</span>
											</span>
											<button
												type="button"
												onClick={() => {
													setPrefs((p) => ({ ...p, fields: [] }));
												}}
												className="text-xs font-medium hover:underline text-muted-foreground"
											>
												Đặt lại
											</button>
										</FieldLegend>
										<FieldDescription>
											{translations.step2.fieldsOfInterestMax}
										</FieldDescription>
										<ToggleGroup
											type="multiple"
											variant="outline"
											spacing={2}
											size="sm"
											value={prefs.fields}
											onValueChange={(value: string[]) => {
												if (value.length <= 3) {
													setPrefs((p) => ({ ...p, fields: value }));
												}
											}}
											className="flex flex-wrap gap-2"
										>
											{constants.fieldsOfStudy.map((field) => (
												<ToggleGroupItem
													key={field}
													value={field}
													disabled={
														!prefs.fields.includes(field) &&
														prefs.fields.length >= 3
													}
													className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary disabled:opacity-40 transition-all"
												>
													<span className="text-sm font-medium">{field}</span>
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</FieldSet>

									{/* Regions */}
									<FieldSet>
										<FieldLegend className="flex items-center justify-between w-full">
											<span>{translations.step2.regionsOfInterest}</span>
											<div className="flex gap-2">
												<button
													type="button"
													onClick={() => {
														const allRegionNames = constants.regions.map(
															(r) => r.name,
														);
														setPrefs((p) => ({
															...p,
															regions: allRegionNames,
														}));
													}}
													className="text-xs font-medium text-primary hover:underline"
												>
													Chọn tất cả
												</button>
												<button
													type="button"
													onClick={() => {
														setPrefs((p) => ({
															...p,
															regions: [],
														}));
													}}
													className="text-xs font-medium hover:underline text-muted-foreground"
												>
													Đặt lại
												</button>
											</div>
										</FieldLegend>
										<FieldDescription>
											{(() => {
												const countries = constants.regions
													.filter((r) => prefs.regions.includes(r.name))
													.map((r) => r.countries)
													.join(", ");
												return `Các quốc gia trong vùng lựa chọn: ${countries || "chưa có"}`;
											})()}
										</FieldDescription>
										<ToggleGroup
											type="multiple"
											variant="outline"
											spacing={2}
											size="sm"
											value={prefs.regions}
											onValueChange={(value: string[]) => {
												setPrefs((p) => ({ ...p, regions: value }));
											}}
											className="flex flex-wrap gap-2"
										>
											{constants.regions.map((region) => (
												<ToggleGroupItem
													key={region.name}
													value={region.name}
													className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
												>
													<span className="text-sm font-medium">
														{region.name}
													</span>
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</FieldSet>

									<div className="pt-6 flex justify-between border-t border-border mt-6">
										<Button
											variant="outline"
											size="lg"
											onClick={handleBack}
											className="px-8"
										>
											{translations.buttons.back}
										</Button>
										<Button
											size="lg"
											disabled={!isStep2Valid}
											onClick={handleNext}
											className="px-8"
										>
											{translations.buttons.continue}
										</Button>
									</div>
								</FieldGroup>
							</motion.div>
						)}

						{/* STEP 3: PLAN (Timeline & Budget) */}
						{currentStep === 2 && (
							<motion.div
								key="step2b"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="w-full space-y-8"
							>
								<div className="text-center space-y-2">
									<h1 className="text-3xl font-bold tracking-tight">
										{translations.step2b.title}
									</h1>
									<p className="text-muted-foreground text-lg">
										{translations.step2b.subtitle}
									</p>
								</div>

								<FieldGroup className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
									{/* Timeline */}
									<FieldSet>
										<FieldLegend>
											{translations.step2b.timeline}{" "}
											<span className="text-red-500">
												{translations.step2b.timelineRequired}
											</span>
										</FieldLegend>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
											<div className="space-y-2">
												<FieldDescription>
													{translations.step2b.selectYear}
												</FieldDescription>
												<Select
													value={prefs.startYear}
													onChange={(e) =>
														setPrefs((p) => ({
															...p,
															startYear: e.target.value,
														}))
													}
												>
													<option value="" disabled>
														{translations.step2b.selectYearPlaceholder}
													</option>
													{constants.startYears.map((year) => (
														<option key={year} value={year}>
															{year}
														</option>
													))}
												</Select>
											</div>

											<div className="space-y-2">
												<FieldDescription>
													{translations.step2b.selectTerm}
												</FieldDescription>
												<Select
													value={prefs.startTerm}
													onChange={(e) =>
														setPrefs((p) => ({
															...p,
															startTerm: e.target.value,
														}))
													}
												>
													<option value="" disabled>
														{translations.step2b.selectTermPlaceholder}
													</option>
													{constants.startTerms.map((term) => (
														<option key={term} value={term}>
															{term}
														</option>
													))}
												</Select>
											</div>
										</div>
									</FieldSet>

									{/* Budget */}
									<FieldSet>
										<FieldLegend>
											{translations.step2b.budget}{" "}
											<span className="text-red-500">
												{translations.step2b.budgetRequired}
											</span>
										</FieldLegend>
										<ToggleGroup
											type="single"
											variant="outline"
											spacing={2}
											size="sm"
											value={prefs.budgetIndex.toString()}
											onValueChange={(value: string) => {
												if (value) {
													setPrefs((p) => ({
														...p,
														budgetIndex: parseInt(value),
													}));
												}
											}}
											className="flex flex-wrap gap-2 pt-2"
										>
											{constants.budgetOptions.map((option, index) => (
												<ToggleGroupItem
													key={option.value}
													value={index.toString()}
													className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
												>
													<span className="text-sm font-medium">
														{option.label}
													</span>
												</ToggleGroupItem>
											))}
										</ToggleGroup>
									</FieldSet>

									<div className="pt-6 flex justify-between border-t border-border mt-6">
										<Button
											variant="outline"
											size="lg"
											onClick={handleBack}
											className="px-8"
										>
											{translations.buttons.back}
										</Button>
										<Button
											size="lg"
											disabled={!isStep3Valid}
											onClick={handleNext}
											className="px-8"
										>
											{translations.buttons.continue}
										</Button>
									</div>
								</FieldGroup>
							</motion.div>
						)}

						{/* STEP 4: JOURNEY SELECTION */}
						{currentStep === 3 && (
							<motion.div
								key="step3"
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="w-full space-y-8"
							>
								<div className="text-center space-y-2">
									<h1 className="text-3xl font-bold tracking-tight">
										{translations.step3.title}
									</h1>
									<p className="text-muted-foreground text-lg">
										{translations.step3.subtitle}
									</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
									{constants.journeyOptions.map((option) => {
										const Icon =
											option.iconName === "compass" ? Compass : Target;
										return (
											<Card
												key={option.id}
												onClick={() => handleJourneySelect(option.id)}
												className="cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300 group relative overflow-hidden h-full"
											>
												<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
												<CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-4">
													<div
														className={`w-16 h-16 rounded-full bg-${option.color}/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
													>
														<Icon
															className={`w-8 h-8 text-${option.color === "primary" ? "primary" : "chart-2"}`}
														/>
													</div>
													<h3 className="text-xl font-bold">{option.title}</h3>
													<p className="text-muted-foreground">
														{option.description}
													</p>
													<div className="pt-4 opacity-0 text-primary font-medium group-hover:opacity-100 transition-all flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0">
														{translations.step3.startNow}{" "}
														<ArrowRight className="w-4 h-4" />
													</div>
												</CardContent>
											</Card>
										);
									})}
								</div>

								<div className="pt-6 flex justify-start border-t border-border mt-6">
									<Button
										variant="outline"
										size="lg"
										onClick={handleBack}
										className="px-8"
									>
										{translations.buttons.back}
									</Button>
								</div>
							</motion.div>
						)}

						{/* STEP 5: COMPLETION */}
						{currentStep === 4 && (
							<motion.div
								key="step4"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
								className="w-full space-y-8 flex flex-col items-center text-center max-w-lg mx-auto py-12"
							>
								<div className="w-24 h-24 bg-primary dark:bg-primary/30 rounded-full flex items-center justify-center mb-4 text-primary-foreground dark:text-primary-foreground">
									<PartyPopper className="w-12 h-12" />
								</div>

								<div className="space-y-4">
									<h1 className="text-4xl font-bold tracking-tight">
										{translations.step4.title}
									</h1>
									<p className="text-xl text-muted-foreground">
										{translations.step4.subtitle}
									</p>
								</div>

								<div className="pt-8 w-full">
									<Button
										size="lg"
										onClick={handleCompletion}
										className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
									>
										{selectedJourney === "targeted"
											? translations.step4.ctaTargeted
											: translations.step4.ctaExploring}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</PageTransition>
	);
}
