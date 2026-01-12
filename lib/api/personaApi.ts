/**
 * Persona Lab API
 * TODO: Add these endpoints to the OpenAPI spec and regenerate with Orval
 * For now, keeping manual implementation
 */
import { apiClient } from "./client";

export const personaApi = {
	async getPersonaState(): Promise<any> {
		return apiClient.get<any>("/v1/persona-lab/state");
	},

	async selectTrack(trackId: string): Promise<any> {
		return apiClient.post<any>("/v1/persona-lab/track/select", {
			trackId,
		});
	},

	async sendMessage(content: string): Promise<any> {
		return apiClient.post<any>("/v1/persona-lab/message", {
			content,
		});
	},

	async goBackToTrackSelection(): Promise<any> {
		return apiClient.post<any>("/v1/persona-lab/track/back", {});
	},

	async redoTrack(trackId: string): Promise<any> {
		return apiClient.post<any>("/v1/persona-lab/track/redo", {
			trackId,
		});
	},

	async extractKeywords(content: string, trackId?: string): Promise<any> {
		return apiClient.post<any>("/v1/persona-lab/keywords", {
			content,
			trackId,
		});
	},

	async getPersonaGraph(): Promise<any> {
		return apiClient.get<any>("/v1/persona-lab/graph");
	},
};
