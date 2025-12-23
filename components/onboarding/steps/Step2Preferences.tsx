"use client";

import {
	FieldDescription,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StepContainer } from "../components/StepContainer";
import { StepNavigation } from "../components/StepNavigation";
import type { OnboardingConstants, OnboardingTranslations, Preferences } from "../types";

interface Step2PreferencesProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	prefs: Preferences;
	onPrefsChange: (updates: Partial<Preferences>) => void;
	onNext: () => void;
	onBack: () => void;
}

export function Step2Preferences({
	translations,
	constants,
	prefs,
	onPrefsChange,
	onNext,
	onBack,
}: Step2PreferencesProps) {
	const isValid = prefs.fields.length > 0;

	const selectedCountries = constants.regions
		.filter((r) => prefs.regions.includes(r.name))
		.map((r) => r.countries)
		.join(", ");

	return (
		<StepContainer
			stepKey="step2"
			title={translations.step2.title}
			subtitle={translations.step2.subtitle}
		>
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
						onClick={() => onPrefsChange({ fields: [] })}
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
							onPrefsChange({ fields: value });
						}
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.fieldsOfStudy.map((field) => (
						<ToggleGroupItem
							key={field}
							value={field}
							disabled={!prefs.fields.includes(field) && prefs.fields.length >= 3}
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
								const allRegionNames = constants.regions.map((r) => r.name);
								onPrefsChange({ regions: allRegionNames });
							}}
							className="text-xs font-medium text-primary hover:underline"
						>
							Chọn tất cả
						</button>
						<button
							type="button"
							onClick={() => onPrefsChange({ regions: [] })}
							className="text-xs font-medium hover:underline text-muted-foreground"
						>
							Đặt lại
						</button>
					</div>
				</FieldLegend>
				<FieldDescription>
					{`Các quốc gia trong vùng lựa chọn: ${selectedCountries || "chưa có"}`}
				</FieldDescription>
				<ToggleGroup
					type="multiple"
					variant="outline"
					spacing={2}
					size="sm"
					value={prefs.regions}
					onValueChange={(value: string[]) => {
						onPrefsChange({ regions: value });
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.regions.map((region) => (
						<ToggleGroupItem
							key={region.name}
							value={region.name}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
						>
							<span className="text-sm font-medium">{region.name}</span>
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
