/**
 * Persona Lab Graph Conversation Hooks
 * Re-exports Orval-generated hooks for persona lab conversation
 */

export {
	useExpandNode,
	useGetCoverage as useCoverage,
	useGetPersona as usePersonaGraph,
	useResetConversation,
	useSendGraphMessage as useSendMessage,
	useStartConversation,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";

// Query keys for cache management (for custom invalidation)
export const personaQueryKeys = {
	all: ["persona"] as const,
	conversation: () => [...personaQueryKeys.all, "conversation"] as const,
	coverage: () => [...personaQueryKeys.all, "coverage"] as const,
	graph: () => [...personaQueryKeys.all, "graph"] as const,
};
