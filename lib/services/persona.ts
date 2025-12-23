import { apiClient } from "../api/client";
import type {
	ArchetypeResponse,
	ConversationRequest,
	ConversationResponse,
	PersonaResponse,
	SynthesisResponse,
	TrackDetailResponse,
	TrackStartResponse,
	TrackType,
} from "../api/types";

export const personaService = {
	getPersona: async (): Promise<PersonaResponse> => {
		return apiClient.get<PersonaResponse>("/v1/persona");
	},

	getTrack: async (trackId: TrackType): Promise<TrackDetailResponse> => {
		return apiClient.get<TrackDetailResponse>(`/v1/persona/tracks/${trackId}`);
	},

	startTrack: async (trackId: TrackType): Promise<TrackStartResponse> => {
		return apiClient.post<TrackStartResponse>(
			`/v1/persona/tracks/${trackId}/start`,
			{},
		);
	},

	resetTrack: async (trackId: TrackType): Promise<void> => {
		return apiClient.post<void>(`/v1/persona/tracks/${trackId}/reset`, {});
	},

	sendMessage: async (
		trackId: TrackType,
		message: string,
	): Promise<ConversationResponse> => {
		const payload: ConversationRequest = { message };
		return apiClient.post<ConversationResponse>(
			`/v1/persona/tracks/${trackId}/message`,
			payload,
		);
	},

	synthesizeTrack: async (trackId: TrackType): Promise<SynthesisResponse> => {
		return apiClient.post<SynthesisResponse>(
			`/v1/persona/tracks/${trackId}/synthesize`,
			{},
		);
	},

	synthesizeArchetype: async (): Promise<ArchetypeResponse> => {
		return apiClient.post<ArchetypeResponse>(
			"/v1/persona/synthesize-archetype",
			{},
		);
	},
};
