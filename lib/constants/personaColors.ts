import type { TrackId } from "@/lib/store/personaStore";

export const TRACK_COLORS = {
	future: {
		primary: "#8B5CF6",
		light: "rgba(139, 92, 246, 0.1)",
		muted: "#C4B5FD",
		bgClass: "bg-violet-500/10",
		textClass: "text-violet-600",
		borderClass: "border-violet-300",
		hoverClass: "hover:bg-violet-500/20",
	},
	academic: {
		primary: "#3B82F6",
		light: "rgba(59, 130, 246, 0.1)",
		muted: "#93C5FD",
		bgClass: "bg-blue-500/10",
		textClass: "text-blue-600",
		borderClass: "border-blue-300",
		hoverClass: "hover:bg-blue-500/20",
	},
	activities: {
		primary: "#F59E0B",
		light: "rgba(245, 158, 11, 0.1)",
		muted: "#FCD34D",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
		hoverClass: "hover:bg-amber-500/20",
	},
	values: {
		primary: "#F43F5E",
		light: "rgba(244, 63, 94, 0.1)",
		muted: "#FDA4AF",
		bgClass: "bg-rose-500/10",
		textClass: "text-rose-600",
		borderClass: "border-rose-300",
		hoverClass: "hover:bg-rose-500/20",
	},
} as const;

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

export const LAYER_STYLES = {
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

export function getTrackColor(trackId: TrackId) {
	return TRACK_COLORS[trackId];
}

export function getTrackIcon(trackId: TrackId): string {
	const icons: Record<TrackId, string> = {
		academic: "book",
		activities: "star",
		values: "gem",
		future: "rocket",
	};
	return icons[trackId];
}
