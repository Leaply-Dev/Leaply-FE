import { z } from "zod";
import {
	UpdatePreferencesBody,
	UpdateProfileBody,
} from "@/lib/generated/api/zod/user/user.zod";

/**
 * Profile form validation schema
 * Extends the generated API schema with UI-specific requirements
 */
export const profileSchema = UpdateProfileBody.extend({
	fullName: z
		.string()
		.min(1, "Full name is required")
		.min(2, "Full name must be at least 2 characters")
		.max(100, "Full name must not exceed 100 characters")
		.regex(
			/^[a-zA-ZÀ-ỹ\s'-]+$/,
			"Full name can only contain letters, spaces, hyphens, and apostrophes",
		),
	gpa: z
		.number()
		.min(0, "GPA must be at least 0")
		.max(10, "GPA cannot exceed 10")
		.optional()
		.or(z.literal("")), // Allow empty string to clear value
	gpaScale: z
		.number()
		.min(1, "GPA Scale must be at least 1")
		.max(10, "GPA Scale cannot exceed 10")
		.optional()
		.default(4.0),
	workExperienceYears: z
		.number()
		.min(0, "Years cannot be negative")
		.max(50, "Years cannot exceed 50")
		.optional()
		.or(z.literal("")),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Preferences form validation schema
 * Extends the generated API schema with UI-specific requirements
 */
export const preferencesSchema = UpdatePreferencesBody.extend({
	fieldOfInterest: z.array(z.string()).max(3, "Select up to 3 fields"),
	preferredRegions: z.array(z.string()),
	// Helper fields for UI that map to intendedStartTerm
	intendedStartYear: z.string().optional(),
	intendedStartTerm: z.string().optional(),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;
