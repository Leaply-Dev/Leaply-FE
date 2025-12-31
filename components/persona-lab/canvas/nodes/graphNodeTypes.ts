/**
 * Node type registry for the 4-layer concentric graph
 *
 * Maps node types from PersonaNodeDto to React Flow custom node components.
 *
 * Layer hierarchy:
 * - Layer 0: profile_summary -> ProfileSummaryNode
 * - Layer 1: essay_angle -> EssayAngleNode
 * - Layer 2: key_story -> KeyStoryNode
 * - Layer 3: detail -> DetailNode
 */

import type { NodeTypes } from "@xyflow/react";
import { ProfileSummaryNode } from "./ProfileSummaryNode";
import { EssayAngleNode } from "./EssayAngleNode";
import { KeyStoryNode } from "./KeyStoryNode";
import { DetailNode } from "./DetailNode";

/**
 * Node types mapping for React Flow
 * Keys match the `type` field in PersonaNodeDto
 */
export const graphNodeTypes: NodeTypes = {
	profile_summary: ProfileSummaryNode,
	essay_angle: EssayAngleNode,
	key_story: KeyStoryNode,
	detail: DetailNode,
};

/**
 * Node type labels for UI display
 */
export const NODE_TYPE_LABELS: Record<string, string> = {
	profile_summary: "Hồ sơ cá nhân",
	essay_angle: "Góc nhìn Essay",
	key_story: "Câu chuyện chính",
	detail: "Chi tiết",
};

/**
 * Get display label for a node type
 */
export function getNodeTypeLabel(type: string): string {
	return NODE_TYPE_LABELS[type] ?? type;
}

// Re-export individual node components for direct use
export { ProfileSummaryNode } from "./ProfileSummaryNode";
export { EssayAngleNode } from "./EssayAngleNode";
export { KeyStoryNode } from "./KeyStoryNode";
export { DetailNode } from "./DetailNode";
