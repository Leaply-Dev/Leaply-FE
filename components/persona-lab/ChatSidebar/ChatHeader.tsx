"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type {
	PillarCoverageDto,
	TierProgressDto,
} from "@/lib/api/personaLab/types";
import type { CoverageMetrics } from "@/lib/generated/api/models";
import { PillarProgress } from "../PillarProgress";

interface ChatHeaderProps {
	tierProgress: TierProgressDto | null;
	pillarCoverage: PillarCoverageDto | null;
	coverage?: CoverageMetrics;
	completionReady?: boolean;
	storyNodeCount?: number;
	totalNodeCount?: number;
}

export function ChatHeader({
	tierProgress,
	pillarCoverage,
	completionReady = false,
	storyNodeCount = 0,
}: ChatHeaderProps) {
	const t = useTranslations("personaLab");

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
						{completionReady && (
							<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
								{t("ready")}
							</span>
						)}
					</div>
				</div>
			</div>

			{/* 2-Pillar tier + coverage progress */}
			<PillarProgress
				tierProgress={tierProgress}
				pillarCoverage={pillarCoverage}
			/>
		</div>
	);
}
