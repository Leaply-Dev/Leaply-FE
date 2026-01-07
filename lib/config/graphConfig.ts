// ============================================================================
// Node Styling Configuration
// ============================================================================

// Layer hierarchy: Archetype -> Pattern -> Skill/Value -> Story
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

export const EDGE_CONFIG = {
	member_of: { color: "rgba(59, 130, 246, 0.3)", width: 2 }, // blue
	evidences: { color: "rgba(245, 158, 11, 0.4)", width: 3 }, // amber
	supports: { color: "rgba(16, 185, 129, 0.3)", width: 2 }, // emerald
	conflicts: { color: "rgba(239, 68, 68, 0.5)", width: 1.5, dashed: true }, // red
	demonstrates: { color: "rgba(236, 72, 153, 0.3)", width: 2 }, // pink
} as const;