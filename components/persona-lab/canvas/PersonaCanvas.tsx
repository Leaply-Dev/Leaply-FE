"use client";

import {
	Background,
	BackgroundVariant,
	Controls,
	type Edge,
	MarkerType,
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
	LAYER_DEPTHS,
	LAYER_DISTANCES,
	NODE_DIMENSIONS,
} from "@/lib/hooks/useElkLayout";
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

// Edge styles for different hierarchy levels
const EDGE_STYLES = {
	// Archetype to Track: dashed, prominent
	archetypeToTrack: {
		strokeDasharray: "8 4",
		strokeWidth: 2.5,
		strokeLinecap: "round" as const,
	},
	// Track to Child: solid, thinner, with marker
	trackToChild: {
		strokeDasharray: undefined,
		strokeWidth: 1.5,
		strokeLinecap: "round" as const,
	},
	// Cross-track link: dotted, distinct color
	crossTrack: {
		strokeDasharray: "2 4",
		strokeWidth: 2,
		strokeLinecap: "round" as const,
	},
};

// Animation variants for nodes appearing from parent
const nodeAnimationVariants = {
	hidden: {
		scale: 0.3,
		opacity: 0,
	},
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 25,
			duration: 0.5,
		},
	},
	exit: {
		scale: 0.5,
		opacity: 0,
		transition: {
			duration: 0.2,
		},
	},
};

// Helper function to determine handle position based on angle
function getHandleForAngle(angle: number): {
	source: Position;
	target: Position;
} {
	// Normalize angle to 0-360
	const normalizedAngle = ((angle % 360) + 360) % 360;

	if (normalizedAngle >= 315 || normalizedAngle < 45) {
		return { source: Position.Right, target: Position.Left };
	}
	if (normalizedAngle >= 45 && normalizedAngle < 135) {
		return { source: Position.Bottom, target: Position.Top };
	}
	if (normalizedAngle >= 135 && normalizedAngle < 225) {
		return { source: Position.Left, target: Position.Right };
	}
	return { source: Position.Top, target: Position.Bottom };
}

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
	const previousNodeIds = useRef<Set<string>>(new Set());

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

	// Calculate track positions for ELK layout
	const trackPositionsForElk = useMemo(() => {
		const CENTER = { x: 0, y: 0 };
		const positions: Record<TrackId, { x: number; y: number; angle: number }> =
			{} as Record<TrackId, { x: number; y: number; angle: number }>;

		for (const trackId of TRACK_IDS) {
			const trackPos = TRACK_POSITIONS[trackId];
			const radians = (trackPos.angle * Math.PI) / 180;
			positions[trackId] = {
				x: CENTER.x + Math.cos(radians) * SUMMARY_NODE_DISTANCE,
				y: CENTER.y + Math.sin(radians) * SUMMARY_NODE_DISTANCE,
				angle: trackPos.angle,
			};
		}
		return positions;
	}, []);

	// Generate fixed nodes (archetype + summary) and initial child nodes
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
			position: { x: CENTER.x - 100, y: CENTER.y - 80 },
			data: archetypeData,
		});

		// Create 4 Summary Nodes in diamond layout (fixed positions)
		for (const trackId of TRACK_IDS) {
			const trackPos = TRACK_POSITIONS[trackId];
			const track = tracks[trackId];
			const radians = (trackPos.angle * Math.PI) / 180;

			const position = {
				x: CENTER.x + Math.cos(radians) * SUMMARY_NODE_DISTANCE - 100,
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

			// Edge from archetype to summary - use hierarchical style
			const trackColor = TRACK_COLORS[trackId];
			rfEdges.push({
				id: `archetype-to-summary-${trackId}`,
				source: "archetype",
				target: `summary-${trackId}`,
				sourceHandle: trackPos.sourceHandle,
				targetHandle: trackPos.targetHandle,
				style: {
					stroke: trackColor.primary,
					strokeOpacity: track.status === "completed" ? 0.7 : 0.25,
					...EDGE_STYLES.archetypeToTrack,
				},
				animated: track.status === "in_progress",
			});
		}

		// Group story/evidence/insight nodes by track
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

		// Create child nodes with layer-based positioning (will be refined by ELK)
		for (const [trackId, trackNodes] of Object.entries(nodesByTrack) as [
			TrackId,
			StoreCanvasNode[],
		][]) {
			const trackPos = TRACK_POSITIONS[trackId];
			const trackColor = TRACK_COLORS[trackId];
			const baseAngle = trackPos.angle;

			// Group nodes by layer type for proper spacing
			const nodesByLayer: Record<string, StoreCanvasNode[]> = {
				story: [],
				evidence: [],
				insight: [],
			};

			for (const node of trackNodes) {
				if (node.type in nodesByLayer) {
					nodesByLayer[node.type].push(node);
				}
			}

			// Position nodes by layer (concentric zones around track)
			for (const [layerType, layerNodes] of Object.entries(nodesByLayer)) {
				const layerDistance =
					LAYER_DISTANCES[layerType as keyof typeof LAYER_DISTANCES] ?? 200;
				const layerDepth =
					LAYER_DEPTHS[layerType as keyof typeof LAYER_DEPTHS] ?? 0;

				layerNodes.forEach((storeNode, idx) => {
					// Check if layer is visible
					const isLayerVisible =
						visibleLayers[storeNode.type as keyof typeof visibleLayers];
					if (!isLayerVisible) return;

					// Calculate position in arc around track at layer distance
					const nodeCount = layerNodes.length;
					const angleSpread = Math.min(15, 40 / Math.max(nodeCount, 1));
					const angleOffset = (idx - (nodeCount - 1) / 2) * angleSpread;
					const angle = baseAngle + angleOffset;
					const radians = (angle * Math.PI) / 180;

					const dims =
						NODE_DIMENSIONS[storeNode.type as keyof typeof NODE_DIMENSIONS] ??
						NODE_DIMENSIONS.story;

					const position = {
						x: CENTER.x + Math.cos(radians) * layerDistance - dims.width / 2,
						y: CENTER.y + Math.sin(radians) * layerDistance - dims.height / 2,
					};

					// Create node with layer metadata
					const nodeData: Record<string, unknown> = {
						id: storeNode.id,
						title: storeNode.title,
						content: storeNode.content,
						sourceTrackId: storeNode.sourceTrackId,
						layer: layerType,
						layerDepth,
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

					// Create edge from summary node to child - use track-to-child style
					// Calculate which handle to use based on node angle relative to track
					const childAngle = angle;
					const handleForChild = getHandleForAngle(childAngle);

					rfEdges.push({
						id: `summary-${trackId}-to-${storeNode.id}`,
						source: `summary-${trackId}`,
						target: storeNode.id,
						sourceHandle: trackPos.sourceHandle,
						targetHandle: handleForChild.target,
						style: {
							stroke: trackColor.primary,
							strokeOpacity: 0.35,
							...EDGE_STYLES.trackToChild,
						},
						markerEnd: {
							type: MarkerType.ArrowClosed,
							width: 12,
							height: 12,
							color: `${trackColor.primary}60`,
						},
						animated: false,
					});
				});
			}
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

	// Track node IDs for change detection
	useEffect(() => {
		const currentIds = new Set(storeNodes.map((n) => n.id));
		previousNodeIds.current = currentIds;
	}, [storeNodes]);

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
