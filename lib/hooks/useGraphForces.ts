import { useEffect, useRef, useState } from "react";
import type { ForceGraphMethods } from "react-force-graph-2d";
import type {
	ForceGraphLink,
	ForceGraphNode,
} from "@/lib/types/persona-canvas";
import { transformGraphData } from "@/lib/utils/graphTransform";

/**
 * Hook to manage graph data and D3 force configuration
 * Returns ref and graph data for ForceGraph2D component
 */
export function useGraphForces() {
	const fgRef = useRef<ForceGraphMethods | undefined>(undefined);
	const [graphData, setGraphData] = useState<{
		nodes: ForceGraphNode[];
		links: ForceGraphLink[];
	}>({ nodes: [], links: [] });

	// Load data on mount and configure forces
	useEffect(() => {
		const data = transformGraphData();
		setGraphData(data);

		// Configure custom forces for hierarchical layout
		if (fgRef.current) {
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
							// Layer-based radial distance
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
		}
	}, []);

	return { fgRef, graphData };
}
