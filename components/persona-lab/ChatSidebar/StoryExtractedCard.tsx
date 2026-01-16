"use client";

import { m } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { PersonaNodeDto } from "@/lib/generated/api/models";
import type { StarStructureKey } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";
import { StarGapsIndicator } from "./StarGapsIndicator";

interface StoryExtractedCardProps {
	node: PersonaNodeDto;
	starGaps?: StarStructureKey[];
	className?: string;
}

export function StoryExtractedCard({
	node,
	starGaps = [],
	className,
}: StoryExtractedCardProps) {
	const t = useTranslations("personaLab.star");

	// Only show for key_story nodes
	if (node.type !== "key_story") {
		return null;
	}

	return (
		<m.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className={cn(
				"bg-primary/5 border border-primary/20 rounded-lg p-3 space-y-2",
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center gap-2">
				<div className="p-1 rounded bg-primary/10">
					<BookOpen className="w-3 h-3 text-primary" />
				</div>
				<span className="text-xs font-semibold text-primary flex items-center gap-1">
					<Sparkles className="w-3 h-3" />
					{t("storyExtracted")}
				</span>
			</div>

			{/* Story title */}
			<div className="text-sm font-medium text-foreground">{node.title}</div>

			{/* Tags */}
			{node.tags && node.tags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{node.tags.slice(0, 4).map((tag) => (
						<span
							key={tag}
							className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
						>
							{tag}
						</span>
					))}
				</div>
			)}

			{/* STAR gaps indicator */}
			{starGaps.length > 0 && (
				<StarGapsIndicator gaps={starGaps} variant="compact" />
			)}
		</m.div>
	);
}
