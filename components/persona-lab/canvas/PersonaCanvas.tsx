"use client";

import {
	Background,
	BackgroundVariant,
	Controls,
	type Edge,
	type Node,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
	useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import { NODE_TYPE_COLORS, TRACK_COLORS } from "@/lib/constants/tracks";
import {
	type CanvasNode as StoreCanvasNode,
	usePersonaStore,
} from "@/lib/store/personaStore";
import type { NodeType, TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";
import { CANVAS_CENTER } from "@/lib/utils/canvasLayout";
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

// Define node types for React Flow
const nodeTypes = {
	archetype: ArchetypeNode,
	story: StoryNode,
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
	const {
		nodes: storeNodes,
		archetype,
		visibleLayers,
		selectNode,
	} = usePersonaStore();
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
	const [modalData, setModalData] = useState<NodeDetailData | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { zoom } = useViewport();

	// Generate React Flow nodes from store nodes
	const generatedData = useMemo(() => {
		const rfNodes: Node[] = [];
		const rfEdges: Edge[] = [];

		// Create archetype node (always present, but may be locked)
		const archetypeData: ArchetypeNodeData = {
			state: archetype ? "revealed" : "locked",
			archetypeType: archetype?.type,
			personalizedSummary: archetype?.personalizedSummary,
			zoom,
		};

		rfNodes.push({
			id: "archetype",
			type: "archetype",
			position: { x: CANVAS_CENTER.x, y: CANVAS_CENTER.y },
			data: archetypeData,
		});

		// Group nodes by track for positioning
		const nodesByTrack: Record<TrackId, StoreCanvasNode[]> = {
			future_vision: [],
			academic_journey: [],
			activities_impact: [],
			values_turning_points: [],
		};

		// Sort nodes by type and track
		for (const node of storeNodes) {
			if (node.sourceTrackId) {
				nodesByTrack[node.sourceTrackId].push(node);
			}
		}

		// Track angle mapping for positioning
		const trackAngles: Record<TrackId, number> = {
			future_vision: -90, // top
			academic_journey: 0, // right
			values_turning_points: 90, // bottom
			activities_impact: 180, // left
		};

		// Create React Flow nodes for each store node
		let nodeIndex = 0;
		for (const [trackId, trackNodes] of Object.entries(nodesByTrack) as [
			TrackId,
			StoreCanvasNode[],
		][]) {
			const baseAngle = trackAngles[trackId];
			const trackColor = TRACK_COLORS[trackId];

			trackNodes.forEach((storeNode, idx) => {
				const distance = 200 + idx * 80;
				const angleSpread = 15;
				const angle = baseAngle + (idx - trackNodes.length / 2) * angleSpread;
				const radians = (angle * Math.PI) / 180;

				const position = {
					x: CANVAS_CENTER.x + Math.cos(radians) * distance,
					y: CANVAS_CENTER.y + Math.sin(radians) * distance,
				};

				// Check if layer is visible
				const isLayerVisible =
					visibleLayers[storeNode.type as keyof typeof visibleLayers];
				if (!isLayerVisible) return;

				// Create node based on type
				const nodeData: Record<string, unknown> = {
					id: storeNode.id,
					title: storeNode.title,
					content: storeNode.content,
					sourceTrackId: storeNode.sourceTrackId,
					zoom,
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

				// Create edge from archetype to this node
				if (storeNode.type === "story") {
					rfEdges.push({
						id: `archetype-${storeNode.id}`,
						source: "archetype",
						target: storeNode.id,
						style: {
							stroke: trackColor.primary,
							strokeWidth: 2,
							strokeOpacity: 0.3,
						},
						animated: false,
					});
				}

				nodeIndex++;
			});
		}

		// If no nodes exist, create placeholder "seed" nodes
		if (storeNodes.length === 0) {
			const placeholders = [
				{
					id: "seed-1",
					title: "Start your discovery journey",
					trackId: "future_vision" as TrackId,
					angle: -45,
				},
				{
					id: "seed-2",
					title: "Share your stories",
					trackId: "academic_journey" as TrackId,
					angle: 45,
				},
			];

			placeholders.forEach((p, idx) => {
				const radians = (p.angle * Math.PI) / 180;
				const distance = 250;

				rfNodes.push({
					id: p.id,
					type: "insight",
					position: {
						x: CANVAS_CENTER.x + Math.cos(radians) * distance,
						y: CANVAS_CENTER.y + Math.sin(radians) * distance,
					},
					data: {
						id: p.id,
						title: p.title,
						sourceTrackId: p.trackId,
						isAIGenerated: false,
						zoom,
					},
				});
			});
		}

		return { nodes: rfNodes, edges: rfEdges };
	}, [storeNodes, archetype, visibleLayers, zoom]);

	const [nodes, setNodes, onNodesChange] = useNodesState(generatedData.nodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(generatedData.edges);

	// Sync with generated data
	useEffect(() => {
		setNodes(generatedData.nodes);
		setEdges(generatedData.edges);
	}, [generatedData, setNodes, setEdges]);

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
					strokeOpacity: isHighlighted ? 0.8 : 0.2,
					transition: "stroke-opacity 0.3s ease",
				},
				animated: isHighlighted,
			};
		});
	}, [edges, selectedNodeId, hoveredNodeId]);

	const handleNodeClick = useCallback(
		(_event: React.MouseEvent, node: Node) => {
			setSelectedNodeId(node.id);
			selectNode(node.id);
			onNodeSelect?.(node.id);

			const nodeData = createModalData(node, storeNodes, archetype);
			if (nodeData) {
				setModalData(nodeData);
				setIsModalOpen(true);
			}
		},
		[onNodeSelect, storeNodes, archetype, selectNode],
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
				const nodeData = createModalData(node, storeNodes, archetype);
				if (nodeData) {
					setModalData(nodeData);
				}
			}
		},
		[nodes, storeNodes, archetype],
	);

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
				nodeTypes={nodeTypes}
				fitView
				fitViewOptions={{ padding: 0.3 }}
				minZoom={0.3}
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
