/**
 * Hand-written React Query hooks for the 2-Pillar persona-lab endpoints.
 *
 * Temporary: these endpoints exist on the backend (Commits 3-4) but aren't yet
 * in the deployed OpenAPI spec that Orval reads. Replace with generated hooks
 * once `bun generate:api` surfaces them.
 */
import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { customInstance } from "@/lib/api/mutator";
import type {
	PillarCoverageDto,
	TierProgressDto,
} from "./types";

type ApiResponse<T> = {
	status?: number;
	message?: string;
	data?: T;
};

type Wrapped<T> = { data: ApiResponse<T>; status: number; headers: Headers };

// === Query keys ===
export const getTierProgressQueryKey = () =>
	["/v1/persona/tier-progress"] as const;
export const getPillarCoverageQueryKey = () =>
	["/v1/persona/pillar-coverage"] as const;

// === Raw fetchers ===
const fetchTierProgress = (): Promise<Wrapped<TierProgressDto>> =>
	customInstance<Wrapped<TierProgressDto>>("/v1/persona/tier-progress", {
		method: "GET",
	});

const fetchPillarCoverage = (): Promise<Wrapped<PillarCoverageDto>> =>
	customInstance<Wrapped<PillarCoverageDto>>("/v1/persona/pillar-coverage", {
		method: "GET",
	});

// === Hooks ===
export function useGetTierProgress<
	TData = Wrapped<TierProgressDto>,
	TError = unknown,
>(options?: {
	query?: Partial<UseQueryOptions<Wrapped<TierProgressDto>, TError, TData>>;
}) {
	return useQuery<Wrapped<TierProgressDto>, TError, TData>({
		queryKey: getTierProgressQueryKey(),
		queryFn: fetchTierProgress,
		...options?.query,
	});
}

export function useGetPillarCoverage<
	TData = Wrapped<PillarCoverageDto>,
	TError = unknown,
>(options?: {
	query?: Partial<UseQueryOptions<Wrapped<PillarCoverageDto>, TError, TData>>;
}) {
	return useQuery<Wrapped<PillarCoverageDto>, TError, TData>({
		queryKey: getPillarCoverageQueryKey(),
		queryFn: fetchPillarCoverage,
		...options?.query,
	});
}

