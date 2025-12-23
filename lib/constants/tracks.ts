// Track Definitions - Must match backend exactly
// 4 discovery tracks for Persona Lab

import type { Track, TrackId, TrackStatus } from "@/lib/types/persona";

export interface TrackDefinition {
	id: TrackId;
	displayName: string;
	description: string;
	icon: string;
	order: number;
}

export const TRACKS: Record<TrackId, TrackDefinition> = {
	future_vision: {
		id: "future_vision",
		displayName: "Future Vision",
		description: "Khám phá mục tiêu và động lực",
		icon: "target",
		order: 1,
	},
	academic_journey: {
		id: "academic_journey",
		displayName: "Academic Journey",
		description: "Hành trình học thuật của bạn",
		icon: "book-open",
		order: 2,
	},
	activities_impact: {
		id: "activities_impact",
		displayName: "Activities & Impact",
		description: "Hoạt động và ảnh hưởng",
		icon: "sparkles",
		order: 3,
	},
	values_turning_points: {
		id: "values_turning_points",
		displayName: "Values & Turning Points",
		description: "Giá trị và bước ngoặt",
		icon: "gem",
		order: 4,
	},
} as const;

// Track emoji icons for display
export const TRACK_EMOJIS: Record<TrackId, string> = {
	future_vision: "🎯",
	academic_journey: "📚",
	activities_impact: "🌟",
	values_turning_points: "💎",
};

// Helper to get track by ID
export function getTrack(trackId: TrackId): TrackDefinition {
	return TRACKS[trackId];
}

// Get all track IDs in order
export const TRACK_IDS: TrackId[] = (Object.values(TRACKS) as TrackDefinition[])
	.sort((a, b) => a.order - b.order)
	.map((t) => t.id);

// Create initial track state
export function createInitialTrack(trackId: TrackId): Track {
	const def = TRACKS[trackId];
	return {
		id: trackId,
		displayName: def.displayName,
		description: def.description,
		icon: def.icon,
		status: "not_started" as TrackStatus,
		completedAt: null,
	};
}

// Create initial tracks record
export function createInitialTracks(): Record<TrackId, Track> {
	return {
		future_vision: createInitialTrack("future_vision"),
		academic_journey: createInitialTrack("academic_journey"),
		activities_impact: createInitialTrack("activities_impact"),
		values_turning_points: createInitialTrack("values_turning_points"),
	};
}

// Track colors for canvas visualization
export const TRACK_COLORS: Record<
	TrackId,
	{
		primary: string;
		light: string;
		muted: string;
		bgClass: string;
		textClass: string;
		borderClass: string;
		hoverClass: string;
	}
> = {
	future_vision: {
		primary: "#8B5CF6",
		light: "rgba(139, 92, 246, 0.1)",
		muted: "#C4B5FD",
		bgClass: "bg-violet-500/10",
		textClass: "text-violet-600",
		borderClass: "border-violet-300",
		hoverClass: "hover:bg-violet-500/20",
	},
	academic_journey: {
		primary: "#3B82F6",
		light: "rgba(59, 130, 246, 0.1)",
		muted: "#93C5FD",
		bgClass: "bg-blue-500/10",
		textClass: "text-blue-600",
		borderClass: "border-blue-300",
		hoverClass: "hover:bg-blue-500/20",
	},
	activities_impact: {
		primary: "#F59E0B",
		light: "rgba(245, 158, 11, 0.1)",
		muted: "#FCD34D",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
		hoverClass: "hover:bg-amber-500/20",
	},
	values_turning_points: {
		primary: "#F43F5E",
		light: "rgba(244, 63, 94, 0.1)",
		muted: "#FDA4AF",
		bgClass: "bg-rose-500/10",
		textClass: "text-rose-600",
		borderClass: "border-rose-300",
		hoverClass: "hover:bg-rose-500/20",
	},
};

// Node type colors (not track-based in new spec)
export const NODE_TYPE_COLORS = {
	story: {
		primary: "#10B981",
		bgClass: "bg-emerald-500/10",
		textClass: "text-emerald-600",
		borderClass: "border-emerald-300",
	},
	evidence: {
		primary: "#78716C",
		bgClass: "bg-stone-500/10",
		textClass: "text-stone-600",
		borderClass: "border-stone-300",
	},
	insight: {
		primary: "#F59E0B",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
	},
	archetype: {
		primary: "#16A34A",
		bgClass: "bg-primary/10",
		textClass: "text-primary",
		borderClass: "border-primary/30",
	},
};

// Layer styles for canvas controls
export const LAYER_STYLES = {
	story: { label: "Stories", icon: "file-text" },
	evidence: { label: "Evidence", icon: "list" },
	insight: { label: "Insights", icon: "lightbulb" },
	archetype: { label: "Archetype", icon: "target" },
};
