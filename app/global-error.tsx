"use client";

/**
 * Global error boundary for the application.
 * This file is required for Next.js 16 + Vercel deployment.
 * It handles uncaught errors at the root level.
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
			<body>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "100vh",
						fontFamily:
							"Raleway, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
						backgroundColor: "#0a0a0a",
						color: "#fafafa",
						padding: "20px",
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
						}}
					>
						An unexpected error occurred. Please try again or refresh the page.
					</p>
					<button
						type="button"
						onClick={() => reset()}
						style={{
							padding: "12px 24px",
							fontSize: "14px",
							fontWeight: 500,
							backgroundColor: "#6366f1",
							color: "#ffffff",
							border: "none",
							borderRadius: "8px",
							cursor: "pointer",
							transition: "background-color 0.2s",
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.backgroundColor = "#4f46e5";
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.backgroundColor = "#6366f1";
						}}
						onFocus={(e) => {
							e.currentTarget.style.backgroundColor = "#4f46e5";
						}}
						onBlur={(e) => {
							e.currentTarget.style.backgroundColor = "#6366f1";
						}}
					>
						Try again
					</button>
				</div>
			</body>
		</html>
	);
}
