"use client";

import {
	ReactFlow,
	Background,
	Controls,
	useNodesState,
	useEdgesState,
	type Node,
	type Edge,
	BackgroundVariant,
	ReactFlowProvider,
	useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
	usePersonaStore,
	type DiscoveryTrack,
	type KeyStory,
} from "@/lib/store/personaStore";
import { TRACK_COLORS } from "@/lib/constants/personaColors";
import {
	calculateNodePosition,
	getCoreNodePosition,
	generateEdgesForTrack,
	CANVAS_CENTER,
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
import {
	NodeDetailModal,
	type NodeDetailData,
	type NodeType,
} from "./NodeDetailModal";
import { CanvasControls } from "./CanvasControls";
import { cn } from "@/lib/utils";
import { useOrganicLayout } from "@/lib/hooks/useOrganicLayout";

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

export function PersonaCanvas(props: PersonaCanvasProps) {
	return (
		<ReactFlowProvider>
			<PersonaCanvasInner {...props} />
		</ReactFlowProvider>
	);
}

function PersonaCanvasInner({ className, onNodeSelect }: PersonaCanvasProps) {
	const { tracks, keyStories } = usePersonaStore();
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	const [modalData, setModalData] = useState<NodeDetailData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { zoom } = useViewport();
	const [expandedClusters, setExpandedClusters] = useState<Set<string>>(
		new Set(),
	);

	const toggleCluster = useCallback((clusterId: string) => {
		setExpandedClusters((prev) => {
			const next = new Set(prev);
			if (next.has(clusterId)) next.delete(clusterId);
			else next.add(clusterId);
			return next;
		});
	}, []);

	// Generate nodes and edges from persona data
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
			unlockHint: "Complete all topics to discover",
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
			const trackStories = keyStories.filter((s) => s.sourceTrack === track.id);

			// Summary node (main topic node)
			const summaryNodeId = `${track.id}-summary`;
			trackNodeIds.summary.push(summaryNodeId);

			const firstStory = trackStories[0];
			const isClustered = trackStories.length >= 5;
			const isExpanded = expandedClusters.has(summaryNodeId);

			const summaryData: SummaryNodeData = {
				track: track.id,
				state: isCompleted ? "unlocked" : "locked",
				title: isCompleted ? firstStory?.title || track.title : undefined,
				themeTag: isCompleted ? getThemeTag(track.id) : undefined,
				unlockHint: `Complete ${track.title}`,
				isCluster: isClustered,
				childCount: trackStories.length,
			};

			nodes.push({
				id: summaryNodeId,
				type: "summary",
				position: calculateNodePosition(track.id, "summary"),
				data: summaryData,
			});

			// Evidence nodes (story nodes) - show if NOT clustered OR if expanded
			if (!isClustered || isExpanded) {
				const storiesToShow = isClustered
					? trackStories
					: trackStories.slice(1, 4);
				storiesToShow.forEach((story, idx) => {
					const evidenceNodeId = `${track.id}-evidence-${idx}`;
					trackNodeIds.evidence.push(evidenceNodeId);

					const evidenceData: EvidenceNodeData = {
						track: track.id,
						state: isCompleted ? "unlocked" : "locked",
						title: story.title,
						content: story.summary,
						unlockHint: "Share more stories",
					};

					nodes.push({
						id: evidenceNodeId,
						type: "evidence",
						position: calculateNodePosition(track.id, "evidence", idx),
						data: evidenceData,
					});
				});
			}

			// Insight node (AI-generated)
			if (isCompleted) {
				const insightNodeId = `${track.id}-insight`;
				trackNodeIds.insight.push(insightNodeId);

				const insightData: InsightNodeData = {
					track: track.id,
					state: "unlocked",
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
			edges.push(...(trackEdges as Edge[]));
		}

		return { nodes, edges };
	}, [tracks, keyStories]);

	const [nodes, setNodes, onNodesChange] = useNodesState(generatedData.nodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(generatedData.edges);

	// Initialize organic layout hook
	const { isMacroView } = useOrganicLayout({ nodes, edges, setNodes });

	// Sync states when initial data changes or zoom changes
	useEffect(() => {
		setNodes((nds) => {
			// Process nodes to include zoom level and other metadata
			let processedNodes = generatedData.nodes.map((node) => {
				const existing = nds.find((n) => n.id === node.id);
				return {
					...node,
					position: existing ? existing.position : node.position,
					data: {
						...node.data,
						zoom,
					},
				} as Node;
			});

			// Add Seed Nodes if empty (Cold Start)
			if (processedNodes.length < 3) {
				const seedNodes: Node[] = [
					{
						id: "seed-1",
						type: "insight",
						position: { x: CANVAS_CENTER.x - 200, y: CANVAS_CENTER.y - 100 },
						data: {
							title: "Share a story about leadership",
							track: "activities",
							state: "unlocked",
							zoom,
						},
					},
					{
						id: "seed-2",
						type: "insight",
						position: { x: CANVAS_CENTER.x + 200, y: CANVAS_CENTER.y + 100 },
						data: {
							title: "What are your core values?",
							track: "values",
							state: "unlocked",
							zoom,
						},
					},
				];
				processedNodes = [...processedNodes, ...seedNodes];
			}

			return processedNodes;
		});
	}, [generatedData.nodes, zoom, setNodes]);

	// Highlight connections
	const styledEdges = useMemo(() => {
		return generatedData.edges.map((edge) => {
			const isHighlighted =
				selectedNodeId === edge.source ||
				selectedNodeId === edge.target ||
				hoveredNodeId === edge.source ||
				hoveredNodeId === edge.target;

			// Check if this edge connects to a node that is hidden by zoom
			const sourceIsHidden =
				isMacroView &&
				(edge.source.includes("evidence") || edge.source.includes("insight"));
			const targetIsHidden =
				isMacroView &&
				(edge.target.includes("evidence") || edge.target.includes("insight"));
			const isHiddenByZoom = sourceIsHidden || targetIsHidden;

			return {
				...edge,
				style: {
					...edge.style,
					strokeOpacity: isHiddenByZoom ? 0 : isHighlighted ? 0.8 : 0.1,
					stroke: isHighlighted ? edge.style?.stroke : "#94a3b8",
					transition: "stroke-opacity 0.3s ease, stroke 0.3s ease",
					pointerEvents: (isHiddenByZoom ? "none" : "auto") as any,
				},
				animated: isHighlighted && !edge.id.includes("insight"),
			};
		});
	}, [generatedData.edges, selectedNodeId, hoveredNodeId, isMacroView]);

	useEffect(() => {
		setEdges(styledEdges as Edge[]);
	}, [styledEdges, setEdges]);

	const handleNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			// Handle cluster toggle
			if (node.type === "summary" && node.data.isCluster) {
				toggleCluster(node.id);
				return;
			}

			setSelectedNodeId(node.id);
			onNodeSelect?.(node.id);

			const nodeData = createModalData(node, tracks, keyStories);
			if (nodeData) {
				setModalData(nodeData);
				setIsModalOpen(true);
			}
		},
		[onNodeSelect, tracks, keyStories],
	);

	const handleNodeMouseEnter = useCallback(
		(_: React.MouseEvent, node: Node) => {
			setHoveredNodeId(node.id);
		},
		[],
	);

	const handleNodeMouseLeave = useCallback(() => {
		setHoveredNodeId(null);
	}, []);

	const handlePaneClick = useCallback(() => {
		setSelectedNodeId(null);
		onNodeSelect?.(null);
	}, [onNodeSelect]);

	const handleModalClose = useCallback(() => {
		setIsModalOpen(false);
		setModalData(null);
	}, []);

	const handleModalNavigate = useCallback(
		(nodeId: string) => {
			const node = nodes.find((n) => n.id === nodeId);
			if (node) {
				setSelectedNodeId(nodeId);
				const nodeData = createModalData(node, tracks, keyStories);
				if (nodeData) {
					setModalData(nodeData);
				}
			}
		},
		[nodes, tracks, keyStories],
	);

	return (
		<div className={cn("w-full h-full relative", className)}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeClick={handleNodeClick}
				onPaneClick={handlePaneClick}
				onNodeMouseEnter={handleNodeMouseEnter}
				onNodeMouseLeave={handleNodeMouseLeave}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				minZoom={0.3}
				maxZoom={1.5}
				defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
				proOptions={{ hideAttribution: true }}
				className="bg-background"
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={true}
			>
				<Background
					variant={BackgroundVariant.Dots}
					gap={20}
					size={1}
					color="hsl(var(--muted-foreground) / 0.15)"
				/>
				<Controls
					showInteractive={false}
					className="!bg-background !border-border !shadow-md"
				/>
			</ReactFlow>

			{/* Custom controls overlay */}
			<div className="absolute top-4 left-4 z-10">
				<CanvasControls />
			</div>

			{/* Node detail modal */}
			<NodeDetailModal
				isOpen={isModalOpen}
				data={modalData}
				onClose={handleModalClose}
				onNavigate={handleModalNavigate}
			/>
		</div>
	);
}

// Helper function to create modal data from node
function createModalData(
	node: Node,
	tracks: DiscoveryTrack[],
	keyStories: KeyStory[],
): NodeDetailData | null {
	const nodeType = node.type as string;

	if (nodeType === "core") {
		const data = node.data as CoreNodeData;
		return {
			id: node.id,
			type: "core" as NodeType,
			title: data.archetype || "Your Archetype",
			subtitle: data.subtitle,
			content:
				data.state === "unlocked"
					? "This is your unique archetype, synthesized from all your stories and experiences. It represents the core of who you are and what makes you stand out."
					: "Complete all topics to discover your unique archetype.",
		};
	}

	if (nodeType === "summary") {
		const data = node.data as SummaryNodeData;
		const track = tracks.find((t) => t.id === data.track);
		const stories = keyStories.filter((s) => s.sourceTrack === data.track);

		return {
			id: node.id,
			type: "topic" as NodeType,
			trackId: data.track,
			title: data.title || track?.title || "Topic",
			subtitle: track?.description,
			themes: data.themeTag ? [data.themeTag] : [],
			relatedStories: stories.slice(1, 4).map((s) => ({
				id: `${data.track}-evidence-${stories.indexOf(s) - 1}`,
				title: s.title,
			})),
		};
	}

	if (nodeType === "evidence") {
		const data = node.data as EvidenceNodeData;
		const story = keyStories.find((s) => s.title === data.title);

		return {
			id: node.id,
			type: "story" as NodeType,
			trackId: data.track,
			title: data.title || "Your Story",
			content: story?.summary || data.content,
		};
	}

	if (nodeType === "insight") {
		const data = node.data as InsightNodeData;

		return {
			id: node.id,
			type: "insight" as NodeType,
			trackId: data.track,
			title: data.title || "AI Insight",
			isAIGenerated: true,
			content: getInsightContent(data.track),
			suggestedAngles: getInsightAngles(data.track),
		};
	}

	return null;
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

function getInsightContent(trackId: string): string {
	const content: Record<string, string> = {
		academic:
			"Based on your stories, you demonstrate a strong ability to connect academic learning with practical applications. Your projects show a pattern of taking theoretical concepts and applying them to solve real community problems.",
		activities:
			"Your activities reveal a talent for building collaborative networks. You don't just participate — you create systems and communities that enable others to contribute to meaningful change.",
		values:
			"Your responses show a unique ability to bridge traditional wisdom with modern innovation. This perspective is valuable in showing how you can bring diverse viewpoints together.",
		future:
			"Your vision clearly centers on using technology as a tool for community empowerment, not just innovation for its own sake. This purpose-driven approach is compelling.",
	};
	return (
		content[trackId] ||
		"Leaply AI has identified patterns in your stories that reveal unique strengths."
	);
}

function getInsightAngles(trackId: string): string[] {
	const angles: Record<string, string[]> = {
		academic: [
			"Write about a specific moment when theory met practice",
			"Describe a research question that emerged from community work",
		],
		activities: [
			"Focus on how you built trust across diverse groups",
			"Show the ripple effects of your network-building",
		],
		values: [
			"Illustrate how traditional and modern perspectives can complement",
			"Share a moment of cultural bridge-building",
		],
		future: [
			"Connect a personal experience to your larger vision",
			"Show how your past experiences shaped your future goals",
		],
	};
	return angles[trackId] || [];
}
