"use client";

import { QueryProvider } from "@/app/providers/query-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./AuthProvider";
import { MotionProvider } from "./MotionProvider";

interface ProvidersProps {
	children: React.ReactNode;
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
							<Toaster position="top-center" richColors closeButton />
						</TooltipProvider>
					</MotionProvider>
				</AuthProvider>
			</QueryProvider>
		</ErrorBoundary>
	);
}
