// ============================================================================
// Data Transformation
// ============================================================================

import {
	EDGE_CONFIG,
	GRAPH_EDGE_CONFIG,
	GRAPH_NODE_CONFIG,
	NODE_CONFIG,
} from "@/lib/config/graphConfig";
import { mockPersonaGraph } from "@/lib/mock/personaGraphData";
import type {
	GraphEdge,
	GraphEdgeLabel,
	GraphNode,
	GraphNodeType,
} from "@/lib/types/persona";
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

// ============================================================================
// New API Graph Data Transformation (v2)
// Transforms GraphNode[] and GraphEdge[] from API to ForceGraph format
// ============================================================================

export interface ApiForceGraphNode extends ForceGraphNode {
	layer: number;
	nodeData: GraphNode;
}

export interface ApiForceGraphLink extends ForceGraphLink {
	animated: boolean;
	pulseColor?: string;
	edgeType: "connection" | "tension";
	label: GraphEdgeLabel;
	width: number;
}

/**
 * Transforms API graph data to ForceGraph format for rendering.
 * Handles new node types (profile_summary, essay_angle, key_story, detail)
 * and edge types (connection vs tension with animation).
 */
export function transformApiGraphData(
	nodes: GraphNode[],
	edges: GraphEdge[],
): {
	nodes: ApiForceGraphNode[];
	links: ApiForceGraphLink[];
} {
	const forceNodes: ApiForceGraphNode[] = nodes.map((node) => {
		const config = GRAPH_NODE_CONFIG[node.type as GraphNodeType];

		return {
			id: node.id,
			type: node.type,
			label: node.title,
			size: config?.size || 40,
			color: config?.color || "#94a3b8",
			data: node,
			// Extended properties
			layer: node.layer,
			nodeData: node,
		};
	});

	const forceLinks: ApiForceGraphLink[] = edges.map((edge) => {
		const edgeLabel = edge.label as keyof typeof GRAPH_EDGE_CONFIG;
		const config = GRAPH_EDGE_CONFIG[edgeLabel];
		const isAnimated = config?.animated || false;

		// Only tension edges have pulseColor - check if property exists
		const pulseColor =
			isAnimated && "pulseColor" in config
				? (config.pulseColor as string)
				: undefined;

		return {
			source: edge.sourceNodeId,
			target: edge.targetNodeId,
			type: edge.label,
			strength: Math.round(edge.strength * 100),
			color: config?.color || "rgba(148, 163, 184, 0.3)",
			// Extended properties
			animated: isAnimated,
			pulseColor,
			edgeType: edge.edgeType,
			label: edge.label,
			width: config?.width || 2,
		};
	});

	return { nodes: forceNodes, links: forceLinks };
}

/**
 * Groups nodes by layer for organized rendering.
 */
export function groupNodesByLayer(
	nodes: ApiForceGraphNode[],
): Record<number, ApiForceGraphNode[]> {
	const grouped: Record<number, ApiForceGraphNode[]> = {
		0: [],
		1: [],
		2: [],
		3: [],
	};

	for (const node of nodes) {
		const layer = node.layer;
		if (layer >= 0 && layer <= 3) {
			grouped[layer].push(node);
		}
	}

	return grouped;
}

/**
 * Gets radial position for a layer (used for concentric layout).
 */
export function getLayerRadius(layer: number): number {
	const radii: Record<number, number> = {
		0: 0, // Center
		1: 150, // Inner ring
		2: 280, // Middle ring
		3: 450, // Outer ring
	};
	return radii[layer] || 300;
}

/**
 * Filters tension edges from all edges.
 */
export function getTensionEdges(
	edges: ApiForceGraphLink[],
): ApiForceGraphLink[] {
	return edges.filter((edge) => edge.edgeType === "tension");
}

/**
 * Filters connection edges from all edges.
 */
export function getConnectionEdges(
	edges: ApiForceGraphLink[],
): ApiForceGraphLink[] {
	return edges.filter((edge) => edge.edgeType === "connection");
}
