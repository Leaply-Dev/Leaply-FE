// Persona Lab Graph Conversation Hooks
// TanStack Query hooks for the new graph-based conversation API

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { personaApi } from "@/lib/api/personaApi";
import type { GraphMessageResponse } from "@/lib/types/persona";

// Query keys for cache management
export const personaQueryKeys = {
	all: ["persona"] as const,
	conversation: () => [...personaQueryKeys.all, "conversation"] as const,
	coverage: () => [...personaQueryKeys.all, "coverage"] as const,
	graph: () => [...personaQueryKeys.all, "graph"] as const,
};

/**
 * Hook to start or continue a conversation.
 * Fetches the opening question or last message based on coverage gaps.
 */
export function useConversation(enabled = true) {
	return useQuery({
		queryKey: personaQueryKeys.conversation(),
		queryFn: () => personaApi.getConversation(),
		enabled,
		staleTime: 0, // Always fetch fresh to get latest coverage-based question
		refetchOnWindowFocus: false,
	});
}

/**
 * Hook to send a message in the conversation.
 * Returns GraphMessageResponse with nodes/edges/coverage updates.
 */
export function useSendMessage() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (content: string) =>
			personaApi.sendConversationMessage(content),
		onSuccess: (data: GraphMessageResponse) => {
			// Invalidate conversation and coverage queries to refetch fresh data
			queryClient.invalidateQueries({
				queryKey: personaQueryKeys.conversation(),
			});
			queryClient.invalidateQueries({ queryKey: personaQueryKeys.coverage() });

			// Update graph cache with new nodes/edges
			if (data.nodesCreated.length > 0 || data.edgesCreated.length > 0) {
				queryClient.invalidateQueries({ queryKey: personaQueryKeys.graph() });
			}
		},
	});
}

/**
 * Hook to reset the conversation.
 * Clears all data and starts fresh.
 */
export function useResetConversation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => personaApi.resetConversation(),
		onSuccess: () => {
			// Invalidate all persona queries to refetch fresh data
			queryClient.invalidateQueries({ queryKey: personaQueryKeys.all });
		},
	});
}

/**
 * Hook to expand a node for more detail.
 * Generates targeted follow-up question for missing STAR elements.
 */
export function useExpandNode() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (nodeId: string) => personaApi.expandNode(nodeId),
		onSuccess: () => {
			// Invalidate conversation to show new follow-up question
			queryClient.invalidateQueries({
				queryKey: personaQueryKeys.conversation(),
			});
		},
	});
}

/**
 * Hook to get current coverage metrics.
 */
export function useCoverage(enabled = true) {
	return useQuery({
		queryKey: personaQueryKeys.coverage(),
		queryFn: () => personaApi.getCoverage(),
		enabled,
		staleTime: 30 * 1000, // 30 seconds
		refetchOnWindowFocus: false,
	});
}

/**
 * Hook to prefetch conversation data.
 * Useful for warming up cache before user interaction.
 */
export function usePrefetchConversation() {
	const queryClient = useQueryClient();

	return () => {
		queryClient.prefetchQuery({
			queryKey: personaQueryKeys.conversation(),
			queryFn: () => personaApi.getConversation(),
		});
	};
}
