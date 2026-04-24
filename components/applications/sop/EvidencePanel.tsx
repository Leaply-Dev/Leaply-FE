"use client";

import { CheckCircle2, FileText, TextCursorInput } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EvidenceCardDto } from "@/lib/generated/api/models";
import { formatTagLabel } from "@/lib/utils";

type StarKey = "situation" | "action" | "result" | "emotion" | "insight";

const STAR_ORDER: StarKey[] = [
	"situation",
	"action",
	"result",
	"emotion",
	"insight",
];

const STAR_PREFIXES: Record<StarKey, string[]> = {
	situation: ["Situation:", "situation:"],
	action: ["Action:", "action:"],
	result: ["Result:", "result:"],
	emotion: ["Emotion:", "emotion:"],
	insight: ["Insight:", "insight:"],
};

interface EvidencePanelProps {
	evidenceCards?: EvidenceCardDto[];
	isLoading: boolean;
	onCopy: (text: string) => void;
}

function parseStarFromFacts(facts?: string[]): Record<StarKey, string | null> {
	const result: Record<StarKey, string | null> = {
		situation: null,
		action: null,
		result: null,
		emotion: null,
		insight: null,
	};
	if (!facts) return result;

	for (const fact of facts) {
		for (const key of STAR_ORDER) {
			for (const prefix of STAR_PREFIXES[key]) {
				if (fact.startsWith(prefix)) {
					result[key] = fact.slice(prefix.length).trim();
					break;
				}
			}
		}
	}
	return result;
}

function EvidenceCard({
	card,
	onCopy,
}: {
	card: EvidenceCardDto;
	onCopy: (text: string) => void;
}) {
	const t = useTranslations("sop");
	const starData = parseStarFromFacts(card.facts);
	const presentCount = STAR_ORDER.filter((k) => starData[k]).length;
	const allStarPresent = presentCount === STAR_ORDER.length;

	const handleCopy = () => {
		const text = card.facts?.join("\n\n") || card.title || "";
		onCopy(text);
	};

	return (
		<div className="flex w-full min-w-0 max-w-full flex-col overflow-hidden rounded-lg border bg-card">
			<div className="flex gap-2 px-3 pb-2 pt-3">
				<FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
				<h4 className="min-w-0 flex-1 wrap-break-word text-sm font-medium leading-snug line-clamp-3">
					{card.title}
				</h4>
			</div>

			<div className="border-b border-border/60 px-3 pb-2.5 pt-0.5">
				{allStarPresent ? (
					<div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400/90">
						<CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
						<span>{t("evidenceStarStructureComplete")}</span>
					</div>
				) : (
					<div className="flex min-w-0 flex-col gap-1.5">
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1">
							<span className="shrink-0 text-[10px] font-medium tracking-wide text-muted-foreground">
								{t("evidenceStarStructureBadge")}
							</span>
							<TooltipProvider delayDuration={200}>
								<div className="flex min-w-0 flex-wrap items-center gap-2">
									{STAR_ORDER.map((key) => {
										const present = !!starData[key];
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
						<p className="text-[10px] leading-snug text-muted-foreground">
							{t("starStructureProgress", {
								count: presentCount,
								total: STAR_ORDER.length,
							})}
						</p>
					</div>
				)}
			</div>

			{card.tags && card.tags.length > 0 && (
				<div className="flex min-w-0 flex-wrap gap-1 px-3 pb-2 pt-2">
					{card.tags.map((tag) => (
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

export function EvidencePanel({
	evidenceCards,
	isLoading,
	onCopy,
}: EvidencePanelProps) {
	const t = useTranslations("sop");
	const locale = useLocale();
	const isVietnamese = locale === "vi";

	if (isLoading) {
		return (
			<div className="min-w-0 space-y-3">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-32 w-full rounded-lg" />
				))}
			</div>
		);
	}

	if (!evidenceCards || evidenceCards.length === 0) {
		return (
			<div className="text-center py-8 text-muted-foreground">
				<FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
				<p className="text-sm">
					{isVietnamese
						? "Chưa có evidence card cho phần này."
						: t("noEvidenceAvailable")}
				</p>
			</div>
		);
	}

	return (
		<div className="min-w-0 space-y-3">
			{evidenceCards.map((card, idx) => (
				<EvidenceCard key={card.nodeId || idx} card={card} onCopy={onCopy} />
			))}
		</div>
	);
}
