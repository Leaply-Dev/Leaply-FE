import { useUserStore } from "@/lib/store/userStore";
import { clearAllStorageKeys, clearAllStores } from "./clearStores";

/**
 * Performs a clean logout that clears all auth state
 *
 * The store's logout() action handles cookie clearing synchronously,
 * preventing the race condition that previously caused the 2-refresh problem.
 *
 * Order of operations:
 * 1. Call store logout (clears cookie synchronously + clears state)
 * 2. Clear all other Zustand stores (persona, etc.)
 * 3. Clear localStorage as backup for edge cases
 * 4. Redirect if specified
 */
export function performLogout(options?: { redirect?: string }) {
	// 1. Store's logout() handles cookie removal synchronously
	useUserStore.getState().logout();

	// 2. Clear all other Zustand stores to prevent data leakage
	clearAllStores();

	// 3. Clear localStorage as backup
	// This handles edge cases where persist middleware might restore state
	clearAllStorageKeys();

	// 4. Redirect if specified (validate to prevent open redirect)
	if (options?.redirect) {
		const redirect = options.redirect;
		// Only allow relative paths starting with "/" but not "//" (protocol-relative URLs)
		if (redirect.startsWith("/") && !redirect.startsWith("//")) {
			window.location.href = redirect;
		} else {
			// Fallback to safe default
			window.location.href = "/";
		}
	}
}
