"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DiscoveryProgressStepperProps {
	currentTier: string | null | undefined;
	pillar2Required: boolean;
	completionReady: boolean;
	className?: string;
}

/**
 * Linear stepper for the *scripted* discovery path. Coverage % below can still
 * move in parallel as the model extracts nodes.
 */
export function DiscoveryProgressStepper({
	currentTier,
	pillar2Required,
	completionReady,
	className,
}: DiscoveryProgressStepperProps) {
	const t = useTranslations("personaLab");

	const stepKeys = pillar2Required
		? (["stepFoundation", "stepProfile", "stepImpact", "stepDone"] as const)
		: (["stepFoundation", "stepProfile", "stepDone"] as const);
	const activeIndex = getActiveStepIndex(
		currentTier,
		completionReady,
		pillar2Required,
	);

	return (
		<div className={cn("w-full", className)} data-tour="persona-stepper">
			<ol className="flex w-full list-none items-start justify-between gap-0.5 p-0 m-0 sm:gap-1">
				{stepKeys.map((key, i) => {
					const isDone = i < activeIndex;
					const isCurrent = i === activeIndex;
					const label = t(key);

					return (
						<li
							key={key}
							className="flex min-w-0 flex-1 flex-col items-center gap-0.5"
						>
							<div
								className={cn(
									"flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-semibold transition-colors",
									isDone && "border-primary/60 bg-primary/15 text-primary",
									isCurrent &&
										!isDone &&
										"border-primary bg-primary/10 text-primary shadow-sm",
									!isDone &&
										!isCurrent &&
										"border-muted-foreground/25 text-muted-foreground",
								)}
								aria-current={isCurrent ? "step" : undefined}
							>
								{isDone ? "✓" : i + 1}
							</div>
							<span
								className="w-full text-center text-[9px] leading-tight text-muted-foreground line-clamp-2"
								title={label}
							>
								{label}
							</span>
						</li>
					);
				})}
			</ol>
		</div>
	);
}

function getActiveStepIndex(
	currentTier: string | null | undefined,
	completionReady: boolean,
	pillar2Required: boolean,
): number {
	if (completionReady || currentTier === "COMPLETE") {
		return pillar2Required ? 3 : 2;
	}
	if (currentTier === "TIER_1") {
		return 0;
	}
	if (currentTier === "TIER_2_PILLAR_1") {
		return 1;
	}
	if (currentTier === "TIER_2_PILLAR_2") {
		// No P2 track should not end up here; if it does, show "Profile" not "Done".
		if (!pillar2Required) {
			return 1;
		}
		return 2;
	}
	return 0;
}
