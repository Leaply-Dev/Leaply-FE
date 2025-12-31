"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Target, BookOpen, FileText } from "lucide-react";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";
import type { PersonaNodeDto, LayerNumber } from "@/lib/types/persona-graph";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NodeDetailPanelProps {
	node: PersonaNodeDto;
	onClose: () => void;
}

const LAYER_ICONS = {
	0: Sparkles,
	1: Target,
	2: BookOpen,
	3: FileText,
};

const LAYER_LABELS = {
	0: "Hồ sơ cá nhân",
	1: "Góc nhìn Essay",
	2: "Câu chuyện chính",
	3: "Chi tiết",
};

/**
 * NodeDetailPanel - Slide-in panel showing selected node details
 *
 * Appears on the right side when a node is selected.
 * Shows full content, tags, source info, and confidence.
 */
export function NodeDetailPanel({ node, onClose }: NodeDetailPanelProps) {
	const layerColor = LAYOUT_CONFIG.colors[node.layer as LayerNumber];
	const LayerIcon = LAYER_ICONS[node.layer as LayerNumber] || FileText;
	const layerLabel = LAYER_LABELS[node.layer as LayerNumber] || "Node";

	const trackColors = node.sourceTrackId
		? TRACK_COLORS[node.sourceTrackId]
		: null;

	const primaryArchetype = node.primaryArchetype
		? ARCHETYPES[node.primaryArchetype]
		: null;

	return (
		<AnimatePresence>
			<motion.div
				className={cn(
					"absolute top-4 right-4 bottom-4 z-20",
					"w-72 bg-background rounded-xl border shadow-xl overflow-hidden",
					"flex flex-col",
				)}
				initial={{ x: 300, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: 300, opacity: 0 }}
				transition={{ type: "spring", damping: 25, stiffness: 300 }}
			>
				{/* Header */}
				<div
					className="p-4 border-b flex items-start gap-3"
					style={{ backgroundColor: `${layerColor}08` }}
				>
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
						style={{ backgroundColor: `${layerColor}20` }}
					>
						<LayerIcon className="w-5 h-5" style={{ color: layerColor }} />
					</div>

					<div className="flex-1 min-w-0">
						<p
							className="text-xs font-medium mb-1"
							style={{ color: layerColor }}
						>
							{layerLabel}
						</p>
						<h3 className="text-sm font-semibold text-foreground line-clamp-2">
							{node.title}
						</h3>
					</div>

					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="w-8 h-8 shrink-0 -mt-1 -mr-1"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>

				{/* Content */}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{/* Main content */}
					<div>
						<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
							Nội dung
						</h4>
						<p className="text-sm text-foreground leading-relaxed">
							{node.content}
						</p>
					</div>

					{/* Archetype info (layer 0 only) */}
					{primaryArchetype && (
						<div
							className="p-3 rounded-lg"
							style={{ backgroundColor: `${primaryArchetype.color}10` }}
						>
							<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
								Archetype
							</h4>
							<p
								className="text-sm font-semibold"
								style={{ color: primaryArchetype.color }}
							>
								{primaryArchetype.title}
							</p>
							<p className="text-xs text-muted-foreground mt-1">
								{primaryArchetype.tagline}
							</p>
							{node.archetypeSummary && (
								<p className="text-xs text-foreground mt-2">
									{node.archetypeSummary}
								</p>
							)}
						</div>
					)}

					{/* Tags */}
					{node.tags && node.tags.length > 0 && (
						<div>
							<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
								Tags
							</h4>
							<div className="flex flex-wrap gap-1.5">
								{node.tags.map((tag) => (
									<span
										key={tag}
										className="text-xs px-2 py-1 rounded-full font-medium"
										style={{
											backgroundColor: `${layerColor}15`,
											color: layerColor,
										}}
									>
										{tag}
									</span>
								))}
							</div>
						</div>
					)}

					{/* Source track */}
					{trackColors && node.sourceTrackId && (
						<div>
							<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
								Nguồn
							</h4>
							<div className="flex items-center gap-2">
								<div
									className="w-2 h-2 rounded-full"
									style={{ backgroundColor: trackColors.primary }}
								/>
								<span className="text-sm text-foreground">
									{node.sourceTrackId.replace(/_/g, " ")}
								</span>
							</div>
						</div>
					)}

					{/* Confidence */}
					{node.confidence > 0 && (
						<div>
							<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
								Độ tin cậy
							</h4>
							<div className="flex items-center gap-3">
								<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
									<div
										className="h-full rounded-full transition-all"
										style={{
											width: `${node.confidence * 100}%`,
											backgroundColor: layerColor,
										}}
									/>
								</div>
								<span className="text-sm font-medium" style={{ color: layerColor }}>
									{Math.round(node.confidence * 100)}%
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Footer with timestamp */}
				<div className="p-3 border-t bg-muted/30">
					<p className="text-[10px] text-muted-foreground text-center">
						Tạo lúc: {new Date(node.createdAt).toLocaleDateString("vi-VN")}
					</p>
				</div>
			</motion.div>
		</AnimatePresence>
	);
}
