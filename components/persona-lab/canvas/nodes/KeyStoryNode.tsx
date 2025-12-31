"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { BookOpen, ChevronDown } from "lucide-react";
import { memo } from "react";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";

// Layer 2 color
const STORY_COLOR = LAYOUT_CONFIG.colors[2]; // Emerald

// Animation variants
const nodeVariants = {
	initial: {
		scale: 0.5,
		opacity: 0,
	},
	animate: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring" as const,
			stiffness: 350,
			damping: 25,
		},
	},
};

interface KeyStoryNodeProps {
	data: GraphNodeData;
	selected?: boolean;
}

/**
 * KeyStoryNode - Layer 2 (Outer Ring)
 *
 * Smaller nodes representing concrete experiences/stories.
 * Hovering or selecting reveals layer 3 (detail) children.
 * Shows child count indicator.
 */
function KeyStoryNodeComponent({ data, selected }: KeyStoryNodeProps) {
	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.6;

	const trackColors = data.sourceTrackId
		? TRACK_COLORS[data.sourceTrackId]
		: null;

	const hasChildren = (data.childCount ?? 0) > 0;

	// Macro View - Show small colored circle
	if (isMacroView) {
		return (
			<motion.div
				className="group relative flex items-center justify-center"
				variants={nodeVariants}
				initial="initial"
				animate="animate"
			>
				<div
					className={cn(
						"w-10 h-10 rounded-full border-2 flex items-center justify-center",
						"transition-all duration-500 shadow-md",
						selected && "ring-2 ring-emerald-400 ring-offset-1",
					)}
					style={{
						backgroundColor: STORY_COLOR,
						borderColor: `${STORY_COLOR}60`,
					}}
				>
					<BookOpen className="w-4 h-4 text-white" />
				</div>
				{/* Tooltip */}
				<div className="absolute top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/95 px-2 py-1 rounded text-[9px] font-medium border border-border z-10 shadow-sm max-w-[100px] truncate">
					{data.title}
				</div>
				{/* Handles */}
				<Handle type="target" position={Position.Top} id="top" className="!opacity-0" />
				<Handle type="source" position={Position.Bottom} id="bottom" className="!opacity-0" />
			</motion.div>
		);
	}

	// Full View - Compact card
	return (
		<motion.div
			className={cn(
				"relative rounded-lg border-2 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden",
				"min-w-[70px] max-w-[90px] p-2",
				"bg-background",
				"hover:shadow-md hover:scale-[1.03]",
				selected && "ring-2 ring-offset-1 ring-emerald-500 shadow-md",
				data.isHovered && "shadow-md scale-[1.03] ring-1 ring-emerald-400/50",
				data.isHighlighted && "ring-1 ring-emerald-400/50",
			)}
			style={{
				borderColor: selected || data.isHovered ? STORY_COLOR : `${STORY_COLOR}80`,
				backgroundColor:
					selected || data.isHovered ? `${STORY_COLOR}12` : `${STORY_COLOR}06`,
			}}
			variants={nodeVariants}
			initial="initial"
			animate="animate"
		>
			{/* Content */}
			<div className="relative z-10">
				{/* Icon + Title row */}
				<div className="flex items-start gap-1.5">
					<div
						className="flex items-center justify-center w-5 h-5 rounded shrink-0"
						style={{ backgroundColor: `${STORY_COLOR}20` }}
					>
						<BookOpen className="w-3 h-3" style={{ color: STORY_COLOR }} />
					</div>
					<h4 className="text-[10px] font-semibold text-foreground line-clamp-2 leading-tight flex-1">
						{data.title}
					</h4>
				</div>

				{/* Track indicator */}
				{isMicroView && trackColors && data.sourceTrackId && (
					<div className="flex items-center gap-1 mt-1.5">
						<div
							className="w-1 h-1 rounded-full"
							style={{ backgroundColor: trackColors.primary }}
						/>
						<span className="text-[7px] text-muted-foreground truncate">
							{data.sourceTrackId.split("_")[0]}
						</span>
					</div>
				)}

				{/* Child count indicator - shows when there are details */}
				{hasChildren && (
					<div
						className={cn(
							"flex items-center justify-center gap-0.5 mt-1.5 pt-1 border-t",
							"transition-colors",
						)}
						style={{ borderColor: `${STORY_COLOR}20` }}
					>
						<ChevronDown
							className={cn(
								"w-3 h-3 transition-transform",
								(selected || data.isHovered) && "animate-bounce",
							)}
							style={{ color: STORY_COLOR }}
						/>
						<span
							className="text-[8px] font-medium"
							style={{ color: STORY_COLOR }}
						>
							{data.childCount} details
						</span>
					</div>
				)}
			</div>

			{/* Handles */}
			<Handle type="target" position={Position.Top} id="top" className="w-1.5 h-1.5 !opacity-0" />
			<Handle type="target" position={Position.Left} id="left" className="w-1.5 h-1.5 !opacity-0" />
			<Handle type="source" position={Position.Bottom} id="bottom" className="w-1.5 h-1.5 !opacity-0" />
			<Handle type="source" position={Position.Right} id="right" className="w-1.5 h-1.5 !opacity-0" />
		</motion.div>
	);
}

export const KeyStoryNode = memo(KeyStoryNodeComponent);
