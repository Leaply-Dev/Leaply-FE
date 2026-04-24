import type { useTranslations } from "next-intl";
import type { SubDimension } from "@/lib/api/personaLab/types";
import {
	getSubDimensionLabel,
	PILLARS_CONFIG,
} from "@/lib/config/pillarsConfig";

type PersonaT = ReturnType<typeof useTranslations<"personaLab">>;

/** Map backend `buildNextIntentLabel` English prefix → config pillar key */
const INTENT_PILLAR_PREFIX: Record<string, "pillar1" | "pillar2" | "origin"> = {
	"Pillar 1": "pillar1",
	"Pillar 2": "pillar2",
	Origin: "origin",
};

const KNOWN_SUB: Set<string> = new Set([
	"knowledge",
	"skill",
	"network",
	"opportunities",
	"funds",
	"area",
	"aspect",
	"beneficiaries",
	"idea",
]);

/**
 * Replaces API tier codes (e.g. TIER_2_PILLAR_1) with short, user-facing text.
 */
export function formatCurrentTierForUi(
	tier: string | null | undefined,
	t: PersonaT,
): string | null {
	if (!tier?.trim()) return null;
	switch (tier) {
		case "TIER_1":
			return t("tierPhaseTIER1");
		case "TIER_2_PILLAR_1":
			return t("tierPhaseTIER2P1");
		case "TIER_2_PILLAR_2":
			return t("tierPhaseTIER2P2");
		case "COMPLETE":
			return t("tierPhaseComplete");
		default:
			return t("tierPhaseOther", { code: tier });
	}
}

/**
 * Localizes the next-question intent from the server ("Pillar 2 / Idea") using
 * pillar + sub-dimension display names.
 */
export function formatNextQuestionIntentForUi(
	raw: string | null | undefined,
	locale: "en" | "vi",
	t: PersonaT,
): string | null {
	if (!raw?.trim()) return null;
	const parts = raw.split(" / ").map((s) => s.trim());
	if (parts.length < 2) {
		return raw;
	}
	const [pillarEn, subRaw] = parts;
	const pillarKey = INTENT_PILLAR_PREFIX[pillarEn];
	const l = locale === "vi" ? "labelVi" : "label";
	const pillarLabel = pillarKey ? PILLARS_CONFIG[pillarKey][l] : pillarEn;
	const subLower = subRaw.toLowerCase();
	const areaLabel = KNOWN_SUB.has(subLower)
		? getSubDimensionLabel(subLower as SubDimension, locale)
		: subRaw;
	return t("nextFocusLine", { pillar: pillarLabel, area: areaLabel });
}
