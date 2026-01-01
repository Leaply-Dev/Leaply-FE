"use client";

import { Handle, Position } from "@xyflow/react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Quote, MessageCircle, Sparkles } from "lucide-react";
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

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

// Get icon based on tags
function getIconForNode(tags: string[] | undefined): React.ElementType {
  const tagSet = new Set(tags?.map((t) => t.toLowerCase()) || []);

  if (tagSet.has("quote") || tagSet.has("said")) {
    return Quote;
  }
  if (tagSet.has("insight") || tagSet.has("reflection")) {
    return Sparkles;
  }
  if (tagSet.has("conversation") || tagSet.has("dialogue")) {
    return MessageCircle;
  }

  return FileText; // Default icon
}

interface DetailNodeProps {
  data: GraphNodeData;
  selected?: boolean;
}

/**
 * DetailNode - Layer 3 (Outermost)
 *
 * Obsidian-style small circular node for supporting details.
 * Hidden by default, visible when parent layer 2 is hovered/selected.
 * Minimal design - just a small colored circle with icon.
 */
function DetailNodeComponent({ data, selected }: DetailNodeProps) {
  const isVisible = data.isVisible;
  const size = LAYOUT_CONFIG.nodeSize[3];
  const labelOffset = LAYOUT_CONFIG.labelOffset[3];
  const fontSize = LAYOUT_CONFIG.labelFontSize[3];
  const maxChars = LAYOUT_CONFIG.labelMaxChars[3];

  const Icon = getIconForNode(data.tags);
  const truncatedLabel = truncateText(data.title, maxChars);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className="relative flex flex-col items-center"
          variants={nodeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Small circular node */}
          <div
            className={cn(
              "rounded-full flex items-center justify-center cursor-pointer",
              "transition-all duration-200 ease-out",
              "hover:scale-125",
              selected && "ring-1 ring-white/50 ring-offset-1",
              data.isHovered && "scale-125 shadow-md",
            )}
            style={{
              width: size,
              height: size,
              backgroundColor: DETAIL_COLOR,
              boxShadow: `0 0 6px ${DETAIL_COLOR}30`,
            }}
          >
            <Icon className="w-2.5 h-2.5 text-white" />
          </div>

          {/* External label below node - only show on hover */}
          <div
            className={cn(
              "absolute text-center pointer-events-none",
              "opacity-0 transition-opacity duration-200",
              (data.isHovered || selected) && "opacity-100",
            )}
            style={{
              top: size / 2 + labelOffset / 2,
              width: 70,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <p
              className="text-muted-foreground leading-tight drop-shadow-sm"
              style={{ fontSize }}
            >
              {truncatedLabel}
            </p>
          </div>

          {/* Handles - target only (details don't have children) */}
          <Handle
            type="target"
            position={Position.Top}
            id="top"
            className="!opacity-0 !w-0.5 !h-0.5"
          />
          <Handle
            type="target"
            position={Position.Left}
            id="left"
            className="!opacity-0 !w-0.5 !h-0.5"
          />
          <Handle
            type="target"
            position={Position.Bottom}
            id="bottom"
            className="!opacity-0 !w-0.5 !h-0.5"
          />
          <Handle
            type="target"
            position={Position.Right}
            id="right"
            className="!opacity-0 !w-0.5 !h-0.5"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const DetailNode = memo(DetailNodeComponent);
