/**
 * API Error class for structured error handling.
 *
 * This is the only export needed from this file - used by errorUtils and query-provider.
 * All API calls go through mutator.ts which handles cookie-based auth.
 */

export class ApiError extends Error {
	constructor(
		public message: string,
		public status: number,
		public code?: string,
		public field?: string,
		public details?: Record<string, unknown>,
		public endpoint?: string,
		public timestamp?: string,
	) {
		super(message);
		this.name = "ApiError";
	}

	getUserMessage(): string {
		switch (this.status) {
			case 400:
				return this.message || "Invalid request. Please check your input.";
			case 401:
				return "Please log in to continue.";
			case 403:
				return "You don't have permission to perform this action.";
			case 404:
				return "The requested resource was not found.";
			case 500:
				return "Something went wrong on our end. Please try again later.";
			default:
				return this.message || "An unexpected error occurred.";
		}
	}

	logDetails(): void {
		console.error(`API Error [${this.status}] - ${this.endpoint}`, {
			message: this.message,
			code: this.code || "N/A",
			field: this.field || "N/A",
			details: this.details || {},
		});
	}
}
