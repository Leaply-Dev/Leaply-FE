// Persona Colors - Updated for new track IDs
// Re-exports from tracks.ts with backward compatibility

import type { LegacyTrackId, NodeType, TrackId } from "@/lib/types/persona";
import {
	LAYER_STYLES as NEW_LAYER_STYLES,
	TRACK_COLORS as NEW_TRACK_COLORS,
	NODE_TYPE_COLORS,
} from "./tracks";

// Re-export for backward compatibility
export const TRACK_COLORS = NEW_TRACK_COLORS;

// Legacy track ID mapping for components still using old IDs
export const LEGACY_TRACK_COLORS: Record<
	LegacyTrackId,
	(typeof NEW_TRACK_COLORS)[TrackId]
> = {
	future: NEW_TRACK_COLORS.future_vision,
	academic: NEW_TRACK_COLORS.academic_journey,
	activities: NEW_TRACK_COLORS.activities_impact,
	values: NEW_TRACK_COLORS.values_turning_points,
};

export const NODE_STATES = {
	locked: {
		bg: "bg-muted",
		border: "border-border",
		text: "text-muted-foreground",
	},
	unlocked: {
		bg: "bg-background",
		border: "border-2",
		text: "text-foreground",
	},
} as const;

// Updated layer styles for new node types
export const LAYER_STYLES = {
	story: {
		label: "Stories",
		icon: "file-text",
	},
	evidence: {
		label: "Evidence",
		icon: "list",
	},
	insight: {
		label: "Insights",
		icon: "lightbulb",
	},
	archetype: {
		label: "Archetype",
		icon: "target",
	},
} as const;

// Legacy layer styles for backward compatibility
export const LEGACY_LAYER_STYLES = {
	core: {
		label: "Core",
		icon: "target",
	},
	summary: {
		label: "Summary",
		icon: "file-text",
	},
	evidence: {
		label: "Evidence",
		icon: "list",
	},
	insight: {
		label: "Insights",
		icon: "lightbulb",
	},
} as const;

// Get track color by new TrackId
export function getTrackColor(trackId: TrackId) {
	return TRACK_COLORS[trackId];
}

// Get track color by legacy TrackId (for migration)
export function getLegacyTrackColor(trackId: LegacyTrackId) {
	return LEGACY_TRACK_COLORS[trackId];
}

// Get node type color (new color scheme based on node type, not track)
export function getNodeTypeColor(nodeType: NodeType) {
	return NODE_TYPE_COLORS[nodeType];
}

// Get track icon by new TrackId
export function getTrackIcon(trackId: TrackId): string {
	const icons: Record<TrackId, string> = {
		future_vision: "target",
		academic_journey: "book-open",
		activities_impact: "sparkles",
		values_turning_points: "gem",
	};
	return icons[trackId];
}

// Get track emoji by TrackId
export function getTrackEmoji(trackId: TrackId): string {
	const emojis: Record<TrackId, string> = {
		future_vision: "🎯",
		academic_journey: "📚",
		activities_impact: "🌟",
		values_turning_points: "💎",
	};
	return emojis[trackId];
}
