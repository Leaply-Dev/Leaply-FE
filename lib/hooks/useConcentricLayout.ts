"use client";

import { useCallback, useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import type {
	GraphNodeData,
	LayerNumber,
	PersonaEdgeDto,
	PersonaNodeDto,
	LAYER_CONFIGS,
} from "@/lib/types/persona-graph";

// Re-export layer config for convenience
export { LAYER_CONFIGS } from "@/lib/types/persona-graph";

// Layout configuration - Obsidian-style circular nodes
export const LAYOUT_CONFIG = {
	// Ring radii for each layer
	layerRadius: {
		0: 0, // Center
		1: 180, // Inner ring (closer for circular nodes)
		2: 320, // Outer ring
		3: 420, // Outermost ring (details)
	} as Record<LayerNumber, number>,

	// Node sizes for each layer (diameter for circular nodes)
	nodeSize: {
		0: 90, // Profile - 80-100px diameter
		1: 55, // Angles - 50-60px diameter
		2: 40, // Stories - 35-45px diameter
		3: 24, // Details - 20-25px diameter
	} as Record<LayerNumber, number>,

	// Node heights (same as width for circles)
	nodeHeight: {
		0: 90, // Circle - same as width
		1: 55,
		2: 40,
		3: 24,
	} as Record<LayerNumber, number>,

	// Colors per layer
	colors: {
		0: "#6366F1", // Indigo - profile
		1: "#8B5CF6", // Purple - angles
		2: "#10B981", // Emerald - stories
		3: "#94A3B8", // Slate - details
	} as Record<LayerNumber, string>,

	// Center offset for the canvas
	centerX: 0,
	centerY: 0,

	// Minimum angle between nodes on same ring (degrees)
	minAngleSpacing: 20,

	// Label configuration for external labels
	labelOffset: {
		0: 60, // Distance from node center to label
		1: 42,
		2: 32,
		3: 22,
	} as Record<LayerNumber, number>,

	// Font sizes for labels
	labelFontSize: {
		0: 12,
		1: 10,
		2: 9,
		3: 8,
	} as Record<LayerNumber, number>,

	// Max label characters before truncation
	labelMaxChars: {
		0: 20,
		1: 15,
		2: 12,
		3: 10,
	} as Record<LayerNumber, number>,
};

interface LayoutResult {
	nodes: Node<GraphNodeData>[];
	edges: Edge[];
}

interface CalculateLayoutOptions {
	centerX?: number;
	centerY?: number;
	selectedNodeId?: string | null;
	hoveredNodeId?: string | null;
	showAllDetails?: boolean;
	zoom?: number;
}

/**
 * Hook for calculating concentric ring layout for persona graph
 */
export function useConcentricLayout() {
	/**
	 * Calculate position on a ring given angle and radius
	 */
	const polarToCartesian = useCallback(
		(
			angle: number,
			radius: number,
			centerX: number,
			centerY: number,
		): { x: number; y: number } => {
			const radian = (angle * Math.PI) / 180;
			return {
				x: centerX + radius * Math.cos(radian),
				y: centerY + radius * Math.sin(radian),
			};
		},
		[],
	);

	/**
	 * Distribute nodes evenly on a ring
	 */
	const distributeOnRing = useCallback(
		(
			nodes: PersonaNodeDto[],
			radius: number,
			centerX: number,
			centerY: number,
			startAngle = 0,
		): Map<string, { x: number; y: number }> => {
			const positions = new Map<string, { x: number; y: number }>();

			if (nodes.length === 0) return positions;

			// Distribute evenly around the circle
			const angleStep = 360 / nodes.length;

			nodes.forEach((node, index) => {
				const angle = startAngle + index * angleStep;
				const pos = polarToCartesian(angle, radius, centerX, centerY);
				positions.set(node.id, pos);
			});

			return positions;
		},
		[polarToCartesian],
	);

	/**
	 * Group nodes by layer
	 */
	const groupNodesByLayer = useCallback(
		(nodes: PersonaNodeDto[]): Map<LayerNumber, PersonaNodeDto[]> => {
			const groups = new Map<LayerNumber, PersonaNodeDto[]>();

			// Initialize all layers
			([0, 1, 2, 3] as LayerNumber[]).forEach((layer) => {
				groups.set(layer, []);
			});

			nodes.forEach((node) => {
				const layerNodes = groups.get(node.layer) || [];
				layerNodes.push(node);
				groups.set(node.layer, layerNodes);
			});

			return groups;
		},
		[],
	);

	/**
	 * Find parent node ID for a given node based on edges
	 */
	const findParentNodeId = useCallback(
		(nodeId: string, edges: PersonaEdgeDto[]): string | null => {
			const edge = edges.find((e) => e.target === nodeId);
			return edge?.source || null;
		},
		[],
	);

	/**
	 * Check if a layer 3 (detail) node should be visible
	 */
	const isDetailNodeVisible = useCallback(
		(
			node: PersonaNodeDto,
			edges: PersonaEdgeDto[],
			selectedNodeId: string | null,
			hoveredNodeId: string | null,
			showAllDetails: boolean,
		): boolean => {
			if (node.layer !== 3) return true;
			if (showAllDetails) return true;

			const parentId = findParentNodeId(node.id, edges);
			if (!parentId) return false;

			return parentId === selectedNodeId || parentId === hoveredNodeId;
		},
		[findParentNodeId],
	);

	/**
	 * Position detail nodes around their parent story node
	 */
	const positionDetailNodes = useCallback(
		(
			detailNodes: PersonaNodeDto[],
			edges: PersonaEdgeDto[],
			storyPositions: Map<string, { x: number; y: number }>,
			centerX: number,
			centerY: number,
		): Map<string, { x: number; y: number }> => {
			const positions = new Map<string, { x: number; y: number }>();

			// Group details by their parent story
			const detailsByParent = new Map<string, PersonaNodeDto[]>();
			detailNodes.forEach((detail) => {
				const parentId = findParentNodeId(detail.id, edges);
				if (parentId) {
					const siblings = detailsByParent.get(parentId) || [];
					siblings.push(detail);
					detailsByParent.set(parentId, siblings);
				}
			});

			// Position each group around its parent
			detailsByParent.forEach((details, parentId) => {
				const parentPos = storyPositions.get(parentId);
				if (!parentPos) return;

				// Calculate angle from center to parent
				const dx = parentPos.x - centerX;
				const dy = parentPos.y - centerY;
				const parentAngle = Math.atan2(dy, dx) * (180 / Math.PI);

				// Spread details in an arc around the parent direction
				const spreadAngle = 30; // Degrees to spread
				const detailRadius = 80; // Distance from parent

				details.forEach((detail, index) => {
					const offsetAngle =
						spreadAngle * (index - (details.length - 1) / 2);
					const angle = parentAngle + offsetAngle;
					const pos = polarToCartesian(
						angle,
						detailRadius,
						parentPos.x,
						parentPos.y,
					);
					positions.set(detail.id, pos);
				});
			});

			return positions;
		},
		[findParentNodeId, polarToCartesian],
	);

	/**
	 * Main layout calculation function
	 */
	const calculateLayout = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
			options: CalculateLayoutOptions = {},
		): LayoutResult => {
			const {
				centerX = LAYOUT_CONFIG.centerX,
				centerY = LAYOUT_CONFIG.centerY,
				selectedNodeId = null,
				hoveredNodeId = null,
				showAllDetails = false,
				zoom = 1,
			} = options;

			// Group nodes by layer
			const nodesByLayer = groupNodesByLayer(apiNodes);

			// Calculate positions for each layer
			const allPositions = new Map<string, { x: number; y: number }>();

			// Layer 0: Center (profile summary)
			const layer0Nodes = nodesByLayer.get(0) || [];
			layer0Nodes.forEach((node) => {
				allPositions.set(node.id, { x: centerX, y: centerY });
			});

			// Layer 1: Inner ring (essay angles)
			const layer1Nodes = nodesByLayer.get(1) || [];
			const layer1Positions = distributeOnRing(
				layer1Nodes,
				LAYOUT_CONFIG.layerRadius[1],
				centerX,
				centerY,
				-90, // Start from top
			);
			layer1Positions.forEach((pos, id) => allPositions.set(id, pos));

			// Layer 2: Outer ring (key stories)
			const layer2Nodes = nodesByLayer.get(2) || [];
			const layer2Positions = distributeOnRing(
				layer2Nodes,
				LAYOUT_CONFIG.layerRadius[2],
				centerX,
				centerY,
				-90 + 15, // Slight offset from layer 1
			);
			layer2Positions.forEach((pos, id) => allPositions.set(id, pos));

			// Layer 3: Details - positioned around their parent stories
			const layer3Nodes = nodesByLayer.get(3) || [];
			const layer3Positions = positionDetailNodes(
				layer3Nodes,
				apiEdges,
				layer2Positions,
				centerX,
				centerY,
			);
			layer3Positions.forEach((pos, id) => allPositions.set(id, pos));

			// Convert to React Flow nodes
			const nodes: Node<GraphNodeData>[] = apiNodes.map((node) => {
				const position = allPositions.get(node.id) || { x: 0, y: 0 };
				const isVisible = isDetailNodeVisible(
					node,
					apiEdges,
					selectedNodeId,
					hoveredNodeId,
					showAllDetails,
				);

				// Count children for layer 2 nodes
				let childCount = 0;
				if (node.layer === 2) {
					childCount = apiEdges.filter((e) => e.source === node.id).length;
				}

				const nodeData: GraphNodeData = {
					...node,
					isSelected: node.id === selectedNodeId,
					isHovered: node.id === hoveredNodeId,
					isHighlighted: false,
					isVisible,
					zoom,
					childCount,
				};

				return {
					id: node.id,
					type: node.type, // Will map to custom node components
					position: {
						x: position.x - LAYOUT_CONFIG.nodeSize[node.layer] / 2,
						y: position.y - LAYOUT_CONFIG.nodeHeight[node.layer] / 2,
					},
					data: nodeData,
					hidden: !isVisible,
					style: {
						width: LAYOUT_CONFIG.nodeSize[node.layer],
						height: LAYOUT_CONFIG.nodeHeight[node.layer],
					},
				};
			});

			// Convert to React Flow edges - curved bezier style
			const edges: Edge[] = apiEdges.map((edge) => {
				const sourceNode = apiNodes.find((n) => n.id === edge.source);
				const targetNode = apiNodes.find((n) => n.id === edge.target);
				const sourceLayer = sourceNode?.layer ?? 1;
				const isDetailEdge = targetNode?.layer === 3;

				return {
					id: edge.id,
					source: edge.source,
					target: edge.target,
					type: "smoothstep", // Curved bezier edges
					animated: false,
					style: {
						stroke: LAYOUT_CONFIG.colors[sourceLayer as LayerNumber],
						// Thinner, more subtle strokes
						strokeWidth: isDetailEdge ? 0.5 + edge.strength * 0.5 : 0.75 + edge.strength * 1,
						// Lower opacity for subtlety
						opacity: isDetailEdge ? 0.15 + edge.strength * 0.25 : 0.2 + edge.strength * 0.3,
					},
				};
			});

			return { nodes, edges };
		},
		[
			groupNodesByLayer,
			distributeOnRing,
			positionDetailNodes,
			isDetailNodeVisible,
		],
	);

	/**
	 * Recalculate layout when a new node is added
	 */
	const recalculateOnAdd = useCallback(
		(
			newNode: PersonaNodeDto,
			existingNodes: PersonaNodeDto[],
			existingEdges: PersonaEdgeDto[],
			options: CalculateLayoutOptions = {},
		): LayoutResult => {
			const allNodes = [...existingNodes, newNode];
			return calculateLayout(allNodes, existingEdges, options);
		},
		[calculateLayout],
	);

	/**
	 * Get node size for a given layer
	 */
	const getNodeSize = useCallback(
		(layer: LayerNumber): { width: number; height: number } => ({
			width: LAYOUT_CONFIG.nodeSize[layer],
			height: LAYOUT_CONFIG.nodeHeight[layer],
		}),
		[],
	);

	/**
	 * Get color for a given layer
	 */
	const getLayerColor = useCallback((layer: LayerNumber): string => {
		return LAYOUT_CONFIG.colors[layer];
	}, []);

	return {
		calculateLayout,
		recalculateOnAdd,
		getNodeSize,
		getLayerColor,
		LAYOUT_CONFIG,
	};
}
