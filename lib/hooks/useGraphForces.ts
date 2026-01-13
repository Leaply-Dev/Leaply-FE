import * as d3Force from "d3-force";
import { useEffect, useRef, useState } from "react";
import type { ForceGraphMethods } from "react-force-graph-2d";
import type { PersonaNodeDto } from "@/lib/generated/api/models";
import { usePersonaStore } from "@/lib/store/personaStore";
import {
	type ApiForceGraphNode,
	type ForceGraphLink,
	transformApiGraphData,
} from "@/lib/utils/graphTransform";

/**
 * Hook to manage graph data and D3 force configuration
 * Uses real-time API graph data from the store
 * Returns ref and graph data for ForceGraph2D component
 */
export function useGraphForces() {
	const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
	const [graphData, setGraphData] = useState<{
		nodes: ApiForceGraphNode[];
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

			// Check if profile_summary exists, if not add skeleton profile
			const hasProfileSummary = nodes.some((n) => n.type === "profile_summary");
			if (!hasProfileSummary) {
				const skeletonNodeData: PersonaNodeDto = {
					id: "skeleton-profile",
					type: "profile_summary",
					layer: 0,
					title: "Your Profile",
					content: "Keep chatting to build your profile",
					tags: [],
				};
				nodes.unshift({
					id: "skeleton-profile",
					label: "Your Profile",
					type: "profile_summary",
					layer: 0,
					size: 24,
					color: "#f59e0b",
					data: skeletonNodeData,
					nodeData: skeletonNodeData,
				});
			}

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

		// Add collision force to prevent overlap - increased radius to account for labels
		const collideForce = d3Force.forceCollide((node) => {
			const graphNode = node as ApiForceGraphNode;
			// Larger collision radius to prevent label overlap
			// For detail nodes (size=8): Math.max(8*3+50, 70) = 74px
			const minRadius = 70;
			return Math.max(graphNode.size * 3 + 50, minRadius);
		});
		fgRef.current.d3Force("collide", collideForce);

		// Add radial positioning force based on node layer
		const radialForce = d3Force
			.forceRadial(
				(node) => {
					const graphNode = node as ApiForceGraphNode;
					// Layer-based radial distance for new API nodes
					switch (graphNode.layer) {
						case 0:
							return 0; // Center - profile_summary
						case 1:
							return 150; // Inner ring - essay_angle
						case 2:
							return 280; // Middle ring - key_story
						case 3: {
							// Outer ring - detail with jitter to spread nodes
							// Add variance based on node id hash to prevent clustering
							const hash = graphNode.id
								.split("")
								.reduce((a, c) => a + c.charCodeAt(0), 0);
							const jitter = (hash % 80) - 40; // -40 to +40 variance
							return 420 + jitter;
						}
						default:
							return 280;
					}
				},
				0,
				0,
			)
			.strength(0.8);
		fgRef.current.d3Force("radial", radialForce);

		// Configure link force - increased distance and reduced strength to prevent clustering
		fgRef.current.d3Force("link")?.distance(180).strength(0.3);

		// Reheat simulation when data changes
		fgRef.current.d3ReheatSimulation();
	}, [graphData]);

	return { fgRef, graphData };
}
