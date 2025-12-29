"use client";

import type { Edge, Node } from "@xyflow/react";
import ELK, {
	type ElkExtendedEdge,
	type ElkNode,
} from "elkjs/lib/elk.bundled.js";
import { useCallback, useMemo, useRef } from "react";
import type { NodeType, TrackId } from "@/lib/types/persona";

// Layer depths for the 3-layer system
export const LAYER_DEPTHS = {
	story: 0,
	evidence: 1,
	insight: 2,
} as const;

export type LayerType = keyof typeof LAYER_DEPTHS;

// Node dimensions for layout calculation
export const NODE_DIMENSIONS = {
	archetype: { width: 200, height: 160 },
	summary: { width: 200, height: 100 },
	story: { width: 180, height: 80 },
	evidence: { width: 160, height: 70 },
	insight: { width: 180, height: 80 },
} as const;

// Distance from center for each layer zone (concentric circles around track)
export const LAYER_DISTANCES = {
	story: 180, // Closest to summary node
	evidence: 280, // Middle layer
	insight: 380, // Furthest layer
} as const;

// ELK options optimized for layered graph with clear hierarchy
const ELK_OPTIONS = {
	"elk.algorithm": "layered",
	"elk.direction": "RIGHT", // Will be rotated per track
	"elk.layered.spacing.nodeNodeBetweenLayers": "80",
	"elk.spacing.nodeNode": "40",
	"elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
	"elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
	"elk.edgeRouting": "ORTHOGONAL",
	"elk.partitioning.activate": "true",
	"elk.hierarchyHandling": "INCLUDE_CHILDREN",
};

interface ElkLayoutInput {
	nodes: Node[];
	edges: Edge[];
	trackId: TrackId;
	trackAngle: number; // Angle of track from center (in degrees)
	trackPosition: { x: number; y: number }; // Position of the track summary node
}

interface ElkLayoutOutput {
	nodes: Node[];
	edges: Edge[];
}

// Position for pending nodes (will animate from here)
export interface PendingNodePosition {
	nodeId: string;
	targetPosition: { x: number; y: number };
	sourcePosition: { x: number; y: number }; // Position to animate from (parent)
}

export function useElkLayout() {
	const elkRef = useRef<InstanceType<typeof ELK> | null>(null);

	// Lazy initialize ELK instance
	const getElk = useCallback(() => {
		if (!elkRef.current) {
			elkRef.current = new ELK();
		}
		return elkRef.current;
	}, []);

	/**
	 * Calculate positions for child nodes of a track using ELK.
	 * Child nodes are positioned in concentric arcs around the track summary node.
	 */
	const calculateTrackChildLayout = useCallback(
		async (input: ElkLayoutInput): Promise<ElkLayoutOutput> => {
			const elk = getElk();
			const { nodes, edges, trackId, trackAngle, trackPosition } = input;

			// Filter nodes that belong to this track
			const childNodes = nodes.filter(
				(node) =>
					node.data?.sourceTrackId === trackId &&
					["story", "evidence", "insight"].includes(node.type ?? ""),
			);

			if (childNodes.length === 0) {
				return { nodes, edges };
			}

			// Group nodes by layer
			const nodesByLayer: Record<LayerType, Node[]> = {
				story: [],
				evidence: [],
				insight: [],
			};

			for (const node of childNodes) {
				const nodeType = node.type as LayerType;
				if (nodeType in nodesByLayer) {
					nodesByLayer[nodeType].push(node);
				}
			}

			// Build ELK graph with partitions for each layer
			const elkChildren: ElkNode[] = [];
			const elkEdges: ElkExtendedEdge[] = [];

			for (const [layer, layerNodes] of Object.entries(nodesByLayer) as [
				LayerType,
				Node[],
			][]) {
				const partition = LAYER_DEPTHS[layer];
				const dims = NODE_DIMENSIONS[layer];

				for (const node of layerNodes) {
					elkChildren.push({
						id: node.id,
						width: dims.width,
						height: dims.height,
						layoutOptions: {
							"elk.partitioning.partition": String(partition),
						},
					});
				}
			}

			// Add edges between related nodes
			for (const edge of edges) {
				const sourceInTrack = childNodes.some((n) => n.id === edge.source);
				const targetInTrack = childNodes.some((n) => n.id === edge.target);
				if (sourceInTrack && targetInTrack) {
					elkEdges.push({
						id: edge.id,
						sources: [edge.source],
						targets: [edge.target],
					});
				}
			}

			if (elkChildren.length === 0) {
				return { nodes, edges };
			}

			// Calculate ELK layout
			const elkGraph: ElkNode = {
				id: `track-${trackId}`,
				children: elkChildren,
				edges: elkEdges,
				layoutOptions: ELK_OPTIONS,
			};

			try {
				const layoutedGraph = await elk.layout(elkGraph);

				// Transform ELK positions to canvas positions (polar coordinates around track)
				const updatedNodes = [...nodes];

				for (const elkNode of layoutedGraph.children ?? []) {
					const nodeIndex = updatedNodes.findIndex((n) => n.id === elkNode.id);
					if (nodeIndex === -1) continue;

					const originalNode = updatedNodes[nodeIndex];
					const nodeType = originalNode.type as LayerType;
					const layerDistance = LAYER_DISTANCES[nodeType] ?? 200;

					// Calculate position in arc around track
					// ELK y position maps to angle offset, ELK x position maps to distance variation
					const elkX = elkNode.x ?? 0;
					const elkY = elkNode.y ?? 0;

					// Normalize ELK positions to create arc positions
					const angleOffset =
						(elkY / 100 - nodesByLayer[nodeType].length / 2) * 15; // ±15 degrees spread
					const distanceVariation = elkX / 2; // Slight distance variation based on ELK x

					const finalAngle = trackAngle + angleOffset;
					const finalDistance = layerDistance + distanceVariation;

					// Convert polar to cartesian (relative to track position center reference)
					const radians = (finalAngle * Math.PI) / 180;
					const dims = NODE_DIMENSIONS[nodeType];

					const position = {
						x:
							trackPosition.x +
							Math.cos(radians) * finalDistance -
							dims.width / 2,
						y:
							trackPosition.y +
							Math.sin(radians) * finalDistance -
							dims.height / 2,
					};

					updatedNodes[nodeIndex] = {
						...originalNode,
						position,
						data: {
							...originalNode.data,
							layer: nodeType,
							layerDepth: LAYER_DEPTHS[nodeType],
						},
					};
				}

				return { nodes: updatedNodes, edges };
			} catch (error) {
				console.error("ELK layout calculation failed:", error);
				return { nodes, edges };
			}
		},
		[getElk],
	);

	/**
	 * Calculate layout for all tracks' child nodes.
	 * Keeps archetype and summary nodes at fixed positions.
	 */
	const calculateFullLayout = useCallback(
		async (
			nodes: Node[],
			edges: Edge[],
			trackPositions: Record<TrackId, { x: number; y: number; angle: number }>,
		): Promise<ElkLayoutOutput> => {
			let resultNodes = [...nodes];
			let resultEdges = [...edges];

			// Process each track's children
			const trackIds: TrackId[] = [
				"future_vision",
				"academic_journey",
				"values_turning_points",
				"activities_impact",
			];

			for (const trackId of trackIds) {
				const trackPos = trackPositions[trackId];
				if (!trackPos) continue;

				const result = await calculateTrackChildLayout({
					nodes: resultNodes,
					edges: resultEdges,
					trackId,
					trackAngle: trackPos.angle,
					trackPosition: { x: trackPos.x, y: trackPos.y },
				});

				resultNodes = result.nodes;
				resultEdges = result.edges;
			}

			return { nodes: resultNodes, edges: resultEdges };
		},
		[calculateTrackChildLayout],
	);

	/**
	 * Get the spawn position for a new node (from parent track summary node).
	 * Used for animation: nodes animate from parent to their calculated position.
	 */
	const getNodeSpawnPosition = useCallback(
		(
			nodeId: string,
			sourceTrackId: TrackId,
			trackPositions: Record<TrackId, { x: number; y: number }>,
		): { x: number; y: number } => {
			const trackPos = trackPositions[sourceTrackId];
			if (trackPos) {
				return { x: trackPos.x, y: trackPos.y };
			}
			return { x: 0, y: 0 };
		},
		[],
	);

	return {
		calculateFullLayout,
		calculateTrackChildLayout,
		getNodeSpawnPosition,
		LAYER_DEPTHS,
		LAYER_DISTANCES,
		NODE_DIMENSIONS,
	};
}
