"use client";

/**
 * Global error boundary - renders when root layout throws
 * Must be a Client Component with its own html/body tags
 * Cannot use any context providers (including next-intl)
 */
export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<html lang="en">
			<body
				style={{
					margin: 0,
					padding: 0,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					fontFamily:
						'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
					backgroundColor: "#fafafa",
				}}
			>
				<div style={{ textAlign: "center", padding: "2rem" }}>
					<h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#333" }}>
						Something went wrong
					</h2>
					<p style={{ color: "#666", marginBottom: "1.5rem" }}>
						An unexpected error occurred
					</p>
					<button
						type="button"
						onClick={() => reset()}
						style={{
							padding: "0.75rem 1.5rem",
							backgroundColor: "#6366f1",
							color: "white",
							border: "none",
							borderRadius: "0.5rem",
							cursor: "pointer",
							fontSize: "1rem",
						}}
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
