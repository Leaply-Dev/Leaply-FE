"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lightbulb } from "lucide-react";
import { useTranslations } from "next-intl";
import type { StarStructureKey } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

// All possible STAR elements
const ALL_STAR_ELEMENTS: StarStructureKey[] = [
	"situation",
	"task",
	"action",
	"result",
	"emotion",
	"insight",
];

// Core STAR elements (required for a complete story)
const CORE_STAR_ELEMENTS: StarStructureKey[] = [
	"situation",
	"task",
	"action",
	"result",
];

interface StarGapsIndicatorProps {
	gaps: StarStructureKey[];
	className?: string;
	variant?: "compact" | "detailed";
}

export function StarGapsIndicator({
	gaps,
	className,
	variant = "compact",
}: StarGapsIndicatorProps) {
	const t = useTranslations("personaLab.star");

	// Calculate which elements are complete
	const completedElements = ALL_STAR_ELEMENTS.filter(
		(el) => !gaps.includes(el),
	);
	const coreComplete = CORE_STAR_ELEMENTS.every((el) => !gaps.includes(el));

	// No gaps = story is complete
	if (gaps.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 5 }}
				animate={{ opacity: 1, y: 0 }}
				className={cn(
					"flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-lg",
					className,
				)}
			>
				<CheckCircle2 className="w-3.5 h-3.5" />
				<span>{t("complete")}</span>
			</motion.div>
		);
	}

	// Compact variant - just show the hint
	if (variant === "compact") {
		const missingLabels = gaps
			.slice(0, 2)
			.map((gap) => t(gap).toLowerCase())
			.join(", ");
		const hasMore = gaps.length > 2;

		return (
			<motion.div
				initial={{ opacity: 0, y: 5 }}
				animate={{ opacity: 1, y: 0 }}
				className={cn(
					"flex items-start gap-2 text-xs text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-3 py-2 rounded-lg",
					className,
				)}
			>
				<Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" />
				<span>
					{t("missingHint", {
						elements: hasMore ? `${missingLabels}...` : missingLabels,
					})}
				</span>
			</motion.div>
		);
	}

	// Detailed variant - show all STAR elements with their status
	return (
		<motion.div
			initial={{ opacity: 0, y: 5 }}
			animate={{ opacity: 1, y: 0 }}
			className={cn(
				"bg-muted/50 border border-border rounded-lg p-3",
				className,
			)}
		>
			<div className="flex items-center gap-2 mb-2">
				<span className="text-xs font-semibold text-foreground">
					{t("title")}
				</span>
				{coreComplete && (
					<span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
						Core complete
					</span>
				)}
			</div>

			{/* STAR progress bar */}
			<div className="flex gap-1 mb-2">
				{CORE_STAR_ELEMENTS.map((element) => {
					const isComplete = !gaps.includes(element);
					return (
						<div
							key={element}
							className={cn(
								"flex-1 h-1.5 rounded-full transition-colors",
								isComplete ? "bg-emerald-500" : "bg-muted-foreground/20",
							)}
							title={`${t(element)}: ${isComplete ? "Complete" : "Missing"}`}
						/>
					);
				})}
			</div>

			{/* Element list */}
			<div className="grid grid-cols-2 gap-1.5">
				{ALL_STAR_ELEMENTS.map((element) => {
					const isComplete = !gaps.includes(element);
					const isCore = CORE_STAR_ELEMENTS.includes(element);

					return (
						<div
							key={element}
							className={cn(
								"flex items-center gap-1.5 text-[10px]",
								isComplete ? "text-foreground" : "text-muted-foreground",
							)}
						>
							{isComplete ? (
								<CheckCircle2 className="w-3 h-3 text-emerald-500" />
							) : (
								<Circle className="w-3 h-3" />
							)}
							<span className={cn(!isCore && "italic")}>
								{t(element)}
								{!isCore && " +"}
							</span>
						</div>
					);
				})}
			</div>

			{/* Missing hint */}
			{gaps.length > 0 && (
				<div className="mt-2 pt-2 border-t border-border">
					<p className="text-[10px] text-orange-600 flex items-start gap-1.5">
						<Lightbulb className="w-3 h-3 shrink-0 mt-0.5" />
						{t("missingHint", {
							elements: gaps
								.slice(0, 3)
								.map((g) => t(g).toLowerCase())
								.join(", "),
						})}
					</p>
				</div>
			)}
		</motion.div>
	);
}
