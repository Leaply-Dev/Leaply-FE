import { generateHomeResponse } from "@/lib/mock";
import { apiClient } from "./client";
import type { HomeResponse } from "./types";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// ============================================
// Mock Data
// ============================================

const MOCK_HOME_RESPONSE: HomeResponse = generateHomeResponse();

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
