"use client";

import type { PillarCoverageDto } from "@/lib/api/personaLab/types";
import { averageCoverage } from "@/lib/config/pillarsConfig";
import type { CoverageMetrics } from "@/lib/generated/api/models";
import { MilestoneBadge } from "../MilestoneBadge";
import { PillarProgress } from "../PillarProgress";

interface ChatHeaderProps {
	pillarCoverage: PillarCoverageDto | null;
	coverage?: CoverageMetrics;
	completionReady?: boolean;
	totalNodeCount?: number;
	currentTier?: string | null;
	unlockedMilestones?: string[];
}

export function ChatHeader({
	pillarCoverage,
	unlockedMilestones,
}: ChatHeaderProps) {
	const pillar2Required = Boolean(pillarCoverage?.pillar2Required);
	const p1 = averageCoverage(pillarCoverage?.pillar1);
	const p2 = pillar2Required ? averageCoverage(pillarCoverage?.pillar2) : null;
	const overall = p2 !== null ? Math.round((p1 + p2) / 2) : p1;

	return (
		<div className="px-4 py-3 border-b border-border shrink-0">
			<div className="space-y-3">
				<div>
					<p className="text-2xl font-bold tabular-nums text-primary leading-none">
						{overall}% ready
					</p>
					<p className="text-sm text-muted-foreground mt-0.5">
						for Essay Ideation
					</p>
				</div>

				{unlockedMilestones && unlockedMilestones.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{unlockedMilestones.map((m) => (
							<MilestoneBadge key={m} type={m} />
						))}
					</div>
				)}

				<div className="space-y-1.5" data-tour="persona-progress">
					<PillarProgress pillarCoverage={pillarCoverage} />
				</div>
			</div>
		</div>
	);
}
