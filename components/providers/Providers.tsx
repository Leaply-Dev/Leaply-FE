"use client";

import { QueryProvider } from "@/app/providers/query-provider";
import { AuthProvider, useSessionWarning } from "./AuthProvider";
import { SessionTimeoutWarning } from "./SessionTimeoutWarning";

interface ProvidersProps {
	children: React.ReactNode;
}

/**
 * Renders the session timeout warning modal
 * Must be inside AuthProvider to access the context
 */
function SessionWarningRenderer() {
	const { showWarning, secondsRemaining, onExtendSession } = useSessionWarning();

	return (
		<SessionTimeoutWarning
			isOpen={showWarning}
			secondsRemaining={secondsRemaining}
			onExtendSession={onExtendSession}
		/>
	);
}

/**
 * Client-side providers wrapper
 * Combines all app-level providers in one place
 */
export function Providers({ children }: ProvidersProps) {
	return (
		<QueryProvider>
			<AuthProvider>
				{children}
				<SessionWarningRenderer />
			</AuthProvider>
		</QueryProvider>
	);
}
