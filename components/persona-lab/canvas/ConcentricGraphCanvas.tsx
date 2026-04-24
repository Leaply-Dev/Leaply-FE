"use client";

import {
	ChevronRight,
	Eye,
	EyeOff,
	Info,
	Maximize2,
	MessageCircle,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import type { PersonaNodeDto } from "@/lib/api/personaLab/types";
import { getArchetypeConfig } from "@/lib/config/archetypeConfig";
import { getNodeConfig } from "@/lib/config/graphConfig";
import { PILLARS_CONFIG } from "@/lib/config/pillarsConfig";
import { useExpandNode } from "@/lib/hooks/persona";
import { useMockGraphData } from "@/lib/hooks/persona/useMockGraphData";
import { useContainerDimensions } from "@/lib/hooks/useContainerDimensions";
import { useGraphControls } from "@/lib/hooks/useGraphControls";
import { useGraphForces } from "@/lib/hooks/useGraphForces";
import { useGraphInteraction } from "@/lib/hooks/useGraphInteraction";
import { useGraphRenderers } from "@/lib/hooks/useGraphRenderers";
import {
	type StarStructureKey,
	usePersonaStore,
} from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";
import type { ApiForceGraphNode } from "@/lib/utils/graphTransform";

// Node types in the graph (matching API)
type NodeType = "profile_summary" | "essay_angle" | "key_story" | "detail";

// Alias for backwards compatibility
type ForceGraphNode = ApiForceGraphNode;

// STAR element labels for display
const STAR_LABELS: Record<StarStructureKey, string> = {
	situation: "Situation",
	task: "Task",
	action: "Action",
	result: "Result",
	emotion: "Emotion",
	insight: "Insight",
};

interface ConcentricGraphCanvasProps {
	className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function ConcentricGraphCanvas({
	className,
}: ConcentricGraphCanvasProps) {
	const t = useTranslations("personaLab");
	const locale = useLocale();
	const archetypeType = usePersonaStore((state) => state.archetypeType);
	const archetypeConfig = archetypeType
		? getArchetypeConfig(archetypeType)
		: null;

	// Load mock data when mock mode is enabled (development only)
	useMockGraphData();

	// Use all custom hooks for clean composition
	const { fgRef, graphData } = useGraphForces();
	const { dimensions, containerRef } = useContainerDimensions();

	// Node expansion mutation (adds follow-up question to chat)
	const expandNodeMutation = useExpandNode();

	// Get STAR gaps from store
	const getStarGapsForNode = usePersonaStore(
		(state) => state.getStarGapsForNode,
	);

	const {
		selectedNode,
		hoveredNode,
		hiddenNodeTypes,
		highlightNodes,
		highlightLinks,
		handleNodeClick,
		handleNodeHover,
		handleBackgroundClick,
		toggleNodeTypeVisibility,
	} = useGraphInteraction({ graphData, fgRef, dimensions });

	const {
		showLabels,
		handleZoomIn,
		handleZoomOut,
		handleFitView,
		toggleLabels,
	} = useGraphControls(fgRef);

	const { paintNode, paintLink, paintNodePointerArea, nodeTooltip } =
		useGraphRenderers({
			selectedNode,
			hoveredNode,
			showLabels,
			highlightNodes,
			highlightLinks,
			hiddenNodeTypes,
		});

	// Handler for expanding a node (getting follow-up question)
	const handleExpandNode = (nodeId: string) => {
		expandNodeMutation.mutate({ nodeId });
	};

	// Get PersonaNodeDto data for selected node with validation
	const selectedGraphNode: PersonaNodeDto | undefined = selectedNode?.data
		? (() => {
				const data = selectedNode.data as PersonaNodeDto;
				// Validate required fields exist
				if (data && typeof data.id === "string") {
					return data;
				}
				console.warn("[ConcentricGraphCanvas] Invalid node data:", data);
				return undefined;
			})()
		: undefined;

	// Get STAR gaps for selected key_story node
	const selectedNodeStarGaps =
		selectedNode && selectedNode.type === "key_story"
			? getStarGapsForNode(selectedNode.id)
			: [];

	const selectedNodeTitle =
		selectedNode?.type === "profile_summary" && archetypeConfig
			? locale === "vi"
				? archetypeConfig.titleVi
				: archetypeConfig.title
			: selectedNode?.label;

	// Check if graph is empty (no nodes)
	const isEmpty = graphData.nodes.length === 0;

	return (
		<div ref={containerRef} className={cn("relative h-full w-full", className)}>
			{/* Empty State */}
			{isEmpty && (
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
					<div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
						<MessageCircle className="w-8 h-8 text-muted-foreground" />
					</div>
					<h3 className="text-lg font-semibold mb-2">
						{t("emptyCanvasTitle")}
					</h3>
					<p className="text-sm text-muted-foreground max-w-xs">
						{t("emptyCanvasDesc")}
					</p>
				</div>
			)}

			{/* Force Graph */}
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				width={dimensions.width}
				height={dimensions.height}
				nodeId="id"
				nodeRelSize={1}
				nodeVal={(node) => (node as unknown as ForceGraphNode).size}
				nodeCanvasObject={paintNode}
				nodePointerAreaPaint={paintNodePointerArea}
				linkCanvasObject={paintLink}
				onNodeClick={handleNodeClick}
				onNodeHover={handleNodeHover}
				onBackgroundClick={handleBackgroundClick}
				nodeLabel={nodeTooltip}
				enableNodeDrag={true}
				enableZoomInteraction={true}
				enablePanInteraction={true}
				cooldownTicks={100}
				onEngineStop={() => fgRef.current?.zoomToFit(400, 50)}
				d3AlphaDecay={0.02}
				d3VelocityDecay={0.3}
				warmupTicks={100}
			/>

			{/* Controls - only show when there are nodes */}
			{!isEmpty && (
				<div className="absolute top-4 right-4 flex flex-col gap-2">
					<Button
						variant="secondary"
						size="icon"
						onClick={handleZoomIn}
						className="shadow-lg"
						title="Zoom In"
					>
						<ZoomIn className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={handleZoomOut}
						className="shadow-lg"
						title="Zoom Out"
					>
						<ZoomOut className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={handleFitView}
						className="shadow-lg"
						title="Fit View"
					>
						<Maximize2 className="h-4 w-4" />
					</Button>
					<Button
						variant="secondary"
						size="icon"
						onClick={toggleLabels}
						className="shadow-lg"
						title={showLabels ? "Hide Labels" : "Show Labels"}
					>
						{showLabels ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</Button>
				</div>
			)}

			{/* Legend - only show when there are nodes */}
			{!isEmpty && (
				<div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg max-w-xs">
					<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
						<Info className="h-4 w-4" />
						Graph Layers
					</h3>
					<div className="space-y-2.5 text-xs">
						{/* Display hierarchical order of API node types */}
						{(
							[
								{
									type: "profile_summary",
									layer: "Center",
									desc: "Core identity",
								},
								{ type: "essay_angle", layer: "Inner", desc: "Essay themes" },
								{ type: "key_story", layer: "Middle", desc: "Key narratives" },
								{ type: "detail", layer: "Outer", desc: "Evidence" },
							] as Array<{ type: NodeType; layer: string; desc: string }>
						).map(({ type, layer, desc }) => {
							const config = getNodeConfig(type);
							const isHidden = hiddenNodeTypes.has(type);
							return (
								<button
									key={type}
									type="button"
									className="flex items-start gap-2 w-full hover:bg-muted/50 rounded px-2 py-1.5 transition-colors"
									onClick={() => toggleNodeTypeVisibility(type)}
									title={
										isHidden ? `Show ${config.label}` : `Hide ${config.label}`
									}
								>
									<div
										className="w-3 h-3 rounded-full shrink-0 mt-0.5"
										style={{
											backgroundColor: config.color,
											opacity: isHidden ? 0.3 : 1,
										}}
									/>
									<div className="flex-1 text-left">
										<div className="flex items-center gap-1.5">
											<span
												className="font-medium text-foreground"
												style={{ opacity: isHidden ? 0.5 : 1 }}
											>
												{config.label}
											</span>
											<span
												className="text-[10px] text-muted-foreground/60"
												style={{ opacity: isHidden ? 0.5 : 1 }}
											>
												({layer})
											</span>
										</div>
										<div
											className="text-[10px] text-muted-foreground mt-0.5"
											style={{ opacity: isHidden ? 0.5 : 1 }}
										>
											{desc}
										</div>
									</div>
									{isHidden ? (
										<EyeOff className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
									) : (
										<Eye className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
									)}
								</button>
							);
						})}
					</div>

					{/* Pillar badges section */}
					<div className="mt-4 pt-3 border-t border-border">
						<div className="text-[11px] font-semibold text-foreground mb-2">
							{t("pillarBadges")}
						</div>
						<div className="space-y-1.5">
							{(["pillar1", "pillar2", "origin"] as const).map((p) => {
								const cfg = PILLARS_CONFIG[p];
								return (
									<div key={p} className="flex items-center gap-2">
										<div
											className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
											style={{
												backgroundColor: cfg.badgeColor,
												color: cfg.badgeTextColor,
											}}
										>
											{cfg.badgeLetter}
										</div>
										<span className="text-[11px] text-foreground">
											{cfg.label}
										</span>
									</div>
								);
							})}
						</div>
					</div>

					<div className="mt-4 pt-3 border-t border-border">
						<div className="text-xs text-muted-foreground space-y-2.5">
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<div className="w-8 h-0.5 bg-blue-500/40" />
									<span className="font-medium text-foreground">
										Connection
									</span>
								</div>
								<div className="text-[10px] ml-10">
									Normal relationships (supports, builds on, enables)
								</div>
							</div>
							<div className="space-y-1">
								<div className="flex items-center gap-2">
									<div
										className="w-8 h-0.5 animate-pulse"
										style={{
											background:
												"linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0.3) 50%, #f97316 100%)",
										}}
									/>
									<span className="font-medium text-foreground">Tension</span>
								</div>
								<div className="text-[10px] ml-10">
									Conflicts & evolution (contradicts, transforms)
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Selected Node Detail Panel */}
			{selectedNode && (
				<div
					className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm border-2 rounded-lg p-5 shadow-2xl max-w-md min-w-[320px]"
					style={{
						borderColor: getNodeConfig(selectedNode.type).color,
					}}
				>
					<div className="flex items-start justify-between mb-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<div
									className="rounded-full"
									style={{
										backgroundColor: getNodeConfig(selectedNode.type).color,
										width: "16px",
										height: "16px",
										boxShadow: `0 0 0 2px rgba(255,255,255,0.1), 0 0 0 4px ${getNodeConfig(selectedNode.type).color}40`,
									}}
								/>
								<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									{selectedNode.type === "story"
										? (
												(selectedNode.data as { story_type?: string })
													?.story_type ?? "Story"
											).replace("_", " ")
										: getNodeConfig(selectedNode.type).label}
								</span>
							</div>
							<h3 className="font-bold text-base">{selectedNodeTitle}</h3>
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleBackgroundClick}
							className="h-7 w-7 p-0 hover:bg-destructive/10"
						>
							×
						</Button>
					</div>

					{/* Unified minimal node content — all types share the same layout */}
					<div className="space-y-3">
						{selectedGraphNode && (
							<>
								{/* Content */}
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content || "No content"}
									</p>
								</div>

								{/* Takeaway / CTA (from essayAngle) */}
								{selectedGraphNode.essayAngle && (
									<div className="p-3 bg-amber-500/5 rounded-md border border-amber-500/15">
										<p className="text-xs text-amber-700 leading-relaxed">
											<span className="mr-1">💡</span>
											{selectedGraphNode.essayAngle}
										</p>
									</div>
								)}

								{/* Expand Button for story nodes with gaps */}
								{selectedNode.type === "key_story" &&
									selectedNodeStarGaps.length > 0 && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleExpandNode(selectedNode.id)}
											disabled={expandNodeMutation.isPending}
											className="w-full text-xs border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10"
										>
											{expandNodeMutation.isPending ? (
												"Generating question..."
											) : (
												<>
													<ChevronRight className="w-3 h-3 mr-1" />
													Expand: Tell me more about{" "}
													{selectedNodeStarGaps
														.slice(0, 2)
														.map((g) => STAR_LABELS[g].toLowerCase())
														.join(", ")}
												</>
											)}
										</Button>
									)}

								{/* Tags */}
								{selectedGraphNode.tags &&
									selectedGraphNode.tags.length > 0 && (
										<div className="flex flex-wrap gap-1">
											{selectedGraphNode.tags.map((tag) => (
												<span
													key={tag}
													className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground"
												>
													{tag}
												</span>
											))}
										</div>
									)}
							</>
						)}
					</div>
				</div>
			)}
			{/* Stats Badge - only show when there are nodes */}
			{!isEmpty && (
				<div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
					<div className="text-xs text-muted-foreground">
						<span className="font-medium">{graphData.nodes.length}</span> nodes
						· <span className="font-medium">{graphData.links.length}</span>{" "}
						connections
					</div>
				</div>
			)}
		</div>
	);
}
