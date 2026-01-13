import type { PersonaNodeDto } from "@/lib/generated/api/models";
import type {
	DetailFixture,
	EssayAngleFixture,
	KeyStoryFixture,
} from "../types";

/**
 * Creates a profile summary node (center of graph)
 */
export function createProfileSummaryNode(): PersonaNodeDto {
	return {
		id: "mock-profile-summary",
		type: "profile_summary",
		layer: 0,
		title: "Your Profile",
		content:
			"Aspiring graduate researcher combining systems engineering, machine learning, and inclusive education. Driven by rigorous problem-solving, intellectual curiosity, and making technical knowledge accessible.",
		tags: ["research", "systems", "machine-learning", "education"],
		confidence: 0.9,
		createdAt: new Date().toISOString(),
	};
}

/**
 * Transforms essay angle fixture to PersonaNodeDto
 */
export function createEssayAngleNode(
	fixture: EssayAngleFixture,
): PersonaNodeDto {
	return {
		id: `mock-angle-${fixture.title.toLowerCase().replace(/\s+/g, "-")}`,
		type: "essay_angle",
		layer: 1,
		title: fixture.title,
		content: fixture.essayAngle,
		tags: fixture.tags,
		essayAngle: fixture.title,
		bestFor: fixture.bestFor,
		wordCountPotential: fixture.wordCountPotential,
		primaryArchetype: fixture.primaryArchetype,
		secondaryArchetype: fixture.secondaryArchetype,
		archetypeSummary: fixture.archetypeSummary,
		confidence: 0.85,
		createdAt: new Date().toISOString(),
	};
}

/**
 * Transforms key story fixture to PersonaNodeDto
 */
export function createKeyStoryNode(fixture: KeyStoryFixture): PersonaNodeDto {
	const structuredContent: Record<string, string> = {
		situation: fixture.situation,
		task: fixture.task,
		action: fixture.action,
	};

	if (fixture.result) {
		structuredContent.result = fixture.result;
	}
	if (fixture.emotion) {
		structuredContent.emotion = fixture.emotion;
	}
	if (fixture.insight) {
		structuredContent.insight = fixture.insight;
	}

	return {
		id: `mock-story-${fixture.title.toLowerCase().replace(/\s+/g, "-")}`,
		type: "key_story",
		layer: 2,
		title: fixture.title,
		content: `${fixture.situation} ${fixture.task} ${fixture.action}`,
		tags: fixture.tags,
		structuredContent,
		confidence: 0.8,
		createdAt: new Date().toISOString(),
	};
}

/**
 * Transforms detail fixture to PersonaNodeDto
 */
export function createDetailNode(fixture: DetailFixture): PersonaNodeDto {
	return {
		id: `mock-detail-${fixture.title.toLowerCase().replace(/\s+/g, "-")}`,
		type: "detail",
		layer: 3,
		title: fixture.title,
		content: fixture.content,
		tags: fixture.tags,
		confidence: 0.75,
		createdAt: new Date().toISOString(),
	};
}
