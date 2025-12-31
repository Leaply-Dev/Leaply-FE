"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { Lightbulb, Target } from "lucide-react";
import { memo } from "react";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";

// Layer 1 color
const ANGLE_COLOR = LAYOUT_CONFIG.colors[1]; // Purple

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

interface EssayAngleNodeProps {
	data: GraphNodeData;
	selected?: boolean;
}

/**
 * EssayAngleNode - Layer 1 (Inner Ring)
 *
 * Medium-sized nodes representing narrative themes/angles for essays.
 * Shows title, tags, and source track indicator.
 */
function EssayAngleNodeComponent({ data, selected }: EssayAngleNodeProps) {
	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.6;

	const trackColors = data.sourceTrackId
		? TRACK_COLORS[data.sourceTrackId]
		: null;

	// Macro View - Show colored circle
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
						"w-14 h-14 rounded-full border-3 flex items-center justify-center",
						"transition-all duration-500 shadow-lg",
						selected && "ring-3 ring-purple-400 ring-offset-2",
					)}
					style={{
						backgroundColor: ANGLE_COLOR,
						borderColor: `${ANGLE_COLOR}60`,
					}}
				>
					<Lightbulb className="w-6 h-6 text-white" />
				</div>
				{/* Tooltip on hover */}
				<div className="absolute top-16 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/95 px-2 py-1 rounded-md text-[10px] font-medium border border-border z-10 shadow-md max-w-[120px] truncate">
					{data.title}
				</div>
				{/* Handles */}
				<Handle type="target" position={Position.Top} id="top" className="!opacity-0" />
				<Handle type="source" position={Position.Bottom} id="bottom" className="!opacity-0" />
				<Handle type="target" position={Position.Left} id="left" className="!opacity-0" />
				<Handle type="source" position={Position.Right} id="right" className="!opacity-0" />
			</motion.div>
		);
	}

	// Full View - Detailed card
	return (
		<motion.div
			className={cn(
				"relative rounded-xl border-2 shadow-md transition-all duration-300 cursor-pointer overflow-hidden",
				"min-w-[100px] max-w-[130px] p-3",
				"bg-background",
				"hover:shadow-lg hover:scale-[1.02]",
				selected && "ring-2 ring-offset-2 ring-purple-500",
				data.isHovered && "shadow-lg scale-[1.02]",
				data.isHighlighted && "ring-2 ring-purple-400/50",
			)}
			style={{
				borderColor: ANGLE_COLOR,
				backgroundColor: `${ANGLE_COLOR}08`,
			}}
			variants={nodeVariants}
			initial="initial"
			animate="animate"
		>
			{/* Subtle glow */}
			<div
				className="absolute -inset-1 opacity-10 blur-lg transition-all"
				style={{ backgroundColor: ANGLE_COLOR }}
			/>

			<div className="relative z-10">
				{/* Header with icon */}
				<div className="flex items-start gap-2">
					<div
						className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0"
						style={{ backgroundColor: `${ANGLE_COLOR}15` }}
					>
						<Target className="w-3.5 h-3.5" style={{ color: ANGLE_COLOR }} />
					</div>

					<div className="flex-1 min-w-0">
						<h4 className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">
							{data.title}
						</h4>
					</div>
				</div>

				{/* Tags */}
				{isMicroView && data.tags && data.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2">
						{data.tags.slice(0, 2).map((tag) => (
							<span
								key={tag}
								className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
								style={{
									backgroundColor: `${ANGLE_COLOR}15`,
									color: ANGLE_COLOR,
								}}
							>
								{tag}
							</span>
						))}
					</div>
				)}

				{/* Source track indicator */}
				{isMicroView && trackColors && data.sourceTrackId && (
					<div className="mt-2 pt-2 border-t border-border/50">
						<div className="flex items-center gap-1">
							<div
								className="w-1.5 h-1.5 rounded-full"
								style={{ backgroundColor: trackColors.primary }}
							/>
							<span className="text-[8px] text-muted-foreground truncate">
								{data.sourceTrackId.replace(/_/g, " ")}
							</span>
						</div>
					</div>
				)}
			</div>

			{/* Handles */}
			<Handle type="target" position={Position.Top} id="top" className="w-2 h-2 !opacity-0" />
			<Handle type="source" position={Position.Bottom} id="bottom" className="w-2 h-2 !opacity-0" />
			<Handle type="target" position={Position.Left} id="left" className="w-2 h-2 !opacity-0" />
			<Handle type="source" position={Position.Right} id="right" className="w-2 h-2 !opacity-0" />
		</motion.div>
	);
}

export const EssayAngleNode = memo(EssayAngleNodeComponent);
