"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	getCompletedPartsCount,
	type PartsProgress,
} from "@/lib/config/partsConfig";
import type { CoverageMetrics } from "@/lib/generated/api/models";
import { PartsProgress as PartsProgressComponent } from "./PartsProgress";

interface ChatHeaderProps {
	partsProgress: PartsProgress;
	coverage?: CoverageMetrics; // Keep for backward compatibility
	completionReady?: boolean;
	storyNodeCount?: number;
	totalNodeCount?: number;
}

export function ChatHeader({
	partsProgress,
	completionReady = false,
	storyNodeCount = 0,
}: ChatHeaderProps) {
	const t = useTranslations("personaLab");
	const completedParts = getCompletedPartsCount(partsProgress);
	const allPartsComplete = completedParts === 4;

	return (
		<div className="px-4 py-3 border-b border-border shrink-0">
			{/* Header row */}
			<div className="flex items-center gap-2 mb-3">
				<div className="p-1.5 rounded-lg bg-primary/10">
					<Sparkles className="w-4 h-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-sm">{t("discoveryChat")}</h2>
					<div className="flex items-center gap-2 mt-0.5">
						<span className="text-[10px] text-muted-foreground">
							{storyNodeCount}{" "}
							{storyNodeCount === 1 ? t("story") : t("stories")}
						</span>
						{(completionReady || allPartsComplete) && (
							<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
								{t("ready")}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* Parts progress indicator */}
			<PartsProgressComponent progress={partsProgress} showLabels={true} />
		</div>
	);
}
