/**
 * Persona Lab Hooks
 *
 * Organized exports for persona-lab API hooks.
 * Only exports ACTIVE hooks - deprecated track-based hooks are intentionally excluded.
 *
 * @example
 * ```tsx
 * import { useSendGraphMessage, useGetCoverage } from '@/lib/hooks/persona';
 * ```
 *
 * For legacy track-based hooks (deprecated), import directly from:
 * @see lib/generated/api/endpoints/persona-lab/persona-lab.ts
 */

// === Conversation (Chat Interface) ===
export {
	getStartConversationQueryKey,
	useExpandNode,
	useGenerateArchetype,
	useResetConversation,
	useSendGraphMessage,
	useStartConversation,
} from "./conversation";
// === Graph (Visualization) ===
export {
	getGetCoverageQueryKey,
	getGetGraphQueryKey,
	useGetCoverage,
	useGetGraph,
} from "./graph";
// === Profile & Synthesis ===
export {
	getGetPersonaStateQueryKey,
	useGetPersonaState,
} from "./profile";
