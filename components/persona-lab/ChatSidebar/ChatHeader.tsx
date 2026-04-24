"use client";

import type { PillarCoverageDto } from "@/lib/api/personaLab/types";
import type { CoverageMetrics } from "@/lib/generated/api/models";
import { DiscoveryProgressStepper } from "../DiscoveryProgressStepper";
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
	completionReady = false,
	currentTier,
	unlockedMilestones,
}: ChatHeaderProps) {
	const pillar2Required = Boolean(pillarCoverage?.pillar2Required);

	return (
		<div className="px-4 py-3 border-b border-border shrink-0">
			<div className="space-y-3">
				<DiscoveryProgressStepper
					currentTier={currentTier}
					pillar2Required={pillar2Required}
					completionReady={completionReady}
				/>

				{/* Milestone badges */}
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
