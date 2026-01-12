import { useUserStore } from "@/lib/store/userStore";

/**
 * Hook that returns true only after the Zustand store has hydrated from localStorage.
 *
 * This uses the recommended Zustand pattern of storing hydration state directly in the store
 * via the `onRehydrateStorage` callback. This is more reliable than external hooks because:
 * 1. The state is set as part of the hydration callback chain
 * 2. It's reactive - components automatically re-render when hydration completes
 * 3. Avoids race conditions with useEffect timing
 *
 * @see https://zustand.docs.pmnd.rs/integrations/persisting-store-data#how-can-i-check-if-my-store-has-been-hydrated
 *
 * @example
 * ```tsx
 * const hydrated = useStoreHydrated();
 *
 * if (!hydrated) {
 *   return <Skeleton />; // Show while store is hydrating
 * }
 *
 * // Now isAuthenticated reflects the actual persisted value
 * const { isAuthenticated } = useUserStore();
 * return isAuthenticated ? <AuthUI /> : <PublicUI />;
 * ```
 */
export function useStoreHydrated(): boolean {
	return useUserStore((state) => state._hasHydrated);
}
