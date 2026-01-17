/**
 * Display Formatters
 *
 * Utility functions to convert backend enum keys to human-readable display labels.
 * This is the single source of truth for frontend display formatting.
 *
 * See /ENUMS.md for the full list of backend enum values.
 */

// =============================================================================
// Types
// =============================================================================

export type Locale = "en" | "vi";

// =============================================================================
// Generic Formatters
// =============================================================================

/**
 * Convert snake_case to Title Case
 * @example "on_campus" → "On Campus"
 * @example "united_states" → "United States"
 */
export function formatSnakeCase(value?: string | null): string {
	if (!value) return "N/A";
	return value
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Format country names with special handling for common cases
 * @example "united_states" → "United States"
 * @example "united_kingdom" → "United Kingdom"
 */
export function formatCountryName(country?: string | null): string {
	if (!country) return "N/A";

	// Special cases
	const specialCases: Record<string, string> = {
		usa: "USA",
		uk: "UK",
		uae: "UAE",
	};

	const lower = country.toLowerCase();
	if (specialCases[lower]) {
		return specialCases[lower];
	}

	return formatSnakeCase(country);
}

// =============================================================================
// Delivery Mode
// =============================================================================

const DELIVERY_MODE_LABELS: Record<string, string> = {
	on_campus: "On Campus",
	online: "Online",
	hybrid: "Hybrid",
};

/**
 * Format delivery mode enum to display label
 * @example "on_campus" → "On Campus"
 */
export function formatDeliveryMode(mode?: string | null): string {
	if (!mode) return "N/A";
	return DELIVERY_MODE_LABELS[mode.toLowerCase()] || formatSnakeCase(mode);
}

// =============================================================================
// Degree Type
// =============================================================================

const DEGREE_TYPE_LABELS: Record<string, string> = {
	masters: "Master's",
	master: "Master's", // Alias for compatibility
	mba: "MBA",
	phd: "PhD",
	bachelor: "Bachelor's",
	bachelors: "Bachelor's",
	diploma: "Diploma",
	certificate: "Certificate",
};

/**
 * Format degree type enum to display label
 * @example "masters" → "Master's"
 * @example "phd" → "PhD"
 */
export function formatDegreeType(type?: string | null): string {
	if (!type) return "N/A";
	return DEGREE_TYPE_LABELS[type.toLowerCase()] || formatSnakeCase(type);
}

// =============================================================================
// Language
// =============================================================================

const LANGUAGE_LABELS: Record<string, string> = {
	english: "English",
	german: "German",
	french: "French",
	spanish: "Spanish",
	chinese: "Chinese",
	japanese: "Japanese",
	korean: "Korean",
	dutch: "Dutch",
	swedish: "Swedish",
	danish: "Danish",
	finnish: "Finnish",
	norwegian: "Norwegian",
	italian: "Italian",
	portuguese: "Portuguese",
};

/**
 * Format language enum to display label
 * @example "english" → "English"
 */
export function formatLanguage(lang?: string | null): string {
	if (!lang) return "N/A";
	return LANGUAGE_LABELS[lang.toLowerCase()] || formatSnakeCase(lang);
}

// =============================================================================
// Currency & Numbers
// =============================================================================

/**
 * Format tuition with /year suffix
 * @example 45000 → "$45,000/yr"
 */
export function formatTuitionPerYear(value?: number | null): string {
	if (value === null || value === undefined) return "N/A";
	// Format as USD currency
	const formatted = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
	return `${formatted}/yr`;
}

// =============================================================================
// Duration
// =============================================================================

/**
 * Format duration in months to human-readable string
 * @example 24 → "2 years"
 * @example 18 → "1.5 years"
 * @example 6 → "6 months"
 */
export function formatDuration(months?: number | null): string {
	if (!months) return "N/A";

	const years = Math.floor(months / 12);
	const remainingMonths = months % 12;

	if (years === 0) {
		return `${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`;
	}

	if (remainingMonths === 0) {
		return `${years} year${years > 1 ? "s" : ""}`;
	}

	// Show as X.5 years if roughly half
	if (remainingMonths >= 5 && remainingMonths <= 7) {
		return `${years}.5 years`;
	}

	return `${years}y ${remainingMonths}m`;
}

// =============================================================================
// Date Formatting
// =============================================================================

/**
 * Format date string to localized display
 * @example "2026-01-15" → "Jan 15, 2026"
 */
export function formatDate(
	dateStr?: string | null,
	options?: { short?: boolean },
): string {
	if (!dateStr) return "N/A";

	try {
		const date = new Date(dateStr);
		if (Number.isNaN(date.getTime())) return "N/A";

		if (options?.short) {
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			});
		}

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	} catch {
		return "N/A";
	}
}

/**
 * Check if a deadline is in the past
 */
export function isDeadlinePast(dateStr?: string | null): boolean {
	if (!dateStr) return false;
	try {
		const date = new Date(dateStr);
		return date < new Date();
	} catch {
		return false;
	}
}

// =============================================================================
// Test Score Formatting
// =============================================================================

/**
 * Format IELTS requirement
 * @example 7.0 → "IELTS 7.0+"
 */
export function formatIeltsRequirement(score?: number | null): string {
	if (score === null || score === undefined) return "";
	return `IELTS ${score}+`;
}

// =============================================================================
// Scholarship Formatters
// =============================================================================

// -----------------------------------------------------------------------------
// Scholarship Source Type
// -----------------------------------------------------------------------------

const SOURCE_TYPE_LABELS: Record<string, string> = {
	university: "University",
	government: "Government",
	foundation: "Foundation",
};

/**
 * Format scholarship source type enum to display label
 * @example "university" → "University"
 * @example "foundation" → "Foundation"
 */
export function formatSourceType(type?: string | null): string {
	if (!type) return "N/A";
	return SOURCE_TYPE_LABELS[type.toLowerCase()] || formatSnakeCase(type);
}

// -----------------------------------------------------------------------------
// Scholarship Coverage Type
// -----------------------------------------------------------------------------

const COVERAGE_TYPE_LABELS: Record<string, string> = {
	full_funded: "Full Funded",
	partial_funded: "Partial Funded",
};

/**
 * Format scholarship coverage type enum to display label
 * @example "full_funded" → "Full Funded"
 * @example "partial_funded" → "Partial Funded"
 */
export function formatCoverageType(type?: string | null): string {
	if (!type) return "N/A";
	return COVERAGE_TYPE_LABELS[type.toLowerCase()] || formatSnakeCase(type);
}

// -----------------------------------------------------------------------------
// Scholarship Coverage Duration
// -----------------------------------------------------------------------------

const COVERAGE_DURATION_LABELS: Record<string, string> = {
	first_year: "First Year Only",
	annual_renewable: "Annual (Renewable)",
	full_program: "Full Program",
	one_time: "One-time",
	not_specified: "Not Specified",
	other: "Other",
};

/**
 * Format scholarship coverage duration enum to display label
 * @example "annual_renewable" → "Annual (Renewable)"
 * @example "full_program" → "Full Program"
 */
export function formatCoverageDuration(duration?: string | null): string {
	if (!duration) return "N/A";
	return (
		COVERAGE_DURATION_LABELS[duration.toLowerCase()] ||
		formatSnakeCase(duration)
	);
}

// -----------------------------------------------------------------------------
// Scholarship Eligibility Type
// -----------------------------------------------------------------------------

const ELIGIBILITY_TYPE_LABELS: Record<string, string> = {
	merit: "Merit-based",
	need_based: "Need-based",
};

/**
 * Format scholarship eligibility type enum to display label
 * @example "merit" → "Merit-based"
 * @example "need_based" → "Need-based"
 */
export function formatEligibilityType(type?: string | null): string {
	if (!type) return "N/A";
	return ELIGIBILITY_TYPE_LABELS[type.toLowerCase()] || formatSnakeCase(type);
}

// -----------------------------------------------------------------------------
// Scholarship Eligibility Focus
// -----------------------------------------------------------------------------

const ELIGIBILITY_FOCUS_LABELS: Record<string, string> = {
	academic: "Academic",
	holistic: "Holistic",
	leadership: "Leadership",
	research: "Research",
	community_service: "Community Service",
};

/**
 * Format scholarship eligibility focus enum to display label
 * @example "community_service" → "Community Service"
 * @example "leadership" → "Leadership"
 */
export function formatEligibilityFocus(focus?: string | null): string {
	if (!focus) return "N/A";
	return (
		ELIGIBILITY_FOCUS_LABELS[focus.toLowerCase()] || formatSnakeCase(focus)
	);
}

// -----------------------------------------------------------------------------
// Scholarship Degree Level
// -----------------------------------------------------------------------------

const SCHOLARSHIP_DEGREE_LEVEL_LABELS: Record<string, string> = {
	bachelor: "Bachelor's",
	master: "Master's",
	phd: "PhD",
};

/**
 * Format scholarship degree level enum to display label
 * Note: This is different from program DegreeType which uses "masters" (plural)
 * @example "master" → "Master's"
 * @example "phd" → "PhD"
 */
export function formatScholarshipDegreeLevel(level?: string | null): string {
	if (!level) return "N/A";
	return (
		SCHOLARSHIP_DEGREE_LEVEL_LABELS[level.toLowerCase()] ||
		formatSnakeCase(level)
	);
}

// -----------------------------------------------------------------------------
// Required Document
// -----------------------------------------------------------------------------

const REQUIRED_DOCUMENT_LABELS: Record<string, string> = {
	transcript: "Transcript",
	cv: "CV/Resume",
	motivation_letter: "Motivation Letter",
	recommendation_letters: "Recommendation Letters",
	portfolio: "Portfolio",
	research_proposal: "Research Proposal",
	financial_documents: "Financial Documents",
	language_certificate: "Language Certificate",
};

/**
 * Format required document enum to display label
 * @example "recommendation_letters" → "Recommendation Letters"
 * @example "cv" → "CV/Resume"
 */
export function formatRequiredDocument(doc?: string | null): string {
	if (!doc) return "N/A";
	return REQUIRED_DOCUMENT_LABELS[doc.toLowerCase()] || formatSnakeCase(doc);
}

// -----------------------------------------------------------------------------
// Scholarship Amount Formatting
// -----------------------------------------------------------------------------

/**
 * Format scholarship coverage amount range
 * @example (5000, 10000) → "$5,000 - $10,000"
 * @example (null, 50000) → "Up to $50,000"
 * @example (10000, null) → "From $10,000"
 */
export function formatCoverageAmount(
	min?: number | null,
	max?: number | null,
	options?: { compact?: boolean },
): string {
	if (min === null && max === null) return "N/A";
	if (min === undefined && max === undefined) return "N/A";

	const formatFn = (val: number) => {
		if (options?.compact) {
			// Compact format: $45k, $1.2M
			if (val >= 1_000_000) {
				return `$${(val / 1_000_000).toFixed(1)}M`;
			}
			if (val >= 1_000) {
				return `$${Math.round(val / 1_000)}k`;
			}
			return `$${val}`;
		}
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			maximumFractionDigits: 0,
		}).format(val);
	};

	if (min && max) {
		if (min === max) return formatFn(min);
		return `${formatFn(min)} - ${formatFn(max)}`;
	}
	if (max) return `Up to ${formatFn(max)}`;
	if (min) return `From ${formatFn(min)}`;
	return "N/A";
}

// =============================================================================
// Application Status (with locale support)
// =============================================================================

const APPLICATION_STATUS_LABELS: Record<Locale, Record<string, string>> = {
	en: {
		planning: "Planning",
		writing: "Writing",
		submitted: "Submitted",
		accepted: "Accepted",
		rejected: "Rejected",
	},
	vi: {
		planning: "Đang chuẩn bị",
		writing: "Đang viết",
		submitted: "Đã nộp",
		accepted: "Trúng tuyển",
		rejected: "Không đạt",
	},
};

/**
 * Format application status enum to display label
 * @example formatApplicationStatus("planning", "vi") → "Đang chuẩn bị"
 * @example formatApplicationStatus("submitted", "en") → "Submitted"
 */
export function formatApplicationStatus(
	status?: string | null,
	locale: Locale = "vi",
): string {
	if (!status) return "N/A";
	const labels = APPLICATION_STATUS_LABELS[locale];
	return labels[status.toLowerCase()] || formatSnakeCase(status);
}

// =============================================================================
// SOP Status (with locale support)
// =============================================================================

const SOP_STATUS_LABELS: Record<Locale, Record<string, string>> = {
	en: {
		not_started: "Not Started",
		drafting: "Drafting",
		reviewing: "Reviewing",
		completed: "Completed",
	},
	vi: {
		not_started: "Chưa bắt đầu",
		drafting: "Đang viết",
		reviewing: "Đang xem xét",
		completed: "Hoàn thành",
	},
};

/**
 * Format SOP status enum to display label
 * @example formatSopStatus("drafting", "vi") → "Đang viết"
 * @example formatSopStatus("completed", "en") → "Completed"
 */
export function formatSopStatus(
	status?: string | null,
	locale: Locale = "vi",
): string {
	if (!status) return locale === "vi" ? "Chưa bắt đầu" : "Not Started";
	const labels = SOP_STATUS_LABELS[locale];
	return labels[status.toLowerCase()] || formatSnakeCase(status);
}

// =============================================================================
// Coverage Type (with locale support)
// =============================================================================

const COVERAGE_TYPE_LABELS_I18N: Record<Locale, Record<string, string>> = {
	en: {
		full_funded: "Full Funded",
		partial_funded: "Partial Funded",
	},
	vi: {
		full_funded: "Toàn phần",
		partial_funded: "Bán phần",
	},
};

/**
 * Format scholarship coverage type enum to display label with locale support
 * @example formatCoverageTypeI18n("full_funded", "vi") → "Toàn phần"
 * @example formatCoverageTypeI18n("partial_funded", "en") → "Partial Funded"
 */
export function formatCoverageTypeI18n(
	type?: string | null,
	locale: Locale = "vi",
): string {
	if (!type) return "N/A";
	const labels = COVERAGE_TYPE_LABELS_I18N[locale];
	return labels[type.toLowerCase()] || formatSnakeCase(type);
}

// =============================================================================
// Coverage Duration (with locale support)
// =============================================================================

const COVERAGE_DURATION_LABELS_I18N: Record<Locale, Record<string, string>> = {
	en: {
		first_year: "First Year Only",
		annual_renewable: "Annual (Renewable)",
		full_program: "Full Program",
		one_time: "One-time",
		not_specified: "Not Specified",
		other: "Other",
	},
	vi: {
		first_year: "Năm đầu tiên",
		annual_renewable: "Hàng năm (Gia hạn)",
		full_program: "Toàn chương trình",
		one_time: "Một lần",
		not_specified: "Chưa xác định",
		other: "Khác",
	},
};

/**
 * Format scholarship coverage duration enum to display label with locale support
 * @example formatCoverageDurationI18n("full_program", "vi") → "Toàn chương trình"
 */
export function formatCoverageDurationI18n(
	duration?: string | null,
	locale: Locale = "vi",
): string {
	if (!duration) return "N/A";
	const labels = COVERAGE_DURATION_LABELS_I18N[locale];
	return labels[duration.toLowerCase()] || formatSnakeCase(duration);
}

// =============================================================================
// Eligibility Type (with locale support)
// =============================================================================

const ELIGIBILITY_TYPE_LABELS_I18N: Record<Locale, Record<string, string>> = {
	en: {
		merit: "Merit-based",
		need_based: "Need-based",
	},
	vi: {
		merit: "Theo thành tích",
		need_based: "Theo nhu cầu",
	},
};

/**
 * Format scholarship eligibility type enum to display label with locale support
 * @example formatEligibilityTypeI18n("merit", "vi") → "Theo thành tích"
 */
export function formatEligibilityTypeI18n(
	type?: string | null,
	locale: Locale = "vi",
): string {
	if (!type) return "N/A";
	const labels = ELIGIBILITY_TYPE_LABELS_I18N[locale];
	return labels[type.toLowerCase()] || formatSnakeCase(type);
}

// =============================================================================
// Source Type (with locale support)
// =============================================================================

const SOURCE_TYPE_LABELS_I18N: Record<Locale, Record<string, string>> = {
	en: {
		university: "University",
		government: "Government",
		foundation: "Foundation",
	},
	vi: {
		university: "Trường đại học",
		government: "Chính phủ",
		foundation: "Tổ chức/Quỹ",
	},
};

/**
 * Format scholarship source type enum to display label with locale support
 * @example formatSourceTypeI18n("government", "vi") → "Chính phủ"
 */
export function formatSourceTypeI18n(
	type?: string | null,
	locale: Locale = "vi",
): string {
	if (!type) return "N/A";
	const labels = SOURCE_TYPE_LABELS_I18N[locale];
	return labels[type.toLowerCase()] || formatSnakeCase(type);
}
