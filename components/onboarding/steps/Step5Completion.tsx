"use client";

import { m } from "framer-motion";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JourneyType } from "@/lib/store/userStore";
import type { OnboardingTranslations } from "../types";

interface Step5CompletionProps {
	translations: OnboardingTranslations;
	selectedJourney: JourneyType | null;
	onComplete: () => void;
}

export function Step5Completion({
	translations,
	selectedJourney,
	onComplete,
}: Step5CompletionProps) {
	return (
		<m.div
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
					onClick={onComplete}
					className="w-full h-14 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
				>
					{selectedJourney === "targeted"
						? translations.step4.ctaTargeted
						: translations.step4.ctaExploring}
					<ArrowRight className="ml-2 w-5 h-5" />
				</Button>
			</div>
		</m.div>
	);
}
