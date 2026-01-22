"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";
import {
	copyErrorToClipboard,
	createErrorReport,
	generateErrorId,
	getUserFriendlyError,
	logError,
} from "@/lib/utils/errorUtils";

// Only load devtools in development to reduce production bundle size
const ReactQueryDevtools =
	process.env.NODE_ENV === "development"
		? dynamic(
				() =>
					import("@tanstack/react-query-devtools").then((m) => ({
						default: m.ReactQueryDevtools,
					})),
				{ ssr: false },
			)
		: () => null;

export function QueryProvider({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000, // 1 minute default
						gcTime: 5 * 60 * 1000, // 5 minutes (was cacheTime in v4)
						refetchOnWindowFocus: false, // Disable annoying refetches
						retry: (failureCount, error) => {
							// Don't retry on client errors (4xx)
							if (error instanceof ApiError && error.status < 500) {
								return false;
							}
							// Retry server errors (5xx) up to 2 times
							return failureCount < 2;
						},
						retryDelay: (attemptIndex) =>
							Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
					},
					mutations: {
						// Global mutation error handler
						onError: (error, _variables, _context) => {
							logError(error, "Mutation");
							const { message, canRetry, errorId } =
								getUserFriendlyError(error);

							// Show error toast with action to copy error details
							toast.error(message, {
								description: canRetry
									? "You can try again."
									: `Error ID: ${errorId}`,
								duration: 5000,
								action: {
									label: "Copy Error",
									onClick: async () => {
										const report = createErrorReport(error, errorId);
										const success = await copyErrorToClipboard(report);
										if (success) {
											toast.success("Error details copied to clipboard", {
												description:
													"Share this with our support team for help.",
											});
										}
									},
								},
							});
						},
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
