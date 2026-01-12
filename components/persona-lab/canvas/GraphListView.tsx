"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	BookOpen,
	ChevronDown,
	ChevronRight,
	FileText,
	MessageCircle,
	Monitor,
	Sparkles,
	Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LAYOUT_CONFIG } from "@/lib/hooks/useForceLayout";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { GraphNode, GraphNodeLayer } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

// Hook for responsive mobile detection
function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		// Initial check
		checkMobile();

		// Add listener
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [breakpoint]);

	return isMobile;
}

const LAYER_CONFIG: Record<
	GraphNodeLayer,
	{ label: string; icon: typeof Sparkles; description: string }
> = {
	0: {
		label: "Profile Summary",
		icon: Sparkles,
		description: "Overview and archetype",
	},
	1: {
		label: "Essay Angles",
		icon: Target,
		description: "Key themes for essays",
	},
	2: {
		label: "Key Stories",
		icon: BookOpen,
		description: "Important experiences",
	},
	3: {
		label: "Details",
		icon: FileText,
		description: "Supporting evidence and insights",
	},
};

interface GraphListViewProps {
	className?: string;
}

/**
 * GraphListView - Mobile fallback for the graph
 *
 * Displays nodes grouped by layer in a list format.
 * Uses real-time graph data from chat conversation.
 * Shows a banner prompting users to use desktop for the full graph.
 */
export function GraphListView({ className }: GraphListViewProps) {
	// Use apiGraphNodes from chat-based updates (new system)
	const apiGraphNodes = usePersonaStore((state) => state.apiGraphNodes);
	const [expandedLayers, setExpandedLayers] = useState<Set<number>>(
		new Set([0, 1]),
	);
	const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
	const isMobile = useIsMobile(768);

	// Group nodes by layer with validation
	const nodesByLayer = useMemo(() => {
		const validLayers: GraphNodeLayer[] = [0, 1, 2, 3];
		const groups = new Map<GraphNodeLayer, GraphNode[]>();
		validLayers.forEach((layer) => {
			groups.set(layer, []);
		});

		apiGraphNodes.forEach((node) => {
			// Validate layer is a valid GraphNodeLayer (0-3)
			const layer = node.layer as number;
			if (!validLayers.includes(layer as GraphNodeLayer)) {
				console.warn(
					`[GraphListView] Invalid layer ${layer} for node ${node.id}, defaulting to layer 3`,
				);
				// Default invalid layers to outermost layer (detail)
				const layerNodes = groups.get(3) || [];
				layerNodes.push(node);
				groups.set(3, layerNodes);
				return;
			}
			const layerNodes = groups.get(layer as GraphNodeLayer) || [];
			layerNodes.push(node);
			groups.set(layer as GraphNodeLayer, layerNodes);
		});

		return groups;
	}, [apiGraphNodes]);

	// Toggle layer expansion
	const toggleLayer = (layer: number) => {
		setExpandedLayers((prev) => {
			const next = new Set(prev);
			if (next.has(layer)) {
				next.delete(layer);
			} else {
				next.add(layer);
			}
			return next;
		});
	};

	// Empty state
	const isEmpty = apiGraphNodes.length === 0;

	if (isEmpty) {
		return (
			<div
				className={cn(
					"flex flex-col items-center justify-center h-full p-8",
					className,
				)}
			>
				<div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
					<MessageCircle className="w-8 h-8 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
				<p className="text-sm text-muted-foreground text-center max-w-xs">
					Share your stories in the chat to build your persona graph.
				</p>
			</div>
		);
	}

	return (
		<div className={cn("flex flex-col h-full overflow-hidden", className)}>
			{/* Desktop prompt banner - only show on mobile */}
			{isMobile && (
				<div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center gap-3">
					<div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
						<Monitor className="w-5 h-5" />
					</div>
					<div>
						<p className="text-sm font-medium">View full graph on desktop</p>
						<p className="text-xs text-white/80">
							Open on a larger screen for interactive visualization
						</p>
					</div>
				</div>
			)}

			{/* Node list by layer */}
			<div className="flex-1 overflow-y-auto">
				{([0, 1, 2, 3] as GraphNodeLayer[]).map((layer) => {
					const nodes = nodesByLayer.get(layer) || [];
					const config = LAYER_CONFIG[layer];
					const isExpanded = expandedLayers.has(layer);
					const layerColor = LAYOUT_CONFIG.colors[layer];
					const Icon = config.icon;

					if (nodes.length === 0 && layer !== 0) return null;

					return (
						<div key={layer} className="border-b last:border-b-0">
							{/* Layer header */}
							<button
								type="button"
								className={cn(
									"w-full flex items-center gap-3 p-4 text-left",
									"hover:bg-muted/50 transition-colors",
								)}
								onClick={() => toggleLayer(layer)}
							>
								<div
									className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
									style={{ backgroundColor: `${layerColor}15` }}
								>
									<Icon className="w-4 h-4" style={{ color: layerColor }} />
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-sm font-semibold">
											{config.label}
										</span>
										<span
											className="text-xs px-1.5 py-0.5 rounded-full"
											style={{
												backgroundColor: `${layerColor}15`,
												color: layerColor,
											}}
										>
											{nodes.length}
										</span>
									</div>
									<p className="text-xs text-muted-foreground truncate">
										{config.description}
									</p>
								</div>

								{isExpanded ? (
									<ChevronDown className="w-4 h-4 text-muted-foreground" />
								) : (
									<ChevronRight className="w-4 h-4 text-muted-foreground" />
								)}
							</button>

							{/* Layer nodes */}
							<AnimatePresence>
								{isExpanded && (
									<motion.div
										initial={{ height: 0, opacity: 0 }}
										animate={{ height: "auto", opacity: 1 }}
										exit={{ height: 0, opacity: 0 }}
										transition={{ duration: 0.2 }}
										className="overflow-hidden"
									>
										{nodes.length === 0 ? (
											<div className="px-4 pb-4 pl-14">
												<p className="text-xs text-muted-foreground italic">
													No data yet. Keep chatting to discover more.
												</p>
											</div>
										) : (
											<div className="px-4 pb-4 pl-14 space-y-2">
												{nodes.map((node) => (
													<NodeListItem
														key={node.id}
														node={node}
														layerColor={layerColor}
														isSelected={selectedNodeId === node.id}
														onClick={() =>
															setSelectedNodeId(
																selectedNodeId === node.id ? null : node.id,
															)
														}
													/>
												))}
											</div>
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// Individual node item component
interface NodeListItemProps {
	node: GraphNode;
	layerColor: string;
	isSelected: boolean;
	onClick: () => void;
}

function NodeListItem({
	node,
	layerColor,
	isSelected,
	onClick,
}: NodeListItemProps) {
	return (
		<motion.button
			className={cn(
				"w-full text-left p-3 rounded-lg border transition-all",
				"hover:shadow-sm",
				isSelected
					? "border-2 shadow-sm"
					: "border-border hover:border-muted-foreground/30",
			)}
			style={{
				borderColor: isSelected ? layerColor : undefined,
				backgroundColor: isSelected ? `${layerColor}05` : "transparent",
			}}
			onClick={onClick}
			initial={false}
			animate={{ scale: isSelected ? 1.01 : 1 }}
		>
			{/* Title */}
			<h4 className="text-sm font-medium text-foreground mb-1">{node.title}</h4>

			{/* Content (was description in old API) */}
			<p
				className={cn(
					"text-xs text-muted-foreground",
					isSelected ? "" : "line-clamp-2",
				)}
			>
				{node.content}
			</p>

			{/* Essay angle badge (for profile_summary nodes) */}
			{node.essayAngle && (
				<div
					className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium"
					style={{
						backgroundColor: `${layerColor}15`,
						color: layerColor,
					}}
				>
					<Target className="w-3 h-3" />
					{node.essayAngle}
				</div>
			)}

			{/* Tags */}
			{isSelected && node.tags && node.tags.length > 0 && (
				<div className="flex flex-wrap gap-1 mt-2">
					{node.tags.map((tag) => (
						<span
							key={tag}
							className="text-[10px] px-1.5 py-0.5 rounded-full"
							style={{
								backgroundColor: `${layerColor}15`,
								color: layerColor,
							}}
						>
							{tag}
						</span>
					))}
				</div>
			)}

			{/* Best for indicator */}
			{isSelected && node.bestFor && node.bestFor.length > 0 && (
				<div className="mt-2 text-[10px] text-muted-foreground">
					<span className="font-medium">Best for:</span>{" "}
					{node.bestFor.join(", ")}
				</div>
			)}

			{/* Word count potential */}
			{isSelected && node.wordCountPotential && (
				<div className="mt-1 text-[10px] text-muted-foreground">
					<span className="font-medium">Word count:</span>{" "}
					{node.wordCountPotential}
				</div>
			)}
		</motion.button>
	);
}
