"use client";

import { Check, Lightbulb, List, PenLine, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Phase =
	| "not_started"
	| "ideation"
	| "outlining"
	| "writing"
	| "review"
	| "completed";

interface PhaseProgressProps {
	currentPhase: Phase;
}

const phases = [
	{ key: "ideation" as const, label: "Ideation", icon: Lightbulb },
	{ key: "outlining" as const, label: "Outline", icon: List },
	{ key: "writing" as const, label: "Writing", icon: PenLine },
	{ key: "review" as const, label: "Review", icon: Star },
];

export function PhaseProgress({ currentPhase }: PhaseProgressProps) {
	const getPhaseIndex = (phase: Phase): number => {
		if (phase === "not_started") return -1;
		if (phase === "completed") return phases.length;
		return phases.findIndex((p) => p.key === phase);
	};

	const currentIndex = getPhaseIndex(currentPhase);

	return (
		<div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-8">
			{phases.map((phase, index) => {
				const Icon = phase.icon;
				const isCompleted = currentIndex > index;
				const isCurrent = phases[currentIndex]?.key === phase.key;
				const isActive = isCompleted || isCurrent;

				return (
					<div key={phase.key} className="flex items-center flex-1">
						{/* Phase circle */}
						<div className="flex flex-col items-center gap-2">
							<div
								className={cn(
									"w-10 h-10 rounded-full flex items-center justify-center transition-all",
									isCompleted && "bg-primary text-primary-foreground",
									isCurrent &&
										"bg-primary/20 text-primary border-2 border-primary",
									!isActive && "bg-muted text-muted-foreground",
								)}
							>
								{isCompleted ? (
									<Check className="w-5 h-5" />
								) : (
									<Icon className="w-5 h-5" />
								)}
							</div>
							<span
								className={cn(
									"text-xs font-medium",
									isActive ? "text-foreground" : "text-muted-foreground",
								)}
							>
								{phase.label}
							</span>
						</div>

						{/* Connector line */}
						{index < phases.length - 1 && (
							<div className="flex-1 h-0.5 mx-2 mt-[-20px]">
								<div
									className={cn(
										"h-full transition-all",
										isCompleted ? "bg-primary" : "bg-muted",
									)}
								/>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
}
