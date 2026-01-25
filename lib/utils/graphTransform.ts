// ============================================================================
// Data Transformation
// ============================================================================

import { GRAPH_EDGE_CONFIG, GRAPH_NODE_CONFIG } from "@/lib/config/graphConfig";
import type {
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/generated/api/models";

// Node type for the graph (from API)
type GraphNodeType = "profile_summary" | "essay_angle" | "key_story" | "detail";

// Edge label types
type ConnectionEdgeLabel = "enables" | "builds_on" | "supports" | "complements";
type TensionEdgeLabel =
	| "contradicts"
	| "evolved_from"
	| "challenged_by"
	| "transformed";
type GraphEdgeLabel = ConnectionEdgeLabel | TensionEdgeLabel;

// ForceGraph display types
export interface ForceGraphNode {
	id: string;
	type: string;
	label: string;
	size: number;
	color: string;
	// biome-ignore lint/suspicious/noExplicitAny: Allows flexibility for node data
	data: Record<string, any>;
}

export interface ForceGraphLink {
	source: string;
	target: string;
	type: string;
	strength: number;
	color: string;
}

// ============================================================================
// API Graph Data Transformation
// Transforms PersonaNodeDto[] and PersonaEdgeDto[] from API to ForceGraph format
// ============================================================================

export interface ApiForceGraphNode extends ForceGraphNode {
	layer: number;
	nodeData: PersonaNodeDto;
	// D3 simulation adds/updates these properties
	x?: number;
	y?: number;
	vx?: number;
	vy?: number;
	fx?: number;
	fy?: number;
}

export interface ApiForceGraphLink extends ForceGraphLink {
	animated: boolean;
	pulseColor?: string;
	edgeType: "connection" | "tension";
	label: GraphEdgeLabel;
	width: number;
}

/**
 * Determines edge type based on label
 */
function getEdgeType(label: string): "connection" | "tension" {
	const tensionLabels: string[] = [
		"contradicts",
		"evolved_from",
		"challenged_by",
		"transformed",
	];
	return tensionLabels.includes(label) ? "tension" : "connection";
}

/**
 * Transforms API graph data to ForceGraph format for rendering.
 * Handles new node types (profile_summary, essay_angle, key_story, detail)
 * and edge types (connection vs tension with animation).
 * Also adds angular positioning to spread children evenly around parents.
 */
export function transformApiGraphData(
	nodes: PersonaNodeDto[],
	edges: PersonaEdgeDto[],
): {
	nodes: ApiForceGraphNode[];
	links: ApiForceGraphLink[];
} {
	// Filter out nodes without valid IDs (safety check)
	const validNodes = nodes.filter((n) => n.id && typeof n.id === "string");
	if (validNodes.length !== nodes.length) {
		console.warn(
			"[transformApiGraphData] Filtered out nodes without valid IDs:",
			nodes.length - validNodes.length,
		);
	}

	// Build parent-child relationship map for angular distribution
	const childrenByParent = new Map<string, string[]>();
	for (const edge of edges) {
		if (!edge.source || !edge.target) continue;
		if (!childrenByParent.has(edge.source)) {
			childrenByParent.set(edge.source, []);
		}
		childrenByParent.get(edge.source)?.push(edge.target);
	}

	// Layer radii (must match useGraphForces)
	const layerRadii: Record<number, number> = {
		0: 0, // Center
		1: 200, // Inner ring
		2: 320, // Middle ring
		3: 450, // Outer ring
	};

	const forceNodes: ApiForceGraphNode[] = validNodes.map((node, index) => {
		const nodeType = (node.type || "detail") as GraphNodeType;
		const config = GRAPH_NODE_CONFIG[nodeType];
		const layer = node.layer ?? 3;
		const radius = layerRadii[layer] || 300;

		// Calculate angular position for even distribution
		let angle = 0;
		let initialX = 0;
		let initialY = 0;

		// Find parent node (source of incoming edge)
		// Use node.id directly since we already filtered for valid IDs
		const nodeId = node.id as string;
		const parentEdge = edges.find((e) => e.target === nodeId);
		if (parentEdge?.source) {
			const siblings = childrenByParent.get(parentEdge.source) || [];
			const siblingIndex = siblings.indexOf(nodeId);
			const siblingCount = siblings.length;

			if (siblingIndex >= 0 && siblingCount > 0) {
				// Distribute evenly around the circle
				// Add offset to avoid perfect vertical/horizontal alignment
				const angleOffset = Math.PI / 6; // 30 degree offset
				// Add small jitter based on node ID hash to prevent identical positions
				// when multiple nodes have same siblingIndex/siblingCount ratio
				const idHash = nodeId
					.split("")
					.reduce((a, c) => a + c.charCodeAt(0), 0);
				const angleJitter = ((idHash % 100) / 100) * 0.3; // 0 to 0.3 radians (~0-17°)
				angle =
					(siblingIndex / siblingCount) * 2 * Math.PI +
					angleOffset +
					angleJitter;

				// Calculate initial position on the circle
				initialX = radius * Math.cos(angle);
				initialY = radius * Math.sin(angle);
			}
		} else if (layer === 0) {
			// Root node stays at center
			initialX = 0;
			initialY = 0;
		} else {
			// No parent, distribute around the ring based on index
			// Use golden angle for better distribution
			const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5 degrees
			angle = index * goldenAngle;
			initialX = radius * Math.cos(angle);
			initialY = radius * Math.sin(angle);
		}

		return {
			id: nodeId,
			type: nodeType,
			label: node.title || "Untitled",
			size: config?.size || 12,
			color: config?.color || "#94a3b8",
			data: node,
			// Extended properties
			layer: layer,
			nodeData: node,
			// Initial position for better distribution
			x: initialX,
			y: initialY,
		};
	});

	const forceLinks: ApiForceGraphLink[] = edges.map((edge) => {
		const edgeLabel = (edge.label || "supports") as GraphEdgeLabel;
		const config =
			GRAPH_EDGE_CONFIG[edgeLabel as keyof typeof GRAPH_EDGE_CONFIG];
		const isAnimated = config?.animated || false;
		const edgeType = getEdgeType(edgeLabel);

		// Only tension edges have pulseColor - check if property exists
		const pulseColor =
			isAnimated && config && "pulseColor" in config
				? (config.pulseColor as string)
				: undefined;

		return {
			// PersonaEdgeDto uses source/target directly
			source: edge.source || "",
			target: edge.target || "",
			type: edgeLabel,
			strength: Math.round((edge.strength ?? 0.5) * 100),
			color: config?.color || "rgba(148, 163, 184, 0.3)",
			// Extended properties
			animated: isAnimated,
			pulseColor,
			edgeType,
			label: edgeLabel,
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
