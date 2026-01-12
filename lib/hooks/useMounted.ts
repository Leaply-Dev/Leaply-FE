import { useEffect, useState } from "react";

/**
 * Hook that returns true only after the component has mounted on the client.
 * Use this to defer rendering of content that depends on client-only state
 * (like Zustand persisted stores) to prevent hydration mismatches.
 *
 * @example
 * ```tsx
 * const mounted = useMounted();
 *
 * if (!mounted) {
 *   return <Skeleton />; // Server-safe placeholder
 * }
 *
 * return <AuthDependentContent />; // Client-only content
 * ```
 */
export function useMounted(): boolean {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return mounted;
}
