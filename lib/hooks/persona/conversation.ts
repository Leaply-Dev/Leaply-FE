/**
 * Persona Lab - Conversation Hooks
 * Graph-based conversation API for chat interface
 */

// Re-export types
export type {
	ExpandNodeMutationResult,
	ResetConversationMutationResult,
	SendGraphMessageMutationResult,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
export {
	// Query keys for cache management
	getStartConversationQueryKey,
	useExpandNode,
	useResetConversation,
	// Mutations
	useSendGraphMessage,
	// Queries
	useStartConversation,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
