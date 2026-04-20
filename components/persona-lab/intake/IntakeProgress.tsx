"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface IntakeProgressProps {
	currentSection: 1 | 2 | 3;
	totalSections: 2 | 3;
	labels: string[];
}

export function IntakeProgress({
	currentSection,
	totalSections,
	labels,
}: IntakeProgressProps) {
	const steps = Array.from({ length: totalSections }, (_, i) => i + 1);
	return (
		<div className="w-full max-w-2xl mx-auto">
			<div className="flex items-center justify-between">
				{steps.map((n, idx) => {
					const isDone = n < currentSection;
					const isCurrent = n === currentSection;
					return (
						<div key={n} className="flex-1 flex flex-col items-center relative">
							<div
								className={cn(
									"w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors z-10",
									isDone && "bg-primary text-primary-foreground",
									isCurrent &&
										"bg-primary text-primary-foreground ring-4 ring-primary/20",
									!isDone && !isCurrent && "bg-muted text-muted-foreground",
								)}
							>
								{isDone ? <Check className="w-4 h-4" /> : n}
							</div>
							<span
								className={cn(
									"text-xs mt-2 text-center max-w-[140px]",
									isDone || isCurrent
										? "text-foreground font-medium"
										: "text-muted-foreground",
								)}
							>
								{labels[idx]}
							</span>
							{idx < steps.length - 1 && (
								<div
									className={cn(
										"absolute top-4 left-[50%] w-full h-0.5",
										isDone ? "bg-primary" : "bg-muted",
									)}
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
