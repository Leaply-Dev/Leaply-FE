"use client";

import { Button } from "@/components/ui/button";

interface StepNavigationProps {
	backLabel: string;
	continueLabel: string;
	onBack: () => void;
	onNext: () => void;
	isBackDisabled?: boolean;
	isNextDisabled?: boolean;
	showContinue?: boolean;
}

export function StepNavigation({
	backLabel,
	continueLabel,
	onBack,
	onNext,
	isBackDisabled = false,
	isNextDisabled = false,
	showContinue = true,
}: StepNavigationProps) {
	return (
		<div className="pt-6 flex justify-between border-t border-border mt-6">
			<Button
				variant="outline"
				size="lg"
				disabled={isBackDisabled}
				onClick={onBack}
				className="px-8"
			>
				{backLabel}
			</Button>
			{showContinue && (
				<Button
					size="lg"
					disabled={isNextDisabled}
					onClick={onNext}
					className="px-8"
				>
					{continueLabel}
				</Button>
			)}
		</div>
	);
}
