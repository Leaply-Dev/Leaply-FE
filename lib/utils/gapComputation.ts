import type {
	ProgramListItemResponse,
	UserContextResponse,
} from "@/lib/generated/api/models";

/**
 * Format country name from snake_case to proper name
 */
export function formatCountryName(country?: string): string {
	if (!country) return "";

	const countryMap: Record<string, string> = {
		united_states: "United States",
		united_kingdom: "United Kingdom",
		new_zealand: "New Zealand",
		south_korea: "South Korea",
		hong_kong: "Hong Kong",
		saudi_arabia: "Saudi Arabia",
		south_africa: "South Africa",
		united_arab_emirates: "United Arab Emirates",
	};

	// Check if it's in snake_case and needs mapping
	if (countryMap[country.toLowerCase()]) {
		return countryMap[country.toLowerCase()];
	}

	// If already proper case or single word, capitalize first letter of each word
	return country
		.split(/[-_\s]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

/**
 * Gap status types
 */
export type GapStatus = "clear" | "match" | "bonus" | "gap" | "unknown";

export interface GapGridItem {
	label: string;
	userValue?: number | string;
	requiredValue?: number | string;
	status: GapStatus;
	delta?: number;
	note?: string;
}

export interface GapGridData {
	gpa: GapGridItem;
	ielts: GapGridItem;
	budget: GapGridItem;
	workExp: GapGridItem;
}

/**
 * Compute gap status by comparing user value with required value
 */
function computeGapStatus(
	userValue?: number,
	requiredValue?: number,
	higherIsBetter = true,
): GapStatus {
	if (userValue === undefined || requiredValue === undefined) {
		return "unknown";
	}

	if (higherIsBetter) {
		// For GPA, test scores: higher is better
		if (userValue >= requiredValue) {
			return userValue > requiredValue ? "bonus" : "match";
		}
		return "gap";
	}
	// For budget/cost: lower is better
	if (userValue <= requiredValue) {
		return "clear";
	}
	return "gap";
}

/**
 * Parse budget range string to max budget number
 * e.g., "under_30k" -> 30000
 */
function parseBudgetRange(budgetLabel?: string): number | undefined {
	if (!budgetLabel) return undefined;

	const budgetMap: Record<string, number> = {
		low: 20000,
		under_30k: 30000,
		medium: 40000,
		under_50k: 50000,
		high: 60000,
		under_70k: 70000,
		very_high: 100000,
		unlimited: 200000,
	};

	return budgetMap[budgetLabel];
}

/**
 * Compute Gap Grid data for a program based on user profile
 */
export function computeGapGrid(
	program: ProgramListItemResponse,
	userProfile?: UserContextResponse | null,
): GapGridData {
	// GPA Comparison - profile.gpa is string in new schema
	const userGpa = userProfile?.profile?.gpa
		? Number.parseFloat(userProfile.profile.gpa)
		: undefined;
	// Don't hardcode GPA requirement - if program doesn't specify, return unknown
	// In the future, this could come from program.requirements.gpaMinimum
	const requiredGpa = undefined; // Programs often don't have GPA requirements in our data
	const gpaStatus = computeGapStatus(userGpa, requiredGpa, true);
	const gpaDelta = userGpa && requiredGpa ? userGpa - requiredGpa : undefined;

	const gpa: GapGridItem = {
		label: "GPA",
		userValue: userGpa,
		requiredValue: requiredGpa,
		status: gpaStatus,
		delta: gpaDelta,
		note:
			gpaStatus === "gap" && gpaDelta
				? `Need +${Math.abs(gpaDelta).toFixed(1)}`
				: undefined,
	};

	// IELTS Comparison - profile.testScores
	const userIelts = userProfile?.profile?.testScores?.IELTS
		? Number.parseFloat(userProfile.profile.testScores.IELTS)
		: undefined;
	const requiredIelts = program.ieltsMinimum;
	const ieltsStatus = computeGapStatus(userIelts, requiredIelts, true);
	const ieltsDelta =
		userIelts && requiredIelts ? userIelts - requiredIelts : undefined;

	const ielts: GapGridItem = {
		label: "IELTS",
		userValue: userIelts,
		requiredValue: requiredIelts,
		status: ieltsStatus,
		delta: ieltsDelta,
		note:
			ieltsStatus === "gap" && ieltsDelta
				? `Need ${requiredIelts}`
				: ieltsStatus === "match"
					? "OK"
					: undefined,
	};

	// Budget Comparison - preferences.budgetLabel
	const userBudget = parseBudgetRange(userProfile?.preferences?.budgetLabel);
	const programCost = program.tuitionAnnualUsd;
	// For budget: compare programCost (what you need) vs userBudget (what you have)
	// If programCost <= userBudget, then "clear" (you can afford it)
	const budgetStatus = computeGapStatus(programCost, userBudget, false);

	const budget: GapGridItem = {
		label: "Cost",
		userValue: programCost ? `$${(programCost / 1000).toFixed(0)}k` : undefined,
		requiredValue: userBudget
			? `$${(userBudget / 1000).toFixed(0)}k`
			: undefined,
		status: budgetStatus,
		note:
			budgetStatus === "clear"
				? "Match"
				: budgetStatus === "gap"
					? "High"
					: undefined,
	};

	// Work Experience Comparison - not available in new UserContextResponse
	// TODO: Add workExperienceYears to program requirements when backend provides this field
	const userWorkExp = undefined;
	const requiredWorkExp = undefined;
	const workExpStatus = computeGapStatus(userWorkExp, requiredWorkExp, true);

	const workExp: GapGridItem = {
		label: "Exp",
		userValue: userWorkExp !== undefined ? `${userWorkExp}y` : undefined,
		requiredValue:
			requiredWorkExp !== undefined ? `${requiredWorkExp}y` : undefined,
		status: workExpStatus,
		note:
			workExpStatus === "match" || workExpStatus === "bonus"
				? "Bonus"
				: undefined,
	};

	return {
		gpa,
		ielts,
		budget,
		workExp,
	};
}

/**
 * Get status color for UI rendering
 */
export function getGapStatusColor(status: GapStatus): {
	bg: string;
	text: string;
	border: string;
} {
	switch (status) {
		case "clear":
		case "match":
		case "bonus":
			return {
				bg: "bg-green-50 dark:bg-green-950/30",
				text: "text-green-700 dark:text-green-400",
				border: "border-green-200 dark:border-green-800",
			};
		case "gap":
			return {
				bg: "bg-yellow-50 dark:bg-yellow-950/30",
				text: "text-yellow-700 dark:text-yellow-400",
				border: "border-yellow-200 dark:border-yellow-800",
			};
		default:
			return {
				bg: "bg-gray-50 dark:bg-gray-900/30",
				text: "text-gray-600 dark:text-gray-400",
				border: "border-gray-200 dark:border-gray-700",
			};
	}
}
