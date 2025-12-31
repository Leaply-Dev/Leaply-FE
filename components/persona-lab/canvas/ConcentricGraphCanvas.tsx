"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	ReactFlow,
	ReactFlowProvider,
	Background,
	Controls,
	useReactFlow,
	type OnNodesChange,
	type OnEdgesChange,
	applyNodeChanges,
	applyEdgeChanges,
	type Node,
	type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { usePersonaStore } from "@/lib/store/personaStore";
import { useConcentricLayout } from "@/lib/hooks/useConcentricLayout";
import { graphNodeTypes } from "./nodes/graphNodeTypes";
import { GraphControls } from "./GraphControls";
import { NodeDetailPanel } from "./NodeDetailPanel";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";

interface ConcentricGraphCanvasProps {
	className?: string;
}

/**
 * Inner component that uses React Flow hooks
 */
function ConcentricGraphCanvasInner({ className }: ConcentricGraphCanvasProps) {
	const { fitView, getZoom } = useReactFlow();
	const [zoom, setZoom] = useState(1);

	// Store state
	const {
		graphNodes,
		graphEdges,
		isGraphLoading,
		fetchPersonaGraph,
		selectedGraphNodeId,
		selectGraphNode,
		hoveredNodeId,
		setHoveredNode,
		showAllDetails,
		setShowAllDetails,
	} = usePersonaStore();

	// Layout hook
	const { calculateLayout } = useConcentricLayout();

	// Calculate layout
	const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
		if (graphNodes.length === 0) {
			return { nodes: [], edges: [] };
		}

		return calculateLayout(graphNodes, graphEdges, {
			centerX: 0,
			centerY: 0,
			selectedNodeId: selectedGraphNodeId,
			hoveredNodeId,
			showAllDetails,
			zoom,
		});
	}, [
		graphNodes,
		graphEdges,
		calculateLayout,
		selectedGraphNodeId,
		hoveredNodeId,
		showAllDetails,
		zoom,
	]);

	// Local state for React Flow (allows dragging etc.)
	const [nodes, setNodes] = useState<Node<GraphNodeData>[]>([]);
	const [edges, setEdges] = useState<Edge[]>([]);

	// Sync layout nodes with local state
	useEffect(() => {
		setNodes(layoutNodes);
		setEdges(layoutEdges);
	}, [layoutNodes, layoutEdges]);

	// Fetch graph data on mount
	useEffect(() => {
		fetchPersonaGraph();
	}, [fetchPersonaGraph]);

	// Track zoom level
	const handleMoveEnd = useCallback(() => {
		const currentZoom = getZoom();
		setZoom(currentZoom);
	}, [getZoom]);

	// Node change handler
	const onNodesChange: OnNodesChange<Node<GraphNodeData>> = useCallback(
		(changes) => {
			setNodes((nds) => applyNodeChanges(changes, nds) as Node<GraphNodeData>[]);
		},
		[],
	);

	// Edge change handler
	const onEdgesChange: OnEdgesChange = useCallback(
		(changes) => {
			setEdges((eds) => applyEdgeChanges(changes, eds));
		},
		[],
	);

	// Node click handler
	const handleNodeClick = useCallback(
		(_: React.MouseEvent, node: Node<GraphNodeData>) => {
			selectGraphNode(node.id === selectedGraphNodeId ? null : node.id);
		},
		[selectGraphNode, selectedGraphNodeId],
	);

	// Node hover handlers
	const handleNodeMouseEnter = useCallback(
		(_: React.MouseEvent, node: Node<GraphNodeData>) => {
			setHoveredNode(node.id);
		},
		[setHoveredNode],
	);

	const handleNodeMouseLeave = useCallback(() => {
		setHoveredNode(null);
	}, [setHoveredNode]);

	// Pane click - deselect node
	const handlePaneClick = useCallback(() => {
		selectGraphNode(null);
	}, [selectGraphNode]);

	// Double-click to fit view
	const handlePaneDoubleClick = useCallback(() => {
		fitView({ duration: 500, padding: 0.2 });
	}, [fitView]);

	// Get selected node data for detail panel
	const selectedNode = useMemo(() => {
		if (!selectedGraphNodeId) return null;
		return graphNodes.find((n) => n.id === selectedGraphNodeId) || null;
	}, [selectedGraphNodeId, graphNodes]);

	// Loading state
	if (isGraphLoading) {
		return (
			<div className={cn("flex items-center justify-center h-full", className)}>
				<div className="flex flex-col items-center gap-3">
					<div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
					<p className="text-sm text-muted-foreground">Đang tải graph...</p>
				</div>
			</div>
		);
	}

	// Empty state
	if (graphNodes.length === 0) {
		return (
			<div className={cn("flex items-center justify-center h-full", className)}>
				<div className="text-center p-8">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
						<svg
							className="w-8 h-8 text-muted-foreground"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold mb-2">Chưa có dữ liệu</h3>
					<p className="text-sm text-muted-foreground max-w-xs">
						Hoàn thành các cuộc hội thoại khám phá để xây dựng persona graph của bạn.
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className={cn("relative h-full", className)}>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={graphNodeTypes}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onNodeClick={handleNodeClick}
				onNodeMouseEnter={handleNodeMouseEnter}
				onNodeMouseLeave={handleNodeMouseLeave}
				onPaneClick={handlePaneClick}
				onDoubleClick={handlePaneDoubleClick}
				onMoveEnd={handleMoveEnd}
				fitView
				fitViewOptions={{ padding: 0.3 }}
				minZoom={0.2}
				maxZoom={2}
				defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
				proOptions={{ hideAttribution: true }}
				className="bg-background"
			>
				<Background color="#e5e7eb" gap={20} size={1} />
				<Controls
					showInteractive={false}
					position="bottom-left"
					className="!bg-background !border !border-border !shadow-md"
				/>
			</ReactFlow>

			{/* Custom controls */}
			<GraphControls
				showAllDetails={showAllDetails}
				onToggleDetails={() => setShowAllDetails(!showAllDetails)}
				onFitView={() => fitView({ duration: 500, padding: 0.2 })}
			/>

			{/* Detail panel for selected node */}
			{selectedNode && (
				<NodeDetailPanel
					node={selectedNode}
					onClose={() => selectGraphNode(null)}
				/>
			)}
		</div>
	);
}

/**
 * ConcentricGraphCanvas - Main canvas component
 *
 * Renders the 4-layer concentric persona graph using React Flow.
 * Wrapped in ReactFlowProvider for hooks to work.
 */
export function ConcentricGraphCanvas({ className }: ConcentricGraphCanvasProps) {
	return (
		<ReactFlowProvider>
			<ConcentricGraphCanvasInner className={className} />
		</ReactFlowProvider>
	);
}
