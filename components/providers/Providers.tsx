"use client";

import { QueryProvider } from "@/app/providers/query-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useSessionWarning } from "./AuthProvider";
import { MotionProvider } from "./MotionProvider";
import { SessionTimeoutWarning } from "./SessionTimeoutWarning";

interface ProvidersProps {
	children: React.ReactNode;
}

/**
 * Renders the session timeout warning modal
 * Must be inside AuthProvider to access the context
 */
function SessionWarningRenderer() {
	const { showWarning, secondsRemaining, onExtendSession } =
		useSessionWarning();

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
		<ErrorBoundary>
			<QueryProvider>
				<AuthProvider>
					<MotionProvider>
						<TooltipProvider delayDuration={300}>
							{children}
							<SessionWarningRenderer />
							<Toaster position="top-center" richColors closeButton />
						</TooltipProvider>
					</MotionProvider>
				</AuthProvider>
			</QueryProvider>
		</ErrorBoundary>
	);
}
