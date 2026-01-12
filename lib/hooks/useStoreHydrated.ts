import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/store/userStore";

/**
 * Hook that returns true only after the Zustand store has hydrated from localStorage.
 *
 * This is different from useMounted() which only tracks React component mounting.
 * Zustand's persist middleware hydrates asynchronously AFTER React mounts,
 * so we need to wait for store hydration before reading persisted state.
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
	const [hydrated, setHydrated] = useState(false);

	useEffect(() => {
		// Check if already hydrated (might be true on subsequent renders)
		if (useUserStore.persist.hasHydrated()) {
			setHydrated(true);
			return;
		}

		// Subscribe to hydration completion
		const unsubscribe = useUserStore.persist.onFinishHydration(() => {
			setHydrated(true);
		});

		return unsubscribe;
	}, []);

	return hydrated;
}
