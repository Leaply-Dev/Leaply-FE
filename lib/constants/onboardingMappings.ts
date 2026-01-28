/**
 * Onboarding field mappings
 *
 * Maps localized display labels to backend enum keys.
 * These are used to transform user selections before sending to the API.
 */

/**
 * Maps field of study display labels to backend TargetField enum values
 *
 * Backend enum: cs_it, business, finance, engineering, data_science, design, health, arts, media_communication, science, humanities, law, other
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
	"Nghệ thuật": "arts",
	"Truyền thông & Báo chí": "media_communication",
	"Khoa học (Sinh, Hóa, Toán, Lý)": "science",
	"Nhân văn": "humanities",
	Luật: "law",
	"Khác / Chưa xác định": "other",

	// English labels (for future i18n support)
	"Computer Science / IT": "cs_it",
	"Business / Management": "business",
	"Economics / Finance": "finance",
	Engineering: "engineering",
	"Data Science / Analytics": "data_science",
	"Design (UX/UI, Industrial)": "design",
	"Public Health / Healthcare": "health",
	Arts: "arts",
	"Media & Communication": "media_communication",
	"Science (Bio, Chem, Math, Physics)": "science",
	Humanities: "humanities",
	Law: "law",
	"Other / Undecided": "other",

	// Also support direct enum keys (passthrough)
	cs_it: "cs_it",
	business: "business",
	finance: "finance",
	engineering: "engineering",
	data_science: "data_science",
	design: "design",
	health: "health",
	arts: "arts",
	media_communication: "media_communication",
	science: "science",
	humanities: "humanities",
	law: "law",
	other: "other",
};

/**
 * Maps region display labels to backend TargetRegion enum values
 *
 * Backend enum: east_asia, southeast_asia, western_europe, central_europe, northern_europe, north_america, oceania
 */
export const REGION_LABEL_TO_KEY: Record<string, string> = {
	// Vietnamese labels
	"Đông Á": "east_asia",
	"Đông Nam Á": "southeast_asia",
	"Tây Âu": "western_europe",
	"Trung Âu": "central_europe",
	"Bắc Âu": "northern_europe",
	"Bắc Mỹ": "north_america",
	"Châu Đại Dương": "oceania",

	// English labels (for future i18n support)
	"East Asia": "east_asia",
	"Southeast Asia": "southeast_asia",
	"Western Europe": "western_europe",
	"Central Europe": "central_europe",
	"Northern Europe": "northern_europe",
	"North America": "north_america",
	Oceania: "oceania",

	// Also support direct enum keys (passthrough)
	east_asia: "east_asia",
	southeast_asia: "southeast_asia",
	western_europe: "western_europe",
	central_europe: "central_europe",
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

export function mapFieldsToKeys(labels: string[]): string[] {
	return labels
		.map((label) => FIELD_LABEL_TO_KEY[label])
		.filter((key): key is string => key !== undefined);
}

export function mapRegionsToKeys(labels: string[]): string[] {
	return labels
		.map((label) => REGION_LABEL_TO_KEY[label])
		.filter((key): key is string => key !== undefined);
}

export function mapBudgetIndexToKey(index: number): string {
	return BUDGET_INDEX_TO_KEY[index] ?? "500m_1b";
}

export function mapBudgetLabelToKey(label: string): string {
	return BUDGET_LABEL_TO_KEY[label] ?? "500m_1b";
}

// ============================================
// Reverse mappings (key → label for display)
// ============================================

/**
 * Maps backend enum keys to Vietnamese display labels
 */
export const FIELD_KEY_TO_LABEL: Record<string, string> = {
	cs_it: "Khoa học máy tính / IT",
	business: "Kinh doanh / Quản trị",
	finance: "Kinh tế / Tài chính",
	engineering: "Khoa học kỹ thuật",
	data_science: "Khoa học Dữ liệu / Phân tích",
	design: "Thiết kế (UX/UI, Công nghiệp)",
	health: "Y tế cộng đồng / Y tế",
	arts: "Nghệ thuật",
	media_communication: "Truyền thông & Báo chí",
	science: "Khoa học (Sinh, Hóa, Toán, Lý)",
	humanities: "Nhân văn",
	law: "Luật",
	other: "Khác / Chưa xác định",
};

export const REGION_KEY_TO_LABEL: Record<string, string> = {
	east_asia: "Đông Á",
	southeast_asia: "Đông Nam Á",
	western_europe: "Tây Âu",
	central_europe: "Trung Âu",
	northern_europe: "Bắc Âu",
	north_america: "Bắc Mỹ",
	oceania: "Châu Đại Dương",
};

export const BUDGET_KEY_TO_LABEL: Record<string, string> = {
	under_500m: "<500 triệu",
	"500m_1b": "500 triệu - 1 tỷ",
	over_1b: ">1 tỷ",
	need_full_scholarship: "Cần học bổng full",
};

export function mapFieldKeyToLabel(key: string): string {
	return FIELD_KEY_TO_LABEL[key] ?? key;
}

export function mapRegionKeyToLabel(key: string): string {
	return REGION_KEY_TO_LABEL[key] ?? key;
}

export function mapBudgetKeyToLabel(key: string): string {
	return BUDGET_KEY_TO_LABEL[key] ?? key;
}

export const FIELD_OPTIONS = Object.entries(FIELD_KEY_TO_LABEL).map(
	([value, label]) => ({ value, label }),
);

export const REGION_OPTIONS = Object.entries(REGION_KEY_TO_LABEL).map(
	([value, label]) => ({ value, label }),
);

export const BUDGET_OPTIONS = Object.entries(BUDGET_KEY_TO_LABEL).map(
	([value, label]) => ({ value, label }),
);
