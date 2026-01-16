/**
 * Display Formatters
 *
 * Utility functions to convert backend enum keys to human-readable display labels.
 * This is the single source of truth for frontend display formatting.
 *
 * See /ENUMS.md for the full list of backend enum values.
 */

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
// University Type
// =============================================================================

const UNIVERSITY_TYPE_LABELS: Record<string, string> = {
	public: "Public",
	private: "Private",
	"private-nonprofit": "Private Non-profit",
	"private-forprofit": "Private For-profit",
};

/**
 * Format university type enum to display label
 * @example "public" → "Public"
 */
export function formatUniversityType(type?: string | null): string {
	if (!type) return "N/A";
	return UNIVERSITY_TYPE_LABELS[type.toLowerCase()] || formatSnakeCase(type);
}

// =============================================================================
// Currency & Numbers
// =============================================================================

/**
 * Format currency value to USD display
 * @example 45000 → "$45,000"
 */
export function formatCurrency(
	value?: number | null,
	options?: { compact?: boolean },
): string {
	if (value === null || value === undefined) return "N/A";

	if (options?.compact) {
		// Compact format: $45k, $1.2M
		if (value >= 1_000_000) {
			return `$${(value / 1_000_000).toFixed(1)}M`;
		}
		if (value >= 1_000) {
			return `$${Math.round(value / 1_000)}k`;
		}
		return `$${value}`;
	}

	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(value);
}

/**
 * Format tuition with /year suffix
 * @example 45000 → "$45,000/yr"
 */
export function formatTuitionPerYear(value?: number | null): string {
	if (value === null || value === undefined) return "N/A";
	return `${formatCurrency(value, { compact: true })}/yr`;
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

/**
 * Format duration range (min-max months)
 * @example (18, 24) → "18-24 months"
 */
export function formatDurationRange(
	minMonths?: number | null,
	maxMonths?: number | null,
): string {
	if (!minMonths && !maxMonths) return "N/A";
	if (!maxMonths || minMonths === maxMonths) return formatDuration(minMonths);
	if (!minMonths) return formatDuration(maxMonths);

	return `${minMonths}-${maxMonths} months`;
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

/**
 * Format TOEFL requirement
 * @example 100 → "TOEFL 100+"
 */
export function formatToeflRequirement(score?: number | null): string {
	if (score === null || score === undefined) return "";
	return `TOEFL ${score}+`;
}

/**
 * Format GPA requirement
 * @example 3.5 → "GPA 3.5+"
 */
export function formatGpaRequirement(gpa?: number | null): string {
	if (gpa === null || gpa === undefined) return "";
	return `GPA ${gpa}+`;
}

// =============================================================================
// Fit Category
// =============================================================================

const FIT_CATEGORY_LABELS: Record<string, string> = {
	safety: "Safety",
	target: "Target",
	reach: "Reach",
};

const FIT_CATEGORY_LABELS_VI: Record<string, string> = {
	safety: "An toàn",
	target: "Phù hợp",
	reach: "Thử thách",
};

/**
 * Format fit category enum to display label
 * @example "safety" → "Safety"
 */
export function formatFitCategory(
	category?: string | null,
	locale: "en" | "vi" = "en",
): string {
	if (!category) return "N/A";
	const labels = locale === "vi" ? FIT_CATEGORY_LABELS_VI : FIT_CATEGORY_LABELS;
	return labels[category.toLowerCase()] || formatSnakeCase(category);
}

// =============================================================================
// Region (reuse from onboardingMappings but export here for consistency)
// =============================================================================

const REGION_LABELS: Record<string, string> = {
	east_asia: "East Asia",
	southeast_asia: "Southeast Asia",
	western_europe: "Western Europe",
	central_europe: "Central Europe",
	northern_europe: "Northern Europe",
	north_america: "North America",
	oceania: "Oceania",
};

/**
 * Format region enum to display label
 * @example "north_america" → "North America"
 */
export function formatRegion(region?: string | null): string {
	if (!region) return "N/A";
	return REGION_LABELS[region.toLowerCase()] || formatSnakeCase(region);
}

// =============================================================================
// Null/Empty Value Handling
// =============================================================================

/** Vietnamese "no data" placeholder */
export const NO_DATA_VI = "Chưa có dữ liệu";

/** English "no data" placeholder */
export const NO_DATA_EN = "N/A";

/**
 * Return value or fallback for display
 */
export function displayValue<T>(
	value: T | null | undefined,
	formatter?: (v: T) => string,
	fallback: string = NO_DATA_EN,
): string {
	if (value === null || value === undefined) return fallback;
	if (formatter) return formatter(value);
	return String(value);
}
