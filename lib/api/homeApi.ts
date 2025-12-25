import { apiClient } from "./client";
import type { HomeResponse } from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// ============================================
// Mock Data
// ============================================

const MOCK_HOME_RESPONSE: HomeResponse = {
	firstName: "Bạn",
	profileCompletion: 65,
	journeyType: "exploring",
	discovery: {
		completedTracks: 1,
		totalTracks: 4,
		archetypeRevealed: false,
	},
	applications: {
		total: 2,
		byStatus: { planning: 1, writing: 1, submitted: 0 },
		byCategory: { reach: 1, target: 1, safety: 0 },
	},
	recentApplications: [
		{
			id: "app-1",
			universityName: "MIT",
			programName: "Computer Science",
			status: "writing",
			fitScore: 78,
		},
		{
			id: "app-2",
			universityName: "Stanford University",
			programName: "Data Science",
			status: "planning",
			fitScore: 85,
		},
	],
	upcomingDeadlines: [
		{
			applicationId: "app-1",
			programName: "MIT - Computer Science",
			deadline: "2025-03-15",
			daysRemaining: 80,
		},
	],
	suggestedAction: {
		type: "persona",
		title: "Tiếp tục khám phá",
		description: "Đã hoàn thành 1/4 tracks",
		link: "/persona-lab",
	},
};

// ============================================
// API Functions
// ============================================

/**
 * Get aggregated home page data
 */
export async function getHomeData(): Promise<HomeResponse> {
	if (USE_MOCK_DATA) {
		await new Promise((resolve) => setTimeout(resolve, 500));
		return MOCK_HOME_RESPONSE;
	}

	return apiClient.get<HomeResponse>("/v1/home");
}
