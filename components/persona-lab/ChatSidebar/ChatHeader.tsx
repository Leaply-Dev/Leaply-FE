"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { COVERAGE_COLORS, COVERAGE_LABELS } from "@/lib/config/graphConfig";
import type { CoverageMetrics } from "@/lib/generated/api/models";

interface ChatHeaderProps {
	coverage: CoverageMetrics;
	completionReady?: boolean;
	storyNodeCount?: number;
	totalNodeCount?: number;
}

// Coverage keys that have progress rings (excluding metadata fields)
type CoverageCategory = "goals" | "evidence" | "skills" | "values" | "tensions";

interface CoverageRingProps {
	value: number;
	color: string;
	label: string;
	size?: number;
}

function CoverageRing({ value, color, label, size = 40 }: CoverageRingProps) {
	const isComplete = value >= 60;
	const strokeWidth = 3;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const progress = Math.min(value, 100);
	const strokeDashoffset = circumference - (progress / 100) * circumference;

	return (
		<div className="flex flex-col items-center gap-1 group relative">
			{/* Tooltip */}
			<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
				<div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap border border-border">
					{label}: {value}%
				</div>
			</div>

			{/* Ring */}
			<div className="relative" style={{ width: size, height: size }}>
				<svg
					width={size}
					height={size}
					className="transform -rotate-90"
					viewBox={`0 0 ${size} ${size}`}
					role="img"
				>
					<title>{`${label}: ${value}%`}</title>
					{/* Background circle */}
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke="currentColor"
						strokeWidth={strokeWidth}
						className="text-muted"
					/>
					{/* Progress circle */}
					<motion.circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						fill="none"
						stroke={color}
						strokeWidth={strokeWidth}
						strokeLinecap="round"
						initial={{ strokeDashoffset: circumference }}
						animate={{ strokeDashoffset }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						style={{
							strokeDasharray: circumference,
						}}
					/>
				</svg>

				{/* Center content: percentage or checkmark */}
				<div className="absolute inset-0 flex items-center justify-center">
					{isComplete ? (
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.3, delay: 0.3 }}
							className="rounded-full p-0.5"
							style={{ backgroundColor: color }}
						>
							<Check className="w-3 h-3 text-white" />
						</motion.div>
					) : (
						<span className="text-[9px] font-semibold" style={{ color }}>
							{value}%
						</span>
					)}
				</div>
			</div>

			{/* Label */}
			<span className="text-[9px] text-muted-foreground truncate max-w-11 text-center">
				{label}
			</span>
		</div>
	);
}

export function ChatHeader({
	coverage,
	completionReady = false,
	storyNodeCount = 0,
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
							{storyNodeCount} {storyNodeCount === 1 ? "story" : "stories"}
							{storyNodeCount < 10 && (
								<span className="text-muted-foreground/60 ml-1">
									({10 - storyNodeCount} left to unlock)
								</span>
							)}
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

			{/* 5 coverage rings */}
			<div className="flex items-center justify-between gap-1">
				{segments.map((segment) => (
					<CoverageRing
						key={segment.key}
						value={coverage[segment.key] ?? 0}
						color={segment.color}
						label={segment.label}
					/>
				))}
			</div>
		</div>
	);
}
