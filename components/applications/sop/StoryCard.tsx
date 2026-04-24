"use client";

import { BookOpen, ChevronDown, ChevronUp, Copy } from "lucide-react";
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

type StarKey = "situation" | "task" | "action" | "result" | "emotion" | "insight";

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

	const handleCopy = () => {
		const text = node.content || "";
		onCopy(text);
	};

	const displayTitle = node.title || (isVietnamese ? "Câu chuyện" : "Story");
	const displayContent = node.content || "";
	const isLongContent = displayContent.length > 500;

	return (
		<div className="rounded-lg border bg-card overflow-hidden">
			{/* Header — always visible */}
			<button
				type="button"
				onClick={() => setExpanded((v) => !v)}
				className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
			>
				{expanded ? (
					<ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
				) : (
					<ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
				)}
				<BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
				<span className="text-sm font-medium flex-1 truncate">
					{displayTitle}
				</span>
				<span className="text-[10px] text-muted-foreground shrink-0">
					{presentCount}/{STAR_ORDER.length}
				</span>
			</button>

			{/* Tags */}
			{node.tags && node.tags.length > 0 && (
				<div className="px-3 pb-2 flex flex-wrap gap-1">
					{node.tags.map((tag) => (
						<Badge
							key={tag}
							variant="secondary"
							className="text-[10px] px-1.5 py-0 h-4"
						>
							{tag}
						</Badge>
					))}
				</div>
			)}

			{/* STAR dots */}
			<div className="px-3 pb-2 flex items-center gap-2">
				<TooltipProvider delayDuration={200}>
					{STAR_ORDER.map((key) => {
						const present = starPresent[key];
						return (
							<Tooltip key={key}>
								<TooltipTrigger asChild>
									<div
										className="w-2 h-2 rounded-full cursor-help"
										style={{
											backgroundColor: present ? "#10B981" : "#D1D5DB",
										}}
									/>
								</TooltipTrigger>
								{!present && (
									<TooltipContent side="top" className="text-xs">
										{t("starMissingTooltip", {
											element: t(`star${key.charAt(0).toUpperCase() + key.slice(1)}`),
										})}
									</TooltipContent>
								)}
							</Tooltip>
						);
					})}
				</TooltipProvider>
			</div>

			{/* Expanded content */}
			{expanded && (
				<div className="px-3 pb-3 space-y-2">
					<p
						className={`text-xs text-muted-foreground leading-relaxed ${
							isLongContent ? "max-h-44 overflow-y-auto pr-1" : ""
						}`}
					>
						{displayContent}
					</p>
					<Button
						variant="outline"
						size="sm"
						className="h-7 text-xs gap-1.5"
						onClick={handleCopy}
					>
						<Copy className="w-3 h-3" />
						{t("copyToEditor")}
					</Button>
				</div>
			)}
		</div>
	);
}
