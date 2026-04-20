/**
 * Hand-written DTOs for the 2-Pillar persona-lab endpoints.
 *
 * Backend endpoints (Commits 3-4) that aren't yet in the deployed OpenAPI spec:
 *   GET /v1/persona/tier-progress
 *   GET /v1/persona/pillar-coverage
 *   GET /v1/persona/next-question
 *
 * Replace with Orval-generated types once the backend is redeployed.
 */

export type Pillar = "pillar1" | "pillar2" | "origin";

export type SubDimension =
	| "knowledge"
	| "skill"
	| "network"
	| "funds"
	| "opportunities"
	| "area"
	| "aspect"
	| "beneficiaries"
	| "idea";

export type Tier = "TIER_1" | "TIER_2" | "TIER_3";

export interface TierProgressDto {
	tier1Anchor: { completed: number; total: number };
	tier2Pillar1: { completed: number; total: number };
	tier2Pillar2: { completed: number; total: number };
	pillar2Required: boolean;
	currentTier: Tier | null;
}

export interface SubDimensionCoverage {
	nodeCount: number;
	coverage: number;
}

export interface PillarCoverageDto {
	pillar1: Record<string, SubDimensionCoverage>;
	pillar2: Record<string, SubDimensionCoverage>;
	origin: Record<string, SubDimensionCoverage>;
	pillar2Required: boolean;
}

export interface NextQuestionDto {
	questionKey: string;
	tier: Tier;
	pillar: Pillar | null;
	subDimension: SubDimension | null;
	prompt: string;
	promptVi: string | null;
	promptEn: string | null;
	displayOrder: number;
}
