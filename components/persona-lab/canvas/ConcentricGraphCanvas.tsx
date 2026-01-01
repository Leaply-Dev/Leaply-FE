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
import { useForceLayout } from "@/lib/hooks/useForceLayout";
import { graphNodeTypes } from "./nodes/graphNodeTypes";
import { GraphControls } from "./GraphControls";
import { NodeDetailPanel } from "./NodeDetailPanel";
import type { GraphNodeData, PersonaNodeDto } from "@/lib/types/persona-graph";
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
    archetype,
    tracks,
  } = usePersonaStore();

  // Force-directed layout hook (Obsidian-style)
  const { calculateLayout } = useForceLayout();

  // Ensure there's always a center node (layer 0)
  const nodesWithCenter = useMemo(() => {
    const hasLayer0 = graphNodes.some((n) => n.layer === 0);
    if (hasLayer0) {
      return graphNodes;
    }

    // Create placeholder center node
    const centerNode: PersonaNodeDto = {
      id: "profile-center-placeholder",
      type: "profile_summary",
      layer: 0,
      title: archetype ? "Hồ sơ cá nhân" : "Hồ sơ cá nhân",
      content: archetype
        ? archetype.personalizedSummary
        : "Hoàn thành tracks để khám phá archetype của bạn",
      tags: [],
      primaryArchetype: archetype?.type,
      secondaryArchetype: null,
      archetypeSummary: archetype?.personalizedSummary,
      sourceTrackId: null,
      sourceQuestionId: null,
      confidence: archetype ? 0.8 : 0,
      createdAt: new Date().toISOString(),
    };

    return [centerNode, ...graphNodes];
  }, [graphNodes, archetype]);

  // Calculate layout
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    // Always render center node even if no other nodes
    if (nodesWithCenter.length === 0) {
      return { nodes: [], edges: [] };
    }

    return calculateLayout(nodesWithCenter, graphEdges, {
      centerX: 0,
      centerY: 0,
      selectedNodeId: selectedGraphNodeId,
      hoveredNodeId,
      showAllDetails,
      zoom,
    });
  }, [
    nodesWithCenter,
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
      setNodes(
        (nds) => applyNodeChanges(changes, nds) as Node<GraphNodeData>[],
      );
    },
    [],
  );

  // Edge change handler
  const onEdgesChange: OnEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

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
    return nodesWithCenter.find((n) => n.id === selectedGraphNodeId) || null;
  }, [selectedGraphNodeId, nodesWithCenter]);

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

  // Note: Empty state removed - we always show center node placeholder

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
export function ConcentricGraphCanvas({
  className,
}: ConcentricGraphCanvasProps) {
  return (
    <ReactFlowProvider>
      <ConcentricGraphCanvasInner className={className} />
    </ReactFlowProvider>
  );
}
