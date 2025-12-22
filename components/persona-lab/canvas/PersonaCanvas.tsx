"use client";

import {
	ReactFlow,
	Background,
	Controls,
	MiniMap,
	useNodesState,
	useEdgesState,
	type Node,
	type Edge,
	BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo } from "react";
import { usePersonaStore } from "@/lib/store/personaStore";
import { TRACK_COLORS } from "@/lib/constants/personaColors";
import {
	calculateNodePosition,
	getCoreNodePosition,
	generateEdgesForTrack,
} from "@/lib/utils/canvasLayout";
import {
	CoreNode,
	SummaryNode,
	EvidenceNode,
	InsightNode,
	type CoreNodeData,
	type SummaryNodeData,
	type EvidenceNodeData,
	type InsightNodeData,
} from "./nodes";
import { CanvasControls } from "./CanvasControls";
import { cn } from "@/lib/utils";

// Define node types for React Flow
const nodeTypes = {
	core: CoreNode,
	summary: SummaryNode,
	evidence: EvidenceNode,
	insight: InsightNode,
};

interface PersonaCanvasProps {
	className?: string;
	onNodeSelect?: (nodeId: string | null) => void;
}

export function PersonaCanvas({ className, onNodeSelect }: PersonaCanvasProps) {
	const { tracks, keyStories } = usePersonaStore();

	// Generate nodes from store data
	const generatedData = useMemo(() => {
		const nodes: Node[] = [];
		const edges: Edge[] = [];

		// Check if all tracks are completed for core node
		const allTracksCompleted = tracks.every((t) => t.status === "completed");

		// Core node
		const corePosition = getCoreNodePosition();
		const coreData: CoreNodeData = {
			state: allTracksCompleted ? "unlocked" : "locked",
			archetype: allTracksCompleted ? "The Innovator" : undefined,
			subtitle: allTracksCompleted
				? "Bridge between tradition & technology"
				: undefined,
			unlockHint: "Complete all tracks to discover your archetype",
		};

		nodes.push({
			id: "core",
			type: "core",
			position: corePosition,
			data: coreData,
		});

		// Generate nodes for each track
		for (const track of tracks) {
			const isCompleted = track.status === "completed";
			const trackColor = TRACK_COLORS[track.id];
			const trackNodeIds: {
				summary: string[];
				evidence: string[];
				insight: string[];
			} = {
				summary: [],
				evidence: [],
				insight: [],
			};

			// Get stories for this track
			const trackStories = keyStories.filter(
				(s) => s.sourceTrack === track.id,
			);

			// L1: Summary node (first answer/story)
			const summaryNodeId = `${track.id}-summary`;
			trackNodeIds.summary.push(summaryNodeId);

			const firstStory = trackStories[0];
			const summaryData: SummaryNodeData = {
				track: track.id,
				state: isCompleted ? "unlocked" : "locked",
				layerLabel: "L1: Summary",
				title: isCompleted ? firstStory?.title || track.title : undefined,
				themeTag: isCompleted ? getThemeTag(track.id) : undefined,
				unlockHint: `Complete ${track.title}`,
			};

			nodes.push({
				id: summaryNodeId,
				type: "summary",
				position: calculateNodePosition(track.id, "summary"),
				data: summaryData,
			});

			// L2: Evidence nodes (additional stories/answers)
			const additionalStories = trackStories.slice(1, 4);
			additionalStories.forEach((story, idx) => {
				const evidenceNodeId = `${track.id}-evidence-${idx}`;
				trackNodeIds.evidence.push(evidenceNodeId);

				const evidenceData: EvidenceNodeData = {
					track: track.id,
					state: isCompleted ? "unlocked" : "locked",
					layerLabel: "L2: Evidence",
					title: story.title,
					content: story.summary,
					unlockHint: "Answer more questions",
				};

				nodes.push({
					id: evidenceNodeId,
					type: "evidence",
					position: calculateNodePosition(track.id, "evidence", idx),
					data: evidenceData,
				});
			});

			// L3: Insight node (AI-generated, placeholder for now)
			if (isCompleted) {
				const insightNodeId = `${track.id}-insight`;
				trackNodeIds.insight.push(insightNodeId);

				const insightData: InsightNodeData = {
					track: track.id,
					state: "unlocked",
					layerLabel: "L3: Insight",
					title: getInsightTitle(track.id),
					isAIGenerated: true,
				};

				nodes.push({
					id: insightNodeId,
					type: "insight",
					position: calculateNodePosition(track.id, "insight"),
					data: insightData,
				});
			}

			// Generate edges for this track
			const trackEdges = generateEdgesForTrack(
				track.id,
				trackNodeIds,
				trackColor.primary,
			);
			edges.push(...trackEdges);
		}

		return { nodes, edges };
	}, [tracks, keyStories]);

	const [nodes, setNodes, onNodesChange] = useNodesState(generatedData.nodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(generatedData.edges);

	// Update nodes when store data changes
	useEffect(() => {
		setNodes(generatedData.nodes);
		setEdges(generatedData.edges);
	}, [generatedData, setNodes, setEdges]);

	const handleNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			onNodeSelect?.(node.id);
		},
		[onNodeSelect],
	);

	const handlePaneClick = useCallback(() => {
		onNodeSelect?.(null);
	}, [onNodeSelect]);

	return (
		<div className={cn("w-full h-full relative", className)}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeClick={handleNodeClick}
				onPaneClick={handlePaneClick}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.3}
				maxZoom={1.5}
				defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
				proOptions={{ hideAttribution: true }}
				className="bg-background"
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={20}
					size={1}
					color="hsl(var(--muted-foreground) / 0.2)"
				/>
				<Controls
					showInteractive={false}
					className="!bg-background !border-border !shadow-md"
				/>
				<MiniMap
					nodeColor={(node) => {
						if (node.type === "core") return "hsl(var(--primary))";
						const data = node.data as SummaryNodeData | undefined;
						const trackId = data?.track;
						if (trackId && TRACK_COLORS[trackId]) {
							return TRACK_COLORS[trackId].primary;
						}
						return "hsl(var(--muted))";
					}}
					maskColor="hsl(var(--background) / 0.8)"
					className="!bg-card !border-border"
				/>
			</ReactFlow>

			{/* Custom controls overlay */}
			<div className="absolute top-4 left-4 z-10">
				<CanvasControls />
			</div>
		</div>
	);
}

// Helper functions for demo data
function getThemeTag(trackId: string): string {
	const tags: Record<string, string> = {
		academic: "Research",
		activities: "Leadership",
		values: "Growth",
		future: "Vision",
	};
	return tags[trackId] || "Theme";
}

function getInsightTitle(trackId: string): string {
	const insights: Record<string, string> = {
		academic: "Connects theory to real-world impact",
		activities: "Builds networks for systemic change",
		values: "Tradition meets innovation mindset",
		future: "Technology for community empowerment",
	};
	return insights[trackId] || "Key insight from your journey";
}
