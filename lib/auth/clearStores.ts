/**
 * Centralized Store Cleanup
 *
 * Resets all persisted Zustand stores on logout to prevent data leakage
 * between user sessions. This ensures a clean slate for new users.
 *
 * Add new stores here as they are created.
 */
import { usePersonaStore } from "@/lib/store/personaStore";

/**
 * Clear all persisted stores.
 * Called during logout to ensure no user data persists in browser storage.
 */
export function clearAllStores(): void {
	// Reset persona store (clears graphMessages, nodes, edges, coverage, etc.)
	usePersonaStore.getState().resetPersona();

	// Future stores can be added here:
	// useExampleStore.getState().reset();
}

/**
 * Clear localStorage keys for all stores as a backup.
 * Handles edge cases where persist middleware might restore state.
 */
export function clearAllStorageKeys(): void {
	try {
		// User store is handled separately to avoid circular imports
		localStorage.removeItem("leaply-user-store");
		localStorage.removeItem("leaply-persona-store-v4");

		// Future store keys can be added here:
		// localStorage.removeItem("leaply-example-store");
	} catch {
		// Ignore errors (e.g., localStorage not available)
	}
}
