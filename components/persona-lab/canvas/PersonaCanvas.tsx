"use client";

import {
	Background,
	BackgroundVariant,
	Controls,
	type Edge,
	type Node,
	Position,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import {
	calculateOverallProgress,
	calculateTrackProgress,
	getQuestionProgress,
	TRACK_COLORS,
	TRACK_IDS,
} from "@/lib/constants/tracks";
import {
	type CanvasNode as StoreCanvasNode,
	usePersonaStore,
} from "@/lib/store/personaStore";
import type { NodeType, TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";
import { CanvasControls } from "./CanvasControls";
import {
	type NodeType as ModalNodeType,
	type NodeDetailData,
	NodeDetailModal,
} from "./NodeDetailModal";
import { ArchetypeNode, type ArchetypeNodeData } from "./nodes/ArchetypeNode";
import { EvidenceNode, type EvidenceNodeData } from "./nodes/EvidenceNode";
import { InsightNode, type InsightNodeData } from "./nodes/InsightNode";
import { StoryNode, type StoryNodeData } from "./nodes/StoryNode";
import { SummaryNode, type SummaryNodeData } from "./nodes/SummaryNode";

// Define node types for React Flow
const nodeTypes = {
	archetype: ArchetypeNode,
	summary: SummaryNode,
	story: StoryNode,
	evidence: EvidenceNode,
	insight: InsightNode,
};

// Distance from center for summary nodes (diamond layout)
const SUMMARY_NODE_DISTANCE = 280;

// Track positions in diamond layout: Top, Right, Bottom, Left
const TRACK_POSITIONS: Record<
	TrackId,
	{ angle: number; sourceHandle: Position; targetHandle: Position }
> = {
	future_vision: {
		angle: -90,
		sourceHandle: Position.Top,
		targetHandle: Position.Bottom,
	},
	academic_journey: {
		angle: 0,
		sourceHandle: Position.Right,
		targetHandle: Position.Left,
	},
	values_turning_points: {
		angle: 90,
		sourceHandle: Position.Bottom,
		targetHandle: Position.Top,
	},
	activities_impact: {
		angle: 180,
		sourceHandle: Position.Left,
		targetHandle: Position.Right,
	},
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
	const {
		nodes: storeNodes,
		tracks,
		archetype,
		archetypeHints,
		keywords,
		visibleLayers,
		selectNode,
		isLoading,
	} = usePersonaStore();
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	const [modalData, setModalData] = useState<NodeDetailData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [currentZoom, setCurrentZoom] = useState(0.8);
	const initialFitDone = useRef(false);

	const { fitView, getViewport } = useReactFlow();

	// Calculate track completion percentages using real progress data
	const trackProgress = useMemo(() => {
		const progress: Record<TrackId, number> = {
			future_vision: 0,
			academic_journey: 0,
			activities_impact: 0,
			values_turning_points: 0,
		};

		for (const trackId of TRACK_IDS) {
			progress[trackId] = calculateTrackProgress(tracks[trackId]);
		}

		return progress;
	}, [tracks]);

	// Calculate overall progress
	const overallProgress = useMemo(
		() => calculateOverallProgress(tracks),
		[tracks],
	);

	const completedTracksCount = useMemo(() => {
		return Object.values(tracks).filter((t) => t.status === "completed").length;
	}, [tracks]);

	// Generate React Flow nodes from store nodes
	const generatedData = useMemo(() => {
		const rfNodes: Node[] = [];
		const rfEdges: Edge[] = [];

		// Center position (will be adjusted by fitView)
		const CENTER = { x: 0, y: 0 };

		// Create archetype node (always present at center)
		const archetypeData: ArchetypeNodeData = {
			state: archetype ? "revealed" : "locked",
			archetypeType: archetype?.type,
			personalizedSummary: archetype?.personalizedSummary,
			overallProgress,
			completedTracks: completedTracksCount,
			totalTracks: 4,
			archetypeHints,
			zoom: currentZoom,
		};

		rfNodes.push({
			id: "archetype",
			type: "archetype",
			position: { x: CENTER.x - 100, y: CENTER.y - 80 }, // Offset to center the node
			data: archetypeData,
		});

		// Create 4 Summary Nodes in diamond layout
		for (const trackId of TRACK_IDS) {
			const trackPos = TRACK_POSITIONS[trackId];
			const track = tracks[trackId];
			const radians = (trackPos.angle * Math.PI) / 180;

			const position = {
				x: CENTER.x + Math.cos(radians) * SUMMARY_NODE_DISTANCE - 100, // Offset to center
				y: CENTER.y + Math.sin(radians) * SUMMARY_NODE_DISTANCE - 50,
			};

			// Get keywords for this track
			const trackKeywords = keywords
				.filter((k) => k.trackId === trackId)
				.map((k) => ({ id: k.id, keyword: k.keyword }));

			const summaryData: SummaryNodeData = {
				trackId,
				status: track.status,
				completionPercentage: trackProgress[trackId],
				questionProgress: getQuestionProgress(track),
				isLoading: isLoading,
				keywords: trackKeywords,
				zoom: currentZoom,
			};

			rfNodes.push({
				id: `summary-${trackId}`,
				type: "summary",
				position,
				data: summaryData,
			});

			// Create edge from archetype to summary node with proper handles
			const trackColor = TRACK_COLORS[trackId];
			rfEdges.push({
				id: `archetype-to-summary-${trackId}`,
				source: "archetype",
				target: `summary-${trackId}`,
				sourceHandle: trackPos.sourceHandle,
				targetHandle: trackPos.targetHandle,
				style: {
					stroke: trackColor.primary,
					strokeWidth: 2,
					strokeOpacity: track.status === "completed" ? 0.8 : 0.3,
				},
				animated: track.status === "in_progress",
			});
		}

		// Group story/evidence/insight nodes by track for positioning
		const nodesByTrack: Record<TrackId, StoreCanvasNode[]> = {
			future_vision: [],
			academic_journey: [],
			activities_impact: [],
			values_turning_points: [],
		};

		for (const node of storeNodes) {
			if (node.sourceTrackId) {
				nodesByTrack[node.sourceTrackId].push(node);
			}
		}

		// Create React Flow nodes for each store node (story, evidence, insight)
		for (const [trackId, trackNodes] of Object.entries(nodesByTrack) as [
			TrackId,
			StoreCanvasNode[],
		][]) {
			const trackPos = TRACK_POSITIONS[trackId];
			const trackColor = TRACK_COLORS[trackId];
			const baseAngle = trackPos.angle;

			// Position nodes in an arc beyond the summary node
			trackNodes.forEach((storeNode, idx) => {
				// Check if layer is visible
				const isLayerVisible =
					visibleLayers[storeNode.type as keyof typeof visibleLayers];
				if (!isLayerVisible) return;

				// Calculate position - spread nodes in an arc
				const distance = SUMMARY_NODE_DISTANCE + 150 + idx * 60;
				const angleSpread = 12;
				const angle =
					baseAngle + (idx - (trackNodes.length - 1) / 2) * angleSpread;
				const radians = (angle * Math.PI) / 180;

				const position = {
					x: CENTER.x + Math.cos(radians) * distance - 80,
					y: CENTER.y + Math.sin(radians) * distance - 40,
				};

				// Create node based on type
				const nodeData: Record<string, unknown> = {
					id: storeNode.id,
					title: storeNode.title,
					content: storeNode.content,
					sourceTrackId: storeNode.sourceTrackId,
					zoom: currentZoom,
				};

				if (storeNode.type === "insight") {
					(nodeData as InsightNodeData).isAIGenerated = true;
				}

				rfNodes.push({
					id: storeNode.id,
					type: storeNode.type,
					position,
					data: nodeData,
				});

				// Create edge from summary node to this node with proper handles
				rfEdges.push({
					id: `summary-${trackId}-to-${storeNode.id}`,
					source: `summary-${trackId}`,
					target: storeNode.id,
					sourceHandle: trackPos.sourceHandle,
					targetHandle: trackPos.targetHandle,
					style: {
						stroke: trackColor.primary,
						strokeWidth: 1.5,
						strokeOpacity: 0.4,
					},
					animated: false,
				});
			});
		}

		return { nodes: rfNodes, edges: rfEdges };
	}, [
		storeNodes,
		tracks,
		archetype,
		archetypeHints,
		keywords,
		visibleLayers,
		currentZoom,
		trackProgress,
		overallProgress,
		completedTracksCount,
		isLoading,
	]);

	const [nodes, setNodes, onNodesChange] = useNodesState(generatedData.nodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(generatedData.edges);

	// Sync with generated data
	useEffect(() => {
		setNodes(generatedData.nodes);
		setEdges(generatedData.edges);
	}, [generatedData, setNodes, setEdges]);

	// Initial fit view centered on archetype
	useEffect(() => {
		if (!initialFitDone.current && nodes.length > 0) {
			// Small delay to ensure nodes are rendered
			const timer = setTimeout(() => {
				fitView({
					padding: 0.3,
					duration: 300,
					nodes: [{ id: "archetype" }], // Center on archetype
				});
				initialFitDone.current = true;
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [nodes.length, fitView]);

	// Track zoom changes
	const handleMoveEnd = useCallback(() => {
		const viewport = getViewport();
		setCurrentZoom(viewport.zoom);
	}, [getViewport]);

	// Highlight connections on hover/select
	const styledEdges = useMemo(() => {
		return edges.map((edge) => {
			const isHighlighted =
				selectedNodeId === edge.source ||
				selectedNodeId === edge.target ||
				hoveredNodeId === edge.source ||
				hoveredNodeId === edge.target;

			return {
				...edge,
				style: {
					...edge.style,
					strokeOpacity: isHighlighted
						? 0.9
						: (edge.style?.strokeOpacity ?? 0.3),
					strokeWidth: isHighlighted ? 3 : (edge.style?.strokeWidth ?? 2),
					transition: "stroke-opacity 0.3s ease, stroke-width 0.3s ease",
				},
				animated: isHighlighted || edge.animated,
			};
		});
	}, [edges, selectedNodeId, hoveredNodeId]);

	const handleNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			setSelectedNodeId(node.id);
			selectNode(node.id);
			onNodeSelect?.(node.id);

			const nodeData = createModalData(node, storeNodes, archetype, tracks);
			if (nodeData) {
				setModalData(nodeData);
				setIsModalOpen(true);
			}
		},
		[onNodeSelect, storeNodes, archetype, selectNode, tracks],
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
		selectNode(null);
		onNodeSelect?.(null);
	}, [onNodeSelect, selectNode]);

	const handleModalClose = useCallback(() => {
		setIsModalOpen(false);
		setModalData(null);
	}, []);

	const handleModalNavigate = useCallback(
		(nodeId: string) => {
			const node = nodes.find((n) => n.id === nodeId);
			if (node) {
				setSelectedNodeId(nodeId);
				const nodeData = createModalData(node, storeNodes, archetype, tracks);
				if (nodeData) {
					setModalData(nodeData);
				}
			}
		},
		[nodes, storeNodes, archetype, tracks],
	);

	// Re-center on archetype when double-clicking pane
	const handlePaneDoubleClick = useCallback(() => {
		fitView({
			padding: 0.3,
			duration: 300,
			nodes: [{ id: "archetype" }],
		});
	}, [fitView]);

	return (
		<div className={cn("w-full h-full relative", className)}>
			<ReactFlow
				nodes={nodes}
				edges={styledEdges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeClick={handleNodeClick}
				onPaneClick={handlePaneClick}
				onNodeMouseEnter={handleNodeMouseEnter}
				onNodeMouseLeave={handleNodeMouseLeave}
				onMoveEnd={handleMoveEnd}
				onDoubleClick={handlePaneDoubleClick}
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{
					padding: 0.3,
					nodes: [{ id: "archetype" }], // Center on archetype
				}}
				minZoom={0.2}
				maxZoom={1.5}
				defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
				proOptions={{ hideAttribution: true }}
				className="bg-background"
				nodesDraggable={true}
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
	storeNodes: StoreCanvasNode[],
	archetype: { type: string; personalizedSummary: string } | null,
	tracks: Record<TrackId, { status: string; displayName: string }>,
): NodeDetailData | null {
	const nodeType = node.type as string;

	if (nodeType === "archetype") {
		const data = node.data as ArchetypeNodeData;
		const archetypeDef = data.archetypeType
			? ARCHETYPES[data.archetypeType]
			: null;

		return {
			id: node.id,
			type: "core" as ModalNodeType,
			title: archetypeDef?.title || "Your Archetype",
			subtitle: archetypeDef?.tagline,
			content:
				data.state === "revealed"
					? data.personalizedSummary ||
						archetypeDef?.description ||
						"Your unique archetype has been revealed."
					: "Complete all 4 discovery tracks to reveal your archetype.",
			themes: archetypeDef?.essayStrengths,
		};
	}

	if (nodeType === "summary") {
		const data = node.data as SummaryNodeData;
		const track = tracks[data.trackId];

		return {
			id: node.id,
			type: "story" as ModalNodeType,
			trackId: data.trackId,
			title: track.displayName,
			content:
				data.summary || `Track progress: ${data.completionPercentage || 0}%`,
		};
	}

	if (nodeType === "story") {
		const data = node.data as StoryNodeData;
		const storeNode = storeNodes.find((n) => n.id === data.id);

		return {
			id: node.id,
			type: "story" as ModalNodeType,
			trackId: data.sourceTrackId || undefined,
			title: data.title,
			content: storeNode?.content || data.content,
		};
	}

	if (nodeType === "evidence") {
		const data = node.data as EvidenceNodeData;
		const storeNode = storeNodes.find((n) => n.id === data.id);

		return {
			id: node.id,
			type: "story" as ModalNodeType,
			trackId: data.sourceTrackId || undefined,
			title: data.title,
			content: storeNode?.content || data.content,
		};
	}

	if (nodeType === "insight") {
		const data = node.data as InsightNodeData;
		const storeNode = storeNodes.find((n) => n.id === data.id);

		return {
			id: node.id,
			type: "insight" as ModalNodeType,
			trackId: data.sourceTrackId || undefined,
			title: data.title,
			isAIGenerated: true,
			content:
				storeNode?.content || "AI-generated insight from your conversation.",
		};
	}

	return null;
}
