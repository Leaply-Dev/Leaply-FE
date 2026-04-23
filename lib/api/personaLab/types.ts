/**
 * Hand-written DTOs for the 2-Pillar persona-lab endpoints.
 *
 * Backend endpoints:
 *   GET /v1/persona/tier-progress
 *   GET /v1/persona/pillar-coverage
 *   GET /v1/persona/next-question
 *   GET /v1/persona/milestones
 *
 * Replace with Orval-generated types once the backend is redeployed and
 * the OpenAPI spec is regenerated.
 */

import type {
	GraphMessageResponse as GeneratedGraphMessageResponse,
	PersonaNodeDto as GeneratedPersonaNodeDto,
} from "@/lib/generated/api/models";

export type Pillar = "pillar1" | "pillar2" | "origin";

export type SubDimension =
	| "knowledge"
	| "skill"
	| "network"
	| "opportunities"
	| "area"
	| "aspect"
	| "beneficiaries"
	| "idea";

export interface TierProgressDto {
	currentTier?: string;
	tier1Completed?: number;
	tier1Total?: number;
	tier1Complete?: boolean;
	answeredQuestionKeys?: string[];
	nextQuestion?: NextQuestionDto;
}

export interface PillarCoverageDto {
	tier1Anchor?: Record<string, number>;
	pillar1?: Record<string, number>;
	pillar2?: Record<string, number>;
	pillar2Required?: boolean;
}

export interface NextQuestionDto {
	questionKey?: string;
	tier?: string;
	pillar?: string;
	subDimension?: string;
	text?: string;
	followUp?: string;
	rawText?: string;
	rawFollowUp?: string;
}

// ============================================================================
// v2 Extensions — add new fields from backend handoff until Orval regenerates
// ============================================================================

/** Extended PersonaNodeDto with pillar traceability fields. */
export type PersonaNodeDto = GeneratedPersonaNodeDto & {
	/** Pillar tag: pillar1 / pillar2 / origin. Null if not pillar-scoped. */
	pillar?: string;
	/** Sub-dimension tag: knowledge/skill/network/.../beneficiaries/idea. Null if cross-pillar. */
	subDimension?: string;
	/** Human-readable label for hover (e.g., "Pillar 1 / Skill -- dung cho Why This Field essay"). */
	servesPillar?: string;
};

/** Extended GraphMessageResponse with v2 server-computed state fields. */
export type GraphMessageResponse = GeneratedGraphMessageResponse & {
	/** Current tier the user is in. */
	currentTier?: string;
	/** Transition message when tier just changed (null otherwise). */
	transitionMessage?: string;
	/** Milestones unlocked this turn. */
	unlockedMilestones?: string[];
	/** What the next question is about (for progress bar). */
	nextQuestionIntent?: string;
};

