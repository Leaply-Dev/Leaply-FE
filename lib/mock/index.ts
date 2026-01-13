import type {
	ChatMessageDto,
	CoverageMetrics,
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/generated/api/models";
import type { ConversationScenario, DetailFixture } from "./types";

import essayAnglesData from "./fixtures/essay-angles.json";
import keyStoriesData from "./fixtures/key-stories.json";
import detailsData from "./fixtures/details.json";
import conversationTurnsData from "./fixtures/conversation-turns.json";

import {
	createProfileSummaryNode,
	createEssayAngleNode,
	createKeyStoryNode,
	createDetailNode,
} from "./generators/nodeGenerator";
import { generateEdgesForNodes } from "./generators/edgeGenerator";
import { calculateCoverage } from "./generators/coverageGenerator";

export type { ConversationScenario };

interface ScenarioState {
	nodes: PersonaNodeDto[];
	edges: PersonaEdgeDto[];
	coverage: CoverageMetrics;
	messages: ChatMessageDto[];
}

interface ScenarioConfig {
	nodeCount: {
		angles: number;
		stories: number;
		details: number;
	};
	turnCount: number;
}

const SCENARIO_CONFIG: Record<ConversationScenario, ScenarioConfig> = {
	"fresh-start": {
		nodeCount: { angles: 0, stories: 0, details: 0 },
		turnCount: 1,
	},
	"building-momentum": {
		nodeCount: { angles: 2, stories: 3, details: 3 },
		turnCount: 4,
	},
	"tension-discovery": {
		nodeCount: { angles: 4, stories: 6, details: 6 },
		turnCount: 7,
	},
	"completion-ready": {
		nodeCount: { angles: 6, stories: 10, details: 10 },
		turnCount: 10,
	},
};

/**
 * Gets the complete state for a given conversation scenario
 */
export function getScenarioState(scenario: ConversationScenario): ScenarioState {
	const config = SCENARIO_CONFIG[scenario];

	// Create profile summary node (always present except fresh-start)
	const profileNode =
		scenario === "fresh-start" ? [] : [createProfileSummaryNode()];

	// Select subset of fixtures based on scenario
	const angles = essayAnglesData.slice(0, config.nodeCount.angles);
	const stories = keyStoriesData.slice(0, config.nodeCount.stories);
	const details = detailsData.slice(0, config.nodeCount.details);

	// Transform fixtures to PersonaNodeDto using generators
	const nodes: PersonaNodeDto[] = [
		...profileNode,
		...angles.map((f) => createEssayAngleNode(f)),
		...stories.map((f) => createKeyStoryNode(f)),
		...details.map((f) => createDetailNode(f as DetailFixture)),
	];

	// Generate edges based on relationships
	const edges = generateEdgesForNodes(nodes);

	// Calculate coverage metrics
	const coverage = calculateCoverage(nodes, edges);

	// Load conversation history (first N turns)
	const messages: ChatMessageDto[] = conversationTurnsData
		.slice(0, config.turnCount)
		.flatMap((turn) => [
			{
				role: "user" as const,
				content: turn.userMessage,
				timestamp: new Date().toISOString(),
			},
			{
				role: "assistant" as const,
				content: turn.assistantMessage,
				timestamp: new Date().toISOString(),
			},
		]);

	return { nodes, edges, coverage, messages };
}

/**
 * Get STAR gaps for a specific node by title
 */
export function getStarGapsForNode(nodeTitle: string): string[] {
	const story = keyStoriesData.find((s) => s.title === nodeTitle);
	return story?.starGaps || [];
}
