/**
 * Consolidated Store Hydration Hook
 *
 * Provides a single source of truth for checking if all Zustand stores
 * have completed hydration from localStorage. Components should wait
 * for this before making authenticated API calls or rendering user-specific data.
 *
 * Usage:
 * ```tsx
 * const { isHydrated, isReady } = useStoresHydrated();
 *
 * if (!isHydrated) return <Skeleton />;
 * if (!isReady) return <LoginPrompt />;
 * ```
 */
import { usePersonaStore } from "@/lib/store/personaStore";
import { useUserStore } from "@/lib/store/userStore";

interface HydrationState {
	/** True when all stores have loaded from localStorage */
	isHydrated: boolean;
	/** True when hydrated AND user is authenticated (ready for protected content) */
	isReady: boolean;
	/** Individual store hydration states for debugging */
	stores: {
		user: boolean;
		persona: boolean;
	};
}

/**
 * Hook to check if all Zustand stores have hydrated.
 * Use this instead of checking individual store hydration flags.
 */
export function useStoresHydrated(): HydrationState {
	const userHydrated = useUserStore((state) => state._hasHydrated);
	const personaHydrated = usePersonaStore((state) => state._hasHydrated);
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	const isHydrated = userHydrated && personaHydrated;
	const isReady = isHydrated && isAuthenticated;

	return {
		isHydrated,
		isReady,
		stores: {
			user: userHydrated,
			persona: personaHydrated,
		},
	};
}

/**
 * Simplified hook returning just the hydration boolean.
 * For components that only need to know if stores are ready.
 */
export function useIsHydrated(): boolean {
	const userHydrated = useUserStore((state) => state._hasHydrated);
	const personaHydrated = usePersonaStore((state) => state._hasHydrated);
	return userHydrated && personaHydrated;
}
