"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Users, Trophy, Briefcase, Globe } from "lucide-react";
import { memo } from "react";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";
import { LAYOUT_CONFIG } from "@/lib/hooks/useForceLayout";

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
    tagSet.has("academic") ||
    tagSet.has("education") ||
    titleLower.includes("school") ||
    titleLower.includes("study")
  ) {
    return GraduationCap;
  }
  if (
    tagSet.has("team") ||
    tagSet.has("community") ||
    titleLower.includes("team") ||
    titleLower.includes("club")
  ) {
    return Users;
  }
  if (
    tagSet.has("achievement") ||
    tagSet.has("award") ||
    titleLower.includes("won") ||
    titleLower.includes("achieve")
  ) {
    return Trophy;
  }
  if (
    tagSet.has("work") ||
    tagSet.has("internship") ||
    titleLower.includes("work") ||
    titleLower.includes("job")
  ) {
    return Briefcase;
  }
  if (
    tagSet.has("travel") ||
    tagSet.has("international") ||
    titleLower.includes("abroad")
  ) {
    return Globe;
  }

  return BookOpen; // Default icon
}

interface KeyStoryNodeProps {
  data: GraphNodeData;
  selected?: boolean;
}

/**
 * KeyStoryNode - Layer 2 (Outer Ring)
 *
 * Obsidian-style circular node for concrete experiences/stories.
 * Shows relevant icon inside, external label below.
 * Hovering reveals connected layer 3 (detail) nodes.
 */
function KeyStoryNodeComponent({ data, selected }: KeyStoryNodeProps) {
  const size = LAYOUT_CONFIG.nodeSize[2];
  const labelOffset = LAYOUT_CONFIG.labelOffset[2];
  const fontSize = LAYOUT_CONFIG.labelFontSize[2];
  const maxChars = LAYOUT_CONFIG.labelMaxChars[2];

  const Icon = getIconForNode(data.tags, data.title);
  const truncatedLabel = truncateText(data.title, maxChars);
  const hasChildren = (data.childCount ?? 0) > 0;

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
          "shadow-sm hover:shadow-md",
          selected && "ring-2 ring-white/50 ring-offset-1 ring-offset-background",
          data.isHovered && "scale-115 shadow-lg",
          data.isHighlighted && "ring-2 ring-emerald-400/60",
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: STORY_COLOR,
          boxShadow:
            data.isHovered || selected
              ? `0 0 20px ${STORY_COLOR}50`
              : `0 0 8px ${STORY_COLOR}20`,
        }}
      >
        <Icon className="w-4 h-4 text-white" />
      </div>

      {/* Child count indicator - small dot */}
      {hasChildren && (
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-background flex items-center justify-center"
          style={{ backgroundColor: STORY_COLOR }}
        >
          <span className="text-[7px] text-white font-bold">
            {data.childCount}
          </span>
        </div>
      )}

      {/* External label below node */}
      <div
        className="absolute text-center pointer-events-none"
        style={{
          top: size / 2 + labelOffset / 2,
          width: 80,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <p
          className={cn(
            "font-medium text-foreground leading-tight",
            "drop-shadow-sm",
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
        className="!opacity-0 !w-1 !h-1"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!opacity-0 !w-1 !h-1"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!opacity-0 !w-1 !h-1"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!opacity-0 !w-1 !h-1"
      />
    </motion.div>
  );
}

export const KeyStoryNode = memo(KeyStoryNodeComponent);
