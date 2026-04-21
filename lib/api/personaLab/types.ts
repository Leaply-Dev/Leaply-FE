/**
 * Hand-written DTOs for the 2-Pillar persona-lab endpoints.
 *
 * Backend endpoints:
 *   GET /v1/persona/tier-progress
 *   GET /v1/persona/pillar-coverage
 *   GET /v1/persona/next-question
 *
 * Replace with Orval-generated types once the backend is redeployed and
 * the OpenAPI spec is regenerated.
 */

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

export type Tier = "TIER_1" | "TIER_2" | "TIER_3";

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
