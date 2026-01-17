/**
 * Error handling utilities for user-friendly error messages and error reporting
 */

import { ApiError } from "@/lib/api/client";

export interface ErrorReport {
	errorId: string;
	message: string;
	userMessage: string;
	timestamp: string;
	url: string;
	userAgent: string;
	status?: number;
	code?: string;
	endpoint?: string;
	stack?: string;
	componentStack?: string;
}

/**
 * Generate a unique error ID for tracking
 */
export function generateErrorId(): string {
	const timestamp = Date.now().toString(36);
	const randomStr = Math.random().toString(36).substring(2, 9);
	return `ERR-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Get user-friendly error message from any error type
 */
export function getUserFriendlyError(error: unknown): {
	message: string;
	canRetry: boolean;
	errorId: string;
} {
	const errorId = generateErrorId();

	// Handle ApiError (from our backend)
	if (error instanceof ApiError) {
		const message = error.getUserMessage();
		const canRetry = error.status >= 500 || error.status === 408; // Server errors or timeout

		return { message, canRetry, errorId };
	}

	// Handle standard Error
	if (error instanceof Error) {
		// Network errors
		if (
			error.message.includes("fetch") ||
			error.message.includes("network") ||
			error.message.includes("NetworkError")
		) {
			return {
				message:
					"Unable to connect to the server. Please check your internet connection.",
				canRetry: true,
				errorId,
			};
		}

		// Timeout errors
		if (error.message.includes("timeout")) {
			return {
				message: "The request took too long to complete. Please try again.",
				canRetry: true,
				errorId,
			};
		}

		// Generic error
		return {
			message: error.message || "An unexpected error occurred.",
			canRetry: false,
			errorId,
		};
	}

	// Unknown error type
	return {
		message: "An unexpected error occurred. Please try again.",
		canRetry: false,
		errorId,
	};
}

/**
 * Create error report for sending to developers
 */
export function createErrorReport(
	error: unknown,
	errorId: string,
	componentStack?: string,
): ErrorReport {
	const timestamp = new Date().toISOString();
	const url = typeof window !== "undefined" ? window.location.href : "";
	const userAgent =
		typeof window !== "undefined" ? window.navigator.userAgent : "";

	const report: ErrorReport = {
		errorId,
		message: error instanceof Error ? error.message : String(error),
		userMessage: getUserFriendlyError(error).message,
		timestamp,
		url,
		userAgent,
		stack: error instanceof Error ? error.stack : undefined,
		componentStack,
	};

	// Add ApiError-specific fields
	if (error instanceof ApiError) {
		report.status = error.status;
		report.code = error.code;
		report.endpoint = error.endpoint;
	}

	return report;
}

/**
 * Copy error report to clipboard for user to share
 */
export async function copyErrorToClipboard(
	report: ErrorReport,
): Promise<boolean> {
	try {
		const reportText = `
=== Error Report ===
Error ID: ${report.errorId}
Timestamp: ${report.timestamp}
URL: ${report.url}

User Message: ${report.userMessage}
Technical Message: ${report.message}
${report.status ? `Status: ${report.status}` : ""}
${report.code ? `Code: ${report.code}` : ""}
${report.endpoint ? `Endpoint: ${report.endpoint}` : ""}

User Agent: ${report.userAgent}
${report.stack ? `\nStack Trace:\n${report.stack}` : ""}
${report.componentStack ? `\nComponent Stack:\n${report.componentStack}` : ""}
==================
		`.trim();

		await navigator.clipboard.writeText(reportText);
		return true;
	} catch {
		return false;
	}
}

/**
 * Log error to console in development
 */
export function logError(error: unknown, context?: string): void {
	if (process.env.NODE_ENV === "development") {
		console.group(`🚨 Error${context ? ` in ${context}` : ""}`);
		console.error(error);
		if (error instanceof ApiError) {
			error.logDetails();
		}
		console.groupEnd();
	}
}

/**
 * Send error report to backend (future implementation)
 */
export async function reportErrorToBackend(report: ErrorReport): Promise<void> {
	// TODO: Implement backend error reporting endpoint
	// For now, just log in development
	if (process.env.NODE_ENV === "development") {
		console.log("Error report would be sent:", report);
	}
}
