"use client";

import { ArrowRight, Compass, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { JourneyType } from "@/lib/store/userStore";
import { StepContainer } from "../components/StepContainer";
import type { OnboardingConstants, OnboardingTranslations } from "../types";

interface Step4JourneySelectionProps {
	translations: OnboardingTranslations;
	constants: OnboardingConstants;
	onJourneySelect: (type: JourneyType) => void;
	onBack: () => void;
}

const COLOR_MAP = {
	primary: {
		bg: "bg-primary/10",
		text: "text-primary",
	},
	"chart-2": {
		bg: "bg-chart-2/10",
		text: "text-chart-2",
	},
} as const;

export function Step4JourneySelection({
	translations,
	constants,
	onJourneySelect,
	onBack,
}: Step4JourneySelectionProps) {
	return (
		<StepContainer
			stepKey="step3"
			title={translations.step3.title}
			subtitle={translations.step3.subtitle}
			variant="plain"
		>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
				{constants.journeyOptions.map((option) => {
					const Icon = option.iconName === "compass" ? Compass : Target;
					const colors = COLOR_MAP[option.color as keyof typeof COLOR_MAP] || COLOR_MAP.primary;

					return (
						<Card
							key={option.id}
							onClick={() => onJourneySelect(option.id)}
							className="cursor-pointer hover:border-primary hover:shadow-md transition-all duration-300 group relative overflow-hidden h-full"
						>
							<div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
							<CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-4">
								<div
									className={`w-16 h-16 rounded-full ${colors.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}
								>
									<Icon className={`w-8 h-8 ${colors.text}`} />
								</div>
								<h3 className="text-xl font-bold">{option.title}</h3>
								<p className="text-muted-foreground">{option.description}</p>
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
					onClick={onBack}
					className="px-8"
				>
					{translations.buttons.back}
				</Button>
			</div>
		</StepContainer>
	);
}
