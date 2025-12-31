// Persona Graph Type Definitions
// New 4-layer concentric graph architecture
// Aligned with Backend API specification (GET /graph)

import type { ArchetypeType, TrackId } from "./persona";

// ============================================
// Node Types
// ============================================

export type GraphNodeType =
  | "profile_summary"
  | "essay_angle"
  | "key_story"
  | "detail";

export type LayerNumber = 0 | 1 | 2 | 3;

/**
 * PersonaNodeDto - Core graph node type
 *
 * Layer hierarchy:
 * - Layer 0: profile_summary (center, largest)
 * - Layer 1: essay_angle (inner ring, medium)
 * - Layer 2: key_story (outer ring, smaller)
 * - Layer 3: detail (outermost, smallest, hidden by default)
 */
export interface PersonaNodeDto {
  id: string;
  type: GraphNodeType;
  layer: LayerNumber;
  title: string;
  content: string;
  tags: string[];

  // Layer 0 (profile_summary) specific fields
  primaryArchetype?: ArchetypeType;
  secondaryArchetype?: ArchetypeType | null;
  archetypeSummary?: string;

  // Traceability
  sourceTrackId: TrackId | null;
  sourceQuestionId: string | null;
  confidence: number; // 0.0-1.0

  createdAt: string;
}

// ============================================
// Edge Types
// ============================================

/**
 * PersonaEdgeDto - Connection between nodes
 *
 * Edge styling:
 * - Width: 1 + (strength * 3) px
 * - Opacity: 0.3 + (strength * 0.5)
 * - Color: Inherited from source node's layer color
 */
export interface PersonaEdgeDto {
  id: string;
  source: string; // Source node ID
  target: string; // Target node ID
  strength: number; // 0.0-1.0
  createdAt: string;
}

// ============================================
// Graph Metadata
// ============================================

export interface GraphMeta {
  nodeCountByLayer: Record<number, number>; // e.g., {0: 1, 1: 3, 2: 12, 3: 28}
  topTags: string[]; // e.g., ["leadership", "education", "impact"]
  hasProfileSummary: boolean;
  totalNodes: number;
  totalEdges: number;
}

// ============================================
// API Response
// ============================================

export interface PersonaGraphResponse {
  nodes: PersonaNodeDto[];
  edges: PersonaEdgeDto[];
  meta: GraphMeta;
}

// ============================================
// Graph UI State
// ============================================

export interface GraphSelectionState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  highlightedEdgeIds: string[];
  revealedDetailIds: string[]; // Layer 3 nodes currently visible
  showAllDetails: boolean;
}

// ============================================
// Layout Configuration
// ============================================

export interface LayerConfig {
  radius: number;
  nodeSize: number;
  color: string;
  opacity: number;
}

export const LAYER_CONFIGS: Record<LayerNumber, LayerConfig> = {
  0: { radius: 0, nodeSize: 150, color: "#6366F1", opacity: 1.0 }, // Indigo - profile
  1: { radius: 180, nodeSize: 100, color: "#8B5CF6", opacity: 1.0 }, // Purple - angles
  2: { radius: 320, nodeSize: 70, color: "#10B981", opacity: 0.9 }, // Emerald - stories
  3: { radius: 460, nodeSize: 40, color: "#94A3B8", opacity: 0.7 }, // Slate - details
};

// ============================================
// React Flow Node Data
// ============================================

export interface GraphNodeData extends PersonaNodeDto {
  // UI state passed to node components
  isSelected: boolean;
  isHovered: boolean;
  isHighlighted: boolean;
  isVisible: boolean; // For layer 3 progressive disclosure
  zoom: number;
  childCount?: number; // For layer 2 nodes
  // Index signature for React Flow compatibility
  [key: string]: unknown;
}

// ============================================
// Canvas Action Types (for real-time updates)
// ============================================

export interface GraphCanvasAction {
  action: "add_node" | "remove_node" | "add_edge" | "remove_edge" | "update_profile";
  node?: PersonaNodeDto;
  edge?: PersonaEdgeDto;
  nodeId?: string;
  edgeId?: string;
  profileUpdate?: {
    primaryArchetype: ArchetypeType;
    secondaryArchetype?: ArchetypeType | null;
    archetypeSummary: string;
  };
}
