"use client";

import type { Edge, Node } from "@xyflow/react";
import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	type Simulation,
	type SimulationLinkDatum,
	type SimulationNodeDatum,
} from "d3-force";
import { useCallback, useRef, useState } from "react";
import type {
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/generated/api/models";

// Layer number type (0 = center, 3 = outermost)
export type LayerNumber = 0 | 1 | 2 | 3;

// Layer configuration for visual styling
export interface LayerConfig {
	radius: number;
	nodeSize: number;
	color: string;
	opacity: number;
}

export const LAYER_CONFIGS: Record<LayerNumber, LayerConfig> = {
	0: { radius: 0, nodeSize: 150, color: "#6366F1", opacity: 1.0 }, // Indigo - profile
	1: { radius: 180, nodeSize: 100, color: "#8B5CF6", opacity: 1.0 }, // Purple - angles
	2: { radius: 320, nodeSize: 70, color: "#10B981", opacity: 0.9 }, // Emerald - stories
	3: { radius: 460, nodeSize: 40, color: "#94A3B8", opacity: 0.7 }, // Slate - details
};

// Graph node data for React Flow
export interface GraphNodeData extends PersonaNodeDto {
	isSelected: boolean;
	isHovered: boolean;
	isHighlighted: boolean;
	isVisible: boolean;
	zoom: number;
	childCount?: number;
	[key: string]: unknown;
}

// Layout configuration - Obsidian-style
export const LAYOUT_CONFIG = {
	// Node sizes for each layer (diameter for circular nodes)
	nodeSize: {
		0: 90, // Profile - center node
		1: 55, // Angles - inner ring
		2: 40, // Stories - outer ring
		3: 24, // Details - smallest
	} as Record<LayerNumber, number>,

	// Colors per layer
	colors: {
		0: "#6366F1", // Indigo - profile
		1: "#8B5CF6", // Purple - angles
		2: "#10B981", // Emerald - stories
		3: "#94A3B8", // Slate - details
	} as Record<LayerNumber, string>,

	// Label configuration
	labelOffset: {
		0: 60,
		1: 42,
		2: 32,
		3: 22,
	} as Record<LayerNumber, number>,

	labelFontSize: {
		0: 12,
		1: 10,
		2: 9,
		3: 8,
	} as Record<LayerNumber, number>,

	labelMaxChars: {
		0: 20,
		1: 15,
		2: 12,
		3: 10,
	} as Record<LayerNumber, number>,

	// Force simulation parameters (Obsidian-like)
	forces: {
		centerStrength: 0.03, // Gentle pull toward center
		chargeStrength: -150, // Moderate repulsion between nodes
		linkDistance: 100, // Base link distance
		linkStrength: 0.7, // Strong link force to keep connected nodes together
		collideRadius: 30, // Collision radius
		alphaDecay: 0.015, // Slower cooling for better settling
		velocityDecay: 0.3, // Less friction for more natural movement
	},
};

// Force simulation node type
interface ForceNode extends SimulationNodeDatum {
	id: string;
	layer: LayerNumber;
	fx?: number | null; // Fixed x position
	fy?: number | null; // Fixed y position
}

// Force simulation link type
interface ForceLink extends SimulationLinkDatum<ForceNode> {
	id: string;
	strength: number;
}

interface LayoutResult {
	nodes: Node<GraphNodeData>[];
	edges: Edge[];
}

interface UseForceLayoutOptions {
	width?: number;
	height?: number;
	selectedNodeId?: string | null;
	hoveredNodeId?: string | null;
	showAllDetails?: boolean;
}

/**
 * Hook for calculating force-directed layout for persona graph (Obsidian-style)
 */
export function useForceLayout(options: UseForceLayoutOptions = {}) {
	const {
		width = 800,
		height = 600,
		selectedNodeId = null,
		hoveredNodeId = null,
		showAllDetails = false,
	} = options;

	const _simulationRef = useRef<Simulation<ForceNode, ForceLink> | null>(null);
	const [_positions, _setPositions] = useState<
		Map<string, { x: number; y: number }>
	>(new Map());

	/**
	 * Find parent node ID for a given node based on edges
	 */
	const findParentNodeId = useCallback(
		(nodeId: string | undefined, edges: PersonaEdgeDto[]): string | null => {
			if (!nodeId) return null;
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
			selectedId: string | null,
			hoveredId: string | null,
			showAll: boolean,
		): boolean => {
			if ((node.layer ?? 3) !== 3) return true;
			if (showAll) return true;

			const parentId = findParentNodeId(node.id, edges);
			if (!parentId) return false;

			return parentId === selectedId || parentId === hoveredId;
		},
		[findParentNodeId],
	);

	/**
	 * Create edges including center-to-all-stories connections
	 */
	const createEdgesWithCenterConnections = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
		): PersonaEdgeDto[] => {
			const edges = [...apiEdges];

			// Find center node (layer 0)
			const centerNode = apiNodes.find((n) => (n.layer ?? 3) === 0);
			if (!centerNode || !centerNode.id) return edges;

			// Add edges from center to all layer 2 (key story) nodes
			const layer2Nodes = apiNodes.filter((n) => (n.layer ?? 3) === 2);
			layer2Nodes.forEach((storyNode) => {
				if (!storyNode.id) return;
				// Check if edge already exists
				const exists = edges.some(
					(e) =>
						(e.source === centerNode.id && e.target === storyNode.id) ||
						(e.target === centerNode.id && e.source === storyNode.id),
				);
				if (!exists) {
					edges.push({
						id: `center-${storyNode.id}`,
						source: centerNode.id,
						target: storyNode.id,
						strength: 0.5,
						createdAt: new Date().toISOString(),
					});
				}
			});

			return edges;
		},
		[],
	);

	/**
	 * Run force simulation and return positions
	 */
	const runSimulation = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
			centerX: number,
			centerY: number,
		): Map<string, { x: number; y: number }> => {
			// Create edges with center connections
			const allEdges = createEdgesWithCenterConnections(apiNodes, apiEdges);

			// Create force nodes
			const forceNodes: ForceNode[] = apiNodes
				.filter((node) => node.id) // Filter out nodes without IDs
				.map((node) => {
					const layer = (node.layer ?? 3) as LayerNumber;
					// Center node is fixed at center
					if (layer === 0) {
						return {
							id: node.id as string,
							layer,
							x: centerX,
							y: centerY,
							fx: centerX, // Fixed position
							fy: centerY,
						};
					}
					// Other nodes start with random positions around center
					const angle = Math.random() * Math.PI * 2;
					const radius = 100 + layer * 80 + Math.random() * 50;
					return {
						id: node.id as string,
						layer,
						x: centerX + Math.cos(angle) * radius,
						y: centerY + Math.sin(angle) * radius,
					};
				});

			// Create force links (filter out edges without required fields)
			const forceLinks: ForceLink[] = allEdges
				.filter((edge) => edge.id && edge.source && edge.target)
				.map((edge) => ({
					// We already filtered for these fields above, so they're guaranteed to exist
					id: edge.id as string,
					source: edge.source as string,
					target: edge.target as string,
					strength: edge.strength ?? 1,
				}));

			// Create node map for quick lookup
			const nodeMap = new Map(forceNodes.map((n) => [n.id, n]));

			// Calculate link distance based on layers
			const getLinkDistance = (link: ForceLink): number => {
				const sourceNode =
					typeof link.source === "string"
						? nodeMap.get(link.source)
						: (link.source as ForceNode);
				const targetNode =
					typeof link.target === "string"
						? nodeMap.get(link.target)
						: (link.target as ForceNode);

				if (!sourceNode || !targetNode)
					return LAYOUT_CONFIG.forces.linkDistance;

				// Shorter distance for center connections
				if (sourceNode.layer === 0 || targetNode.layer === 0) {
					return LAYOUT_CONFIG.forces.linkDistance * 1.2;
				}
				// Layer 2 to layer 3 connections (detail nodes)
				if (sourceNode.layer === 2 && targetNode.layer === 3) {
					return LAYOUT_CONFIG.forces.linkDistance * 0.6;
				}
				return LAYOUT_CONFIG.forces.linkDistance;
			};

			// Create and run simulation
			const simulation = forceSimulation<ForceNode>(forceNodes)
				.force(
					"link",
					forceLink<ForceNode, ForceLink>(forceLinks)
						.id((d) => d.id)
						.distance(getLinkDistance)
						.strength(LAYOUT_CONFIG.forces.linkStrength),
				)
				.force(
					"charge",
					forceManyBody<ForceNode>().strength((d) => {
						// Stronger repulsion for larger nodes
						const baseStrength = LAYOUT_CONFIG.forces.chargeStrength;
						if (d.layer === 0) return baseStrength * 2;
						if (d.layer === 3) return baseStrength * 0.3;
						return baseStrength;
					}),
				)
				.force(
					"center",
					forceCenter<ForceNode>(centerX, centerY).strength(
						LAYOUT_CONFIG.forces.centerStrength,
					),
				)
				.force(
					"collide",
					forceCollide<ForceNode>()
						.radius((d) => LAYOUT_CONFIG.nodeSize[d.layer] / 2 + 15)
						.strength(0.8),
				)
				.alphaDecay(LAYOUT_CONFIG.forces.alphaDecay)
				.velocityDecay(LAYOUT_CONFIG.forces.velocityDecay);

			// Run simulation synchronously for initial layout
			// More iterations = better settling, but slower initial render
			simulation.tick(500);
			simulation.stop();

			// Extract positions
			const newPositions = new Map<string, { x: number; y: number }>();
			forceNodes.forEach((node) => {
				newPositions.set(node.id, {
					x: node.x ?? centerX,
					y: node.y ?? centerY,
				});
			});

			return newPositions;
		},
		[createEdgesWithCenterConnections],
	);

	/**
	 * Main layout calculation function
	 */
	const calculateLayout = useCallback(
		(
			apiNodes: PersonaNodeDto[],
			apiEdges: PersonaEdgeDto[],
			layoutOptions: {
				centerX?: number;
				centerY?: number;
				selectedNodeId?: string | null;
				hoveredNodeId?: string | null;
				showAllDetails?: boolean;
				zoom?: number;
			} = {},
		): LayoutResult => {
			const {
				centerX = width / 2,
				centerY = height / 2,
				selectedNodeId: selId = selectedNodeId,
				hoveredNodeId: hovId = hoveredNodeId,
				showAllDetails: showAll = showAllDetails,
				zoom = 1,
			} = layoutOptions;

			// Run force simulation
			const nodePositions = runSimulation(apiNodes, apiEdges, centerX, centerY);

			// Create edges with center connections
			const allEdges = createEdgesWithCenterConnections(apiNodes, apiEdges);

			// Convert to React Flow nodes
			const nodes: Node<GraphNodeData>[] = apiNodes
				.filter((node) => node.id) // Filter out nodes without IDs
				.map((node) => {
					const nodeId = node.id as string;
					const layer = (node.layer ?? 3) as LayerNumber;
					const position = nodePositions.get(nodeId) || {
						x: centerX,
						y: centerY,
					};
					const isVisible = isDetailNodeVisible(
						node,
						apiEdges,
						selId,
						hovId,
						showAll,
					);

					// Count children for layer 2 nodes
					let childCount = 0;
					if (layer === 2) {
						childCount = apiEdges.filter((e) => e.source === nodeId).length;
					}

					const nodeData: GraphNodeData = {
						...node,
						isSelected: nodeId === selId,
						isHovered: nodeId === hovId,
						isHighlighted: false,
						isVisible,
						zoom,
						childCount,
					};

					return {
						id: nodeId,
						type: node.type,
						position: {
							x: position.x - LAYOUT_CONFIG.nodeSize[layer] / 2,
							y: position.y - LAYOUT_CONFIG.nodeSize[layer] / 2,
						},
						data: nodeData,
						hidden: !isVisible,
						style: {
							width: LAYOUT_CONFIG.nodeSize[layer],
							height: LAYOUT_CONFIG.nodeSize[layer],
						},
					};
				});

			// Convert to React Flow edges - simple straight lines like Obsidian
			const edges: Edge[] = allEdges
				.filter((edge) => edge.id && edge.source && edge.target) // Filter out incomplete edges
				.map((edge) => {
					const sourceNode = apiNodes.find((n) => n.id === edge.source);
					const targetNode = apiNodes.find((n) => n.id === edge.target);
					const isDetailEdge = (targetNode?.layer ?? 3) === 3;
					const isCenterEdge = (sourceNode?.layer ?? 3) === 0;

					// Obsidian uses a consistent neutral color for all edges
					const edgeColor = "#94a3b8"; // Slate-400 - subtle gray

					return {
						id: edge.id as string,
						source: edge.source as string,
						target: edge.target as string,
						type: "straight", // Simple straight lines like Obsidian
						animated: false,
						style: {
							stroke: edgeColor,
							strokeWidth: isDetailEdge ? 0.75 : 1,
							opacity: isDetailEdge ? 0.4 : isCenterEdge ? 0.5 : 0.6,
						},
					};
				});

			return { nodes, edges };
		},
		[
			width,
			height,
			selectedNodeId,
			hoveredNodeId,
			showAllDetails,
			runSimulation,
			createEdgesWithCenterConnections,
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
			layoutOptions: {
				centerX?: number;
				centerY?: number;
				selectedNodeId?: string | null;
				hoveredNodeId?: string | null;
				showAllDetails?: boolean;
				zoom?: number;
			} = {},
		): LayoutResult => {
			const allNodes = [...existingNodes, newNode];
			return calculateLayout(allNodes, existingEdges, layoutOptions);
		},
		[calculateLayout],
	);

	/**
	 * Get node size for a given layer
	 */
	const getNodeSize = useCallback(
		(layer: number): { width: number; height: number } => {
			const validLayer = (
				[0, 1, 2, 3].includes(layer) ? layer : 3
			) as LayerNumber;
			return {
				width: LAYOUT_CONFIG.nodeSize[validLayer],
				height: LAYOUT_CONFIG.nodeSize[validLayer],
			};
		},
		[],
	);

	/**
	 * Get color for a given layer
	 */
	const getLayerColor = useCallback((layer: number): string => {
		const validLayer = (
			[0, 1, 2, 3].includes(layer) ? layer : 3
		) as LayerNumber;
		return LAYOUT_CONFIG.colors[validLayer];
	}, []);

	return {
		calculateLayout,
		recalculateOnAdd,
		getNodeSize,
		getLayerColor,
		LAYOUT_CONFIG,
	};
}
