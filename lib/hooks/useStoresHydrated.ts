/**
 * Consolidated Store Hydration Hook
 *
 * Single source of truth for checking if Zustand stores have completed
 * hydration from localStorage. Components should wait for this before making
 * authenticated API calls or rendering user-specific data.
 *
 * Usage:
 * ```tsx
 * const { isHydrated, isReady } = useStoresHydrated();
 *
 * if (!isHydrated) return <Skeleton />;
 * if (!isReady) return <LoginPrompt />;
 * ```
 */
import { useUserStore } from "@/lib/store/userStore";

interface HydrationState {
	/** True when all stores have loaded from localStorage */
	isHydrated: boolean;
	/** True when hydrated AND user is authenticated (ready for protected content) */
	isReady: boolean;
	/** Individual store hydration states for debugging */
	stores: {
		user: boolean;
	};
}

/**
 * Hook to check if all Zustand stores have hydrated.
 */
export function useStoresHydrated(): HydrationState {
	const userHydrated = useUserStore((state) => state._hasHydrated);
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);

	const isHydrated = userHydrated;
	const isReady = isHydrated && isAuthenticated;

	return {
		isHydrated,
		isReady,
		stores: {
			user: userHydrated,
		},
	};
}

/**
 * Simplified hook returning just the hydration boolean.
 */
export function useIsHydrated(): boolean {
	return useUserStore((state) => state._hasHydrated);
}
