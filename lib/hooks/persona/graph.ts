/**
 * Persona Lab - Graph Hooks
 * Graph data fetching and visualization
 */

// Re-export types
export type {
	GetCoverageQueryResult,
	GetGraphQueryResult,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
export {
	getGetCompactContextQueryKey,
	getGetCoverageQueryKey,
	// Query keys for cache management
	getGetGraphQueryKey,
	useGetCompactContext,
	useGetCoverage,
	// Queries
	useGetGraph,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
