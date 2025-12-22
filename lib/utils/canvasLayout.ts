import type { TrackId } from "@/lib/store/personaStore";
import { Position } from "@xyflow/react";

export type NodeLayer = "core" | "summary" | "evidence" | "insight";

export const CANVAS_CENTER = { x: 400, y: 300 };

// Diamond layout: Top, Right, Bottom, Left
// Each track has its own direction from center
export const TRACK_DIRECTIONS: Record<
	TrackId,
	{ angle: number; sourcePos: Position; targetPos: Position }
> = {
	future: { angle: -90, sourcePos: Position.Top, targetPos: Position.Bottom }, // Top
	academic: { angle: 0, sourcePos: Position.Right, targetPos: Position.Left }, // Right
	values: { angle: 90, sourcePos: Position.Bottom, targetPos: Position.Top }, // Bottom
	activities: { angle: 180, sourcePos: Position.Left, targetPos: Position.Right }, // Left
};

// Distance from center for each layer
const LAYER_DISTANCES = {
	summary: 280,
	evidence: 480,
	insight: 620,
};

// Node dimensions for centering calculations
const NODE_SIZES: Record<NodeLayer, { width: number; height: number }> = {
	core: { width: 180, height: 100 },
	summary: { width: 200, height: 80 },
	evidence: { width: 160, height: 70 },
	insight: { width: 150, height: 60 },
};

// Convert angle (degrees) to radians and calculate position
function polarToCartesian(
	centerX: number,
	centerY: number,
	distance: number,
	angleDegrees: number,
): { x: number; y: number } {
	const angleRadians = (angleDegrees * Math.PI) / 180;
	return {
		x: centerX + distance * Math.cos(angleRadians),
		y: centerY + distance * Math.sin(angleRadians),
	};
}

// Get perpendicular spread for evidence nodes
function getPerpendicularOffset(
	baseAngle: number,
	spreadIndex: number,
	spreadDistance: number,
): { dx: number; dy: number } {
	// Perpendicular angle is base + 90 degrees
	const perpAngle = ((baseAngle + 90) * Math.PI) / 180;
	const offset = (spreadIndex - 1) * spreadDistance; // -1, 0, 1 for indices 0, 1, 2
	return {
		dx: offset * Math.cos(perpAngle),
		dy: offset * Math.sin(perpAngle),
	};
}

export function calculateNodePosition(
	track: TrackId,
	layer: Exclude<NodeLayer, "core">,
	index: number = 0,
): { x: number; y: number } {
	const direction = TRACK_DIRECTIONS[track];
	const distance = LAYER_DISTANCES[layer];
	const nodeSize = NODE_SIZES[layer];

	// Calculate base position along the track's direction
	const basePos = polarToCartesian(
		CANVAS_CENTER.x,
		CANVAS_CENTER.y,
		distance,
		direction.angle,
	);

	// For evidence nodes, spread perpendicular to the main direction
	if (layer === "evidence" && index !== 1) {
		const spread = getPerpendicularOffset(direction.angle, index, 100);
		return {
			x: basePos.x + spread.dx - nodeSize.width / 2,
			y: basePos.y + spread.dy - nodeSize.height / 2,
		};
	}

	// Center the node on the calculated position
	return {
		x: basePos.x - nodeSize.width / 2,
		y: basePos.y - nodeSize.height / 2,
	};
}

export function getCoreNodePosition(): { x: number; y: number } {
	const nodeSize = NODE_SIZES.core;
	return {
		x: CANVAS_CENTER.x - nodeSize.width / 2,
		y: CANVAS_CENTER.y - nodeSize.height / 2,
	};
}

export function getHandlePositions(track: TrackId): {
	source: Position;
	target: Position;
} {
	return {
		source: TRACK_DIRECTIONS[track].sourcePos,
		target: TRACK_DIRECTIONS[track].targetPos,
	};
}

export interface EdgeConfig {
	id: string;
	source: string;
	target: string;
	type: string;
	animated?: boolean;
	sourceHandle?: string;
	targetHandle?: string;
	style?: {
		stroke: string;
		strokeWidth: number;
		strokeDasharray?: string;
	};
}

export function generateEdgesForTrack(
	trackId: TrackId,
	nodeIds: { summary?: string[]; evidence?: string[]; insight?: string[] },
	trackColor: string,
): EdgeConfig[] {
	const edges: EdgeConfig[] = [];
	const direction = TRACK_DIRECTIONS[trackId];

	// Connect core to summary node
	if (nodeIds.summary && nodeIds.summary.length > 0) {
		edges.push({
			id: `core-to-${nodeIds.summary[0]}`,
			source: "core",
			target: nodeIds.summary[0],
			sourceHandle: direction.sourcePos,
			targetHandle: direction.targetPos,
			type: "default", // Bezier curve
			style: {
				stroke: trackColor,
				strokeWidth: 2,
			},
		});
	}

	// Connect summary to evidence nodes
	if (nodeIds.summary && nodeIds.summary.length > 0 && nodeIds.evidence) {
		for (const evidenceId of nodeIds.evidence) {
			edges.push({
				id: `${nodeIds.summary[0]}-to-${evidenceId}`,
				source: nodeIds.summary[0],
				target: evidenceId,
				sourceHandle: direction.sourcePos,
				targetHandle: direction.targetPos,
				type: "default", // Bezier curve
				style: {
					stroke: `${trackColor}90`,
					strokeWidth: 1.5,
				},
			});
		}
	}

	// Connect summary to insight node (or last evidence to insight)
	if (nodeIds.insight && nodeIds.insight.length > 0) {
		const sourceNode =
			nodeIds.evidence && nodeIds.evidence.length > 0
				? nodeIds.evidence[Math.floor(nodeIds.evidence.length / 2)]
				: nodeIds.summary?.[0];

		if (sourceNode) {
			edges.push({
				id: `${sourceNode}-to-${nodeIds.insight[0]}`,
				source: sourceNode,
				target: nodeIds.insight[0],
				sourceHandle: direction.sourcePos,
				targetHandle: direction.targetPos,
				type: "default", // Bezier curve
				animated: true,
				style: {
					stroke: `${trackColor}70`,
					strokeWidth: 1.5,
					strokeDasharray: "4,4",
				},
			});
		}
	}

	return edges;
}

export function getNodeDimensions(layer: NodeLayer): {
	width: number;
	height: number;
} {
	return NODE_SIZES[layer];
}
