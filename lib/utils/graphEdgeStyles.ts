import type { CSSProperties } from "react";
import type { LayerNumber, PersonaEdgeDto, PersonaNodeDto } from "@/lib/types/persona-graph";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";

/**
 * Edge styling utilities for the persona graph
 *
 * Edge styling rules from spec:
 * - Width: 1 + (strength * 3) px
 * - Opacity: 0.3 + (strength * 0.5)
 * - Color: Inherited from source node's layer color
 */

export interface EdgeStyleOptions {
	isHighlighted?: boolean;
	isSelected?: boolean;
	isAnimated?: boolean;
}

/**
 * Calculate edge stroke width based on strength
 */
export function getEdgeWidth(strength: number): number {
	return 1 + strength * 3;
}

/**
 * Calculate edge opacity based on strength
 */
export function getEdgeOpacity(strength: number): number {
	return 0.3 + strength * 0.5;
}

/**
 * Get the color for an edge based on the source node's layer
 */
export function getEdgeColor(sourceLayer: LayerNumber): string {
	return LAYOUT_CONFIG.colors[sourceLayer];
}

/**
 * Generate full edge style object for React Flow
 */
export function getEdgeStyle(
	edge: PersonaEdgeDto,
	sourceNode: PersonaNodeDto | undefined,
	options: EdgeStyleOptions = {},
): CSSProperties {
	const { isHighlighted = false, isSelected = false } = options;

	const sourceLayer = (sourceNode?.layer ?? 1) as LayerNumber;
	const baseColor = LAYOUT_CONFIG.colors[sourceLayer];

	let strokeWidth = getEdgeWidth(edge.strength);
	let opacity = getEdgeOpacity(edge.strength);

	// Adjust for highlight/selection states
	if (isHighlighted || isSelected) {
		strokeWidth *= 1.5;
		opacity = Math.min(1, opacity + 0.3);
	}

	return {
		stroke: baseColor,
		strokeWidth,
		opacity,
	};
}

/**
 * Generate edge style for animated edges (e.g., during transitions)
 */
export function getAnimatedEdgeStyle(
	edge: PersonaEdgeDto,
	sourceNode: PersonaNodeDto | undefined,
): CSSProperties {
	const baseStyle = getEdgeStyle(edge, sourceNode);

	return {
		...baseStyle,
		strokeDasharray: "5 5",
	};
}

/**
 * Edge class names for different states
 */
export function getEdgeClassName(options: EdgeStyleOptions = {}): string {
	const { isHighlighted = false, isSelected = false, isAnimated = false } = options;

	const classes: string[] = ["graph-edge"];

	if (isHighlighted) classes.push("graph-edge--highlighted");
	if (isSelected) classes.push("graph-edge--selected");
	if (isAnimated) classes.push("graph-edge--animated");

	return classes.join(" ");
}

/**
 * Get all edges connected to a specific node
 */
export function getConnectedEdges(
	nodeId: string,
	edges: PersonaEdgeDto[],
): PersonaEdgeDto[] {
	return edges.filter((e) => e.source === nodeId || e.target === nodeId);
}

/**
 * Get edges that should be highlighted when a node is selected/hovered
 */
export function getHighlightedEdgeIds(
	nodeId: string | null,
	edges: PersonaEdgeDto[],
): string[] {
	if (!nodeId) return [];

	return edges
		.filter((e) => e.source === nodeId || e.target === nodeId)
		.map((e) => e.id);
}

/**
 * Calculate edge curvature for overlapping edges
 * Returns a value that can be used for React Flow's edge curvature
 */
export function calculateEdgeCurvature(
	sourceId: string,
	targetId: string,
	allEdges: PersonaEdgeDto[],
): number {
	// Count parallel edges between same nodes
	const parallelEdges = allEdges.filter(
		(e) =>
			(e.source === sourceId && e.target === targetId) ||
			(e.source === targetId && e.target === sourceId),
	);

	if (parallelEdges.length <= 1) return 0;

	// Return slight curvature for parallel edges
	const edgeIndex = parallelEdges.findIndex(
		(e) => e.source === sourceId && e.target === targetId,
	);

	return (edgeIndex - (parallelEdges.length - 1) / 2) * 0.2;
}

/**
 * Layer-to-layer edge styling presets
 */
export const EDGE_PRESETS = {
	// Profile to Angle edges (layer 0 -> 1)
	profileToAngle: {
		strokeDasharray: "none",
		markerEnd: "url(#arrow)",
	},
	// Angle to Story edges (layer 1 -> 2)
	angleToStory: {
		strokeDasharray: "none",
		markerEnd: "url(#arrow)",
	},
	// Story to Detail edges (layer 2 -> 3)
	storyToDetail: {
		strokeDasharray: "4 2",
		markerEnd: "none",
	},
} as const;

/**
 * Get edge preset based on source and target layers
 */
export function getEdgePreset(
	sourceLayer: LayerNumber,
	targetLayer: LayerNumber,
): (typeof EDGE_PRESETS)[keyof typeof EDGE_PRESETS] {
	if (sourceLayer === 0 && targetLayer === 1) {
		return EDGE_PRESETS.profileToAngle;
	}
	if (sourceLayer === 1 && targetLayer === 2) {
		return EDGE_PRESETS.angleToStory;
	}
	if (sourceLayer === 2 && targetLayer === 3) {
		return EDGE_PRESETS.storyToDetail;
	}
	return EDGE_PRESETS.angleToStory; // Default
}
