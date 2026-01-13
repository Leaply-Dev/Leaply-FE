"use client";

import { useEffect } from "react";
import { usePersonaStore } from "@/lib/store/personaStore";
import { getScenarioState } from "@/lib/mock";

/**
 * Hook to load mock data when mock mode is enabled (development only)
 *
 * This hook:
 * 1. Monitors mockMode and mockScenario state
 * 2. Loads corresponding graph data when enabled
 * 3. Clears data when disabled
 */
export function useMockGraphData() {
	const mockMode = usePersonaStore((state) => state.mockMode);
	const mockScenario = usePersonaStore((state) => state.mockScenario);

	useEffect(() => {
		if (mockMode) {
			// Load mock data for the selected scenario
			const state = getScenarioState(mockScenario);

			// Clear existing data first
			usePersonaStore.getState().clearApiGraph();
			usePersonaStore.getState().clearGraphMessages();

			// Load graph data
			usePersonaStore.getState().processGraphUpdate({
				nodesCreated: state.nodes,
				edgesCreated: state.edges,
				coverage: state.coverage,
			});

			// Load chat history
			state.messages.forEach((msg) => {
				usePersonaStore.getState().addGraphMessage({
					id: crypto.randomUUID(),
					role: msg.role as "assistant" | "user",
					content: msg.content || "",
					type: "text",
					timestamp: msg.timestamp || new Date().toISOString(),
				});
			});
		} else {
			// Clear mock data when disabled
			usePersonaStore.getState().clearApiGraph();
			usePersonaStore.getState().clearGraphMessages();
		}
	}, [mockMode, mockScenario]);
}
