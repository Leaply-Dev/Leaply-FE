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
	getGetCoverageQueryKey,
	// Query keys for cache management
	getGetGraphQueryKey,
	useGetCoverage,
	// Queries
	useGetGraph,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
