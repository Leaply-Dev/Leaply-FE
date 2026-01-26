/**
 * Persona Lab - Conversation Hooks
 * Graph-based conversation API for chat interface
 *
 * Includes both legacy (graph-based) and new (guided) conversation endpoints.
 */

// Re-export types
export type {
	ExpandNodeMutationResult,
	GenerateArchetypeMutationResult,
	ResetConversationMutationResult,
	ResetGuidedConversationMutationResult,
	SendGraphMessageMutationResult,
	SendGuidedMessageMutationResult,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
// Legacy graph-based conversation (coverage-based flow)
// New guided conversation (4-Parts flow)
export {
	// Query keys
	getGetPartsProgressQueryKey,
	// Query keys for cache management
	getStartConversationQueryKey,
	getStartGuidedConversationQueryKey,
	useExpandNode,
	// Mutations
	useGenerateArchetype,
	// Queries
	useGetPartsProgress,
	useResetConversation,
	useResetGuidedConversation,
	// Mutations
	useSendGraphMessage,
	useSendGuidedMessage,
	// Queries
	useStartConversation,
	useStartGuidedConversation,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
