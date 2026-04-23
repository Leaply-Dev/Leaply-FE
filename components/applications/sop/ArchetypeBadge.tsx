"use client";

import { Sparkles, Star } from "lucide-react";
import { useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
	ARCHETYPE_CONFIG,
	getArchetypeConfig,
	type ArchetypeKey,
} from "@/lib/config/archetypeConfig";
import type { ArchetypeMotifSuggestionResponse } from "@/lib/api/sop-workspace";

interface ArchetypeBadgeProps {
	data: ArchetypeMotifSuggestionResponse;
	selectedEssayType: string | null;
	selectedMotif: string | null;
}

export function ArchetypeBadge({
	data,
	selectedEssayType,
	selectedMotif,
}: ArchetypeBadgeProps) {
	const locale = useLocale();
	const isVietnamese = locale === "vi";

	if (!data.archetype) return null;

	const archetypeKey = data.archetype.type as ArchetypeKey;
	const config = getArchetypeConfig(archetypeKey);
	const color = data.archetype.color || config?.color || "#6B7280";

	// Localized content
	const title = isVietnamese
		? data.archetype.titleVi
		: config?.title || archetypeKey;
	const strengths = isVietnamese
		? data.archetype.essayStrengthsVi
		: config?.essayStrengths || [];

	// Get suggestions for current essay type
	const essayTypeKey = selectedEssayType === "sop" ? "sop" : "ps";
	const suggestions = data.suggestions?.[essayTypeKey] ?? [];

	// Build a set of recommended motif names for quick lookup
	const recommendedMotifs = new Set(
		suggestions.map((s) => s.motif),
	);

	// Check if currently selected motif is recommended
	const selectedSuggestion = suggestions.find(
		(s) => s.motif === selectedMotif,
	);

	return (
		<Card
			className="w-full p-5 border-0 shadow-sm relative overflow-hidden"
			style={{
				background: `linear-gradient(135deg, ${color}10, ${color}05)`,
				borderLeft: `3px solid ${color}`,
			}}
		>
			<div className="flex items-start gap-3">
				<div
					className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
					style={{ backgroundColor: `${color}20` }}
				>
					<Sparkles className="w-5 h-5" style={{ color }} />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 flex-wrap">
						<h3 className="font-semibold text-sm" style={{ color }}>
							{isVietnamese
								? `Bạn là ${title}`
								: `You are ${title}`}
						</h3>
						{selectedSuggestion && (
							<Badge
								variant="secondary"
								className="text-[10px] px-1.5 py-0 h-5"
								style={{
									backgroundColor: `${color}20`,
									color,
									borderColor: `${color}30`,
								}}
							>
								<Star className="w-2.5 h-2.5 mr-0.5" fill={color} />
								{Math.round(selectedSuggestion.confidence * 100)}%
								{isVietnamese ? " phù hợp" : " match"}
							</Badge>
						)}
					</div>
					<div className="flex flex-wrap gap-1.5 mt-2">
						{strengths.map((strength) => (
							<Badge
								key={strength}
								variant="outline"
								className="text-[10px] px-1.5 py-0 h-5"
								style={{
									borderColor: `${color}30`,
									color: `${color}`,
									backgroundColor: `${color}08`,
								}}
							>
								{strength}
							</Badge>
						))}
					</div>
					{suggestions.length > 0 && !selectedMotif && (
						<p className="text-xs text-muted-foreground mt-2">
							{isVietnamese
								? "Gợi ý phù hợp nhất: "
								: "Top recommendations: "}
							{suggestions
								.slice(0, 2)
								.map((s) => s.motif)
								.join(", ")}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
}
