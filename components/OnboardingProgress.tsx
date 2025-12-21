import { Check, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
	steps: string[];
	currentStep: number;
	className?: string;
}

export function OnboardingProgress({
	steps,
	currentStep,
	className,
}: OnboardingProgressProps) {
	return (
		<div className={cn("w-full", className)}>
			<div className="relative flex items-start justify-between">
				{steps.map((step, index) => {
					const isCompleted = index < currentStep;
					const isCurrent = index === currentStep;
					const isLast = index === steps.length - 1;

					return (
						<div
							key={step}
							className="flex flex-col items-center relative flex-1"
						>
							{/* Step Circle */}
							<div
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 relative z-10",
									isCompleted && "bg-primary text-primary-foreground",
									isCurrent &&
										"bg-primary text-primary-foreground ring-4 ring-primary/20",
									!isCompleted &&
										!isCurrent &&
										"bg-muted text-muted-foreground",
								)}
							>
								{isCompleted ? (
									<Check className="w-5 h-5" />
								) : isLast ? (
									<Flag className="w-5 h-5" />
								) : (
									<span>{index + 1}</span>
								)}
							</div>

							{/* Step Label */}
							<span
								className={cn(
									"text-xs sm:text-sm mt-2 text-center max-w-[120px] transition-colors duration-300",
									(isCompleted || isCurrent) && "text-foreground font-medium",
									!isCompleted && !isCurrent && "text-muted-foreground",
								)}
							>
								{step}
							</span>

							{/* Connecting Line */}
							{!isLast && (
								<div
									className={cn(
										"absolute top-5 left-[50%] h-0.5 transition-all duration-300",
										"w-full",
										isCompleted ? "bg-primary" : "bg-muted",
									)}
									style={{
										transform: "translateY(-50%)",
									}}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
