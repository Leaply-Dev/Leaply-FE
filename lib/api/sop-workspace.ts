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

export interface EvidenceCardDto {
	nodeId: string;
	title: string;
	facts?: string[];
	tags?: string[];
	wordCountPotential?: string;
}

export interface EvidenceCardsResponse {
	evidenceCards: EvidenceCardDto[];
}

export interface SuggestionDto {
	type: string;
	text: string;
	reason?: string;
}

export interface PromptAlignmentDto {
	score?: number;
	feedback?: string;
	missedElements?: string[];
}

export interface SectionFeedbackResponse {
	round: number;
	strengths?: string[];
	suggestions?: SuggestionDto[];
	questions?: string[];
	promptAlignment?: PromptAlignmentDto;
	wordCountStatus?: string;
}

export interface SectionSummaryDto {
	sectionKey?: string;
	title?: string;
	wordCount: number;
	status: string;
}

export interface FullEssayResponse {
	compiledContent: string;
	totalWordCount: number;
	sectionSummary?: SectionSummaryDto[];
}

export interface ReviewResponse {
	overallScore?: number;
	strengths?: string[];
	improvements?: string[];
	consistencyIssues?: string[];
	promptAlignment?: PromptAlignmentDto;
}

export interface CompileResponse {
	content: string;
	wordCount: number;
}

export interface SopWorkspaceStatusResponse {
	applicationId: string;
	currentPhase: SopPhase;
	hasIdeation: boolean;
	hasOutline: boolean;
	sectionsCompleted: number;
	sectionsTotal: number;
	totalWordCount: number;
	wordLimit?: number;
	sopPrompt?: string;
}

// ============================================
// Query Keys
// ============================================

export const sopWorkspaceKeys = {
	all: ["sop-workspace"] as const,
	status: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "status", applicationId] as const,
	ideation: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "ideation", applicationId] as const,
	outline: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "outline", applicationId] as const,
	sections: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "sections", applicationId] as const,
	evidence: (applicationId: string, sectionIndex: number) =>
		[...sopWorkspaceKeys.all, "evidence", applicationId, sectionIndex] as const,
	fullEssay: (applicationId: string) =>
		[...sopWorkspaceKeys.all, "full", applicationId] as const,
};

// ============================================
// Hooks
// ============================================

export function useWorkspaceStatus(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.status(applicationId),
		queryFn: async () => {
			const response = await customFetch<{ data: SopWorkspaceStatusResponse }>(
				`/v1/applications/${applicationId}/sop/workspace/status`,
			);
			return response.data;
		},
		staleTime: 30000,
	});
}

export function useIdeation(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.ideation(applicationId),
		queryFn: async () => {
			const response = await customFetch<{ data: IdeationResponse }>(
				`/v1/applications/${applicationId}/sop/ideation`,
			);
			return response.data;
		},
		retry: false,
	});
}

export function useGenerateIdeation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (applicationId: string) => {
			const response = await customFetch<{ data: GenerateIdeationResponse }>(
				`/v1/applications/${applicationId}/sop/ideation/generate`,
				{ method: "POST" },
			);
			return response.data;
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
			const response = await customFetch<{ data: IdeationResponse }>(
				`/v1/applications/${applicationId}/sop/ideation`,
				{
					method: "PATCH",
					body: JSON.stringify(data),
					headers: { "Content-Type": "application/json" },
				},
			);
			return response.data;
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
			const response = await customFetch<{ data: OutlineResponse }>(
				`/v1/applications/${applicationId}/sop/outline`,
			);
			return response.data;
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
			const response = await customFetch<{ data: OutlineResponse }>(
				`/v1/applications/${applicationId}/sop/outline/generate`,
				{
					method: "POST",
					body: JSON.stringify({ wordLimit }),
					headers: { "Content-Type": "application/json" },
				},
			);
			return response.data;
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
			const response = await customFetch<{ data: SectionsListResponse }>(
				`/v1/applications/${applicationId}/sop/sections`,
			);
			return response.data;
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
			const response = await customFetch<{ data: UpdateSectionResponse }>(
				`/v1/applications/${applicationId}/sop/sections/${sectionIndex}`,
				{
					method: "PATCH",
					body: JSON.stringify(data),
					headers: { "Content-Type": "application/json" },
				},
			);
			return response.data;
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

export function useEvidence(applicationId: string, sectionIndex: number) {
	return useQuery({
		queryKey: sopWorkspaceKeys.evidence(applicationId, sectionIndex),
		queryFn: async () => {
			const response = await customFetch<{ data: EvidenceCardsResponse }>(
				`/v1/applications/${applicationId}/sop/sections/${sectionIndex}/evidence`,
			);
			return response.data;
		},
	});
}

export function useSectionFeedback() {
	return useMutation({
		mutationFn: async ({
			applicationId,
			sectionIndex,
		}: {
			applicationId: string;
			sectionIndex: number;
		}) => {
			const response = await customFetch<{ data: SectionFeedbackResponse }>(
				`/v1/applications/${applicationId}/sop/sections/${sectionIndex}/feedback`,
				{ method: "POST" },
			);
			return response.data;
		},
	});
}

export function useFullEssay(applicationId: string) {
	return useQuery({
		queryKey: sopWorkspaceKeys.fullEssay(applicationId),
		queryFn: async () => {
			const response = await customFetch<{ data: FullEssayResponse }>(
				`/v1/applications/${applicationId}/sop/full`,
			);
			return response.data;
		},
	});
}

export function useReview() {
	return useMutation({
		mutationFn: async (applicationId: string) => {
			const response = await customFetch<{ data: ReviewResponse }>(
				`/v1/applications/${applicationId}/sop/review`,
				{ method: "POST" },
			);
			return response.data;
		},
	});
}

export function useCompile() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (applicationId: string) => {
			const response = await customFetch<{ data: CompileResponse }>(
				`/v1/applications/${applicationId}/sop/compile`,
				{ method: "POST" },
			);
			return response.data;
		},
		onSuccess: (_, applicationId) => {
			queryClient.invalidateQueries({
				queryKey: sopWorkspaceKeys.status(applicationId),
			});
		},
	});
}
