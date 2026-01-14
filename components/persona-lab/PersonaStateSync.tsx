"use client";

import { useEffect } from "react";
import {
	useGetCoverage,
	useGetGraph,
	useGetPersonaState,
} from "@/lib/hooks/persona";
// useGetPersonaState returns PersonaStateResponse
import { usePersonaStore } from "@/lib/store/personaStore";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Component to synchronize persona state from server on mount
 * This ensures that even if local storage is cleared, we can restore
 * the user's progress from the backend.
 */
export function PersonaStateSync() {
	const syncWithServer = usePersonaStore((state) => state.syncWithServer);
	const syncGraph = usePersonaStore((state) => state.syncGraph);
	const setCoverage = usePersonaStore((state) => state.setCoverage);
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const hydrated = usePersonaStore((state) => state._hasHydrated);

	// Fetch full state on mount (history)
	const { data: personaState } = useGetPersonaState({
		query: {
			enabled: isAuthenticated && hydrated,
			staleTime: 0,
		},
	});

	// Fetch graph data (nodes, edges)
	const { data: graphState } = useGetGraph({
		query: {
			enabled: isAuthenticated && hydrated,
			staleTime: 0,
		},
	});

	// Fetch coverage data
	const { data: coverageData } = useGetCoverage({
		query: {
			enabled: isAuthenticated && hydrated,
			staleTime: 0,
		},
	});

	useEffect(() => {
		if (hydrated && personaState && graphState && coverageData) {
			console.log(
				"🔄 [PersonaSync] Restoring full state from server",
				new Date().toISOString(),
			);

			// 1. Sync History (ignore nodes from this response as they are simplified)
			// biome-ignore lint/suspicious/noExplicitAny: API response wrapper typing workaround
			const stateData = (personaState as any)?.data ?? personaState;
			if (stateData) {
				syncWithServer(stateData);
			}

			// 2. Sync Graph (Nodes + Edges)
			// biome-ignore lint/suspicious/noExplicitAny: API response wrapper typing workaround
			const graphData = (graphState as any)?.data ?? graphState;
			if (graphData) {
				syncGraph(graphData.nodes ?? [], graphData.edges ?? []);
			}

			// 3. Sync Coverage
			// biome-ignore lint/suspicious/noExplicitAny: API response wrapper typing workaround
			const covData = (coverageData as any)?.data ?? coverageData;
			if (covData) {
				setCoverage(covData);
			}
		}
	}, [
		hydrated,
		personaState,
		graphState,
		coverageData,
		syncWithServer,
		syncGraph,
		setCoverage,
	]);

	return null; // Renderless component
}
