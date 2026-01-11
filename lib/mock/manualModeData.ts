import type {
	FilterOptionsResponse,
	ProgramListItemResponse,
} from "@/lib/api/types";
import {
	generateFilterOptionsResponse,
	generateMany,
	generateProgramListItemResponse,
} from "./fakerGenerators";

/**
 * Mock data for Manual Mode Explore
 * Generated using Faker.js based on API schema
 */

// Generate 400 programs for manual mode
export const MANUAL_MODE_PROGRAMS: ProgramListItemResponse[] = generateMany(
	generateProgramListItemResponse,
	400,
);

/**
 * Filter options for Manual Mode
 * Using faker generator but with consistent structure for UI
 */
export const FILTER_OPTIONS: FilterOptionsResponse =
	generateFilterOptionsResponse();
