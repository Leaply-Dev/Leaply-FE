// ============================================================================
// Node Styling Configuration
// ============================================================================

// Layer hierarchy: Profile Summary -> Essay Angle -> Key Story -> Detail
// ============================================================================
export const GRAPH_NODE_CONFIG = {
	// ============================================================================
	// LAYER 0 - CENTER (Profile Summary)
	// ============================================================================
	// The core identity node, synthesized from user's stories
	// Created by backend after collecting 10+ stories
	// Shows user's archetype and overall profile summary
	profile_summary: {
		color: "#f59e0b", // amber-500 - CENTER (vibrant like archetype)
		hoverColor: "#d97706", // amber-600
		size: 24, // Largest - center node
		layer: 0,
		label: "Profile",
		description: "Overall profile with archetype",
	},

	// ============================================================================
	// LAYER 1 - INNER RING (Essay Angles)
	// ============================================================================
	// Thematic patterns extracted from stories
	// Used to generate college essay angles
	// Example: "Overcoming Challenges", "Leadership Journey"
	essay_angle: {
		color: "#8b5cf6", // violet-500 - Layer 1
		hoverColor: "#7c3aed", // violet-600
		size: 16,
		layer: 1,
		label: "Essay Angle",
		description: "Patterns and themes for essays",
	},

	// ============================================================================
	// LAYER 2 - MIDDLE RING (Key Stories)
	// ============================================================================
	// Complete narratives with STAR structure
	// (Situation, Task, Action, Result, + Emotion, Insight)
	// Foundation of the entire persona graph
	key_story: {
		color: "#10b981", // emerald-500 - Layer 2
		hoverColor: "#059669", // emerald-600
		size: 12,
		layer: 2,
		label: "Story",
		description: "Complete narratives with STAR structure",
	},

	// ============================================================================
	// LAYER 3 - OUTER RING (Details)
	// ============================================================================
	// Specific achievements, evidence, and metrics
	// Extracted from stories to provide concrete examples
	// Types: value, skill, evidence, goal
	detail: {
		color: "#3b82f6", // blue-500 - Layer 3 (more vibrant than slate)
		hoverColor: "#2563eb", // blue-600
		size: 8,
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
	// ============================================================================
	// Simplified: Only 2 color schemes - Blue for connections, Orange for tensions
	// No semantic colors since users don't have notes explaining the meaning
	// ============================================================================

	// ============================================================================
	// CONNECTION TYPES (Blue - Normal Relationships)
	// ============================================================================

	// ENABLES: One node enables/unlocks capabilities in another
	// Used: Story → Detail (a story unlocks specific details/evidence)
	// Example: Leadership story → enables → "Led team of 5" detail
	enables: {
		color: "rgba(59, 130, 246, 0.4)", // blue-500
		width: 2,
		animated: false,
	},

	// BUILDS_ON: One node builds upon/extends another
	// Used: Essay Angle → Story (stories build on thematic angles)
	// Example: "Overcoming Challenges" angle → builds_on → failure story
	builds_on: {
		color: "rgba(59, 130, 246, 0.4)", // blue-500 (unified)
		width: 2,
		animated: false,
	},

	// SUPPORTS: General supportive/foundational relationship
	// Used: Root → Stories, Root → Angles (foundation of profile)
	// Example: Profile → supports → "Leadership in Crisis" story
	supports: {
		color: "rgba(59, 130, 246, 0.4)", // blue-500 (unified)
		width: 2,
		animated: false,
	},

	// COMPLEMENTS: Nodes complement each other (not currently used)
	// Reserved for: Future peer-to-peer complementary relationships
	// Example: Two different skills that work well together
	complements: {
		color: "rgba(59, 130, 246, 0.3)", // blue-500 slightly faded
		width: 1.5,
		animated: false,
	},

	// ============================================================================
	// TENSION TYPES (Orange - Conflicts/Evolution, Animated)
	// ============================================================================

	// CONTRADICTS: Direct contradiction between nodes
	// Used: Conflicting themes (failure stories vs success angles)
	// Example: "Introvert" angle ← contradicts → "Public Speaker" story
	contradicts: {
		color: "rgba(249, 115, 22, 0.6)", // orange-500
		width: 2.5,
		animated: true,
		pulseColor: "rgba(249, 115, 22, 0.3)",
	},

	// EVOLVED_FROM: One node evolved from another (growth narrative)
	// Reserved for: Showing user's growth over time
	// Example: "Shy Student" story → evolved_from → "Confident Leader" story
	evolved_from: {
		color: "rgba(249, 115, 22, 0.5)", // orange-500 (unified)
		width: 2,
		animated: true,
		pulseColor: "rgba(249, 115, 22, 0.2)",
	},

	// CHALLENGED_BY: One node challenges/questions another
	// Reserved for: Intellectual tensions or competing priorities
	// Example: "Academic Excellence" value ← challenged_by → "Work-Life Balance" value
	challenged_by: {
		color: "rgba(249, 115, 22, 0.6)", // orange-500 (unified)
		width: 2.5,
		animated: true,
		pulseColor: "rgba(249, 115, 22, 0.3)",
	},

	// TRANSFORMED: One node transformed into another (major shift)
	// Reserved for: Pivotal moments of transformation
	// Example: "Engineering Student" → transformed → "Social Entrepreneur"
	transformed: {
		color: "rgba(249, 115, 22, 0.5)", // orange-500 (unified)
		width: 2,
		animated: true,
		pulseColor: "rgba(249, 115, 22, 0.2)",
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
