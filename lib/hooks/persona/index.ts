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
// Legacy graph-based conversation
// New guided conversation (4-Parts flow)
export {
	getGetPartsProgressQueryKey,
	getStartConversationQueryKey,
	getStartGuidedConversationQueryKey,
	useExpandNode,
	useGenerateArchetype,
	useGetPartsProgress,
	useResetConversation,
	useResetGuidedConversation,
	useSendGraphMessage,
	useSendGuidedMessage,
	useStartConversation,
	useStartGuidedConversation,
} from "./conversation";
// === Daily Questions ===
export {
	getGetQuestionQueryKey,
	getGetTodaysQuestionsQueryKey,
	getGetUnansweredQuestionsQueryKey,
	useAnswerDailyQuestion,
	useGetQuestion,
	useGetTodaysQuestions,
	useGetUnansweredQuestions,
} from "./daily-questions";
// === Graph (Visualization) ===
export {
	getGetCompactContextQueryKey,
	getGetCoverageQueryKey,
	getGetGraphQueryKey,
	useGetCompactContext,
	useGetCoverage,
	useGetGraph,
} from "./graph";

// === Profile & Synthesis ===
export {
	getGetPersonaStateQueryKey,
	getGetVoiceProfileQueryKey,
	useExtractKeywords,
	useGetPersonaState,
	useGetVoiceProfile,
	useSynthesizeProfile,
} from "./profile";

// === Convenience Aliases ===
// These provide cleaner names for common operations

/** @alias useSendGraphMessage - Send a message in graph-based conversation */
export { useSendGraphMessage as useSendMessage } from "./conversation";
/** @alias useGetCoverage - Get coverage metrics */
export { useGetCoverage as useCoverage } from "./graph";

// === Query Keys (for custom cache operations) ===
export const personaQueryKeys = {
	all: ["persona-lab"] as const,
	conversation: () => [...personaQueryKeys.all, "conversation"] as const,
	graph: () => [...personaQueryKeys.all, "graph"] as const,
	coverage: () => [...personaQueryKeys.all, "coverage"] as const,
	dailyQuestions: () => [...personaQueryKeys.all, "daily-questions"] as const,
	profile: () => [...personaQueryKeys.all, "profile"] as const,
} as const;
