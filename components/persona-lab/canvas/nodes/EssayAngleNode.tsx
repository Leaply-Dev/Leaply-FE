"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import {
	Compass,
	Heart,
	Lightbulb,
	Rocket,
	Star,
	Target,
	Zap,
} from "lucide-react";
import { memo } from "react";
import { LAYOUT_CONFIG } from "@/lib/hooks/useForceLayout";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";

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

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength - 1) + "…";
}

// Get icon based on tags or title
function getIconForNode(
	tags: string[] | undefined,
	title: string,
): React.ElementType {
	const tagSet = new Set(tags?.map((t) => t.toLowerCase()) || []);
	const titleLower = title.toLowerCase();

	if (
		tagSet.has("leadership") ||
		tagSet.has("leader") ||
		titleLower.includes("lead")
	) {
		return Star;
	}
	if (
		tagSet.has("passion") ||
		tagSet.has("love") ||
		titleLower.includes("passion")
	) {
		return Heart;
	}
	if (
		tagSet.has("future") ||
		tagSet.has("goal") ||
		titleLower.includes("future")
	) {
		return Rocket;
	}
	if (
		tagSet.has("challenge") ||
		tagSet.has("growth") ||
		titleLower.includes("challenge")
	) {
		return Zap;
	}
	if (
		tagSet.has("journey") ||
		tagSet.has("path") ||
		titleLower.includes("journey")
	) {
		return Compass;
	}
	if (tagSet.has("idea") || tagSet.has("insight")) {
		return Lightbulb;
	}

	return Target; // Default icon
}

interface EssayAngleNodeProps {
	data: GraphNodeData;
	selected?: boolean;
}

/**
 * EssayAngleNode - Layer 1 (Inner Ring)
 *
 * Obsidian-style circular node for narrative themes/angles.
 * Shows relevant icon inside, external label below.
 */
function EssayAngleNodeComponent({ data, selected }: EssayAngleNodeProps) {
	const size = LAYOUT_CONFIG.nodeSize[1];
	const labelOffset = LAYOUT_CONFIG.labelOffset[1];
	const fontSize = LAYOUT_CONFIG.labelFontSize[1];
	const maxChars = LAYOUT_CONFIG.labelMaxChars[1];

	const Icon = getIconForNode(data.tags, data.title);
	const truncatedLabel = truncateText(data.title, maxChars);

	return (
		<motion.div
			className="relative flex flex-col items-center"
			variants={nodeVariants}
			initial="initial"
			animate="animate"
		>
			{/* Circular node */}
			<div
				className={cn(
					"rounded-full flex items-center justify-center cursor-pointer",
					"transition-all duration-300 ease-out",
					"shadow-md hover:shadow-lg",
					selected &&
						"ring-3 ring-white/50 ring-offset-2 ring-offset-background",
					data.isHovered && "scale-110",
					data.isHighlighted && "ring-2 ring-purple-400/60",
				)}
				style={{
					width: size,
					height: size,
					backgroundColor: ANGLE_COLOR,
					boxShadow: `0 0 15px ${ANGLE_COLOR}30`,
				}}
			>
				<Icon className="w-6 h-6 text-white" />
			</div>

			{/* External label below node */}
			<div
				className="absolute text-center pointer-events-none"
				style={{
					top: size / 2 + labelOffset / 2,
					width: 100,
					left: "50%",
					transform: "translateX(-50%)",
				}}
			>
				<p
					className={cn(
						"font-medium text-foreground",
						"drop-shadow-sm leading-tight",
					)}
					style={{ fontSize }}
				>
					{truncatedLabel}
				</p>
			</div>

			{/* Handles */}
			<Handle
				type="target"
				position={Position.Top}
				id="top"
				className="!opacity-0 !w-1.5 !h-1.5"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id="bottom"
				className="!opacity-0 !w-1.5 !h-1.5"
			/>
			<Handle
				type="target"
				position={Position.Left}
				id="left"
				className="!opacity-0 !w-1.5 !h-1.5"
			/>
			<Handle
				type="source"
				position={Position.Right}
				id="right"
				className="!opacity-0 !w-1.5 !h-1.5"
			/>
		</motion.div>
	);
}

export const EssayAngleNode = memo(EssayAngleNodeComponent);
