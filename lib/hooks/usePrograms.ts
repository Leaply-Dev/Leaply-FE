import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { exploreApi } from "@/lib/api/exploreApi";
import type {
	ProgramListItemResponse,
	ProgramListParams,
	ProgramListResponse,
} from "@/lib/api/types";

/**
 * React Query hook for fetching programs list with filters
 * @param filters - Program filters (search, sort, etc.)
 * @param initialData - Optional initial data from SSR
 * @returns Query result with programs data, loading, and error states
 */
export function usePrograms(
	filters: ProgramListParams,
	initialData?: ProgramListResponse,
) {
	return useQuery({
		queryKey: ["programs", filters],
		queryFn: () => exploreApi.getPrograms(filters),
		initialData:
			filters.search === "" || !filters.search ? initialData : undefined,
		staleTime: 2 * 60 * 1000, // 2 minutes - consider data fresh
	});
}

/**
 * React Query mutation hook for saving/unsaving programs
 * Includes optimistic updates and automatic rollback on error
 * @returns Mutation function and state
 */
export function useSaveProgram() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, isSaved }: { id: string; isSaved: boolean }) =>
			isSaved ? exploreApi.unsaveProgram(id) : exploreApi.saveProgram(id),
		onMutate: async ({ id, isSaved }) => {
			// Cancel outgoing refetches to prevent race conditions
			await queryClient.cancelQueries({ queryKey: ["programs"] });

			// Snapshot previous value for rollback
			const previousPrograms = queryClient.getQueryData(["programs"]);

			// Optimistically update all program queries
			queryClient.setQueriesData<ProgramListResponse>(
				{ queryKey: ["programs"] },
				(old) => {
					if (!old) return old;

					return {
						...old,
						data: old.data.map((program: ProgramListItemResponse) =>
							program.id === id ? { ...program, isSaved: !isSaved } : program,
						),
					};
				},
			);

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
