/**
 * Persona Lab Store
 *
 * Simplified store for the graph-based persona conversation system.
 * Uses TanStack Query for server state, Zustand only for:
 * - UI state (viewMode)
 * - Persisted chat messages (graphMessages)
 * - Real-time graph data from mutations (apiGraphNodes/Edges)
 * - STAR gaps tracking
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
	ConversationMessage,
	Coverage,
	GraphEdge,
	GraphMessageResponse,
	GraphNode,
	StarStructure,
} from "@/lib/types/persona";

// View mode for canvas/list toggle
export type ViewMode = "list" | "canvas";

// Store State
interface PersonaStoreState {
	// === UI State ===
	viewMode: ViewMode;

	// === Graph-Based Conversation State (from chat mutations) ===
	apiGraphNodes: GraphNode[];
	apiGraphEdges: GraphEdge[];
	coverage: Coverage;
	completionReady: boolean;
	totalNodeCount: number;
	starGapsMap: Record<string, (keyof StarStructure)[]>; // nodeId -> missing STAR elements

	// === Persisted Chat Messages ===
	graphMessages: ConversationMessage[];

	// === Actions ===

	// UI actions
	setViewMode: (mode: ViewMode) => void;

	// Graph update actions (called from ChatSidebar mutation callbacks)
	processGraphUpdate: (response: GraphMessageResponse) => void;
	setCoverage: (coverage: Coverage) => void;
	setCompletionReady: (ready: boolean) => void;
	addStarGaps: (nodeId: string, gaps: (keyof StarStructure)[]) => void;
	clearApiGraph: () => void;
	getStarGapsForNode: (nodeId: string) => (keyof StarStructure)[];

	// Chat message actions
	addGraphMessage: (message: ConversationMessage) => void;
	clearGraphMessages: () => void;

	// Utility
	resetPersona: () => void;
}

// Initial state
const initialState = {
	// UI state
	viewMode: "canvas" as ViewMode,

	// Graph-based conversation state
	apiGraphNodes: [] as GraphNode[],
	apiGraphEdges: [] as GraphEdge[],
	coverage: {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	} as Coverage,
	completionReady: false,
	totalNodeCount: 0,
	starGapsMap: {} as Record<string, (keyof StarStructure)[]>,

	// Persisted chat messages
	graphMessages: [] as ConversationMessage[],
};

export const usePersonaStore = create<PersonaStoreState>()(
	persist(
		(set, get) => ({
			// Initial State
			...initialState,

			// === UI Actions ===
			setViewMode: (mode) => set({ viewMode: mode }),

			// === Graph Update Actions ===

			// Process graph update from API response (called from ChatSidebar mutation callbacks)
			processGraphUpdate: (response: GraphMessageResponse) => {
				set((state) => {
					// Add new nodes (avoid duplicates) - handle optional nodesCreated
					const nodesCreated = response.nodesCreated ?? [];
					const existingNodeIds = new Set(state.apiGraphNodes.map((n) => n.id));
					const newNodes = nodesCreated.filter(
						(n) => !existingNodeIds.has(n.id),
					);

					// Add new edges (avoid duplicates) - handle optional edgesCreated
					const edgesCreated = response.edgesCreated ?? [];
					const existingEdgeIds = new Set(state.apiGraphEdges.map((e) => e.id));
					const newEdges = edgesCreated.filter(
						(e) => !existingEdgeIds.has(e.id),
					);

					// Update STAR gaps for the last story if provided
					const starGapsMap = { ...state.starGapsMap };
					if (
						response.starGapsForLastStory &&
						response.starGapsForLastStory.length > 0
					) {
						// Find the last key_story node created
						const lastStoryNode = [...newNodes]
							.reverse()
							.find((n) => n.type === "key_story");
						if (lastStoryNode) {
							starGapsMap[lastStoryNode.id] = response.starGapsForLastStory;
						}
					}

					return {
						apiGraphNodes: [...state.apiGraphNodes, ...newNodes],
						apiGraphEdges: [...state.apiGraphEdges, ...newEdges],
						coverage: response.coverage,
						completionReady: response.completionReady,
						totalNodeCount: response.totalNodeCount,
						starGapsMap,
					};
				});
			},

			// Set coverage metrics
			setCoverage: (coverage: Coverage) => set({ coverage }),

			// Set completion ready flag
			setCompletionReady: (ready: boolean) => set({ completionReady: ready }),

			// Add STAR gaps for a specific node
			addStarGaps: (nodeId: string, gaps: (keyof StarStructure)[]) => {
				set((state) => ({
					starGapsMap: {
						...state.starGapsMap,
						[nodeId]: gaps,
					},
				}));
			},

			// Clear API graph data (used on reset)
			clearApiGraph: () =>
				set({
					apiGraphNodes: [],
					apiGraphEdges: [],
					coverage: {
						goals: 0,
						evidence: 0,
						skills: 0,
						values: 0,
						tensions: 0,
					},
					completionReady: false,
					totalNodeCount: 0,
					starGapsMap: {},
				}),

			// Get STAR gaps for a specific node
			getStarGapsForNode: (nodeId: string) => {
				return get().starGapsMap[nodeId] || [];
			},

			// === Chat Message Actions ===

			// Add a message to the graph conversation
			addGraphMessage: (message: ConversationMessage) => {
				set((state) => ({
					graphMessages: [...state.graphMessages, message],
				}));
			},

			// Clear all graph messages (used on reset)
			clearGraphMessages: () => set({ graphMessages: [] }),

			// === Utility ===

			// Reset all persona data
			resetPersona: () => set(initialState),
		}),
		{
			name: "leaply-persona-store-v4", // Bump version to clear old data
			partialize: (state) => ({
				// Only persist essential data
				viewMode: state.viewMode,
				apiGraphNodes: state.apiGraphNodes,
				apiGraphEdges: state.apiGraphEdges,
				coverage: state.coverage,
				completionReady: state.completionReady,
				totalNodeCount: state.totalNodeCount,
				starGapsMap: state.starGapsMap,
				graphMessages: state.graphMessages,
			}),
		},
	),
);

// Selectors for common use cases
export const selectViewMode = (state: PersonaStoreState) => state.viewMode;
export const selectApiGraphNodes = (state: PersonaStoreState) =>
	state.apiGraphNodes;
export const selectApiGraphEdges = (state: PersonaStoreState) =>
	state.apiGraphEdges;
export const selectCoverage = (state: PersonaStoreState) => state.coverage;
export const selectCompletionReady = (state: PersonaStoreState) =>
	state.completionReady;
export const selectTotalNodeCount = (state: PersonaStoreState) =>
	state.totalNodeCount;
export const selectStarGapsMap = (state: PersonaStoreState) =>
	state.starGapsMap;
export const selectGraphMessages = (state: PersonaStoreState) =>
	state.graphMessages;

// Re-export types for convenience
export type {
	ConversationMessage,
	Coverage,
	GraphEdge,
	GraphMessageResponse,
	GraphNode,
	StarStructure,
};
