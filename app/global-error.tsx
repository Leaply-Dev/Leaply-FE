"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Global error boundary for the application.
 * This file is required for Next.js 16 + Vercel deployment.
 * It handles uncaught errors at the root level.
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error;
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to Sentry/Glitchtip
		Sentry.captureException(error);
	}, [error]);

	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					padding: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily:
						"Raleway, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
					backgroundColor: "#0a0a0a",
					color: "#fafafa",
					textAlign: "center",
				}}
			>
				<h2 style={{ fontSize: "24px", marginBottom: "16px" }}>
					Something went wrong
				</h2>
				<p
					style={{
						fontSize: "14px",
						color: "#a1a1aa",
						marginBottom: "24px",
						maxWidth: "400px",
						padding: "0 20px",
					}}
				>
					An unexpected error occurred. Please try again or refresh the page.
				</p>
				<button
					type="button"
					onClick={reset}
					style={{
						padding: "12px 24px",
						fontSize: "14px",
						fontWeight: 500,
						backgroundColor: "#6366f1",
						color: "#ffffff",
						border: "none",
						borderRadius: "8px",
						cursor: "pointer",
					}}
				>
					Try again
				</button>
			</body>
		</html>
	);
}
