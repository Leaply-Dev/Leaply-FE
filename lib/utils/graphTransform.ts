// ============================================================================
// Data Transformation
// ============================================================================

import { EDGE_CONFIG, NODE_CONFIG } from "@/lib/config/graphConfig";
import { mockPersonaGraph } from "@/lib/mock/personaGraphData";
import type {
	ForceGraphLink,
	ForceGraphNode,
} from "@/lib/types/persona-canvas";

export function transformGraphData(): {
	nodes: ForceGraphNode[];
	links: ForceGraphLink[];
} {
	const nodes: ForceGraphNode[] = [];
	const links: ForceGraphLink[] = [];

	// Add archetype node (center)
	nodes.push({
		id: mockPersonaGraph.archetype.id,
		type: "archetype",
		label: `${mockPersonaGraph.archetype.primary_type.toUpperCase()}`,
		size: NODE_CONFIG.archetype.size,
		color: NODE_CONFIG.archetype.color,
		data: mockPersonaGraph.archetype,
	});

	// Add story nodes
	for (const story of mockPersonaGraph.stories) {
		nodes.push({
			id: story.id,
			type: "story",
			label: story.title,
			size: NODE_CONFIG.story.size,
			color: NODE_CONFIG.story.color,
			data: story,
		});
	}

	// Add pattern nodes
	for (const pattern of mockPersonaGraph.patterns) {
		nodes.push({
			id: pattern.id,
			type: "pattern",
			label: pattern.cluster_name,
			size: NODE_CONFIG.pattern.size,
			color: NODE_CONFIG.pattern.color,
			data: pattern,
		});
	}

	// Add value system node
	nodes.push({
		id: mockPersonaGraph.values.id,
		type: "value",
		label: "Value System",
		size: NODE_CONFIG.value.size,
		color: NODE_CONFIG.value.color,
		data: mockPersonaGraph.values,
	});

	// Add skill nodes
	for (const skill of mockPersonaGraph.skills) {
		nodes.push({
			id: skill.id,
			type: "skill",
			label: skill.skill_name,
			size: NODE_CONFIG.skill.size,
			color: NODE_CONFIG.skill.color,
			data: skill,
		});
	}

	// Add edges
	for (const edge of mockPersonaGraph.edges) {
		const config = EDGE_CONFIG[edge.type as keyof typeof EDGE_CONFIG];
		links.push({
			source: edge.from,
			target: edge.to,
			type: edge.type,
			strength: edge.strength || 50,
			color: config?.color || "rgba(148, 163, 184, 0.3)",
		});
	}

	return { nodes, links };
}
