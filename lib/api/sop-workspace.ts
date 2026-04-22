/**
 * SOP Workspace API types and hooks
 * Manual implementation until backend is running for API generation
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import customFetch from "./mutator";

// ============================================
// Types
// ============================================

export type SopPhase =
	| "not_started"
	| "ideation"
	| "outlining"
	| "writing"
	| "review"
	| "completed";

export interface AngleDto {
	id: string;
	title: string;
	hook?: string;
	relevantNodeIds?: string[];
	relevantTags?: string[];
	fitScore?: number;
	fitReason?: string;
	matchLevel?: "STRONG" | "MODERATE" | "WEAK";
}

export interface IdeationResponse {
	id: string;
	applicationId: string;
	angles?: AngleDto[];
	selectedAngleId?: string;
	tonePreference?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface GenerateIdeationResponse {
	angles: AngleDto[];
	scholarshipContext?: string;
}

export interface UpdateIdeationRequest {
	selectedAngleId: string;
	tonePreference?: string;
}

export interface WordTargetDto {
	min: number;
	max: number;
}

export interface OutlineSectionDto {
	key: string;
	title: string;
	purpose?: string;
	wordTarget?: WordTargetDto;
	guidingQuestions?: string[];
	suggestedNodeIds?: string[];
	tip?: string;
}

export interface OutlineResponse {
	id: string;
	applicationId: string;
	ideationId?: string;
	sections?: OutlineSectionDto[];
	totalWordTarget?: number;
	createdAt?: string;
	updatedAt?: string;
}

export interface SectionResponse {
	id: string;
	sectionIndex: number;
	sectionKey?: string;
	title?: string;
	content?: string;
	wordCount: number;
	wordTarget?: WordTargetDto;
	linkedNodeIds?: string[];
	status: string;
	feedbackRound: number;
	updatedAt?: string;
}

export interface SectionsListResponse {
	sections: SectionResponse[];
	totalWordCount: number;
	totalWordTarget?: number;
}

export interface UpdateSectionResponse {
	wordCount: number;
	status: string;
}

export interface PromptAlignmentDto {
	score?: number;
	feedback?: string;
	missedElements?: string[];
}

export interface ReviewResponse {
	overallScore?: number;
	strengths?: string[];
	improvements?: string[];
	consistencyIssues?: string[];
	promptAlignment?: PromptAlignmentDto;
}

export interface SopWorkspaceStatusResponse {
	applicationId: string;
	sopPhase: SopPhase;
	hasIdeation: boolean;
	hasOutline: boolean;
	sectionsCompleted: number;
	sectionsTotal: number;
	totalWordCount: number;
	wordLimit?: number;
	sopPrompt?: string;
	essayType?: string;
	narrativeMotif?: string;
}

// ============================================
// Query Keys
// ============================================

const sopWorkspaceKeys = {
	all: ["sop-workspace"] as const,
	status: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "status", applicationId] as const,
	ideation: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "ideation", applicationId] as const,
	outline: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "outline", applicationId] as const,
	sections: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "sections", applicationId] as const,
};

// ============================================
// Hooks
// ============================================

export function useWorkspaceStatus(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.status(applicationId),
		queryFn: async () => {
			const response = await customFetch<{
				data: { data: SopWorkspaceStatusResponse };
			}>(`/v1/applications/${applicationId}/sop/workspace/status`);
			return response.data.data;
		},
		staleTime: 30000,
	});
}

export interface SavePromptRequest {
	prompt?: string;
	wordLimit?: number;
	essayType?: string;
	narrativeMotif?: string;
}

export function useSavePrompt() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			applicationId,
			data,
		}: {
			applicationId: string;
			data: SavePromptRequest;
		}) => {
			await customFetch(
				`/v1/applications/${applicationId}/sop/workspace/prompt`,
				{
					method: "PATCH",
					body: JSON.stringify(data),
					headers: { "Content-Type": "application/json" },
				},
			);
		},
		onSuccess: (_, { applicationId }) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.status(applicationId),
			});
		},
	});
}

export function useIdeation(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.ideation(applicationId),
		queryFn: async () => {
			const response = await customFetch<{
				data: { data: IdeationResponse };
			}>(`/v1/applications/${applicationId}/sop/ideation`);
			return response.data.data;
		},
		retry: false,
	});
}

export function useGenerateIdeation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (applicationId: string) => {
			const response = await customFetch<{
				data: { data: GenerateIdeationResponse };
			}>(`/v1/applications/${applicationId}/sop/ideation/generate`, {
				method: "POST",
			});
			return response.data.data;
		},
		onSuccess: (_, applicationId) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.ideation(applicationId),
			});
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.status(applicationId),
			});
		},
	});
}

export function useUpdateIdeation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			applicationId,
			data,
		}: {
			applicationId: string;
			data: UpdateIdeationRequest;
		}) => {
			const response = await customFetch<{
				data: { data: IdeationResponse };
			}>(`/v1/applications/${applicationId}/sop/ideation`, {
				method: "PATCH",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			});
			return response.data.data;
		},
		onSuccess: (_, { applicationId }) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.ideation(applicationId),
			});
		},
	});
}

export function useOutline(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.outline(applicationId),
		queryFn: async () => {
			const response = await customFetch<{
				data: { data: OutlineResponse };
			}>(`/v1/applications/${applicationId}/sop/outline`);
			return response.data.data;
		},
		retry: false,
	});
}

export function useGenerateOutline() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			applicationId,
			wordLimit,
		}: {
			applicationId: string;
			wordLimit?: number;
		}) => {
			const body = wordLimit !== undefined ? { wordLimit } : {};
			const response = await customFetch<{
				data: { data: OutlineResponse };
			}>(`/v1/applications/${applicationId}/sop/outline/generate`, {
				method: "POST",
				body: JSON.stringify(body),
				headers: { "Content-Type": "application/json" },
			});
			return response.data.data;
		},
		onSuccess: (_, { applicationId }) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.outline(applicationId),
			});
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.sections(applicationId),
			});
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.status(applicationId),
			});
		},
	});
}

export function useConfirmOutline() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (applicationId: string) => {
			await customFetch(
				`/v1/applications/${applicationId}/sop/outline/confirm`,
				{ method: "POST" },
			);
		},
		onSuccess: (_, applicationId) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.status(applicationId),
			});
		},
	});
}

export function useSections(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.sections(applicationId),
		queryFn: async () => {
			const response = await customFetch<{
				data: { data: SectionsListResponse };
			}>(`/v1/applications/${applicationId}/sop/sections`);
			return response.data.data;
		},
	});
}

export function useUpdateSection() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			applicationId,
			sectionIndex,
			data,
		}: {
			applicationId: string;
			sectionIndex: number;
			data: { content: string };
		}) => {
			const response = await customFetch<{
				data: { data: UpdateSectionResponse };
			}>(`/v1/applications/${applicationId}/sop/sections/${sectionIndex}`, {
				method: "PATCH",
				body: JSON.stringify(data),
				headers: { "Content-Type": "application/json" },
			});
			return response.data.data;
		},
		onSuccess: (_, { applicationId }) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.sections(applicationId),
			});
		},
	});
}

export function useMarkSectionDone() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			applicationId,
			sectionIndex,
		}: {
			applicationId: string;
			sectionIndex: number;
		}) => {
			await customFetch(
				`/v1/applications/${applicationId}/sop/sections/${sectionIndex}/done`,
				{ method: "POST" },
			);
		},
		onSuccess: (_, { applicationId }) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.sections(applicationId),
			});
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.status(applicationId),
			});
		},
	});
}

export function useReview() {
	return useMutation({
		mutationFn: async (applicationId: string) => {
			const response = await customFetch<{
				data: { data: ReviewResponse };
			}>(`/v1/applications/${applicationId}/sop/review`, { method: "POST" });
			return response.data.data;
		},
	});
}
