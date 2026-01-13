"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { COVERAGE_COLORS, COVERAGE_LABELS } from "@/lib/config/graphConfig";
import type { CoverageMetrics } from "@/lib/generated/api/models";

interface ChatHeaderProps {
	coverage: CoverageMetrics;
	completionReady?: boolean;
	totalNodeCount?: number;
}

// Coverage keys that have progress bars (excluding metadata fields)
type CoverageCategory = "goals" | "evidence" | "skills" | "values" | "tensions";

interface CoverageSegmentProps {
	category: CoverageCategory;
	value: number;
	color: string;
	label: string;
}

function CoverageSegment({
	category: _category,
	value,
	color,
	label,
}: CoverageSegmentProps) {
	const isComplete = value >= 60;

	return (
		<div className="flex-1 min-w-0 group relative">
			{/* Tooltip */}
			<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
				<div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap border border-border">
					{label}: {value}%
				</div>
			</div>

			{/* Progress bar */}
			<div className="h-2 bg-muted rounded-full overflow-hidden">
				<motion.div
					className="h-full rounded-full"
					initial={{ width: 0 }}
					animate={{ width: `${value}%` }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					style={{ backgroundColor: color }}
				/>
			</div>

			{/* Completion indicator */}
			{isComplete && (
				<div
					className="absolute -top-1 -right-1 w-3 h-3 rounded-full flex items-center justify-center"
					style={{ backgroundColor: color }}
				>
					<CheckCircle2 className="w-2 h-2 text-white" />
				</div>
			)}
		</div>
	);
}

export function ChatHeader({
	coverage,
	completionReady = false,
	totalNodeCount = 0,
}: ChatHeaderProps) {
	const t = useTranslations("personaLab");

	// Calculate average coverage (only from the 5 coverage categories)
	const averageCoverage = useMemo(() => {
		// Use overallProgress if available, otherwise calculate from categories
		if (coverage.overallProgress !== undefined) {
			return Math.round(coverage.overallProgress);
		}
		const categories: CoverageCategory[] = [
			"goals",
			"evidence",
			"skills",
			"values",
			"tensions",
		];
		const values = categories.map((key) => coverage[key] ?? 0);
		return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
	}, [coverage]);

	// Coverage segments configuration
	const segments: { key: CoverageCategory; label: string; color: string }[] = [
		{
			key: "goals",
			label: COVERAGE_LABELS.goals,
			color: COVERAGE_COLORS.goals,
		},
		{
			key: "evidence",
			label: COVERAGE_LABELS.evidence,
			color: COVERAGE_COLORS.evidence,
		},
		{
			key: "skills",
			label: COVERAGE_LABELS.skills,
			color: COVERAGE_COLORS.skills,
		},
		{
			key: "values",
			label: COVERAGE_LABELS.values,
			color: COVERAGE_COLORS.values,
		},
		{
			key: "tensions",
			label: COVERAGE_LABELS.tensions,
			color: COVERAGE_COLORS.tensions,
		},
	];

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
							{totalNodeCount} {totalNodeCount === 1 ? "story" : "stories"}
						</span>
						{completionReady && (
							<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
								Ready!
							</span>
						)}
					</div>
				</div>
				<span className="text-xs font-semibold text-primary">
					{averageCoverage}%
				</span>
			</div>

			{/* 5-segment coverage bar */}
			<div className="flex items-center gap-1">
				{segments.map((segment) => (
					<CoverageSegment
						key={segment.key}
						category={segment.key}
						value={coverage[segment.key] ?? 0}
						color={segment.color}
						label={segment.label}
					/>
				))}
			</div>

			{/* Category labels (shown on hover or always on larger screens) */}
			<div className="flex items-center gap-1 mt-1.5">
				{segments.map((segment) => (
					<div
						key={segment.key}
						className="flex-1 text-center text-[9px] text-muted-foreground truncate"
					>
						{segment.label}
					</div>
				))}
			</div>
		</div>
	);
}
