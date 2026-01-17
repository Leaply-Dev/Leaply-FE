"use client";

import { AlertCircle, Copy, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	copyErrorToClipboard,
	createErrorReport,
	type ErrorReport,
	generateErrorId,
	logError,
} from "@/lib/utils/errorUtils";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
	errorId: string;
	errorReport: ErrorReport | null;
	copied: boolean;
}

/**
 * ErrorBoundary component that catches React errors and provides
 * a user-friendly error UI with the ability to report errors
 */
export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorId: "",
			errorReport: null,
			copied: false,
		};
	}

	static getDerivedStateFromError(error: Error): Partial<State> {
		const errorId = generateErrorId();
		return {
			hasError: true,
			error,
			errorId,
		};
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		// Log error for debugging
		logError(error, "ErrorBoundary");

		// Create error report
		const errorReport = createErrorReport(
			error,
			this.state.errorId,
			errorInfo.componentStack ?? undefined,
		);

		this.setState({ errorReport });

		// Log to console in development
		if (process.env.NODE_ENV === "development") {
			console.group("🔴 React Error Boundary");
			console.error("Error:", error);
			console.error("Component Stack:", errorInfo.componentStack);
			console.groupEnd();
		}
	}

	handleReset = (): void => {
		this.setState({
			hasError: false,
			error: null,
			errorId: "",
			errorReport: null,
			copied: false,
		});
	};

	handleCopyError = async (): Promise<void> => {
		if (!this.state.errorReport) return;

		const success = await copyErrorToClipboard(this.state.errorReport);
		if (success) {
			this.setState({ copied: true });
			setTimeout(() => this.setState({ copied: false }), 3000);
		}
	};

	render(): ReactNode {
		if (this.state.hasError) {
			// Use custom fallback if provided
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default error UI
			return (
				<div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
					<Card className="max-w-2xl w-full">
						<CardHeader>
							<div className="flex items-center gap-3">
								<div className="p-2 rounded-full bg-destructive/10">
									<AlertCircle className="w-6 h-6 text-destructive" />
								</div>
								<CardTitle className="text-xl">
									Oops! Something went wrong
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* User-friendly message */}
							<p className="text-muted-foreground">
								We're sorry for the inconvenience. An unexpected error occurred
								while displaying this page.
							</p>

							{/* Error details (collapsed by default) */}
							<details className="group">
								<summary className="cursor-pointer text-sm font-medium hover:underline">
									Technical Details
								</summary>
								<div className="mt-2 p-3 bg-muted rounded-md text-sm font-mono">
									<p className="text-muted-foreground mb-2">
										<strong>Error ID:</strong> {this.state.errorId}
									</p>
									<p className="text-muted-foreground mb-2">
										<strong>Message:</strong> {this.state.error?.message}
									</p>
									{this.state.error?.stack && (
										<div className="mt-2">
											<p className="text-muted-foreground mb-1">
												<strong>Stack Trace:</strong>
											</p>
											<pre className="text-xs overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap break-words">
												{this.state.error.stack}
											</pre>
										</div>
									)}
								</div>
							</details>

							{/* Action buttons */}
							<div className="flex flex-wrap gap-3 pt-4">
								<Button onClick={this.handleReset} className="gap-2">
									<RefreshCw className="w-4 h-4" />
									Try Again
								</Button>
								<Button
									onClick={this.handleCopyError}
									variant="outline"
									className="gap-2"
								>
									<Copy className="w-4 h-4" />
									{this.state.copied ? "Copied!" : "Copy Error Details"}
								</Button>
								<Button
									variant="outline"
									onClick={() => {
										window.location.href = "/";
									}}
								>
									Go to Home
								</Button>
							</div>

							{/* Help text */}
							<p className="text-xs text-muted-foreground pt-4 border-t">
								If this problem persists, please copy the error details and
								contact our support team at{" "}
								<a
									href="mailto:support@leaply.ai"
									className="underline hover:text-foreground"
								>
									support@leaply.ai
								</a>
							</p>
						</CardContent>
					</Card>
				</div>
			);
		}

		return this.props.children;
	}
}
