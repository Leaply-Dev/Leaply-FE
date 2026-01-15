/**
 * Onboarding field mappings
 *
 * Maps localized display labels to backend enum keys.
 * These are used to transform user selections before sending to the API.
 */

/**
 * Maps field of study display labels to backend TargetField enum values
 *
 * Backend enum: cs_it, business, finance, engineering, data_science, design, health, other
 */
export const FIELD_LABEL_TO_KEY: Record<string, string> = {
	// Vietnamese labels
	"Khoa học máy tính / IT": "cs_it",
	"Kinh doanh / Quản trị": "business",
	"Kinh tế / Tài chính": "finance",
	"Khoa học kỹ thuật": "engineering",
	"Khoa học Dữ liệu / Phân tích": "data_science",
	"Thiết kế (UX/UI, Công nghiệp)": "design",
	"Y tế cộng đồng / Y tế": "health",
	"Khác / Chưa xác định": "other",

	// English labels (for future i18n support)
	"Computer Science / IT": "cs_it",
	"Business / Management": "business",
	"Economics / Finance": "finance",
	Engineering: "engineering",
	"Data Science / Analytics": "data_science",
	"Design (UX/UI, Industrial)": "design",
	"Public Health / Healthcare": "health",
	"Other / Undecided": "other",

	// Also support direct enum keys (passthrough)
	cs_it: "cs_it",
	business: "business",
	finance: "finance",
	engineering: "engineering",
	data_science: "data_science",
	design: "design",
	health: "health",
	other: "other",
};

/**
 * Maps region display labels to backend TargetRegion enum values
 *
 * Backend enum: east_asia, western_europe, northern_europe, north_america, oceania
 * Note: southeast_asia is intentionally excluded from the available options
 */
export const REGION_LABEL_TO_KEY: Record<string, string> = {
	// Vietnamese labels
	"Đông Á": "east_asia",
	"Tây Âu": "western_europe",
	"Bắc Âu": "northern_europe",
	"Bắc Mỹ": "north_america",
	"Châu Đại Dương": "oceania",

	// English labels (for future i18n support)
	"East Asia": "east_asia",
	"Western Europe": "western_europe",
	"Northern Europe": "northern_europe",
	"North America": "north_america",
	Oceania: "oceania",

	// Also support direct enum keys (passthrough)
	east_asia: "east_asia",
	western_europe: "western_europe",
	northern_europe: "northern_europe",
	north_america: "north_america",
	oceania: "oceania",
};

/**
 * Budget range values by slider index
 *
 * Index 0: under_500m      (<500 triệu)
 * Index 1: 500m_1b         (500 triệu - 1 tỷ)
 * Index 2: over_1b         (>1 tỷ)
 * Index 3: need_full_scholarship (Cần học bổng full)
 */
export const BUDGET_INDEX_TO_KEY: string[] = [
	"under_500m",
	"500m_1b",
	"over_1b",
	"need_full_scholarship",
];

/**
 * Maps budget display labels to backend BudgetRange enum values
 *
 * Backend enum: under_500m, 500m_1b, over_1b, need_full_scholarship
 */
export const BUDGET_LABEL_TO_KEY: Record<string, string> = {
	// Vietnamese labels
	"<500 triệu": "under_500m",
	"500 triệu - 1 tỷ": "500m_1b",
	">1 tỷ": "over_1b",
	"Cần học bổng full": "need_full_scholarship",

	// English labels (for future i18n support)
	"Under $50,000/year": "under_500m",
	"$50,000 - $100,000/year": "500m_1b",
	"Over $100,000/year": "over_1b",
	"Need full scholarship": "need_full_scholarship",

	// Also support direct enum keys (passthrough)
	under_500m: "under_500m",
	"500m_1b": "500m_1b",
	over_1b: "over_1b",
	need_full_scholarship: "need_full_scholarship",
};

/**
 * Transform an array of field labels to enum keys
 */
export function mapFieldsToKeys(labels: string[]): string[] {
	return labels
		.map((label) => FIELD_LABEL_TO_KEY[label])
		.filter((key): key is string => key !== undefined);
}

/**
 * Transform an array of region labels to enum keys
 */
export function mapRegionsToKeys(labels: string[]): string[] {
	return labels
		.map((label) => REGION_LABEL_TO_KEY[label])
		.filter((key): key is string => key !== undefined);
}

/**
 * Transform budget slider index to enum key
 */
export function mapBudgetIndexToKey(index: number): string {
	return BUDGET_INDEX_TO_KEY[index] ?? "500m_1b";
}

/**
 * Transform budget label to enum key
 */
export function mapBudgetLabelToKey(label: string): string {
	return BUDGET_LABEL_TO_KEY[label] ?? "500m_1b";
}
