/**
 * Centralized Store Cleanup
 *
 * Resets persisted Zustand stores on logout to prevent data leakage between
 * user sessions. Add new stores here as they are created.
 * (Persona Lab + Application stores removed — Path A strip.)
 */

/**
 * Clear all persisted stores. Called during logout.
 */
export function clearAllStores(): void {}

/**
 * Clear localStorage keys for all stores as a backup.
 */
export function clearAllStorageKeys(): void {
	try {
		localStorage.removeItem("leaply-user-store");
	} catch {
		// Ignore errors (e.g., localStorage not available)
	}
}
