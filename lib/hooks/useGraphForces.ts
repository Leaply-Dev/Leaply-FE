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

		// Import d3-force module
		const d3 = require("d3-force");

		// Configure charge force (repulsion between nodes)
		fgRef.current.d3Force("charge")?.strength(-300);

		// Add collision force to prevent overlap
		const collideForce = d3.forceCollide((node: ForceGraphNode) => node.size + 15);
		fgRef.current.d3Force("collide", collideForce);

		// Add radial positioning force based on node layer
		const radialForce = d3
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
								return 120; // Inner ring - essay_angle
							case 2:
								return 200; // Middle ring - key_story
							case 3:
								return 300; // Outer ring - detail
							default:
								return 200;
						}
					}
					// Legacy node types (fallback for mock data)
					if (node.type === "archetype") return 0; // Center
					if (node.type === "pattern") return 120; // Inner ring
					if (node.type === "value" || node.type === "skill") return 200; // Middle ring
					if (node.type === "story") return 300; // Outer ring
					return 200;
				},
				0,
				0,
			)
			.strength(0.8);
		fgRef.current.d3Force("radial", radialForce);

		// Configure link force for better spacing
		fgRef.current.d3Force("link")?.distance(80);

		// Reheat simulation when data changes
		fgRef.current.d3ReheatSimulation();
	}, [graphData]);

	return { fgRef, graphData };
}
