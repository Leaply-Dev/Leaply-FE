"use client";

// Global error page - must be a Client Component
// This page renders outside of root layout, so it can't use any context providers
export default function GlobalError({
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
						padding: "2rem",
						fontFamily: "system-ui, sans-serif",
					}}
				>
					<h2
						style={{
							fontSize: "1.5rem",
							fontWeight: "bold",
							marginBottom: "1rem",
						}}
					>
						Something went wrong!
					</h2>
					<button
						type="button"
						onClick={() => reset()}
						style={{
							padding: "0.75rem 1.5rem",
							backgroundColor: "#0070f3",
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
