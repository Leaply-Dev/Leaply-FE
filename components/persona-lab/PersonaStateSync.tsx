"use client";

import { useEffect } from "react";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import type {
	CoverageMetrics,
	PersonaGraphResponse,
	PersonaStateResponse,
} from "@/lib/generated/api/models";
import {
	useGetCoverage,
	useGetGraph,
	useGetPersonaState,
} from "@/lib/hooks/persona";
import { useStoresHydrated } from "@/lib/hooks/useStoresHydrated";
import { usePersonaStore } from "@/lib/store/personaStore";

/**
 * Component to synchronize persona state from server on mount
 * This ensures that even if local storage is cleared, we can restore
 * the user's progress from the backend.
 */
export function PersonaStateSync() {
	const syncWithServer = usePersonaStore((state) => state.syncWithServer);
	const syncGraph = usePersonaStore((state) => state.syncGraph);
	const setCoverage = usePersonaStore((state) => state.setCoverage);

	// Use consolidated hydration check - waits for ALL stores
	const { isReady, isHydrated } = useStoresHydrated();

	// Fetch full state on mount (history)
	const { data: personaState } = useGetPersonaState({
		query: {
			enabled: isReady,
			staleTime: 0,
		},
	});

	// Fetch graph data (nodes, edges)
	const { data: graphState } = useGetGraph({
		query: {
			enabled: isReady,
			staleTime: 0,
		},
	});

	// Fetch coverage data
	const { data: coverageData } = useGetCoverage({
		query: {
			enabled: isReady,
			staleTime: 0,
		},
	});

	useEffect(() => {
		if (isHydrated && personaState && graphState && coverageData) {
			console.log(
				"🔄 [PersonaSync] Restoring full state from server",
				new Date().toISOString(),
			);

			// 1. Sync History
			const stateData = unwrapResponse<PersonaStateResponse>(personaState);
			if (stateData) {
				syncWithServer(stateData);
			}

			// 2. Sync Graph (Nodes + Edges)
			const graphData = unwrapResponse<PersonaGraphResponse>(graphState);
			if (graphData) {
				syncGraph(graphData.nodes ?? [], graphData.edges ?? []);
			}

			// 3. Sync Coverage
			const covData = unwrapResponse<CoverageMetrics>(coverageData);
			if (covData) {
				setCoverage(covData);
			}
		}
	}, [
		isHydrated,
		personaState,
		graphState,
		coverageData,
		syncWithServer,
		syncGraph,
		setCoverage,
	]);

	return null; // Renderless component
}
