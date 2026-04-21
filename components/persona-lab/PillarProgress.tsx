"use client";

import { useLocale, useTranslations } from "next-intl";
import type {
	PillarCoverageDto,
	SubDimension,
	TierProgressDto,
} from "@/lib/api/personaLab/types";
import {
	averageCoverage,
	coverageBucket,
	getSubDimensionCoverage,
	getSubDimensionLabel,
	PILLARS_CONFIG,
} from "@/lib/config/pillarsConfig";
import { cn } from "@/lib/utils";

interface PillarProgressProps {
	tierProgress: TierProgressDto | null | undefined;
	pillarCoverage: PillarCoverageDto | null | undefined;
}

export function PillarProgress({
	tierProgress,
	pillarCoverage,
}: PillarProgressProps) {
	const t = useTranslations("personaLab");
	const locale = (useLocale() as "vi" | "en") === "vi" ? "vi" : "en";

	const tier1Completed = tierProgress?.tier1Completed ?? 0;
	const tier1Total = tierProgress?.tier1Total ?? 5;
	const pillar2Required = Boolean(pillarCoverage?.pillar2Required);

	const pillar1Avg = averageCoverage(pillarCoverage?.pillar1);
	const pillar2Avg = averageCoverage(pillarCoverage?.pillar2);

	return (
		<div className="w-full space-y-3">
			{/* Tier 1 Anchor row */}
			<div className="flex items-center justify-between">
				<span className="text-xs text-muted-foreground">
					{t("tier1Anchor")}
				</span>
				<span className="text-xs font-medium text-violet-600">
					{t("tier1AnchorProgress", {
						completed: tier1Completed,
						total: tier1Total,
					})}
				</span>
			</div>

			{/* Pillar 1 row */}
			<PillarRow
				title={PILLARS_CONFIG.pillar1[locale === "vi" ? "labelVi" : "label"]}
				averageLabel={t("coverageLabel", { percent: pillar1Avg })}
				average={pillar1Avg}
				subDimensions={PILLARS_CONFIG.pillar1.subDimensions}
				pillarMap={pillarCoverage?.pillar1}
				barColor={PILLARS_CONFIG.pillar1.badgeColor}
				locale={locale}
			/>

			{/* Pillar 2 row — only when required (scholarship track) */}
			{pillar2Required && (
				<PillarRow
					title={PILLARS_CONFIG.pillar2[locale === "vi" ? "labelVi" : "label"]}
					averageLabel={t("coverageLabel", { percent: pillar2Avg })}
					average={pillar2Avg}
					subDimensions={PILLARS_CONFIG.pillar2.subDimensions}
					pillarMap={pillarCoverage?.pillar2}
					barColor={PILLARS_CONFIG.pillar2.badgeColor}
					locale={locale}
				/>
			)}
		</div>
	);
}

interface PillarRowProps {
	title: string;
	averageLabel: string;
	average: number;
	subDimensions: SubDimension[];
	pillarMap: Record<string, number> | undefined;
	barColor: string;
	locale: "vi" | "en";
}

function PillarRow({
	title,
	averageLabel,
	average,
	subDimensions,
	pillarMap,
	barColor,
	locale,
}: PillarRowProps) {
	return (
		<div className="space-y-1.5">
			<div className="flex items-center justify-between">
				<span className="text-[11px] font-medium" style={{ color: barColor }}>
					{title}
				</span>
				<span className="text-[10px] text-muted-foreground">
					{averageLabel}
				</span>
			</div>

			{/* Average progress bar — recoloured by pillar */}
			<div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
				<div
					className="h-full rounded-full transition-[width] duration-500"
					style={{
						width: `${Math.min(100, Math.max(0, average))}%`,
						backgroundColor: barColor,
					}}
				/>
			</div>

			{/* Sub-dimension squares */}
			<div className="flex items-center gap-1">
				{subDimensions.map((sd) => {
					const cov = getSubDimensionCoverage(pillarMap, sd);
					const bucket = coverageBucket(cov);
					return (
						<div key={sd} className="flex-1 group relative">
							<div
								className={cn(
									"h-2 rounded-sm transition-colors",
									bucket === "empty" && "bg-muted border border-border",
									bucket === "partial" && "opacity-50",
									bucket === "full" && "opacity-100",
								)}
								style={
									bucket !== "empty" ? { backgroundColor: barColor } : undefined
								}
							/>
							<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
								<div className="bg-popover text-popover-foreground text-[10px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap border border-border">
									{getSubDimensionLabel(sd, locale)} · {cov ?? 0}%
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
export type { PillarProgressProps };
