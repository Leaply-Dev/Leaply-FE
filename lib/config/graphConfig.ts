// ============================================================================
// Node Styling Configuration
// ============================================================================

// Layer hierarchy: Archetype -> Pattern -> Skill/Value -> Story
/** @deprecated Use GRAPH_NODE_CONFIG for new graph-based conversation */
export const NODE_CONFIG = {
	archetype: {
		color: "#f59e0b", // amber-500 - CENTER
		hoverColor: "#d97706", // amber-600
		size: 20, // Largest - center node
		layer: 0,
		label: "Archetype",
	},
	pattern: {
		color: "#8b5cf6", // violet-500 - Layer 1
		hoverColor: "#7c3aed", // violet-600
		size: 12,
		layer: 1,
		label: "Pattern",
	},
	value: {
		color: "#10b981", // emerald-500 - Layer 2
		hoverColor: "#059669", // emerald-600
		size: 10,
		layer: 2,
		label: "Values",
	},
	skill: {
		color: "#ec4899", // pink-500 - Layer 2
		hoverColor: "#db2777", // pink-600
		size: 10,
		layer: 2,
		label: "Skill",
	},
	story: {
		color: "#3b82f6", // blue-500 - Layer 3 (outermost)
		hoverColor: "#2563eb", // blue-600
		size: 6,
		layer: 3,
		label: "Story",
	},
} as const;

/** @deprecated Use GRAPH_EDGE_CONFIG for new graph-based conversation */
export const EDGE_CONFIG = {
	member_of: { color: "rgba(59, 130, 246, 0.3)", width: 2 }, // blue
	evidences: { color: "rgba(245, 158, 11, 0.4)", width: 3 }, // amber
	supports: { color: "rgba(16, 185, 129, 0.3)", width: 2 }, // emerald
	conflicts: { color: "rgba(239, 68, 68, 0.5)", width: 1.5, dashed: true }, // red
	demonstrates: { color: "rgba(236, 72, 153, 0.3)", width: 2 }, // pink
} as const;

// ============================================================================
// New Graph-Based Node Configuration (v2)
// Layer hierarchy: Profile Summary -> Essay Angle -> Key Story -> Detail
// ============================================================================

export const GRAPH_NODE_CONFIG = {
	profile_summary: {
		color: "#6366f1", // indigo-500 - CENTER
		hoverColor: "#4f46e5", // indigo-600
		size: 90, // Largest - center node
		layer: 0,
		label: "Profile",
		description: "Overall profile with archetype",
	},
	essay_angle: {
		color: "#8b5cf6", // violet-500 - Layer 1
		hoverColor: "#7c3aed", // violet-600
		size: 55,
		layer: 1,
		label: "Essay Angle",
		description: "Patterns and themes for essays",
	},
	key_story: {
		color: "#10b981", // emerald-500 - Layer 2
		hoverColor: "#059669", // emerald-600
		size: 40,
		layer: 2,
		label: "Story",
		description: "Complete narratives with STAR structure",
	},
	detail: {
		color: "#94a3b8", // slate-400 - Layer 3 (outermost)
		hoverColor: "#64748b", // slate-500
		size: 24,
		layer: 3,
		label: "Detail",
		description: "Specific achievements and evidence",
	},
} as const;

// ============================================================================
// New Graph-Based Edge Configuration (v2)
// Connection types: normal relationships
// Tension types: contradictions (animated orange pulse)
// ============================================================================

export const GRAPH_EDGE_CONFIG = {
	// Connection edge types (normal styling)
	enables: {
		color: "rgba(59, 130, 246, 0.4)", // blue-500
		width: 2,
		animated: false,
	},
	builds_on: {
		color: "rgba(16, 185, 129, 0.4)", // emerald-500
		width: 2,
		animated: false,
	},
	supports: {
		color: "rgba(139, 92, 246, 0.3)", // violet-500
		width: 2,
		animated: false,
	},
	complements: {
		color: "rgba(148, 163, 184, 0.3)", // slate-400
		width: 1.5,
		animated: false,
	},

	// Tension edge types (orange animated pulse)
	contradicts: {
		color: "rgba(249, 115, 22, 0.6)", // orange-500
		width: 2.5,
		animated: true,
		pulseColor: "rgba(249, 115, 22, 0.3)",
	},
	evolved_from: {
		color: "rgba(251, 146, 60, 0.5)", // orange-400
		width: 2,
		animated: true,
		pulseColor: "rgba(251, 146, 60, 0.2)",
	},
	challenged_by: {
		color: "rgba(234, 88, 12, 0.6)", // orange-600
		width: 2.5,
		animated: true,
		pulseColor: "rgba(234, 88, 12, 0.3)",
	},
	transformed: {
		color: "rgba(253, 186, 116, 0.5)", // orange-300
		width: 2,
		animated: true,
		pulseColor: "rgba(253, 186, 116, 0.2)",
	},
} as const;

// Helper to check if an edge type is a tension edge
export function isTensionEdge(
	edgeType: keyof typeof GRAPH_EDGE_CONFIG,
): boolean {
	return [
		"contradicts",
		"evolved_from",
		"challenged_by",
		"transformed",
	].includes(edgeType);
}

// Coverage category colors for progress bar
export const COVERAGE_COLORS = {
	goals: "#8b5cf6", // violet-500
	evidence: "#3b82f6", // blue-500
	skills: "#10b981", // emerald-500
	values: "#f59e0b", // amber-500
	tensions: "#f97316", // orange-500
} as const;

// Coverage category labels
export const COVERAGE_LABELS = {
	goals: "Goals",
	evidence: "Evidence",
	skills: "Skills",
	values: "Values",
	tensions: "Tensions",
} as const;

// ============================================================================
// Unified Node Configuration (combines legacy and new configs)
// Use this when handling both old mock data and new API data
// ============================================================================

export const ALL_NODE_CONFIG = {
	// Legacy node types (mock data)
	...NODE_CONFIG,
	// New API node types
	...GRAPH_NODE_CONFIG,
} as const;

// Helper to get node config for any node type
export function getNodeConfig(nodeType: string) {
	return (
		ALL_NODE_CONFIG[nodeType as keyof typeof ALL_NODE_CONFIG] || {
			color: "#94a3b8",
			hoverColor: "#64748b",
			size: 10,
			layer: 2,
			label: nodeType,
		}
	);
}

// Type exports
export type LegacyNodeType = keyof typeof NODE_CONFIG;
export type GraphNodeType = keyof typeof GRAPH_NODE_CONFIG;
export type AllNodeType = keyof typeof ALL_NODE_CONFIG;
export type GraphEdgeLabel = keyof typeof GRAPH_EDGE_CONFIG;
export type CoverageCategory = keyof typeof COVERAGE_COLORS;
