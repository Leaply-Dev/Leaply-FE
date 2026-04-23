"use client";

import { Copy, FileText } from "lucide-react";
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

	const handleCopy = () => {
		const text = card.facts?.join("\n\n") || card.title || "";
		onCopy(text);
	};

	return (
		<div className="rounded-lg border bg-card p-3 space-y-3">
			<div className="flex items-start gap-2">
				<FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
				<div className="flex-1 min-w-0">
					<h4 className="text-sm font-medium">{card.title}</h4>
					{card.tags && card.tags.length > 0 && (
						<div className="flex flex-wrap gap-1 mt-1.5">
							{card.tags.map((tag) => (
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
				</div>
				<span className="text-[10px] text-muted-foreground shrink-0">
					{presentCount}/{STAR_ORDER.length}
				</span>
			</div>

			{/* STAR indicators */}
			<div className="space-y-1.5">
				<TooltipProvider delayDuration={200}>
					{STAR_ORDER.map((key) => {
						const present = !!starData[key];
						return (
							<div key={key} className="flex items-center gap-2">
								<div
									className="w-2 h-2 rounded-full shrink-0"
									style={{
										backgroundColor: present ? "#10B981" : "#D1D5DB",
									}}
								/>
								<span
									className={`text-xs ${present ? "text-foreground" : "text-muted-foreground"}`}
								>
									{t(
										`star${key.charAt(0).toUpperCase() + key.slice(1)}`,
									)}
								</span>
								{!present && (
									<Tooltip>
										<TooltipTrigger asChild>
											<span className="ml-auto text-[10px] text-muted-foreground cursor-help underline decoration-dotted">
												?
											</span>
										</TooltipTrigger>
										<TooltipContent side="right" className="text-xs max-w-[200px]">
											{t("starMissingTooltip", {
												element: t(
													`star${key.charAt(0).toUpperCase() + key.slice(1)}`,
												),
											})}
										</TooltipContent>
									</Tooltip>
								)}
							</div>
						);
					})}
				</TooltipProvider>
			</div>

			<Button
				variant="outline"
				size="sm"
				className="h-7 text-xs gap-1.5 w-full"
				onClick={handleCopy}
			>
				<Copy className="w-3 h-3" />
				{t("copyToEditor")}
			</Button>
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
			<div className="space-y-3">
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
		<div className="space-y-3">
			{evidenceCards.map((card, idx) => (
				<EvidenceCard key={card.nodeId || idx} card={card} onCopy={onCopy} />
			))}
		</div>
	);
}
