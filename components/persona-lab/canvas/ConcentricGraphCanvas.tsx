"use client";

import {
	ChevronRight,
	Eye,
	EyeOff,
	Info,
	Maximize2,
	ZoomIn,
	ZoomOut,
} from "lucide-react";
import ForceGraph2D from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import { getNodeConfig } from "@/lib/config/graphConfig";
import { useContainerDimensions } from "@/lib/hooks/useContainerDimensions";
import { useGraphControls } from "@/lib/hooks/useGraphControls";
import { useGraphForces } from "@/lib/hooks/useGraphForces";
import { useGraphInteraction } from "@/lib/hooks/useGraphInteraction";
import { useGraphRenderers } from "@/lib/hooks/useGraphRenderers";
import { useExpandNode } from "@/lib/hooks/usePersonaConversation";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { GraphNode, StarStructure } from "@/lib/types/persona";
import type { ForceGraphNode, NodeType } from "@/lib/types/persona-canvas";
import { cn } from "@/lib/utils";

// STAR element labels for display
const STAR_LABELS: Record<keyof StarStructure, string> = {
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
	// Use all custom hooks for clean composition
	const { fgRef, graphData } = useGraphForces();
	const { dimensions, containerRef } = useContainerDimensions();

	// Node expansion mutation (adds follow-up question to chat)
	const expandNodeMutation = useExpandNode();

	// Get STAR gaps from store
	const getStarGapsForNode = usePersonaStore(
		(state) => state.getStarGapsForNode,
	);
	const apiGraphNodes = usePersonaStore((state) => state.apiGraphNodes);

	// Check if we're using new API data (not mock)
	const isUsingApiData = apiGraphNodes.length > 0;

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
		expandNodeMutation.mutate(nodeId);
	};

	// Get GraphNode data for selected node if using API data
	const selectedGraphNode: GraphNode | undefined =
		selectedNode && isUsingApiData
			? (selectedNode.data as GraphNode)
			: undefined;

	// Get STAR gaps for selected key_story node
	const selectedNodeStarGaps =
		selectedNode && selectedNode.type === "key_story"
			? getStarGapsForNode(selectedNode.id)
			: [];

	return (
		<div ref={containerRef} className={cn("relative h-full w-full", className)}>
			{/* Force Graph */}
			<ForceGraph2D
				ref={fgRef}
				graphData={graphData}
				width={dimensions.width}
				height={dimensions.height}
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

			{/* Controls */}
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

			{/* Legend - shows different node types based on data source */}
			<div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
				<h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
					<Info className="h-4 w-4" />
					{isUsingApiData ? "Graph Layers" : "Nodes"}
				</h3>
				<div className="space-y-2 text-xs">
					{/* Display hierarchical order based on data source */}
					{(isUsingApiData
						? ([
								"profile_summary",
								"essay_angle",
								"key_story",
								"detail",
							] as NodeType[])
						: ([
								"archetype",
								"pattern",
								"value",
								"skill",
								"story",
							] as NodeType[])
					).map((type) => {
						const config = getNodeConfig(type);
						const isHidden = hiddenNodeTypes.has(type);
						return (
							<button
								key={type}
								type="button"
								className="flex items-center gap-2 w-full hover:bg-muted/50 rounded px-2 py-1 transition-colors"
								onClick={() => toggleNodeTypeVisibility(type)}
								title={
									isHidden ? `Show ${config.label}` : `Hide ${config.label}`
								}
							>
								<div
									className="rounded-full shrink-0"
									style={{
										backgroundColor: config.color,
										width: `${Math.max(config.size / 2, 8)}px`,
										height: `${Math.max(config.size / 2, 8)}px`,
										opacity: isHidden ? 0.3 : 1,
									}}
								/>
								<span
									className="text-muted-foreground flex-1 text-left"
									style={{ opacity: isHidden ? 0.5 : 1 }}
								>
									{config.label}
									{config.layer === 0 && " (Center)"}
								</span>
								{isHidden ? (
									<EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
								) : (
									<Eye className="h-3 w-3 text-muted-foreground shrink-0" />
								)}
							</button>
						);
					})}
				</div>

				<div className="mt-4 pt-3 border-t border-border">
					<div className="text-xs text-muted-foreground space-y-1">
						<div className="flex items-center gap-2">
							<div className="w-8 h-0.5 bg-blue-500/40" />
							<span>Connection</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className="w-8 h-0.5 animate-pulse"
								style={{
									background:
										"linear-gradient(90deg, #f97316 0%, rgba(249, 115, 22, 0.3) 50%, #f97316 100%)",
								}}
							/>
							<span>Tension</span>
						</div>
					</div>
				</div>
			</div>

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
												selectedNode.data as { story_type: string }
											).story_type.replace("_", " ")
										: getNodeConfig(selectedNode.type).label}
								</span>
							</div>
							<h3 className="font-bold text-base">{selectedNode.label}</h3>
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

					{/* Type-specific content */}
					<div className="space-y-3">
						{/* ============================================
						    New API Node Types (profile_summary, essay_angle, key_story, detail)
						    ============================================ */}

						{/* Profile Summary (Layer 0 - Center) */}
						{selectedNode.type === "profile_summary" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>
								{selectedGraphNode.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{selectedGraphNode.tags.map((tag) => (
											<span
												key={tag}
												className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</>
						)}

						{/* Essay Angle (Layer 1) */}
						{selectedNode.type === "essay_angle" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>
								{selectedGraphNode.essayAngle && (
									<div className="p-3 bg-violet-500/10 rounded-md">
										<span className="text-xs font-semibold text-violet-600 block mb-1">
											Essay Angle
										</span>
										<p className="text-xs text-muted-foreground">
											{selectedGraphNode.essayAngle}
										</p>
									</div>
								)}
								{selectedGraphNode.bestFor &&
									selectedGraphNode.bestFor.length > 0 && (
										<div>
											<span className="text-xs font-medium text-foreground block mb-1">
												Best for:
											</span>
											<div className="flex flex-wrap gap-1">
												{selectedGraphNode.bestFor.map((type) => (
													<span
														key={type}
														className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
													>
														{type.replace(/_/g, " ")}
													</span>
												))}
											</div>
										</div>
									)}
							</>
						)}

						{/* Key Story (Layer 2) - with STAR structure */}
						{selectedNode.type === "key_story" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>

								{/* STAR Structure Panel */}
								{selectedGraphNode.structuredContent && (
									<div className="p-3 bg-emerald-500/5 rounded-md border border-emerald-500/20">
										<span className="text-xs font-semibold text-emerald-600 block mb-2">
											STAR Structure
										</span>
										<div className="space-y-2">
											{(
												Object.keys(STAR_LABELS) as (keyof StarStructure)[]
											).map((key) => {
												const value =
													selectedGraphNode.structuredContent?.[key];
												const hasGap = selectedNodeStarGaps.includes(key);
												return (
													<div
														key={key}
														className={cn("text-xs", hasGap && "opacity-50")}
													>
														<span
															className={cn(
																"font-medium",
																hasGap ? "text-orange-500" : "text-foreground",
															)}
														>
															{STAR_LABELS[key]}:
														</span>{" "}
														<span className="text-muted-foreground">
															{value || (
																<span className="italic text-orange-500">
																	Missing - expand for details
																</span>
															)}
														</span>
													</div>
												);
											})}
										</div>
									</div>
								)}

								{/* Expand Button for nodes with gaps */}
								{selectedNodeStarGaps.length > 0 && (
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
								{selectedGraphNode.tags.length > 0 && (
									<div className="flex flex-wrap gap-1">
										{selectedGraphNode.tags.map((tag) => (
											<span
												key={tag}
												className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
											>
												{tag}
											</span>
										))}
									</div>
								)}
							</>
						)}

						{/* Detail (Layer 3) */}
						{selectedNode.type === "detail" && selectedGraphNode && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{selectedGraphNode.content}
									</p>
								</div>
								{selectedGraphNode.wordCountPotential && (
									<div className="text-xs">
										<span className="font-medium text-foreground">
											Word count potential:
										</span>{" "}
										<span className="text-muted-foreground">
											{selectedGraphNode.wordCountPotential}
										</span>
									</div>
								)}
							</>
						)}

						{/* ============================================
						    Legacy Node Types (story, pattern, archetype, skill, value)
						    ============================================ */}
						{selectedNode.type === "story" && (
							<>
								{/* Description */}
								<div className="p-3 bg-muted/50 rounded-md">
									<p className="text-xs leading-relaxed">
										{(selectedNode.data as { description: string }).description}
									</p>
								</div>

								{/* Track info */}
								<div className="text-xs">
									<span className="font-medium text-foreground">
										From track:
									</span>
									<span className="ml-1 text-muted-foreground capitalize">
										{(selectedNode.data as { track: string }).track.replace(
											"_",
											" ",
										)}
									</span>
								</div>
							</>
						)}
						{selectedNode.type === "pattern" && (
							<>
								{/* Pattern Description */}
								<div>
									<span className="text-xs font-semibold text-foreground block mb-2">
										What This Pattern Reveals
									</span>
									<div className="p-3 bg-muted/50 rounded-md">
										<p className="text-xs leading-relaxed">
											{
												(
													selectedNode.data as {
														pattern_description: string;
													}
												).pattern_description
											}
										</p>
									</div>
								</div>

								{/* Essay Angles - Most Important for Students! */}
								{(
									selectedNode.data as {
										essay_angles: Array<{
											name: string;
											frame: string;
											strength: number;
											uniqueness: number;
										}>;
									}
								).essay_angles.length > 0 && (
									<div>
										<span className="text-xs font-semibold text-foreground block mb-2">
											💡 Essay Angle Ideas (
											{
												(selectedNode.data as { essay_angles: unknown[] })
													.essay_angles.length
											}
											)
										</span>
										<div className="space-y-2">
											{(
												selectedNode.data as {
													essay_angles: Array<{
														name: string;
														frame: string;
														strength: number;
														uniqueness: number;
														fit: string[];
													}>;
												}
											).essay_angles.map((angle) => (
												<div
													key={angle.name}
													className="p-3 bg-muted/30 rounded-md border border-muted"
												>
													<div className="flex items-start justify-between mb-1">
														<p className="text-xs font-semibold text-foreground">
															{angle.name}
														</p>
														<div className="flex gap-1">
															<span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-medium">
																{angle.uniqueness}% unique
															</span>
														</div>
													</div>
													<p className="text-[11px] text-muted-foreground leading-relaxed mb-2">
														{angle.frame}
													</p>
													<div className="flex flex-wrap gap-1">
														{angle.fit.map((type) => (
															<span
																key={type}
																className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary"
															>
																{type.replace(/_/g, " ")}
															</span>
														))}
													</div>
												</div>
											))}
										</div>
									</div>
								)}

								{/* Supporting Stories */}
								<div className="text-xs">
									<span className="font-medium text-foreground">Based on</span>
									<span className="ml-1 text-muted-foreground">
										{
											(selectedNode.data as { member_stories: unknown[] })
												.member_stories.length
										}{" "}
										stories
									</span>
								</div>
							</>
						)}
						{selectedNode.type === "archetype" && (
							<>
								{/* Evolution Direction */}
								<div className="p-3 bg-muted/50 rounded-md">
									<span className="text-xs font-semibold text-foreground block mb-2">
										Your Evolution
									</span>
									<p className="text-xs text-muted-foreground leading-relaxed">
										{
											(
												selectedNode.data as {
													evolution_direction: string;
												}
											).evolution_direction
										}
									</p>
								</div>

								{/* Secondary Traits */}
								{(selectedNode.data as { secondary_traits?: string[] })
									.secondary_traits && (
									<div>
										<span className="text-xs font-semibold text-foreground block mb-2">
											Supporting Traits
										</span>
										<div className="flex flex-wrap gap-1">
											{(
												selectedNode.data as { secondary_traits: string[] }
											).secondary_traits.map((trait) => (
												<span
													key={trait}
													className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground capitalize"
												>
													{trait.replace("_", " ")}
												</span>
											))}
										</div>
									</div>
								)}
							</>
						)}
						{selectedNode.type === "skill" && (
							<>
								{/* Proficiency and Growth */}
								<div className="grid grid-cols-2 gap-3">
									<div className="p-3 bg-muted/50 rounded-md">
										<span className="text-xs font-medium text-foreground block mb-1">
											Level
										</span>
										<p
											className="text-xs font-bold capitalize"
											style={{
												color: getNodeConfig(selectedNode.type).color,
											}}
										>
											{
												(
													selectedNode.data as {
														proficiency: string;
													}
												).proficiency
											}
										</p>
									</div>
									<div className="p-3 bg-muted/50 rounded-md">
										<span className="text-xs font-medium text-foreground block mb-1">
											Growth
										</span>
										<p
											className="text-xs font-bold capitalize"
											style={{
												color: getNodeConfig(selectedNode.type).color,
											}}
										>
											{
												(
													selectedNode.data as {
														growth_trajectory: string;
													}
												).growth_trajectory
											}
										</p>
									</div>
								</div>

								{/* Evidence from stories */}
								<div>
									<span className="text-xs font-semibold text-foreground block mb-2">
										Why We See This Skill
									</span>
									<div className="p-3 bg-muted/50 rounded-md">
										<p className="text-xs text-muted-foreground">
											Demonstrated in{" "}
											<span className="font-medium text-foreground">
												{
													(selectedNode.data as { evidence: string[] }).evidence
														.length
												}{" "}
												{(selectedNode.data as { evidence: string[] }).evidence
													.length === 1
													? "story"
													: "stories"}
											</span>{" "}
											from your experiences
										</p>
									</div>
								</div>

								{/* Essay Value */}
								<div className="flex items-center justify-between text-xs p-3 bg-muted/50 rounded-md">
									<span className="font-medium text-foreground">
										Essay Value:
									</span>
									<span
										className="font-bold"
										style={{
											color:
												(selectedNode.data as { essay_value: number })
													.essay_value >= 80
													? "#10b981"
													: (selectedNode.data as { essay_value: number })
																.essay_value >= 70
														? "#f59e0b"
														: "#6b7280",
										}}
									>
										{(selectedNode.data as { essay_value: number }).essay_value}
										/100
									</span>
								</div>
							</>
						)}
						{selectedNode.type === "value" && (
							<>
								<div className="p-3 bg-muted/50 rounded-md">
									<span className="text-xs font-medium text-foreground block mb-2">
										Value Hierarchy
									</span>
									<div className="space-y-1">
										{(
											selectedNode.data as { value_hierarchy: string[] }
										).value_hierarchy
											.slice(0, 5)
											.map((value, index) => (
												<div key={value} className="flex items-center gap-2">
													<span className="text-xs font-bold text-muted-foreground">
														#{index + 1}
													</span>
													<span className="text-xs capitalize">
														{value.replace("_", " ")}
													</span>
												</div>
											))}
									</div>
								</div>
								{(selectedNode.data as { tensions?: unknown[] }).tensions && (
									<div className="text-xs">
										<span className="font-medium text-foreground">
											Tensions:
										</span>
										<p className="text-muted-foreground mt-1">
											{
												(selectedNode.data as { tensions: unknown[] }).tensions
													.length
											}{" "}
											value conflicts identified
										</p>
									</div>
								)}
							</>
						)}
					</div>
				</div>
			)}

			{/* Stats Badge */}
			<div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
				<div className="text-xs text-muted-foreground">
					<span className="font-medium">{graphData.nodes.length}</span> nodes ·{" "}
					<span className="font-medium">{graphData.links.length}</span>{" "}
					connections
				</div>
			</div>
		</div>
	);
}
