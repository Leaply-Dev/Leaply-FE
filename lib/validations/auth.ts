import { z } from "zod";

/**
 * Login form validation schema
 * Validates email format and password presence
 */
export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form validation schema
 * Enforces password strength requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const registerSchema = z
	.object({
		fullName: z
			.string()
			.min(1, "Full name is required")
			.min(2, "Full name must be at least 2 characters")
			.max(100, "Full name must not exceed 100 characters")
			.regex(
				/^[a-zA-ZÀ-ỹ\s'-]+$/,
				"Full name can only contain letters, spaces, hyphens, and apostrophes",
			),
		email: z
			.string()
			.min(1, "Email is required")
			.email("Please enter a valid email address")
			.toLowerCase(),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Email verification request schema
 */
export const verifyEmailSchema = z.object({
	token: z.string().min(1, "Verification token is required"),
});

/**
 * Password reset request schema
 */
export const forgotPasswordSchema = z.object({
	email: z
		.string()
		.min(1, "Email is required")
		.email("Please enter a valid email address"),
});

/**
 * Password reset confirmation schema
 */
export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, "Reset token is required"),
		newPassword: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Password must contain at least one uppercase letter")
			.regex(/[a-z]/, "Password must contain at least one lowercase letter")
			.regex(/[0-9]/, "Password must contain at least one number"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});
