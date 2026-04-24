"use client";

import {
	BookOpen,
	CheckCircle2,
	ChevronDown,
	ChevronUp,
	TextCursorInput,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PersonaNodeDto } from "@/lib/store/personaStore";
import { formatTagLabel } from "@/lib/utils";

type StarKey =
	| "situation"
	| "task"
	| "action"
	| "result"
	| "emotion"
	| "insight";

const STAR_ORDER: StarKey[] = [
	"situation",
	"task",
	"action",
	"result",
	"emotion",
	"insight",
];

interface StoryCardProps {
	node: PersonaNodeDto;
	onCopy: (text: string) => void;
}

export function StoryCard({ node, onCopy }: StoryCardProps) {
	const t = useTranslations("sop");
	const locale = useLocale();
	const isVietnamese = locale === "vi";
	const [expanded, setExpanded] = useState(false);

	const structured = node.structuredContent ?? {};
	const starPresent: Record<StarKey, boolean> = {
		situation: !!structured["Situation"] || !!structured["situation"],
		task: !!structured["Task"] || !!structured["task"],
		action: !!structured["Action"] || !!structured["action"],
		result: !!structured["Result"] || !!structured["result"],
		emotion: !!structured["Emotion"] || !!structured["emotion"],
		insight: !!structured["Insight"] || !!structured["insight"],
	};

	const presentCount = STAR_ORDER.filter((k) => starPresent[k]).length;
	const allStarPresent = presentCount === STAR_ORDER.length;

	const handleCopy = () => {
		const text = node.content || "";
		onCopy(text);
	};

	const displayTitle = node.title || (isVietnamese ? "Câu chuyện" : "Story");
	const displayContent = node.content || "";
	const isLongContent = displayContent.length > 500;

	return (
		<div className="flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-lg border bg-card">
			{/* Header — always visible */}
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="flex w-full min-w-0 items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
			>
				{expanded ? (
					<ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
				) : (
					<ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
				)}
				<BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
				<span className="min-w-0 flex-1 wrap-break-word text-left text-sm font-medium leading-snug line-clamp-2">
					{displayTitle}
				</span>
			</button>

			{/* STAR+ completeness: 6 = classic STAR + Emotion + Insight; no duplicate fraction + dot row */}
			<div className="border-b border-border/60 px-3 pb-2.5 pt-0.5">
				{allStarPresent ? (
					<div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400/90">
						<CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
						<span>{t("starStructureComplete")}</span>
					</div>
				) : (
					<div className="flex min-w-0 flex-col gap-1.5">
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
							<span className="shrink-0 text-[10px] font-medium tracking-wide text-muted-foreground">
								{t("starStructureBadge")}
							</span>
							<TooltipProvider delayDuration={200}>
								<div className="flex min-w-0 flex-wrap items-center gap-2">
									{STAR_ORDER.map((key) => {
										const present = starPresent[key];
										const label = t(
											`star${key.charAt(0).toUpperCase() + key.slice(1)}`,
										);
										return (
											<Tooltip key={key}>
												<TooltipTrigger asChild>
													<button
														type="button"
														className="rounded-full p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
														aria-label={
															present
																? t("starPresentAria", { element: label })
																: t("starMissingAria", { element: label })
														}
													>
														<span
															className="block h-2 w-2 rounded-full"
															style={{
																backgroundColor: present
																	? "#10B981"
																	: "#D1D5DB",
															}}
														/>
													</button>
												</TooltipTrigger>
												<TooltipContent side="top" className="max-w-xs text-xs">
													{present
														? t("starPresentTooltip", { element: label })
														: t("starMissingTooltip", { element: label })}
												</TooltipContent>
											</Tooltip>
										);
									})}
								</div>
							</TooltipProvider>
						</div>
						<p className="text-[10px] text-muted-foreground leading-snug">
							{t("starStructureProgress", {
								count: presentCount,
								total: STAR_ORDER.length,
							})}
						</p>
					</div>
				)}
			</div>

			{/* Tags */}
			{node.tags && node.tags.length > 0 && (
				<div className="flex min-w-0 flex-wrap gap-1 px-3 pb-2 pt-2">
					{node.tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="h-auto max-w-full min-w-0 whitespace-normal px-1.5 py-0.5 text-[10px] wrap-break-word"
						>
							{formatTagLabel(tag)}
						</Badge>
					))}
				</div>
			)}

			{/* Expanded body only — insert stays in footer CTA below */}
			{expanded && (
				<div className="min-w-0 border-b border-border/60 px-3 py-2">
					<p
						className={`wrap-break-word text-xs leading-relaxed text-muted-foreground ${
							isLongContent ? "max-h-44 overflow-y-auto pr-1" : ""
						}`}
					>
						{displayContent}
					</p>
				</div>
			)}

			{/* Bottom card CTA: always visible, primary strip (collapsed or expanded) */}
			<div className="shrink-0 border-t border-border bg-muted/40 p-3 dark:bg-muted/25">
				<Button
					type="button"
					variant="default"
					size="sm"
					className="w-full gap-1.5 text-xs font-medium shadow-sm"
					onClick={handleCopy}
				>
					<TextCursorInput className="size-3.5 shrink-0" />
					{t("insertIntoEditor")}
				</Button>
			</div>
		</div>
	);
}
