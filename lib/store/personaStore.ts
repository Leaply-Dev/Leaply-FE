import * as Sentry from "@sentry/nextjs";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ApiError } from "@/lib/api/client";
import { personaApi } from "@/lib/api/personaApi";
import { createInitialTracks } from "@/lib/constants/tracks";
import type {
	ArchetypeHints,
	ArchetypeType,
	CanvasAction,
	CanvasNode,
	ChatMessage,
	NodeType,
	Track,
	TrackId,
	TrackStatus,
} from "@/lib/types/persona";
import type {
	GraphMeta,
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/types/persona-graph";

// Re-export types for backward compatibility
export type { TrackId, TrackStatus, Track, ChatMessage, CanvasNode, NodeType };

// Legacy types (kept for backward compatibility with existing components)
export type LegacyTrackId = "academic" | "activities" | "values" | "future";
export type NodeLayer = "story" | "evidence" | "insight" | "archetype";
export type ViewMode = "list" | "canvas";

export interface VisibleLayers {
	story: boolean;
	evidence: boolean;
	insight: boolean;
	archetype: boolean;
}

// Keyword for canvas display
export interface CanvasKeyword {
	id: string;
	keyword: string;
	trackId: TrackId;
	createdAt: string;
}

// Store State
interface PersonaStoreState {
	// === Data State (from API) ===
	tracks: Record<TrackId, Track>;
	nodes: CanvasNode[];
	archetype: {
		type: ArchetypeType;
		personalizedSummary: string;
		revealedAt: string;
	} | null;
	conversationHistory: ChatMessage[];

	// === Phase 2 & 3 Enhancements ===
	archetypeHints: ArchetypeHints | null;
	keywords: CanvasKeyword[]; // Keywords per track for canvas

	// === UI State ===
	currentTrackId: TrackId | null;
	isLoading: boolean;
	isSending: boolean;
	error: string | null;
	viewMode: ViewMode;
	visibleLayers: VisibleLayers;
	selectedNodeId: string | null;
	isExtractingKeywords: boolean;

	// === Canvas Expansion State (Progressive Disclosure) ===
	expandedTrackId: TrackId | null;
	expandedStoryId: string | null;

	// === New Graph State (4-layer concentric graph) ===
	graphNodes: PersonaNodeDto[];
	graphEdges: PersonaEdgeDto[];
	graphMeta: GraphMeta | null;
	isGraphLoading: boolean;
	selectedGraphNodeId: string | null;
	hoveredNodeId: string | null;
	showAllDetails: boolean;

	// === Actions ===

	// Initial load
	fetchPersonaState: () => Promise<void>;

	// Chat flow
	selectTrack: (trackId: TrackId) => Promise<void>;
	sendMessage: (content: string) => Promise<void>;
	goBackToTrackSelection: () => Promise<void>;
	redoTrack: (trackId: TrackId) => Promise<void>;

	// Canvas
	setViewMode: (mode: ViewMode) => void;
	toggleLayer: (layer: NodeLayer) => void;
	setVisibleLayers: (layers: VisibleLayers) => void;
	selectNode: (nodeId: string | null) => void;
	processCanvasActions: (actions: CanvasAction[]) => void;

	// Canvas expansion (progressive disclosure)
	setExpandedTrack: (trackId: TrackId | null) => void;
	setExpandedStory: (storyId: string | null) => void;

	// Keywords & Archetype Hints (Phase 2 & 3)
	extractKeywords: (content: string, trackId: TrackId) => Promise<void>;
	addKeywords: (keywords: string[], trackId: TrackId) => void;
	updateArchetypeHints: (hints: ArchetypeHints) => void;
	getKeywordsForTrack: (trackId: TrackId) => CanvasKeyword[];

	// Computed helpers
	getCompletedTrackCount: () => number;
	getAvailableTracks: () => Track[];
	isArchetypeRevealed: () => boolean;
	getTrackProgress: () => { completed: number; total: number };

	// === New Graph Actions ===
	fetchPersonaGraph: () => Promise<void>;
	selectGraphNode: (nodeId: string | null) => void;
	setHoveredNode: (nodeId: string | null) => void;
	setShowAllDetails: (show: boolean) => void;

	// Utility
	resetPersona: () => void;
	clearError: () => void;
}

// Initial state
const initialState = {
	tracks: createInitialTracks(),
	nodes: [] as CanvasNode[],
	archetype: null,
	conversationHistory: [] as ChatMessage[],
	archetypeHints: null as ArchetypeHints | null,
	keywords: [] as CanvasKeyword[],
	currentTrackId: null,
	isLoading: false,
	isSending: false,
	isExtractingKeywords: false,
	error: null,
	viewMode: "canvas" as ViewMode,
	visibleLayers: {
		story: true,
		evidence: true,
		insight: true,
		archetype: true,
	},
	selectedNodeId: null,
	expandedTrackId: null,
	expandedStoryId: null,
	// New graph state
	graphNodes: [] as PersonaNodeDto[],
	graphEdges: [] as PersonaEdgeDto[],
	graphMeta: null as GraphMeta | null,
	isGraphLoading: false,
	selectedGraphNodeId: null as string | null,
	hoveredNodeId: null as string | null,
	showAllDetails: false,
};

export const usePersonaStore = create<PersonaStoreState>()(
	persist(
		(set, get) => ({
			// Initial State
			...initialState,

			// === Actions ===

			// Fetch full persona state from API
			fetchPersonaState: async () => {
				set({ isLoading: true, error: null });
				console.log("PersonaStore: Fetching persona state...");
				try {
					const state = await personaApi.getPersonaState();
					console.log("PersonaStore: State received:", state);
					set({
						tracks: state.tracks,
						nodes: state.nodes,
						archetype: state.archetype,
						conversationHistory: state.conversationHistory,
						currentTrackId: state.currentTrackId,
						isLoading: false,
					});
				} catch (err) {
					console.error("PersonaStore: Failed to fetch state:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						// Capture unexpected non-API errors to Sentry
						Sentry.captureException(err, {
							tags: { store: "persona", action: "fetchState" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to load persona data. Please refresh.",
						isLoading: false,
					});
				}
			},

			// Select a track to start/continue
			selectTrack: async (trackId: TrackId) => {
				set({ isSending: true, error: null });
				console.log(`PersonaStore: Selecting track: ${trackId}`);
				try {
					const response = await personaApi.selectTrack(trackId);
					console.log("PersonaStore: Track selection successful");

					set((state) => ({
						conversationHistory: [
							...state.conversationHistory,
							response.message,
						],
						currentTrackId: response.currentTrackId,
						tracks: {
							...state.tracks,
							[trackId]: {
								...state.tracks[trackId],
								status: response.trackStatus,
							},
						},
						isSending: false,
					}));
				} catch (err) {
					console.error(
						`PersonaStore: Failed to select track ${trackId}:`,
						err,
					);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "selectTrack" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									`Failed to select ${trackId}. Please try again.`,
						isSending: false,
					});
				}
			},

			// Send a message in the current track conversation
			sendMessage: async (content: string) => {
				const { currentTrackId } = get();
				if (!currentTrackId) {
					set({ error: "No track selected" });
					return;
				}

				// Optimistically add user message
				const userMessage: ChatMessage = {
					id: `temp-${Date.now()}`,
					role: "user",
					content,
					type: "text",
					timestamp: new Date().toISOString(),
				};

				set((state) => ({
					conversationHistory: [...state.conversationHistory, userMessage],
					isSending: true,
					error: null,
				}));

				try {
					const response = await personaApi.sendMessage(content);

					set((state) => {
						// Process canvas actions inline to avoid nested set() calls
						let nodes = [...state.nodes];
						let archetype = state.archetype;

						if (response.message.canvasActions) {
							console.log(
								"PersonaStore: Processing canvas actions:",
								response.message.canvasActions,
							);
							for (const action of response.message.canvasActions) {
								if (action.action === "add" && action.node) {
									// Add new node (avoid duplicates)
									if (!nodes.find((n) => n.id === action.node?.id)) {
										nodes.push(action.node);
									}
								}
								if (action.action === "remove" && action.nodeId) {
									// Remove node
									nodes = nodes.filter((n) => n.id !== action.nodeId);
								}
								if (action.action === "reveal_archetype" && action.archetype) {
									// Reveal archetype
									archetype = {
										type: action.archetype.type,
										personalizedSummary: action.archetype.personalizedSummary,
										revealedAt: new Date().toISOString(),
									};
								}
							}
						}

						// Update track status and progress if provided
						const updatedTracks = { ...state.tracks };
						if (response.currentTrackId) {
							const trackId = response.currentTrackId;
							updatedTracks[trackId] = {
								...updatedTracks[trackId],
								status: response.trackStatus ?? updatedTracks[trackId].status,
								completedAt:
									response.trackStatus === "completed"
										? new Date().toISOString()
										: updatedTracks[trackId].completedAt,
								// Update progress from conversationState
								coreQuestionIndex:
									response.conversationState?.coreQuestionIndex ??
									updatedTracks[trackId].coreQuestionIndex,
								followUpIndex:
									response.conversationState?.followUpIndex ??
									updatedTracks[trackId].followUpIndex,
							};
						}

						// Handle archetype reveal from allTracksComplete flag (fallback)
						if (
							response.allTracksComplete &&
							response.message.canvasActions &&
							!archetype
						) {
							const revealAction = response.message.canvasActions.find(
								(a) => a.action === "reveal_archetype",
							);
							if (revealAction?.archetype) {
								archetype = {
									type: revealAction.archetype.type,
									personalizedSummary:
										revealAction.archetype.personalizedSummary,
									revealedAt: new Date().toISOString(),
								};
							}
						}

						console.log(
							"PersonaStore: State updated - nodes:",
							nodes.length,
							"archetype:",
							archetype?.type,
						);

						return {
							conversationHistory: [
								...state.conversationHistory,
								response.message,
							],
							currentTrackId: response.currentTrackId ?? null,
							tracks: updatedTracks,
							nodes,
							archetype,
							archetypeHints: response.archetypeHints ?? state.archetypeHints,
							isSending: false,
						};
					});
				} catch (err) {
					console.error("PersonaStore: Failed to send message:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "sendMessage" },
						});
					}
					// Remove temp message on error
					set((state) => ({
						conversationHistory: state.conversationHistory.filter(
							(m) => !m.id.startsWith("temp-"),
						),
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to send message. Please try again.",
						isSending: false,
					}));
				}
			},

			// Go back to track selection
			goBackToTrackSelection: async () => {
				set({ isSending: true, error: null });
				try {
					const response = await personaApi.goBackToTrackSelection();
					set((state) => ({
						conversationHistory: [
							...state.conversationHistory,
							response.message,
						],
						currentTrackId: null,
						isSending: false,
					}));
				} catch (err) {
					console.error("PersonaStore: Failed to go back:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "goBack" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to go back. Please try again.",
						isSending: false,
					});
				}
			},

			// Redo a completed track
			redoTrack: async (trackId: TrackId) => {
				set({ isSending: true, error: null });
				try {
					const response = await personaApi.redoTrack(trackId);

					set((state) => {
						// Remove nodes from this track
						const nodes = state.nodes.filter(
							(n) => !response.removedNodeIds.includes(n.id),
						);

						return {
							conversationHistory: [
								...state.conversationHistory,
								response.message,
							],
							currentTrackId: response.currentTrackId,
							tracks: {
								...state.tracks,
								[trackId]: {
									...state.tracks[trackId],
									status: response.trackStatus,
									completedAt: null,
								},
							},
							nodes,
							// Reset archetype if it was revealed
							archetype: null,
							isSending: false,
						};
					});
				} catch (err) {
					console.error("PersonaStore: Failed to redo track:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "redoTrack" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to redo track. Please try again.",
						isSending: false,
					});
				}
			},

			// Canvas actions
			setViewMode: (mode) => set({ viewMode: mode }),

			toggleLayer: (layer: NodeLayer) =>
				set((state) => ({
					visibleLayers: {
						...state.visibleLayers,
						[layer]: !state.visibleLayers[layer],
					},
				})),

			setVisibleLayers: (layers) => set({ visibleLayers: layers }),

			selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

			// Canvas expansion (progressive disclosure)
			setExpandedTrack: (trackId) =>
				set({
					expandedTrackId: trackId,
					expandedStoryId: null, // Reset story expansion when changing tracks
				}),
			setExpandedStory: (storyId) => set({ expandedStoryId: storyId }),

			processCanvasActions: (actions: CanvasAction[]) => {
				set((state) => {
					let nodes = [...state.nodes];
					let archetype = state.archetype;

					for (const action of actions) {
						if (action.action === "add" && action.node) {
							// Add new node (avoid duplicates)
							if (!nodes.find((n) => n.id === action.node?.id)) {
								nodes.push(action.node);
							}
						}
						if (action.action === "remove" && action.nodeId) {
							// Remove node
							nodes = nodes.filter((n) => n.id !== action.nodeId);
						}
						if (action.action === "reveal_archetype" && action.archetype) {
							// Reveal archetype
							archetype = {
								type: action.archetype.type,
								personalizedSummary: action.archetype.personalizedSummary,
								revealedAt: new Date().toISOString(),
							};
						}
					}

					return { nodes, archetype };
				});
			},

			// Keywords & Archetype Hints (Phase 2 & 3)
			extractKeywords: async (content: string, trackId: TrackId) => {
				set({ isExtractingKeywords: true });
				try {
					const response = await personaApi.extractKeywords(content, trackId);
					if (response.keywords && response.keywords.length > 0) {
						get().addKeywords(response.keywords, trackId);
					}
				} catch (err) {
					console.error("PersonaStore: Failed to extract keywords:", err);
					// Don't show error to user - keywords are optional enhancement
				} finally {
					set({ isExtractingKeywords: false });
				}
			},

			addKeywords: (newKeywords: string[], trackId: TrackId) => {
				set((state) => {
					const MAX_KEYWORDS_PER_TRACK = 10;
					const existingForTrack = state.keywords.filter(
						(k) => k.trackId === trackId,
					);
					const otherKeywords = state.keywords.filter(
						(k) => k.trackId !== trackId,
					);

					// Add new keywords
					const newCanvasKeywords: CanvasKeyword[] = newKeywords.map((kw) => ({
						id: `kw-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
						keyword: kw,
						trackId,
						createdAt: new Date().toISOString(),
					}));

					// Combine and limit to max
					let trackKeywords = [...existingForTrack, ...newCanvasKeywords];
					if (trackKeywords.length > MAX_KEYWORDS_PER_TRACK) {
						// Remove oldest keywords
						trackKeywords = trackKeywords.slice(-MAX_KEYWORDS_PER_TRACK);
					}

					return {
						keywords: [...otherKeywords, ...trackKeywords],
					};
				});
			},

			updateArchetypeHints: (hints: ArchetypeHints) => {
				set({ archetypeHints: hints });
			},

			getKeywordsForTrack: (trackId: TrackId) => {
				return get().keywords.filter((k) => k.trackId === trackId);
			},

			// Computed helpers
			getCompletedTrackCount: () => {
				const { tracks } = get();
				return Object.values(tracks).filter((t) => t.status === "completed")
					.length;
			},

			getAvailableTracks: () => {
				const { tracks } = get();
				return Object.values(tracks).filter((t) => t.status !== "completed");
			},

			isArchetypeRevealed: () => {
				return get().archetype !== null;
			},

			getTrackProgress: () => {
				const { tracks } = get();
				const trackList = Object.values(tracks);
				const completed = trackList.filter(
					(t) => t.status === "completed",
				).length;
				return { completed, total: trackList.length };
			},

			// === New Graph Actions ===

			// Fetch persona graph data from API
			fetchPersonaGraph: async () => {
				set({ isGraphLoading: true, error: null });
				console.log("PersonaStore: Fetching persona graph...");
				try {
					const graphData = await personaApi.getPersonaGraph();
					console.log("PersonaStore: Graph data received:", graphData);
					set({
						graphNodes: graphData.nodes,
						graphEdges: graphData.edges,
						graphMeta: graphData.meta,
						isGraphLoading: false,
					});
				} catch (err) {
					console.error("PersonaStore: Failed to fetch graph:", err);
					if (err instanceof ApiError) {
						err.logDetails();
					} else {
						Sentry.captureException(err, {
							tags: { store: "persona", action: "fetchGraph" },
						});
					}
					set({
						error:
							err instanceof ApiError
								? err.getUserMessage()
								: (err as Error).message ||
									"Failed to load graph data. Please refresh.",
						isGraphLoading: false,
					});
				}
			},

			// Select a node in the graph (for detail panel)
			selectGraphNode: (nodeId: string | null) =>
				set({ selectedGraphNodeId: nodeId }),

			// Set hovered node (for layer 3 visibility)
			setHoveredNode: (nodeId: string | null) => set({ hoveredNodeId: nodeId }),

			// Toggle show all details (layer 3 nodes)
			setShowAllDetails: (show: boolean) => set({ showAllDetails: show }),

			// Utility
			resetPersona: () => set(initialState),

			clearError: () => set({ error: null }),
		}),
		{
			name: "leaply-persona-store-v3",
			partialize: (state) => ({
				// Only persist essential data
				tracks: state.tracks,
				nodes: state.nodes,
				archetype: state.archetype,
				conversationHistory: state.conversationHistory,
				archetypeHints: state.archetypeHints,
				keywords: state.keywords,
				currentTrackId: state.currentTrackId,
				viewMode: state.viewMode,
				visibleLayers: state.visibleLayers,
				expandedTrackId: state.expandedTrackId,
				expandedStoryId: state.expandedStoryId,
				// New graph state (persist nodes/edges for offline)
				graphNodes: state.graphNodes,
				graphEdges: state.graphEdges,
				graphMeta: state.graphMeta,
			}),
		},
	),
);

// Selectors for common use cases
export const selectConversationHistory = (state: PersonaStoreState) =>
	state.conversationHistory;
export const selectNodes = (state: PersonaStoreState) => state.nodes;
export const selectTracks = (state: PersonaStoreState) => state.tracks;
export const selectCurrentTrackId = (state: PersonaStoreState) =>
	state.currentTrackId;
export const selectIsLoading = (state: PersonaStoreState) => state.isLoading;
export const selectIsSending = (state: PersonaStoreState) => state.isSending;
export const selectArchetype = (state: PersonaStoreState) => state.archetype;
export const selectVisibleLayers = (state: PersonaStoreState) =>
	state.visibleLayers;
export const selectViewMode = (state: PersonaStoreState) => state.viewMode;

// New graph selectors
export const selectGraphNodes = (state: PersonaStoreState) => state.graphNodes;
export const selectGraphEdges = (state: PersonaStoreState) => state.graphEdges;
export const selectGraphMeta = (state: PersonaStoreState) => state.graphMeta;
export const selectIsGraphLoading = (state: PersonaStoreState) =>
	state.isGraphLoading;
export const selectSelectedGraphNodeId = (state: PersonaStoreState) =>
	state.selectedGraphNodeId;
export const selectHoveredNodeId = (state: PersonaStoreState) =>
	state.hoveredNodeId;
export const selectShowAllDetails = (state: PersonaStoreState) =>
	state.showAllDetails;

// Re-export graph types for convenience
export type { PersonaNodeDto, PersonaEdgeDto, GraphMeta };
