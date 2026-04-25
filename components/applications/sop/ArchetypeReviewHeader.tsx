"use client";

import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import {
	type ArchetypeKey,
	getArchetypeConfig,
} from "@/lib/config/archetypeConfig";
import { usePersonaStore } from "@/lib/store/personaStore";

interface ArchetypeReviewHeaderProps {
	strengths?: string[];
}

export function ArchetypeReviewHeader({
	strengths,
}: ArchetypeReviewHeaderProps) {
	const locale = useLocale();
	const isVietnamese = locale === "vi";
	const archetypeType = usePersonaStore((state) => state.archetypeType);

	if (!archetypeType) return null;

	const config = getArchetypeConfig(archetypeType);
	if (!config) return null;

	const color = config.color;
	const title = isVietnamese ? config.titleVi : config.title;
	const essayStrengths = isVietnamese
		? config.essayStrengthsVi
		: config.essayStrengths;

	// Simple heuristic: if the backend review strengths contain keywords from
	// the archetype strength, mark as demonstrated. Otherwise mark as enhanceable.
	const reviewStrengthsLower = (strengths ?? []).map((s) => s.toLowerCase());

	const strengthStatus = essayStrengths.map((strength) => {
		const demonstrated = reviewStrengthsLower.some((rs) =>
			rs.includes(strength.toLowerCase().slice(0, 8)),
		);
		return { text: strength, demonstrated };
	});

	return (
		<div
			className="rounded-xl border-0 p-4 mb-4"
			style={{
				background: `linear-gradient(135deg, ${color}10, ${color}05)`,
				borderLeft: `3px solid ${color}`,
			}}
		>
			<div className="flex items-center gap-2 mb-3">
				<Sparkles className="w-4 h-4" style={{ color }} />
				<h3 className="font-semibold text-sm" style={{ color }}>
					{isVietnamese ? `Với tư cách là ${title}` : `As a ${title}`}
				</h3>
			</div>

			<div className="space-y-2">
				{strengthStatus.map(({ text, demonstrated }) => (
					<div key={text} className="flex items-center gap-2">
						{demonstrated ? (
							<CheckCircle2
								className="w-4 h-4 shrink-0"
								style={{ color: "#10B981" }}
							/>
						) : (
							<Circle className="w-4 h-4 shrink-0 text-muted-foreground" />
						)}
						<span
							className={`text-sm ${demonstrated ? "text-foreground" : "text-muted-foreground"}`}
						>
							{text}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}
