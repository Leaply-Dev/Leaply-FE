import { useEffect, useRef, useState } from "react";
import type { ForceGraphMethods } from "react-force-graph-2d";
import { usePersonaStore } from "@/lib/store/personaStore";
import type {
	ForceGraphLink,
	ForceGraphNode,
} from "@/lib/types/persona-canvas";
import { transformApiGraphData } from "@/lib/utils/graphTransform";

/**
 * Hook to manage graph data and D3 force configuration
 * Uses real-time API graph data from the store
 * Returns ref and graph data for ForceGraph2D component
 */
export function useGraphForces() {
	const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
	const [graphData, setGraphData] = useState<{
		nodes: ForceGraphNode[];
		links: ForceGraphLink[];
	}>({ nodes: [], links: [] });

	// Subscribe to API graph data from store
	const apiGraphNodes = usePersonaStore((state) => state.apiGraphNodes);
	const apiGraphEdges = usePersonaStore((state) => state.apiGraphEdges);

	// Transform API data to ForceGraph format when available
	useEffect(() => {
		if (apiGraphNodes.length > 0) {
			// Transform API data to ForceGraph format
			const { nodes, links } = transformApiGraphData(
				apiGraphNodes,
				apiGraphEdges,
			);
			setGraphData({ nodes, links });
		} else {
			// No API data - show empty graph
			setGraphData({ nodes: [], links: [] });
		}
	}, [apiGraphNodes, apiGraphEdges]);

	// Configure forces when data changes or ref becomes available
	useEffect(() => {
		if (!fgRef.current) return;

		// Configure custom forces for hierarchical layout
		// Add radial force to push nodes outward from center based on layer
		fgRef.current.d3Force("charge")?.strength(-400);

		// Add collision force to prevent overlap
		fgRef.current.d3Force("collide", () => {
			const d3 = require("d3-force");
			return d3.forceCollide((node: ForceGraphNode) => node.size + 5);
		});

		// Add radial positioning force based on node type/layer
		fgRef.current.d3Force("radial", () => {
			const d3 = require("d3-force");
			return d3
				.forceRadial(
					(node: ForceGraphNode) => {
						// New API node types use layer property
						const nodeData = node as ForceGraphNode & { layer?: number };
						if (nodeData.layer !== undefined) {
							// Layer-based radial distance for new API nodes
							switch (nodeData.layer) {
								case 0:
									return 0; // Center - profile_summary
								case 1:
									return 150; // Inner ring - essay_angle
								case 2:
									return 280; // Middle ring - key_story
								case 3:
									return 450; // Outer ring - detail
								default:
									return 300;
							}
						}
						// Legacy node types (fallback for mock data)
						if (node.type === "archetype") return 0; // Center
						if (node.type === "pattern") return 150; // Inner ring
						if (node.type === "value" || node.type === "skill") return 280; // Middle ring
						if (node.type === "story") return 450; // Outer ring
						return 300;
					},
					0,
					0,
				)
				.strength(0.8);
		});

		// Reheat simulation when data changes
		fgRef.current.d3ReheatSimulation();
	}, [graphData]);

	return { fgRef, graphData };
}
