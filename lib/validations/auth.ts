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
 * Registration form validation schema factory.
 * Accepts a translate function (scoped to the `auth.validation` namespace) so
 * error messages are localized per the user's current locale.
 */
export type ValidationTranslate = (key: string) => string;

/**
 * Creates a Zod schema for validating user registration data.
 *
 * The schema validates `fullName`, `email`, `password`, and `confirmPassword` with length,
 * character, format, and strength constraints, and enforces that `password` and
 * `confirmPassword` match. Validation messages are produced by the provided translate function.
 *
 * @param t - A translation function that maps validation message keys (e.g., `"fullName.required"`) to localized strings
 * @returns A Zod object schema for the registration form data
 */
export function createRegisterSchema(t: ValidationTranslate) {
	return z
		.object({
			fullName: z
				.string()
				.min(1, t("fullName.required"))
				.min(2, t("fullName.min"))
				.max(100, t("fullName.max"))
				.regex(/^[a-zA-ZÀ-ỹ\s'-]+$/, t("fullName.regex")),
			email: z
				.string()
				.min(1, t("email.required"))
				.email(t("email.invalid"))
				.toLowerCase(),
			password: z
				.string()
				.min(8, t("password.min"))
				.regex(/[A-Z]/, t("password.uppercase"))
				.regex(/[a-z]/, t("password.lowercase"))
				.regex(/[0-9]/, t("password.number")),
			confirmPassword: z.string().min(1, t("confirmPassword.required")),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t("confirmPassword.mismatch"),
			path: ["confirmPassword"],
		});
}

export type RegisterFormData = z.infer<ReturnType<typeof createRegisterSchema>>;

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
