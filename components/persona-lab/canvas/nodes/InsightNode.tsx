"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { memo } from "react";
import { NODE_TYPE_COLORS, TRACK_COLORS } from "@/lib/constants/tracks";
import type { TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

export interface InsightNodeData {
	id: string;
	title: string;
	content?: string;
	sourceTrackId: TrackId | null;
	isAIGenerated?: boolean;
	layer?: string;
	layerDepth?: number;
	zoom?: number;
	parentPosition?: { x: number; y: number };
	[key: string]: unknown;
}

interface InsightNodeProps {
	data: InsightNodeData;
	selected?: boolean;
}

// Insight nodes are colored amber/yellow (by type)
const insightColors = NODE_TYPE_COLORS.insight;

function InsightNodeComponent({ data, selected }: InsightNodeProps) {
	// Dynamic animation based on parent position
	const insightVariants = {
		initial: {
			scale: 0.3,
			opacity: 0,
			x: data.parentPosition?.x ?? 0,
			y: data.parentPosition?.y ?? 0,
			rotate: -10,
		},
		animate: {
			scale: 1,
			opacity: 1,
			x: 0,
			y: 0,
			rotate: 0,
			transition: {
				type: "spring" as const,
				stiffness: 400,
				damping: 20,
			},
		},
	};
	const trackColors = data.sourceTrackId
		? TRACK_COLORS[data.sourceTrackId]
		: null;

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.7;

	// Macro view - hidden
	if (isMacroView) {
		return (
			<div className="opacity-0 scale-50 pointer-events-none">
				<Handle
					type="target"
					position={Position.Top}
					id={Position.Top}
					className="!opacity-0"
				/>
				<Handle
					type="source"
					position={Position.Bottom}
					id={Position.Bottom}
					className="!opacity-0"
				/>
			</div>
		);
	}

	return (
		<motion.div
			className={cn(
				"relative rounded-lg transition-all duration-300 cursor-pointer",
				"min-w-[130px] max-w-[150px] px-3 py-2.5",
				"hover:shadow-md hover:scale-[1.02]",
				"bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
				"border border-amber-200 dark:border-amber-800",
				selected && "ring-2 ring-amber-400 ring-offset-1",
				!isMicroView && "scale-90 opacity-80",
			)}
			variants={insightVariants}
			initial="initial"
			animate="animate"
		>
			<div className="flex items-center gap-2">
				{/* Icon */}
				<div
					className={cn(
						"flex items-center justify-center w-6 h-6 rounded shrink-0",
						"bg-gradient-to-br from-amber-400 to-orange-500",
					)}
				>
					<Sparkles className="w-3 h-3 text-white" />
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<span className="text-xs font-medium text-foreground line-clamp-2">
						{data.title || "AI Insight"}
					</span>
				</div>

				<ChevronRight className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
			</div>

			{/* AI indicator and track badge */}
			{isMicroView && (
				<div className="flex flex-wrap items-center gap-1 mt-1.5">
					<div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
						<Sparkles className="w-2.5 h-2.5" />
						<span>AI Generated</span>
					</div>
					{trackColors && data.sourceTrackId && (
						<span
							className="inline-block text-[9px] px-1 py-0.5 rounded font-medium"
							style={{
								backgroundColor: `${trackColors.primary}15`,
								color: trackColors.primary,
							}}
						>
							{data.sourceTrackId.replace(/_/g, " ")}
						</span>
					)}
				</div>
			)}

			{/* Handles */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-1.5 h-1.5 !opacity-0 !bg-amber-500"
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-1.5 h-1.5 !opacity-0 !bg-amber-500"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-1.5 h-1.5 !opacity-0 !bg-amber-500"
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-1.5 h-1.5 !opacity-0 !bg-amber-500"
			/>
		</motion.div>
	);
}

// Memoize for performance
export const InsightNode = memo(InsightNodeComponent);
