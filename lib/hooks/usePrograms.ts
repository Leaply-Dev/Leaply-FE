/**
 * Re-export Orval-generated hooks for programs with custom wrappers
 * This maintains backward compatibility while using generated hooks
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	useSaveProgram as useGeneratedSaveProgram,
	useUnsaveProgram as useGeneratedUnsaveProgram,
	useListPrograms,
} from "@/lib/generated/api/endpoints/explore/explore";
import type {
	ListProgramsParams,
	ProgramListResponse,
} from "@/lib/generated/api/models";

/**
 * Backward-compatible wrapper for useListPrograms
 * Maps old ProgramListParams to new ListProgramsParams
 */
export function usePrograms(filters: ListProgramsParams) {
	return useListPrograms(filters, {
		query: {
			staleTime: 2 * 60 * 1000, // 2 minutes - consider data fresh
		},
	});
}

/**
 * React Query mutation hook for saving/unsaving programs
 * Uses generated hooks with optimistic updates
 */
export function useSaveProgram() {
	const queryClient = useQueryClient();
	const saveMutation = useGeneratedSaveProgram();
	const unsaveMutation = useGeneratedUnsaveProgram();

	return useMutation({
		mutationFn: ({ id, isSaved }: { id: string; isSaved: boolean }) =>
			isSaved
				? unsaveMutation.mutateAsync({ id })
				: saveMutation.mutateAsync({ id }),
		onMutate: async ({ id, isSaved }) => {
			// Cancel outgoing refetches to prevent race conditions
			await queryClient.cancelQueries({ queryKey: ["programs"] });

			// Snapshot previous value for rollback
			const previousPrograms = queryClient.getQueryData(["programs"]);

			// Optimistically update all program queries
			queryClient.setQueriesData({ queryKey: ["programs"] }, (old: any) => {
				const programsResult = unwrapResponse<ProgramListResponse>(old);
				if (!programsResult?.data) return old;

				return {
					...old,
					data: {
						...old.data,
						data: {
							...programsResult,
							data: programsResult.data.map((program: any) =>
								program.id === id ? { ...program, isSaved: !isSaved } : program,
							),
						},
					},
				};
			});

			return { previousPrograms };
		},
		onError: (err, _variables, context) => {
			// Rollback on error
			if (context?.previousPrograms) {
				queryClient.setQueryData(["programs"], context.previousPrograms);
			}
			console.error("Failed to update save status:", err);
		},
		onSettled: () => {
			// Refetch after mutation completes (success or error)
			queryClient.invalidateQueries({ queryKey: ["programs"] });
		},
	});
}
