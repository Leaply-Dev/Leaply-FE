/**
 * Centralized Store Cleanup
 *
 * Resets all persisted Zustand stores on logout to prevent data leakage
 * between user sessions. This ensures a clean slate for new users.
 *
 * Add new stores here as they are created.
 */

import { useApplicationStore } from "@/lib/store/applicationStore";
import { usePersonaIntakeStore } from "@/lib/store/personaIntakeStore";
import { usePersonaStore } from "@/lib/store/personaStore";

/**
 * Clear all persisted stores.
 * Called during logout to ensure no user data persists in browser storage.
 */
export function clearAllStores(): void {
	usePersonaStore.getState().resetPersona();
	usePersonaIntakeStore.getState().resetDraft();
	useApplicationStore.getState().reset();
}

/**
 * Clear localStorage keys for all stores as a backup.
 * Handles edge cases where persist middleware might restore state.
 */
export function clearAllStorageKeys(): void {
	try {
		localStorage.removeItem("leaply-user-store");
		localStorage.removeItem("leaply-persona-store-v5");
		localStorage.removeItem("leaply-persona-intake-v1");
		localStorage.removeItem("application-store");
	} catch {
		// Ignore errors (e.g., localStorage not available)
	}
}
