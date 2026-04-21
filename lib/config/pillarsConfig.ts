/**
 * Pillar configuration for the 2-Pillar persona flow.
 *
 * Pillar 1 — Applicant: knowledge, skill, network, opportunities
 * Pillar 2 — Essay (scholarship track only): area, aspect, beneficiaries, idea
 * Origin  — Tier 1 anchor questions (cross-pillar context)
 *
 * Badge colors are deliberately separate from the layer palette so they read as
 * badges on top of layer-colored nodes, not as replacements for the fill.
 */
import type {
	Pillar,
	PillarCoverageDto,
	SubDimension,
} from "@/lib/api/personaLab/types";

export interface PillarConfig {
	label: string;
	labelVi: string;
	badgeColor: string;
	badgeTextColor: string;
	badgeLetter: string;
	subDimensions: SubDimension[];
}

export const PILLARS_CONFIG: Record<Pillar, PillarConfig> = {
	pillar1: {
		label: "About you",
		labelVi: "Hồ sơ của bạn",
		badgeColor: "#2563eb", // blue-600
		badgeTextColor: "#ffffff",
		badgeLetter: "1",
		subDimensions: ["knowledge", "skill", "network", "opportunities"],
	},
	pillar2: {
		label: "Essay story",
		labelVi: "Câu chuyện essay",
		badgeColor: "#16a34a", // green-600
		badgeTextColor: "#ffffff",
		badgeLetter: "2",
		subDimensions: ["area", "aspect", "beneficiaries", "idea"],
	},
	origin: {
		label: "Background",
		labelVi: "Thông tin nền",
		badgeColor: "#7c3aed", // violet-600
		badgeTextColor: "#ffffff",
		badgeLetter: "O",
		subDimensions: [],
	},
};

/** Letter-labelled pill drawn on top-right of a canvas node. Null pillar → no badge. */
export const PILLAR_BADGE = {
	null: { color: "#cbd5e1", textColor: "#0f172a", letter: "" },
	pillar1: PILLARS_CONFIG.pillar1,
	pillar2: PILLARS_CONFIG.pillar2,
	origin: PILLARS_CONFIG.origin,
} as const;

export function getPillarConfig(pillar: Pillar): PillarConfig {
	return PILLARS_CONFIG[pillar];
}

export function getSubDimensionLabel(
	sd: SubDimension,
	locale: "vi" | "en" = "en",
): string {
	const labels: Record<SubDimension, { vi: string; en: string }> = {
		knowledge: { vi: "Kiến thức", en: "Knowledge" },
		skill: { vi: "Kỹ năng", en: "Skill" },
		network: { vi: "Mạng lưới", en: "Network" },
		opportunities: { vi: "Cơ hội", en: "Opportunities" },
		area: { vi: "Lĩnh vực", en: "Area" },
		aspect: { vi: "Góc nhìn", en: "Aspect" },
		beneficiaries: { vi: "Đối tượng thụ hưởng", en: "Beneficiaries" },
		idea: { vi: "Ý tưởng", en: "Idea" },
	};
	return labels[sd][locale];
}

/** Average 0-100 coverage across a pillar's sub-dimension map. */
export function averageCoverage(
	pillarMap: Record<string, number> | undefined,
): number {
	if (!pillarMap) return 0;
	const values = Object.values(pillarMap);
	if (values.length === 0) return 0;
	const sum = values.reduce((acc, v) => acc + (v ?? 0), 0);
	return Math.round(sum / values.length);
}

/** 3-state colour bucket for a single sub-dimension square. */
export function coverageBucket(
	coverage: number | undefined,
): "empty" | "partial" | "full" {
	if (!coverage || coverage <= 0) return "empty";
	if (coverage >= 60) return "full";
	return "partial";
}

/** Safely pluck a sub-dimension's coverage (0-100) from the pillar map. */
export function getSubDimensionCoverage(
	pillarMap: Record<string, number> | undefined,
	sd: SubDimension,
): number | undefined {
	if (!pillarMap) return undefined;
	return pillarMap[sd] ?? pillarMap[sd.toUpperCase()];
}

export function isPillar2Visible(coverage: PillarCoverageDto | null): boolean {
	return Boolean(coverage?.pillar2Required);
}
