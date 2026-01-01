"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Monitor,
  Sparkles,
  Target,
  BookOpen,
  FileText,
} from "lucide-react";
import { usePersonaStore } from "@/lib/store/personaStore";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import { LAYOUT_CONFIG } from "@/lib/hooks/useConcentricLayout";
import type { PersonaNodeDto, LayerNumber } from "@/lib/types/persona-graph";
import { cn } from "@/lib/utils";

// Hook for responsive mobile detection
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Initial check
    checkMobile();

    // Add listener
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  return isMobile;
}

const LAYER_CONFIG = {
  0: {
    label: "Hồ sơ cá nhân",
    icon: Sparkles,
    description: "Tổng quan về bạn và archetype",
  },
  1: {
    label: "Góc nhìn Essay",
    icon: Target,
    description: "Các chủ đề chính cho bài essay",
  },
  2: {
    label: "Câu chuyện chính",
    icon: BookOpen,
    description: "Những trải nghiệm quan trọng",
  },
  3: {
    label: "Chi tiết",
    icon: FileText,
    description: "Bằng chứng và insights hỗ trợ",
  },
};

interface GraphListViewProps {
  className?: string;
}

/**
 * GraphListView - Mobile fallback for the graph
 *
 * Displays nodes grouped by layer in a list format.
 * Shows a banner prompting users to use desktop for the full graph.
 */
export function GraphListView({ className }: GraphListViewProps) {
  const { graphNodes, isGraphLoading, fetchPersonaGraph } = usePersonaStore();
  const [expandedLayers, setExpandedLayers] = useState<Set<number>>(
    new Set([0, 1]),
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const isMobile = useIsMobile(768);

  // Fetch graph data on mount
  useEffect(() => {
    fetchPersonaGraph();
  }, [fetchPersonaGraph]);

  // Group nodes by layer
  const nodesByLayer = useMemo(() => {
    const groups = new Map<LayerNumber, PersonaNodeDto[]>();
    ([0, 1, 2, 3] as LayerNumber[]).forEach((layer) => {
      groups.set(layer, []);
    });

    graphNodes.forEach((node) => {
      const layerNodes = groups.get(node.layer as LayerNumber) || [];
      layerNodes.push(node);
      groups.set(node.layer as LayerNumber, layerNodes);
    });

    return groups;
  }, [graphNodes]);

  // Toggle layer expansion
  const toggleLayer = (layer: number) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) {
        next.delete(layer);
      } else {
        next.add(layer);
      }
      return next;
    });
  };

  // Loading state
  if (isGraphLoading) {
    return (
      <div
        className={cn("flex items-center justify-center h-full p-8", className)}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {/* Desktop prompt banner - only show on mobile */}
      {isMobile && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium">Xem graph đầy đủ trên desktop</p>
            <p className="text-xs text-white/80">
              Mở trên màn hình lớn để trải nghiệm visualization tương tác
            </p>
          </div>
        </div>
      )}

      {/* Node list by layer */}
      <div className="flex-1 overflow-y-auto">
        {([0, 1, 2, 3] as LayerNumber[]).map((layer) => {
          const nodes = nodesByLayer.get(layer) || [];
          const config = LAYER_CONFIG[layer];
          const isExpanded = expandedLayers.has(layer);
          const layerColor = LAYOUT_CONFIG.colors[layer];
          const Icon = config.icon;

          if (nodes.length === 0 && layer !== 0) return null;

          return (
            <div key={layer} className="border-b last:border-b-0">
              {/* Layer header */}
              <button
                className={cn(
                  "w-full flex items-center gap-3 p-4 text-left",
                  "hover:bg-muted/50 transition-colors",
                )}
                onClick={() => toggleLayer(layer)}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${layerColor}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: layerColor }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {config.label}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${layerColor}15`,
                        color: layerColor,
                      }}
                    >
                      {nodes.length}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {config.description}
                  </p>
                </div>

                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {/* Layer nodes */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {nodes.length === 0 ? (
                      <div className="px-4 pb-4 pl-14">
                        <p className="text-xs text-muted-foreground italic">
                          Chưa có dữ liệu. Hoàn thành thêm tracks để khám phá.
                        </p>
                      </div>
                    ) : (
                      <div className="px-4 pb-4 pl-14 space-y-2">
                        {nodes.map((node) => (
                          <NodeListItem
                            key={node.id}
                            node={node}
                            layerColor={layerColor}
                            isSelected={selectedNodeId === node.id}
                            onClick={() =>
                              setSelectedNodeId(
                                selectedNodeId === node.id ? null : node.id,
                              )
                            }
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Individual node item component
interface NodeListItemProps {
  node: PersonaNodeDto;
  layerColor: string;
  isSelected: boolean;
  onClick: () => void;
}

function NodeListItem({
  node,
  layerColor,
  isSelected,
  onClick,
}: NodeListItemProps) {
  const trackColors = node.sourceTrackId
    ? TRACK_COLORS[node.sourceTrackId]
    : null;

  const primaryArchetype = node.primaryArchetype
    ? ARCHETYPES[node.primaryArchetype]
    : null;

  return (
    <motion.button
      className={cn(
        "w-full text-left p-3 rounded-lg border transition-all",
        "hover:shadow-sm",
        isSelected
          ? "border-2 shadow-sm"
          : "border-border hover:border-muted-foreground/30",
      )}
      style={{
        borderColor: isSelected ? layerColor : undefined,
        backgroundColor: isSelected ? `${layerColor}05` : "transparent",
      }}
      onClick={onClick}
      initial={false}
      animate={{ scale: isSelected ? 1.01 : 1 }}
    >
      {/* Title */}
      <h4 className="text-sm font-medium text-foreground mb-1">{node.title}</h4>

      {/* Content preview */}
      <p
        className={cn(
          "text-xs text-muted-foreground",
          isSelected ? "" : "line-clamp-2",
        )}
      >
        {node.content}
      </p>

      {/* Archetype badge (layer 0) */}
      {primaryArchetype && (
        <div
          className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${primaryArchetype.color}15`,
            color: primaryArchetype.color,
          }}
        >
          <Sparkles className="w-3 h-3" />
          {primaryArchetype.title}
        </div>
      )}

      {/* Tags */}
      {isSelected && node.tags && node.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {node.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${layerColor}15`,
                color: layerColor,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Source track indicator */}
      {trackColors && node.sourceTrackId && (
        <div className="flex items-center gap-1.5 mt-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: trackColors.primary }}
          />
          <span className="text-[10px] text-muted-foreground">
            {node.sourceTrackId.replace(/_/g, " ")}
          </span>
        </div>
      )}
    </motion.button>
  );
}
