"use client";

import {
	FieldLegend,
	FieldSet,
} from "@/components/ui/field";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { StepContainer } from "../components/StepContainer";
import { StepNavigation } from "../components/StepNavigation";
import type { BasicInfo, OnboardingConstants, OnboardingTranslations } from "../types";

interface Step1BasicInfoProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	basicInfo: BasicInfo;
	onBasicInfoChange: (field: keyof BasicInfo, value: string) => void;
	onNext: () => void;
	onBack: () => void;
}

export function Step1BasicInfo({
	translations,
	constants,
	basicInfo,
	onBasicInfoChange,
	onNext,
	onBack,
}: Step1BasicInfoProps) {
	const isValid =
		basicInfo.educationLevel.length > 0 && basicInfo.targetDegree.length > 0;

	return (
		<StepContainer
			stepKey="step1"
			title={translations.step1.title}
			subtitle={translations.step1.subtitle}
		>
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
						if (value) onBasicInfoChange("educationLevel", value);
					}}
					className="flex flex-wrap gap-2"
				>
					{constants.educationLevels.map((level) => (
						<ToggleGroupItem
							key={level.value}
							value={level.value}
							className="h-auto py-2 px-4 rounded-full border-muted-foreground/30 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary transition-all"
						>
							<span className="text-sm font-medium">{level.label}</span>
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
						if (value) onBasicInfoChange("targetDegree", value);
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
							<span className="text-sm font-medium">{prog.label}</span>
						</ToggleGroupItem>
					))}
				</ToggleGroup>
			</FieldSet>

			<StepNavigation
				backLabel={translations.buttons.back}
				continueLabel={translations.buttons.continue}
				onBack={onBack}
				onNext={onNext}
				isBackDisabled
				isNextDisabled={!isValid}
			/>
		</StepContainer>
	);
}
