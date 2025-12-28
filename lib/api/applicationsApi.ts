import { ApiError, apiClient } from "./client";
import type {
	ApiResponse,
	ApplicationListResponse,
	ApplicationSopResponse,
	CreateApplicationRequest,
	CreateApplicationResponse,
	DeleteApplicationResponse,
	EvaluationResponse,
	SaveSopRequest,
	SaveSopResponse,
	SopFeedbackDto,
	UpdateApplicationRequest,
	UpdateApplicationResponse,
} from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// ============================================
// Mock Data
// ============================================

const MOCK_APPLICATION_LIST: ApplicationListResponse = {
	applications: [
		{
			id: "app-1",
			program: {
				id: "prog-1",
				universityName: "MIT",
				programName: "Computer Science",
				degreeName: "Master of Science",
				nextDeadline: "2025-03-15",
				nextIntake: "Fall 2025",
			},
			status: "planning",
			fitScore: 85,
			fitCategory: "target",
			gaps: [
				{
					field: "GRE",
					message: "GRE score not provided",
					severity: "medium",
				},
			],
			sopStatus: "draft",
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		},
	],
	summary: {
		total: 1,
		byStatus: { planning: 1, writing: 0, submitted: 0 },
		byCategory: { reach: 0, target: 1, safety: 0 },
	},
	upcomingDeadlines: [
		{
			applicationId: "app-1",
			programName: "MIT - Computer Science",
			deadline: "2025-03-15",
			daysRemaining: 81,
		},
	],
};

const MOCK_SOP_RESPONSE: ApplicationSopResponse = {
	id: "sop-1",
	applicationId: "app-1",
	wordLimit: 500,
	prompt: "Describe your academic and professional goals.",
	content: "",
	wordCount: 0,
	feedbackRound: 0,
	updatedAt: new Date().toISOString(),
};

const MOCK_EVALUATION: EvaluationResponse = {
	schoolGaps: [],
	commonGaps: [
		{
			field: "GRE",
			count: 1,
			message: "GRE score missing for competitive programs",
		},
	],
	suggestions:
		"Consider taking the GRE to strengthen your application profile.",
	profileCompleteness: 75,
	missingFields: ["gre_score", "work_experience"],
};

// ============================================
// API Functions
// ============================================

/**
 * Get list of user's applications
 */
export async function getApplications(): Promise<ApplicationListResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_APPLICATION_LIST;
	}

	return apiClient.get<ApplicationListResponse>("/v1/applications");
}

/**
 * Create a new application
 */
export async function createApplication(
	request: CreateApplicationRequest,
): Promise<CreateApplicationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id: `app-${Date.now()}`,
			message: "Application created successfully",
		};
	}

	return apiClient.post<CreateApplicationResponse>("/v1/applications", request);
}

/**
 * Update application status
 */
export async function updateApplication(
	id: string,
	request: UpdateApplicationRequest,
): Promise<UpdateApplicationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id,
			status: request.status || "planning",
			updatedAt: new Date().toISOString(),
		};
	}

	return apiClient.patch<UpdateApplicationResponse>(
		`/v1/applications/${id}`,
		request,
	);
}

/**
 * Delete an application
 */
export async function deleteApplication(
	id: string,
): Promise<DeleteApplicationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			success: true,
			message: "Application deleted successfully",
		};
	}

	return apiClient.delete<DeleteApplicationResponse>(`/v1/applications/${id}`);
}

// ============================================
// SOP Functions
// ============================================

/**
 * Get SOP for an application
 */
export async function getSop(
	applicationId: string,
): Promise<ApplicationSopResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return { ...MOCK_SOP_RESPONSE, applicationId };
	}

	return apiClient.get<ApplicationSopResponse>(
		`/v1/applications/${applicationId}/sop`,
	);
}

/**
 * Save SOP draft
 */
export async function saveSop(
	applicationId: string,
	request: SaveSopRequest,
): Promise<SaveSopResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return {
			id: `sop-${Date.now()}`,
			wordCount: request.content.split(/\s+/).filter(Boolean).length,
			updatedAt: new Date().toISOString(),
		};
	}

	return apiClient.put<SaveSopResponse>(
		`/v1/applications/${applicationId}/sop`,
		request,
	);
}

/**
 * Get AI feedback on SOP
 */
export async function getSopFeedback(
	applicationId: string,
): Promise<SopFeedbackDto> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		return {
			round: 1,
			strengths: ["Clear articulation of goals", "Good connection to program"],
			improvements: [
				{
					point: "Specificity",
					suggestion: "Add more specific examples from your experience",
				},
				{
					point: "Program fit",
					suggestion:
						"Mention specific faculty or research areas at the university",
				},
			],
			personaSuggestion:
				"Based on your persona profile, consider emphasizing your leadership experiences.",
			structureNote:
				"Consider organizing your essay with a clear introduction, body, and conclusion.",
			generatedAt: new Date().toISOString(),
		};
	}

	return apiClient.post<SopFeedbackDto>(
		`/v1/applications/${applicationId}/sop/feedback`,
		{},
	);
}

// ============================================
// Evaluation Functions
// ============================================

/**
 * Get profile evaluation with gaps and suggestions
 */
export async function getEvaluation(): Promise<EvaluationResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_EVALUATION;
	}

	return apiClient.get<EvaluationResponse>("/v1/applications/evaluation");
}
