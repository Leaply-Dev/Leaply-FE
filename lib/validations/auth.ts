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
