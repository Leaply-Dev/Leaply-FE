/**
 * Persona Lab - Profile Hooks
 * Profile synthesis, voice profile, and archetype generation
 */

export {
	getGetPersonaStateQueryKey,
	// Query keys for cache management
	getGetVoiceProfileQueryKey,
	useExtractKeywords,
	useGenerateArchetype,
	useGetPersonaState,
	// Queries
	useGetVoiceProfile,
	// Mutations
	useSynthesizeProfile,
	useSynthesizeTrack,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
