/**
 * Applications API
 * TODO: Add these endpoints to the OpenAPI spec and regenerate with Orval
 * For now, keeping manual implementation
 */
import { apiClient } from "./client";

export async function getApplications(): Promise<any> {
	return apiClient.get<any>("/v1/applications");
}

export async function getApplication(id: string): Promise<any> {
	return apiClient.get<any>(`/v1/applications/${id}`);
}

export async function createApplication(data: any): Promise<any> {
	return apiClient.post<any>("/v1/applications", data);
}

export async function updateApplication(id: string, data: any): Promise<any> {
	return apiClient.put<any>(`/v1/applications/${id}`, data);
}

export async function deleteApplication(id: string): Promise<void> {
	return apiClient.delete<void>(`/v1/applications/${id}`);
}
