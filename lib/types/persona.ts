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

// ============================================
// Graph-Based Conversation Types (New API)
// ============================================

/**
 * Coverage metrics for the 5 persona dimensions.
 * Each value is 0-100 representing completion percentage.
 */
export interface Coverage {
	goals: number;
	evidence: number;
	skills: number;
	values: number;
	tensions: number;
}

/**
 * STAR structure for story nodes.
 * Contains structured content extracted from user responses.
 */
export interface StarStructure {
	situation?: string;
	task?: string;
	action?: string;
	result?: string;
	emotion?: string;
	insight?: string;
}

/** Layer in the persona graph (0 = center, 3 = outermost) */
export type GraphNodeLayer = 0 | 1 | 2 | 3;

/** Node types in the new graph-based system */
export type GraphNodeType =
	| "profile_summary" // Layer 0 - Overall profile with archetype
	| "essay_angle" // Layer 1 - Patterns/themes
	| "key_story" // Layer 2 - Complete narratives with STAR
	| "detail"; // Layer 3 - Specific achievements, evidence

/** Connection edge types (normal relationships) */
export type ConnectionEdgeLabel =
	| "enables"
	| "builds_on"
	| "supports"
	| "complements";

/** Tension edge types (contradictions - valuable for essays) */
export type TensionEdgeLabel =
	| "contradicts"
	| "evolved_from"
	| "challenged_by"
	| "transformed";

/** All edge labels */
export type GraphEdgeLabel = ConnectionEdgeLabel | TensionEdgeLabel;

/** Edge category for styling purposes */
export type GraphEdgeType = "connection" | "tension";

/**
 * Node in the persona graph from API.
 */
export interface GraphNode {
	id: string;
	type: GraphNodeType;
	layer: GraphNodeLayer;
	title: string;
	content: string;
	structuredContent?: StarStructure;
	tags: string[];
	bestFor?: string[];
	wordCountPotential?: string;
	essayAngle?: string;
}

/**
 * Edge in the persona graph from API.
 */
export interface GraphEdge {
	id: string;
	sourceNodeId: string;
	targetNodeId: string;
	edgeType: GraphEdgeType;
	label: GraphEdgeLabel;
	strength: number; // 0-1
}

/**
 * Message in the new conversation API.
 */
export interface ConversationMessage {
	id: string;
	role: "assistant" | "user";
	content: string;
	type: "text" | "question" | "completion";
	timestamp: string;
}

/**
 * Response from POST /v1/persona/conversation/message
 * Contains all data needed to update UI after a message.
 */
export interface GraphMessageResponse {
	message: ConversationMessage;
	nodesCreated: GraphNode[];
	edgesCreated: GraphEdge[];
	coverage: Coverage;
	voiceSample: string | null;
	completionReady: boolean;
	starGapsForLastStory: (keyof StarStructure)[] | null;
	totalNodeCount: number;
}

/**
 * Response from GET /v1/persona/conversation
 * Returns opening question based on coverage gaps.
 */
export interface ConversationStartResponse {
	message: ConversationMessage;
	coverage: Coverage;
	totalNodeCount: number;
}

/**
 * Response from GET /v1/persona/coverage
 */
export interface CoverageResponse {
	coverage: Coverage;
	completionReady: boolean;
	totalNodeCount: number;
}

/**
 * Voice profile for essay generation.
 * Response from GET /v1/persona/voice-profile
 */
export interface VoiceProfileResponse {
	personaId: string;
	sentenceStyle: string;
	toneMarkers: {
		formality: string;
		confidence: string;
		emotionLevel: string;
	};
	vocabularyPatterns: string[];
	sampleExcerpts: string[];
	sampleCount: number;
}

/**
 * Response from POST /v1/persona/node/{nodeId}/expand
 */
export interface NodeExpandResponse extends GraphMessageResponse {}

/**
 * Response from POST /v1/persona/conversation/reset
 */
export interface ResetConversationResponse {
	success: boolean;
	message: ConversationMessage;
}

/**
 * Full graph response from GET /v1/persona/graph
 */
export interface PersonaGraphResponse {
	nodes: GraphNode[];
	edges: GraphEdge[];
	coverage: Coverage;
	completionReady: boolean;
}
