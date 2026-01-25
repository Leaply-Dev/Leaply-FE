import * as d3Force from "d3-force";
import { useEffect, useRef, useState } from "react";
import type { ForceGraphMethods } from "react-force-graph-2d";
import type { PersonaNodeDto } from "@/lib/generated/api/models";
import { useGetGraph } from "@/lib/hooks/persona";
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

	// Fetch graph data from server to ensure sync on mount
	const { data: graphResponse } = useGetGraph();

	// Subscribe to API graph data from store
	const apiGraphNodes = usePersonaStore((state) => state.apiGraphNodes);
	const apiGraphEdges = usePersonaStore((state) => state.apiGraphEdges);

	// Sync graph data from server on mount/refetch
	// This ensures localStorage data is reconciled with server state
	// Note: On success (status 200), data is PersonaGraphResponse with nodes/edges directly
	useEffect(() => {
		if (graphResponse?.status === 200) {
			const graphData = graphResponse.data;
			if (graphData?.nodes && graphData?.edges) {
				usePersonaStore.getState().syncGraph(graphData.nodes, graphData.edges);
			}
		}
	}, [graphResponse]);

	// Transform API data to ForceGraph format when available
	useEffect(() => {
		if (apiGraphNodes.length > 0) {
			// Transform API data to ForceGraph format
			const { nodes, links } = transformApiGraphData(
				apiGraphNodes,
				apiGraphEdges,
			);

			// Debug: Log transformed nodes
			console.log("[useGraphForces] Transformed nodes:", {
				count: nodes.length,
				ids: nodes.map((n) => n.id),
				positions: nodes.map((n) => ({
					id: n.id.substring(0, 8),
					x: n.x !== undefined ? n.x.toFixed(0) : "undef",
					y: n.y !== undefined ? n.y.toFixed(0) : "undef",
					size: n.size,
				})),
			});

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
					x: 0,
					y: 0,
				});

				// CRITICAL FIX: Connect all story nodes to the skeleton root
				// When server doesn't have profile_summary, stories need to connect to mock root
				const storyNodes = nodes.filter((n) => n.type === "key_story");
				for (const story of storyNodes) {
					links.push({
						source: "skeleton-profile",
						target: story.id,
						type: "supports",
						strength: 80, // Base strength for skeleton connections
						color: "rgba(139, 92, 246, 0.3)", // violet
						animated: false,
						pulseColor: undefined,
						edgeType: "connection",
						label: "supports",
						width: 2,
					});
				}
			}

			// Debug: Log final graph data
			console.log("[useGraphForces] Final graphData:", {
				nodeCount: nodes.length,
				linkCount: links.length,
			});

			setGraphData({ nodes, links });
		} else {
			// No API data - show empty graph
			setGraphData({ nodes: [], links: [] });
		}
	}, [apiGraphNodes, apiGraphEdges]);

	// Debug: Log node positions after simulation settles
	useEffect(() => {
		if (graphData.nodes.length === 0) return;

		// Log positions after a short delay to let simulation run
		const timer = setTimeout(() => {
			console.log(
				"[useGraphForces] Node positions after simulation:",
				graphData.nodes.map((n) => ({
					id: n.id.substring(0, 8),
					type: n.type,
					x: n.x?.toFixed(0) ?? "undef",
					y: n.y?.toFixed(0) ?? "undef",
					size: n.size,
				})),
			);
		}, 2000);

		return () => clearTimeout(timer);
	}, [graphData]);

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

		// ============================================================================
		// GRAPH LAYER HIERARCHY - Concentric Circle Layout
		// ============================================================================
		// Layer 0 (CENTER)   - Profile Summary: User's core identity/archetype
		// Layer 1 (INNER)    - Essay Angles: Thematic patterns for essays
		// Layer 2 (MIDDLE)   - Stories: Key narratives with STAR structure
		// Layer 3 (OUTER)    - Details: Specific evidence and achievements
		// ============================================================================

		// Add radial positioning force based on node layer
		// Hierarchy: Root (0) -> Story (2) -> Essay Angle (1) -> Detail (3)
		// Higher rank = LOWER radial strength = stays closer to intended position
		// Lower rank = HIGHER radial strength = pushed to outer rings
		const radialForce = d3Force
			.forceRadial(
				(node) => {
					const graphNode = node as ApiForceGraphNode;
					// Layer-based radial distance for new API nodes
					switch (graphNode.layer) {
						case 0:
							// LAYER 0 - CENTER (Profile Summary)
							// - Node Type: profile_summary
							// - Size: 24px (largest)
							// - Color: Amber (#f59e0b)
							// - Purpose: Core identity, synthesized from stories
							return 0; // Center - profile_summary (Root)
						case 1:
							// LAYER 1 - INNER RING (Essay Angles)
							// - Node Type: essay_angle
							// - Size: 16px
							// - Color: Violet (#8b5cf6)
							// - Purpose: Thematic patterns for college essays
							return 200; // Inner ring - essay_angle
						case 2:
							// LAYER 2 - MIDDLE RING (Stories)
							// - Node Type: key_story
							// - Size: 12px
							// - Color: Emerald (#10b981)
							// - Purpose: Complete narratives with STAR structure
							return 320; // Middle ring - key_story
						case 3: {
							// LAYER 3 - OUTER RING (Details)
							// - Node Type: detail
							// - Size: 8px (smallest)
							// - Color: Blue (#3b82f6)
							// - Purpose: Specific achievements, evidence, metrics
							// Outer ring - detail with jitter to spread nodes
							// Add variance based on node id hash to prevent clustering
							const hash = graphNode.id
								.split("")
								.reduce((a, c) => a + c.charCodeAt(0), 0);
							const jitter = (hash % 80) - 40; // -40 to +40 variance
							return 450 + jitter;
						}
						default:
							return 300;
					}
				},
				0,
				0,
			)
			.strength((node) => {
				const graphNode = node as ApiForceGraphNode;
				// ============================================================================
				// RADIAL FORCE STRENGTH - Inverted Hierarchy
				// ============================================================================
				// Higher rank (lower layer) = LOWER force = more flexible positioning
				// Lower rank (higher layer) = HIGHER force = stays in outer rings
				// ============================================================================
				switch (graphNode.layer) {
					case 0:
						// Root: Weakest force (naturally gravitates to center)
						return 0.2; // Root - weakest radial force (naturally centers)
					case 1:
						// Essay Angle: Moderate force (stays in inner ring)
						return 0.5; // Essay Angle - moderate force
					case 2:
						// Story: Stronger force (stays in middle ring)
						return 0.7; // Story - stronger force
					case 3:
						// Detail: Strongest force (locked to outer ring)
						return 0.9; // Detail - strongest force (stays outer)
					default:
						return 0.7;
				}
			});
		fgRef.current.d3Force("radial", radialForce);

		// Configure link force - increased distance and reduced strength to prevent clustering
		fgRef.current.d3Force("link")?.distance(180).strength(0.3);

		// Reheat simulation when data changes
		fgRef.current.d3ReheatSimulation();
	}, [graphData]);

	return { fgRef, graphData };
}
