"use client";

import { Handle, Position } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Quote } from "lucide-react";
import { memo } from "react";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";

// Layer 3 color
const DETAIL_COLOR = LAYOUT_CONFIG.colors[3]; // Slate

// Animation variants for fade in/out
const nodeVariants = {
	hidden: {
		scale: 0.3,
		opacity: 0,
	},
	visible: {
		scale: 1,
		opacity: 1,
		transition: {
			type: "spring" as const,
			stiffness: 400,
			damping: 25,
			delay: 0.05,
		},
	},
	exit: {
		scale: 0.3,
		opacity: 0,
		transition: {
			duration: 0.15,
		},
	},
};

interface DetailNodeProps {
	data: GraphNodeData;
	selected?: boolean;
}

/**
 * DetailNode - Layer 3 (Outermost)
 *
 * The smallest nodes, hidden by default.
 * Only visible when parent layer 2 (KeyStory) is hovered or selected.
 * Shows supporting evidence or insights.
 */
function DetailNodeComponent({ data, selected }: DetailNodeProps) {
	const isVisible = data.isVisible;

	// Determine icon based on tags
	const isQuote = data.tags?.includes("quote") || data.tags?.includes("evidence");
	const Icon = isQuote ? Quote : FileText;

	return (
		<AnimatePresence mode="wait">
			{isVisible && (
				<motion.div
					className={cn(
						"relative rounded-md border shadow-sm transition-all cursor-pointer overflow-hidden",
						"min-w-[45px] max-w-[60px] p-1.5",
						"bg-background/95 backdrop-blur-sm",
						"hover:shadow-md hover:scale-105",
						selected && "ring-1 ring-offset-1 ring-slate-400",
						data.isHovered && "shadow-md scale-105",
					)}
					style={{
						borderColor: `${DETAIL_COLOR}60`,
						backgroundColor: `${DETAIL_COLOR}08`,
					}}
					variants={nodeVariants}
					initial="hidden"
					animate="visible"
					exit="exit"
				>
					{/* Content - minimal for small size */}
					<div className="relative z-10 flex flex-col items-center gap-1">
						{/* Icon */}
						<div
							className="flex items-center justify-center w-4 h-4 rounded"
							style={{ backgroundColor: `${DETAIL_COLOR}15` }}
						>
							<Icon className="w-2.5 h-2.5" style={{ color: DETAIL_COLOR }} />
						</div>

						{/* Title - very condensed */}
						<p
							className="text-[8px] font-medium text-center line-clamp-2 leading-tight"
							style={{ color: DETAIL_COLOR }}
						>
							{data.title}
						</p>
					</div>

					{/* Handles - target only (details don't have children) */}
					<Handle
						type="target"
						position={Position.Top}
						id="top"
						className="w-1 h-1 !opacity-0"
					/>
					<Handle
						type="target"
						position={Position.Left}
						id="left"
						className="w-1 h-1 !opacity-0"
					/>
					<Handle
						type="target"
						position={Position.Bottom}
						id="bottom"
						className="w-1 h-1 !opacity-0"
					/>
					<Handle
						type="target"
						position={Position.Right}
						id="right"
						className="w-1 h-1 !opacity-0"
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export const DetailNode = memo(DetailNodeComponent);
