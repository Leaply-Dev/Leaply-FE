/**
 * Re-export Orval-generated hooks for scholarships with custom wrappers
 * This maintains backward compatibility while using generated hooks
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetMatchedScholarshipsQueryKey,
	getGetSavedScholarshipsQueryKey,
	getListScholarshipsQueryKey,
	useSaveScholarship as useGeneratedSaveScholarship,
	useUnsaveScholarship as useGeneratedUnsaveScholarship,
	useListScholarships,
} from "@/lib/generated/api/endpoints/scholarship-explore/scholarship-explore";
import type {
	ListScholarshipsParams,
	ScholarshipAiMatchResponse,
	ScholarshipListResponse,
} from "@/lib/generated/api/models";

/**
 * Backward-compatible wrapper for useListScholarships
 * Maps old params to new ListScholarshipsParams
 */
export function useScholarships(filters: ListScholarshipsParams) {
	return useListScholarships(filters, {
		query: {
			staleTime: 2 * 60 * 1000, // 2 minutes - consider data fresh
		},
	});
}

/**
 * React Query mutation hook for saving/unsaving scholarships
 * Uses generated hooks with optimistic updates
 */
export function useSaveScholarship() {
	const queryClient = useQueryClient();
	const saveMutation = useGeneratedSaveScholarship();
	const unsaveMutation = useGeneratedUnsaveScholarship();

	return useMutation({
		mutationFn: ({ id, isSaved }: { id: string; isSaved: boolean }) =>
			isSaved
				? unsaveMutation.mutateAsync({ id })
				: saveMutation.mutateAsync({ id }),
		onMutate: async ({ id, isSaved }) => {
			// Cancel outgoing refetches to prevent race conditions
			await queryClient.cancelQueries({
				queryKey: getListScholarshipsQueryKey(),
			});
			await queryClient.cancelQueries({
				queryKey: getGetMatchedScholarshipsQueryKey(),
			});
			await queryClient.cancelQueries({
				queryKey: getGetSavedScholarshipsQueryKey(),
			});

			// Snapshot previous values for rollback
			const previousList = queryClient.getQueriesData({
				queryKey: getListScholarshipsQueryKey(),
			});
			const previousMatched = queryClient.getQueriesData({
				queryKey: getGetMatchedScholarshipsQueryKey(),
			});
			const previousSaved = queryClient.getQueriesData({
				queryKey: getGetSavedScholarshipsQueryKey(),
			});

			// Helper to update scholarship in any query data structure
			const updateScholarshipInData = (old: any): any => {
				if (!old) return old;

				// Handle list response structure
				const listResult = unwrapResponse<ScholarshipListResponse>(old);
				if (listResult?.data && Array.isArray(listResult.data)) {
					return {
						...old,
						data: {
							...old.data,
							data: {
								...listResult,
								data: listResult.data.map((scholarship: any) =>
									scholarship.id === id
										? { ...scholarship, isSaved: !isSaved }
										: scholarship,
								),
							},
						},
					};
				}

				// Handle AI match response structure
				const aiMatchResult = unwrapResponse<ScholarshipAiMatchResponse>(old);
				if (
					aiMatchResult?.reach ||
					aiMatchResult?.target ||
					aiMatchResult?.safety
				) {
					return {
						...old,
						data: {
							...old.data,
							data: {
								...aiMatchResult,
								reach: aiMatchResult.reach?.map((scholarship: any) =>
									scholarship.id === id
										? { ...scholarship, isSaved: !isSaved }
										: scholarship,
								),
								target: aiMatchResult.target?.map((scholarship: any) =>
									scholarship.id === id
										? { ...scholarship, isSaved: !isSaved }
										: scholarship,
								),
								safety: aiMatchResult.safety?.map((scholarship: any) =>
									scholarship.id === id
										? { ...scholarship, isSaved: !isSaved }
										: scholarship,
								),
							},
						},
					};
				}

				return old;
			};

			// Optimistically update all scholarship queries
			queryClient.setQueriesData(
				{ queryKey: getListScholarshipsQueryKey() },
				updateScholarshipInData,
			);
			queryClient.setQueriesData(
				{ queryKey: getGetMatchedScholarshipsQueryKey() },
				updateScholarshipInData,
			);
			queryClient.setQueriesData(
				{ queryKey: getGetSavedScholarshipsQueryKey() },
				updateScholarshipInData,
			);

			return { previousList, previousMatched, previousSaved };
		},
		onError: (err, _variables, context) => {
			// Rollback on error
			if (context?.previousList) {
				for (const [queryKey, data] of context.previousList) {
					queryClient.setQueryData(queryKey, data);
				}
			}
			if (context?.previousMatched) {
				for (const [queryKey, data] of context.previousMatched) {
					queryClient.setQueryData(queryKey, data);
				}
			}
			if (context?.previousSaved) {
				for (const [queryKey, data] of context.previousSaved) {
					queryClient.setQueryData(queryKey, data);
				}
			}
			console.error("Failed to update scholarship save status:", err);
		},
		onSettled: () => {
			// Refetch after mutation completes (success or error)
			queryClient.invalidateQueries({
				queryKey: getListScholarshipsQueryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: getGetMatchedScholarshipsQueryKey(),
			});
			queryClient.invalidateQueries({
				queryKey: getGetSavedScholarshipsQueryKey(),
			});
		},
	});
}
