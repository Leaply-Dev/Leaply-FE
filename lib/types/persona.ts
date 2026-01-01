// Persona Lab Type Definitions
// Aligned with Backend API specification

// ============================================
// Track Types
// ============================================

export type TrackId =
	| "future_vision"
	| "academic_journey"
	| "activities_impact"
	| "values_turning_points";

export type TrackStatus = "not_started" | "in_progress" | "completed";

export interface Track {
	id: TrackId;
	displayName: string;
	description: string;
	icon: string;
	status: TrackStatus;
	completedAt: string | null;
	// Progress tracking (from conversationState)
	coreQuestionIndex: number; // 0-3 (which core question)
	followUpIndex: number; // 0-2 (0=core, 1=detail followup, 2=emotion followup)
}

// ============================================
// Message Types
// ============================================

export type MessageRole = "assistant" | "user";
export type MessageType = "text" | "track_selection" | "track_complete";

export interface TrackAction {
	trackId: TrackId;
	displayName: string;
	icon: string;
	status: TrackStatus;
}

export interface CanvasAction {
	action: "add" | "remove" | "reveal_archetype";
	node?: CanvasNode;
	nodeId?: string;
	archetype?: {
		type: ArchetypeType;
		personalizedSummary: string;
	};
}

export interface ChatMessage {
	id: string;
	role: MessageRole;
	content: string;
	type: MessageType;
	timestamp: string;
	actions?: TrackAction[];
	canvasActions?: CanvasAction[];
}

// ============================================
// Canvas Node Types
// ============================================

export type NodeType = "story" | "evidence" | "insight" | "archetype";

export interface CanvasNode {
	id: string;
	type: NodeType;
	title: string;
	content: string;
	sourceTrackId: TrackId | null;
	createdAt: string;
	archetypeType?: ArchetypeType;
	personalizedSummary?: string;
}

// ============================================
// Archetype Types
// ============================================

export type ArchetypeType =
	| "innovator"
	| "bridge_builder"
	| "scholar"
	| "advocate"
	| "pioneer"
	| "craftsman"
	| "resilient"
	| "catalyst";

export interface ArchetypeDefinition {
	type: ArchetypeType;
	title: string;
	tagline: string;
	description: string;
	essayStrengths: string[];
	color: string;
	bgClass: string;
	textClass: string;
	borderClass: string;
	emoji: string;
}

// ============================================
// Full Persona State
// ============================================

export interface PersonaState {
	userId: string;
	tracks: Record<TrackId, Track>;
	nodes: CanvasNode[];
	archetype: {
		type: ArchetypeType;
		personalizedSummary: string;
		revealedAt: string;
	} | null;
	conversationHistory: ChatMessage[];
	currentTrackId: TrackId | null;
	createdAt: string | null;
	updatedAt: string | null;
}

// ============================================
// API Response Types
// ============================================

export interface PersonaApiResponse {
	success: boolean;
	data: PersonaState;
}

export interface TrackSelectResponse {
	message: ChatMessage;
	trackStatus: TrackStatus;
	currentTrackId: TrackId;
}

export interface ArchetypeCandidate {
	type: ArchetypeType;
	probability: number; // 0-100
	evidence?: string; // One-line quote from user's answers
}

export interface ArchetypeHints {
	totalQuestionsAnswered: number;
	confidence: "none" | "early" | "emerging" | "strong" | "final";
	candidates: ArchetypeCandidate[];
}

export interface MessageResponse {
	message: ChatMessage;
	conversationState?: {
		coreQuestionIndex: number;
		followUpIndex: number;
		totalCoreQuestions: number;
	};
	trackStatus?: TrackStatus;
	currentTrackId?: TrackId | null;
	allTracksComplete?: boolean;
	archetypeHints?: ArchetypeHints;
}

export interface KeywordRequest {
	content: string;
	trackId: string;
}

export interface KeywordResponse {
	keywords: string[];
	trackId: string;
}

export interface BackToTrackResponse {
	message: ChatMessage;
	currentTrackId: null;
}

export interface RedoTrackResponse {
	message: ChatMessage;
	trackStatus: TrackStatus;
	currentTrackId: TrackId;
	removedNodeIds: string[];
}

// ============================================
// Legacy Type Mapping (for migration)
// ============================================

export type LegacyTrackId = "academic" | "activities" | "values" | "future";

export const LEGACY_TRACK_MAPPING: Record<LegacyTrackId, TrackId> = {
	academic: "academic_journey",
	activities: "activities_impact",
	values: "values_turning_points",
	future: "future_vision",
};

export const REVERSE_TRACK_MAPPING: Record<TrackId, LegacyTrackId> = {
	academic_journey: "academic",
	activities_impact: "activities",
	values_turning_points: "values",
	future_vision: "future",
};
