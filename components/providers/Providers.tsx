"use client";

import { AuthProvider } from "./AuthProvider";

interface ProvidersProps {
	children: React.ReactNode;
}

/**
 * Client-side providers wrapper
 * Combines all app-level providers in one place
 */
export function Providers({ children }: ProvidersProps) {
	return <AuthProvider>{children}</AuthProvider>;
}
