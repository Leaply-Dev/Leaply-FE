import * as d3Force from "d3-force";
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
	// biome-ignore lint/correctness/useExhaustiveDependencies: graphData triggers simulation reheat
	useEffect(() => {
		if (!fgRef.current) return;

		// Configure charge force (repulsion between nodes) - strong for better separation
		fgRef.current.d3Force("charge")?.strength(-600);

		// Add collision force to prevent overlap - larger radius for smaller nodes
		const collideForce = d3Force.forceCollide((node) => {
			const graphNode = node as ForceGraphNode;
			// Ensure minimum collision radius for small nodes (detail nodes)
			const minRadius = 40;
			return Math.max(graphNode.size * 2.5 + 30, minRadius);
		});
		fgRef.current.d3Force("collide", collideForce);

		// Add radial positioning force based on node layer
		const radialForce = d3Force
			.forceRadial(
				(node) => {
					const graphNode = node as ForceGraphNode & { layer?: number };
					// New API node types use layer property
					if (graphNode.layer !== undefined) {
						// Layer-based radial distance for new API nodes
						switch (graphNode.layer) {
							case 0:
								return 0; // Center - profile_summary
							case 1:
								return 150; // Inner ring - essay_angle
							case 2:
								return 280; // Middle ring - key_story
							case 3:
								return 420; // Outer ring - detail
							default:
								return 280;
						}
					}
					// Legacy node types (fallback for mock data)
					if (graphNode.type === "archetype") return 0; // Center
					if (graphNode.type === "pattern") return 150; // Inner ring
					if (graphNode.type === "value" || graphNode.type === "skill")
						return 280; // Middle ring
					if (graphNode.type === "story") return 420; // Outer ring
					return 280;
				},
				0,
				0,
			)
			.strength(0.8);
		fgRef.current.d3Force("radial", radialForce);

		// Configure link force for better spacing - increased distance
		fgRef.current.d3Force("link")?.distance(150);

		// Reheat simulation when data changes
		fgRef.current.d3ReheatSimulation();
	}, [graphData]);

	return { fgRef, graphData };
}
