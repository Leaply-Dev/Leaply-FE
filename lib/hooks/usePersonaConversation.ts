/**
 * Persona Lab Graph Conversation Hooks
 *
 * @deprecated Import from '@/lib/hooks/persona' instead for organized exports.
 * This file is kept for backward compatibility during migration.
 *
 * @example
 * ```tsx
 * // Old (deprecated)
 * import { useSendMessage } from '@/lib/hooks/usePersonaConversation';
 *
 * // New (preferred)
 * import { useSendMessage } from '@/lib/hooks/persona';
 * ```
 */

// Re-export from new organized structure for backward compatibility
export {
	personaQueryKeys,
	useCoverage,
	useExpandNode,
	useResetConversation,
	useSendMessage,
	useStartConversation,
} from "@/lib/hooks/persona";
