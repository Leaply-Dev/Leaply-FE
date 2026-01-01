"use client";

import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { memo } from "react";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import type { GraphNodeData } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";
import { LAYOUT_CONFIG } from "@/lib/hooks/useForceLayout";

// Layer 0 color
const PROFILE_COLOR = LAYOUT_CONFIG.colors[0]; // Indigo

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
      stiffness: 300,
      damping: 25,
    },
  },
};

// Truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + "…";
}

interface ProfileSummaryNodeProps {
  data: GraphNodeData;
  selected?: boolean;
}

/**
 * ProfileSummaryNode - Layer 0 (Center)
 *
 * Obsidian-style circular node at the center of the graph.
 * Shows archetype emoji when revealed, lock when locked.
 * External label displayed below the circle.
 */
function ProfileSummaryNodeComponent({
  data,
  selected,
}: ProfileSummaryNodeProps) {
  const hasArchetype = !!data.primaryArchetype;
  const primaryDef = data.primaryArchetype
    ? ARCHETYPES[data.primaryArchetype]
    : null;

  const size = LAYOUT_CONFIG.nodeSize[0];
  const labelOffset = LAYOUT_CONFIG.labelOffset[0];
  const fontSize = LAYOUT_CONFIG.labelFontSize[0];
  const maxChars = LAYOUT_CONFIG.labelMaxChars[0];

  // Get emoji or icon for the node
  const getNodeContent = () => {
    if (hasArchetype && primaryDef) {
      // Use archetype emoji if available
      return (
        <span className="text-3xl" role="img" aria-label={primaryDef.title}>
          {primaryDef.emoji || "✨"}
        </span>
      );
    }
    // Locked state
    return <Lock className="w-8 h-8 text-white/80" />;
  };

  // Get display label
  const label = hasArchetype && primaryDef ? primaryDef.title : "Archetype";
  const truncatedLabel = truncateText(label, maxChars);

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
          "shadow-lg hover:shadow-xl",
          selected && "ring-4 ring-white/50 ring-offset-2 ring-offset-background",
          data.isHovered && "scale-105",
        )}
        style={{
          width: size,
          height: size,
          backgroundColor: hasArchetype
            ? primaryDef?.color || PROFILE_COLOR
            : PROFILE_COLOR,
          boxShadow: `0 0 ${hasArchetype ? 30 : 20}px ${
            hasArchetype ? primaryDef?.color || PROFILE_COLOR : PROFILE_COLOR
          }40`,
        }}
      >
        {/* Glow effect for revealed archetype */}
        {hasArchetype && (
          <div
            className="absolute inset-0 rounded-full animate-pulse opacity-30"
            style={{
              background: `radial-gradient(circle, ${
                primaryDef?.color || PROFILE_COLOR
              }60 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center">
          {getNodeContent()}
        </div>
      </div>

      {/* External label below node */}
      <div
        className="absolute text-center pointer-events-none"
        style={{
          top: size / 2 + labelOffset / 2,
          width: 120,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <p
          className={cn(
            "font-semibold text-foreground whitespace-nowrap",
            "drop-shadow-sm",
          )}
          style={{ fontSize }}
        >
          {truncatedLabel}
        </p>
        {hasArchetype && primaryDef && (
          <p
            className="text-muted-foreground mt-0.5"
            style={{ fontSize: fontSize - 2 }}
          >
            {primaryDef.tagline
              ? truncateText(primaryDef.tagline, maxChars + 5)
              : ""}
          </p>
        )}
        {!hasArchetype && (
          <p
            className="text-muted-foreground mt-0.5 flex items-center justify-center gap-1"
            style={{ fontSize: fontSize - 2 }}
          >
            <Lock className="w-3 h-3" />
            Hoàn thành tracks
          </p>
        )}
      </div>

      {/* Handles - source from all directions for center node */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!opacity-0 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!opacity-0 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!opacity-0 !w-2 !h-2"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!opacity-0 !w-2 !h-2"
      />
    </motion.div>
  );
}

export const ProfileSummaryNode = memo(ProfileSummaryNodeComponent);
