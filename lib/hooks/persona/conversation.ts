/**
 * Persona Lab — Conversation Hooks
 * Graph-based conversation API for chat interface.
 */

export type {
	ExpandNodeMutationResult,
	GenerateArchetypeMutationResult,
	ResetConversationMutationResult,
	SendGraphMessageMutationResult,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
export {
	getStartConversationQueryKey,
	useExpandNode,
	useGenerateArchetype,
	useResetConversation,
	useSendGraphMessage,
	useStartConversation,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
