import { create } from "zustand";
import { persist } from "zustand/middleware";
import { personaApi } from "@/lib/api/personaApi";
import { createInitialTracks } from "@/lib/constants/tracks";
import type {
	ArchetypeType,
	CanvasAction,
	CanvasNode,
	ChatMessage,
	NodeType,
	Track,
	TrackId,
	TrackStatus,
} from "@/lib/types/persona";

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

	// === UI State ===
	currentTrackId: TrackId | null;
	isLoading: boolean;
	isSending: boolean;
	error: string | null;
	viewMode: ViewMode;
	visibleLayers: VisibleLayers;
	selectedNodeId: string | null;

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

	// Computed helpers
	getCompletedTrackCount: () => number;
	getAvailableTracks: () => Track[];
	isArchetypeRevealed: () => boolean;
	getTrackProgress: () => { completed: number; total: number };

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
	currentTrackId: null,
	isLoading: false,
	isSending: false,
	error: null,
	viewMode: "canvas" as ViewMode,
	visibleLayers: {
		story: true,
		evidence: true,
		insight: true,
		archetype: true,
	},
	selectedNodeId: null,
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
					set({
						error: (err as Error).message || "Failed to load persona data. Please refresh.",
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
					console.error(`PersonaStore: Failed to select track ${trackId}:`, err);
					set({
						error: (err as Error).message || `Failed to select ${trackId}. Please try again.`,
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
						// Remove temp user message (API returns it in history)
						const historyWithoutTemp = state.conversationHistory.filter(
							(m) => !m.id.startsWith("temp-"),
						);

						// Process canvas actions if any
						if (response.message.canvasActions) {
							get().processCanvasActions(response.message.canvasActions);
						}

						// Update track status if provided
						const updatedTracks = { ...state.tracks };
						if (response.trackStatus && response.currentTrackId) {
							updatedTracks[response.currentTrackId] = {
								...updatedTracks[response.currentTrackId],
								status: response.trackStatus,
								completedAt:
									response.trackStatus === "completed"
										? new Date().toISOString()
										: null,
							};
						}

						// Handle archetype reveal
						let archetype = state.archetype;
						if (response.allTracksComplete && response.message.canvasActions) {
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

						return {
							conversationHistory: [...historyWithoutTemp, response.message],
							currentTrackId: response.currentTrackId ?? null,
							tracks: updatedTracks,
							archetype,
							isSending: false,
						};
					});
				} catch (err) {
					// Remove temp message on error
					set((state) => ({
						conversationHistory: state.conversationHistory.filter(
							(m) => !m.id.startsWith("temp-"),
						),
						error: (err as Error).message,
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
					set({
						error: (err as Error).message,
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
					set({
						error: (err as Error).message,
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

			// Utility
			resetPersona: () => set(initialState),

			clearError: () => set({ error: null }),
		}),
		{
			name: "leaply-persona-store-v2",
			partialize: (state) => ({
				// Only persist essential data
				tracks: state.tracks,
				nodes: state.nodes,
				archetype: state.archetype,
				conversationHistory: state.conversationHistory,
				currentTrackId: state.currentTrackId,
				viewMode: state.viewMode,
				visibleLayers: state.visibleLayers,
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
