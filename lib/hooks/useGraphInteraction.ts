import { useCallback, useState } from "react";
import type { ForceGraphMethods, NodeObject } from "react-force-graph-2d";
import type {
	ApiForceGraphNode,
	ForceGraphLink,
} from "@/lib/utils/graphTransform";

// Node types in the graph (matching API)
type NodeType = "profile_summary" | "essay_angle" | "key_story" | "detail";

// Alias for backwards compatibility
type ForceGraphNode = ApiForceGraphNode;

interface UseGraphInteractionProps {
	graphData: {
		nodes: ForceGraphNode[];
		links: ForceGraphLink[];
	};
	fgRef: React.RefObject<ForceGraphMethods | undefined>;
	dimensions: { width: number; height: number };
}

export function useGraphInteraction({
	graphData,
	fgRef,
	dimensions,
}: UseGraphInteractionProps) {
	const [selectedNode, setSelectedNode] = useState<ForceGraphNode | null>(null);
	const [hoveredNode, setHoveredNode] = useState<ForceGraphNode | null>(null);
	const [hiddenNodeTypes, setHiddenNodeTypes] = useState<Set<NodeType>>(
		new Set(),
	);
	const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
	const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());

	// Node click handler with highlighting
	const handleNodeClick = useCallback(
		(node: NodeObject) => {
			const graphNode = node as unknown as ForceGraphNode;

			if (selectedNode?.id === graphNode.id) {
				setSelectedNode(null);
				setHighlightNodes(new Set());
				setHighlightLinks(new Set());
				// Zoom back to fit all nodes
				if (fgRef.current) {
					fgRef.current.zoomToFit(400, 50);
				}
				return;
			}

			setSelectedNode(graphNode);

			// Find connected nodes and links
			const connectedNodeIds = new Set<string>();
			const connectedLinkIds = new Set<string>();
			const connectedNodeObjects: NodeObject[] = [];

			// Add the selected node itself
			connectedNodeIds.add(graphNode.id);
			connectedNodeObjects.push(node);

			// Find all directly connected nodes
			graphData.links.forEach((link) => {
				const sourceId =
					typeof link.source === "object"
						? (link.source as ForceGraphNode).id
						: link.source;
				const targetId =
					typeof link.target === "object"
						? (link.target as ForceGraphNode).id
						: link.target;

				// Check if this link connects to the selected node
				if (sourceId === graphNode.id || targetId === graphNode.id) {
					// Add the link
					connectedLinkIds.add(`${sourceId}-${targetId}`);

					// Add the connected node (the one that's NOT the selected node)
					if (sourceId === graphNode.id) {
						connectedNodeIds.add(targetId);
						// Store the actual node object for zoom calculation
						if (typeof link.target === "object") {
							connectedNodeObjects.push(link.target);
						}
					} else {
						connectedNodeIds.add(sourceId);
						// Store the actual node object for zoom calculation
						if (typeof link.source === "object") {
							connectedNodeObjects.push(link.source);
						}
					}
				}
			});

			setHighlightNodes(connectedNodeIds);
			setHighlightLinks(connectedLinkIds);

			// Auto-zoom to the selected node and its connected nodes
			if (fgRef.current && connectedNodeObjects.length > 0) {
				// Calculate bounding box of all highlighted nodes
				let minX = Number.POSITIVE_INFINITY;
				let maxX = Number.NEGATIVE_INFINITY;
				let minY = Number.POSITIVE_INFINITY;
				let maxY = Number.NEGATIVE_INFINITY;

				connectedNodeObjects.forEach((n) => {
					const x = n.x || 0;
					const y = n.y || 0;
					const nodeSize = (n as unknown as ForceGraphNode).size || 10;

					minX = Math.min(minX, x - nodeSize);
					maxX = Math.max(maxX, x + nodeSize);
					minY = Math.min(minY, y - nodeSize);
					maxY = Math.max(maxY, y + nodeSize);
				});

				// Calculate center first
				const centerX = (minX + maxX) / 2;
				const centerY = (minY + maxY) / 2;

				// Calculate bounding box dimensions
				const width = maxX - minX;
				const height = maxY - minY;
				const canvasWidth = dimensions.width;
				const canvasHeight = dimensions.height;

				// Account for detail panel width (left side)
				const panelWidth = 400;
				const effectiveCanvasWidth = canvasWidth - panelWidth;

				// Calculate zoom to fit with padding
				const paddingFactor = 0.85;
				const zoomX = (effectiveCanvasWidth * paddingFactor) / width;
				const zoomY = (canvasHeight * paddingFactor) / height;
				const targetZoom = Math.min(zoomX, zoomY, 4);

				// Smoothly center and zoom to the highlighted region
				setTimeout(() => {
					if (fgRef.current) {
						const offsetX = centerX + panelWidth / (2 * targetZoom);
						fgRef.current.centerAt(offsetX, centerY, 600);

						setTimeout(() => {
							if (fgRef.current) {
								fgRef.current.zoom(targetZoom, 600);
							}
						}, 100);
					}
				}, 50);
			}
		},
		[selectedNode, graphData.links, dimensions, fgRef],
	);

	// Node hover handlers
	const handleNodeHover = useCallback((node: NodeObject | null) => {
		setHoveredNode(node as unknown as ForceGraphNode | null);
	}, []);

	// Background click handler to exit focus mode
	const handleBackgroundClick = useCallback(() => {
		if (selectedNode) {
			setSelectedNode(null);
			setHighlightNodes(new Set());
			setHighlightLinks(new Set());
			if (fgRef.current) {
				fgRef.current.zoomToFit(400, 50);
			}
		}
	}, [selectedNode, fgRef]);

	// Toggle node type visibility
	const toggleNodeTypeVisibility = useCallback((type: NodeType) => {
		setHiddenNodeTypes((prev) => {
			const next = new Set(prev);
			if (next.has(type)) {
				next.delete(type);
			} else {
				next.add(type);
			}
			return next;
		});
	}, []);

	return {
		selectedNode,
		hoveredNode,
		hiddenNodeTypes,
		highlightNodes,
		highlightLinks,
		handleNodeClick,
		handleNodeHover,
		handleBackgroundClick,
		toggleNodeTypeVisibility,
	};
}
