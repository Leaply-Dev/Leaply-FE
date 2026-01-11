import Cookies from "js-cookie";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Performs a synchronous logout that clears all auth state
 * This fixes the race condition where cookie wasn't cleared before redirect
 *
 * Order of operations:
 * 1. Clear auth cookie SYNCHRONOUSLY first (prevents middleware routing issues)
 * 2. Clear Zustand store (triggers async subscription, but cookie already cleared)
 * 3. Clear localStorage as backup
 * 4. Redirect if specified
 */
export function performLogout(options?: { redirect?: string }) {
	// 1. Clear cookie SYNCHRONOUSLY first
	// This is critical - the middleware reads this cookie for routing
	Cookies.remove("leaply-auth-state", { path: "/" });

	// 2. Clear Zustand store
	useUserStore.getState().logout();

	// 3. Clear localStorage as backup
	// This handles edge cases where persist middleware might restore state
	try {
		localStorage.removeItem("leaply-user-store");
	} catch {
		// Ignore errors (e.g., localStorage not available)
	}

	// 4. Redirect if specified
	if (options?.redirect) {
		window.location.href = options.redirect;
	}
}
