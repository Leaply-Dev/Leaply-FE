"use client";

import { FieldDescription, FieldLegend, FieldSet } from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StepContainer } from "../components/StepContainer";
import { StepNavigation } from "../components/StepNavigation";
import type {
	OnboardingConstants,
	OnboardingTranslations,
	Preferences,
} from "../types";

interface Step3PlanProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	prefs: Preferences;
	onPrefsChange: (updates: Partial<Preferences>) => void;
	onNext: () => void;
	onBack: () => void;
}

export function Step3Plan({
	translations,
	constants,
	prefs,
	onPrefsChange,
	onNext,
	onBack,
}: Step3PlanProps) {
	const isValid = prefs.startYear.length > 0 && prefs.startTerm.length > 0;

	return (
		<StepContainer
			stepKey="step2b"
			title={translations.step2b.title}
			subtitle={translations.step2b.subtitle}
		>
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
						<select
							value={prefs.startYear}
							onChange={(e) => onPrefsChange({ startYear: e.target.value })}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="" disabled>
								{translations.step2b.selectYearPlaceholder}
							</option>
							{constants.startYears.map((year) => (
								<option key={year} value={year}>
									{year}
								</option>
							))}
						</select>
					</div>

					<div className="space-y-2">
						<FieldDescription>
							{translations.step2b.selectTerm}
						</FieldDescription>
						<select
							value={prefs.startTerm}
							onChange={(e) => onPrefsChange({ startTerm: e.target.value })}
							className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<option value="" disabled>
								{translations.step2b.selectTermPlaceholder}
							</option>
							{constants.startTerms.map((term) => (
								<option key={term} value={term}>
									{term}
								</option>
							))}
						</select>
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
							onPrefsChange({ budgetIndex: parseInt(value) });
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
							<span className="text-sm font-medium">{option.label}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			<StepNavigation
				backLabel={translations.buttons.back}
				continueLabel={translations.buttons.continue}
				onBack={onBack}
				onNext={onNext}
				isNextDisabled={!isValid}
			/>
		</StepContainer>
	);
}
