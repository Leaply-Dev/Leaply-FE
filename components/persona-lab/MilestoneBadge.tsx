"use client";

import { FileText, Sparkles, Target, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const MILESTONE_CONFIG: Record<
	string,
	{
		labelKey: string;
		icon: typeof Sparkles;
		colorClass: string;
		bgClass: string;
	}
> = {
	draft_angle_available: {
		labelKey: "milestoneDraftAngle",
		icon: Sparkles,
		colorClass: "text-amber-600",
		bgClass: "bg-amber-500/10",
	},
	pillar_1_material_ready: {
		labelKey: "milestonePillar1Outline",
		icon: Target,
		colorClass: "text-blue-600",
		bgClass: "bg-blue-500/10",
	},
	full_scholarship_essay_ready: {
		labelKey: "milestoneFullSop",
		icon: FileText,
		colorClass: "text-violet-600",
		bgClass: "bg-violet-500/10",
	},
	deep_coverage: {
		labelKey: "milestoneDeepCoverage",
		icon: Trophy,
		colorClass: "text-emerald-600",
		bgClass: "bg-emerald-500/10",
	},
};

interface MilestoneBadgeProps {
	type: string;
	className?: string;
}

export function MilestoneBadge({ type, className }: MilestoneBadgeProps) {
	const t = useTranslations("personaLab");
	const config = MILESTONE_CONFIG[type];

	if (!config) {
		// Unknown milestone — render a generic badge
		return (
			<span
				className={cn(
					"inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium",
					className,
				)}
			>
				{type}
			</span>
		);
	}

	const Icon = config.icon;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium",
				config.bgClass,
				config.colorClass,
				className,
			)}
		>
			<Icon className="w-3 h-3" />
			{t(config.labelKey)}
		</span>
	);
}
