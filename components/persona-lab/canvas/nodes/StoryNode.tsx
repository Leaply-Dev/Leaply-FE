"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { ChevronRight, FileText } from "lucide-react";
import { memo } from "react";
import { NODE_TYPE_COLORS, TRACK_COLORS } from "@/lib/constants/tracks";
import type { TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

export interface StoryNodeData {
	id: string;
	title: string;
	content?: string;
	sourceTrackId: TrackId | null;
	layer?: string;
	layerDepth?: number;
	zoom?: number;
	[key: string]: unknown;
}

// Animation variants for node appearance
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

interface StoryNodeProps {
	data: StoryNodeData;
	selected?: boolean;
}

// Story nodes are colored emerald/teal (by type)
const storyColors = NODE_TYPE_COLORS.story;

function StoryNodeComponent({ data, selected }: StoryNodeProps) {
	const trackColors = data.sourceTrackId
		? TRACK_COLORS[data.sourceTrackId]
		: null;

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.7;

	// Macro View (Deep Zoom Out) - Show colored circle
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
						"w-10 h-10 rounded-full border-3 transition-all duration-500 shadow-md",
						storyColors.bgClass,
					)}
					style={{
						backgroundColor: storyColors.primary,
						borderColor: `${storyColors.primary}40`,
					}}
				/>
				<div className="absolute top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded text-[10px] font-medium border border-border z-10">
					{data.title}
				</div>
				{/* Hidden handles */}
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
			</motion.div>
		);
	}

	return (
		<motion.div
			className={cn(
				"relative rounded-xl border-2 shadow-md transition-all duration-300 cursor-pointer overflow-hidden",
				"min-w-[160px] max-w-[200px] px-4 py-3",
				"hover:shadow-lg hover:scale-[1.02]",
				"bg-background",
				selected && "ring-2 ring-offset-2 ring-emerald-500",
				!isMicroView && "scale-95 opacity-90",
			)}
			style={{
				borderColor: storyColors.primary,
				backgroundColor: `${storyColors.primary}08`,
			}}
			variants={nodeVariants}
			initial="initial"
			animate="animate"
		>
			{/* Subtle glow */}
			<div
				className="absolute -inset-1 opacity-10 blur-lg transition-all"
				style={{ backgroundColor: storyColors.primary }}
			/>

			<div className="relative z-10 flex items-start gap-3">
				{/* Icon */}
				<div
					className={cn(
						"flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
						storyColors.bgClass,
					)}
					style={{ backgroundColor: `${storyColors.primary}15` }}
				>
					<FileText
						className="w-4 h-4"
						style={{ color: storyColors.primary }}
					/>
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<span className="text-sm font-semibold text-foreground line-clamp-2">
						{data.title}
					</span>

					{isMicroView && (
						<div className="flex flex-wrap gap-1 mt-1.5">
							{/* Track source badge */}
							{trackColors && data.sourceTrackId && (
								<span
									className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium"
									style={{
										backgroundColor: `${trackColors.primary}15`,
										color: trackColors.primary,
									}}
								>
									{data.sourceTrackId.replace(/_/g, " ")}
								</span>
							)}
							{/* Story type badge */}
							<span
								className="inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium"
								style={{
									backgroundColor: `${storyColors.primary}15`,
									color: storyColors.primary,
								}}
							>
								Story
							</span>
						</div>
					)}
				</div>

				{isMicroView && (
					<ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
				)}
			</div>

			{/* Handles */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: storyColors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: storyColors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: storyColors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: storyColors.primary }}
			/>
		</motion.div>
	);
}

// Memoize for performance
export const StoryNode = memo(StoryNodeComponent);
