/**
 * Persona Lab intake (2-Pillar redesign) — static taxonomies for the intake form UI.
 *
 * Sub-field taxonomy is keyed by `UserProfile.targetFields[0]` from onboarding
 * (the 8 fields defined in `app/onboarding/step2.fields`: cs, business, finance,
 * engineering, dataScience, design, health, other). See
 * `Leaply-BE/docs/persona-lab/sub-field-taxonomy.md` (DP2) and
 * `Leaply-BE/docs/persona-lab/impact-areas.md` (DP1) for source of truth.
 */

/**
 * Keys match backend `TargetField` enum (see `lib/constants/onboardingMappings.ts`):
 * cs_it, business, finance, engineering, data_science, design, health, other.
 * Backend also defines `arts`, `media_communication`, `science`, `humanities`, `law`
 * which fall through to the "other" free-text branch in the intake form.
 */
export type TargetFieldKey =
	| "cs_it"
	| "business"
	| "finance"
	| "engineering"
	| "data_science"
	| "design"
	| "health"
	| "other";

export interface IntakeOption {
	value: string;
	labelEn: string;
	labelVi: string;
}

export const SUB_FIELDS_BY_TARGET: Record<TargetFieldKey, IntakeOption[]> = {
	cs_it: [
		{
			value: "ai_ml",
			labelEn: "Artificial Intelligence & Machine Learning",
			labelVi: "Trí tuệ nhân tạo & học máy",
		},
		{
			value: "hci",
			labelEn: "Human-Computer Interaction",
			labelVi: "Tương tác người-máy",
		},
		{
			value: "security",
			labelEn: "Cybersecurity & Cryptography",
			labelVi: "An ninh mạng & mật mã",
		},
		{
			value: "distributed_systems",
			labelEn: "Distributed Systems & Cloud",
			labelVi: "Hệ thống phân tán & điện toán đám mây",
		},
		{
			value: "software_engineering",
			labelEn: "Software Engineering & Dev Tools",
			labelVi: "Kỹ thuật phần mềm & công cụ lập trình",
		},
		{
			value: "programming_languages",
			labelEn: "Programming Languages & Formal Methods",
			labelVi: "Ngôn ngữ lập trình & phương pháp hình thức",
		},
	],
	business: [
		{
			value: "strategy",
			labelEn: "Strategy & General Management",
			labelVi: "Chiến lược & quản trị tổng quát",
		},
		{
			value: "marketing",
			labelEn: "Marketing & Consumer Behavior",
			labelVi: "Marketing & hành vi người tiêu dùng",
		},
		{
			value: "operations",
			labelEn: "Operations & Supply Chain",
			labelVi: "Vận hành & chuỗi cung ứng",
		},
		{
			value: "entrepreneurship",
			labelEn: "Entrepreneurship & Innovation",
			labelVi: "Khởi nghiệp & đổi mới sáng tạo",
		},
		{
			value: "org_behavior",
			labelEn: "Organizational Behavior & HR",
			labelVi: "Hành vi tổ chức & nhân sự",
		},
		{
			value: "international_business",
			labelEn: "International Business",
			labelVi: "Kinh doanh quốc tế",
		},
	],
	finance: [
		{
			value: "corporate_finance",
			labelEn: "Corporate Finance & Valuation",
			labelVi: "Tài chính doanh nghiệp & định giá",
		},
		{
			value: "investment",
			labelEn: "Investment Management & Asset Pricing",
			labelVi: "Quản lý đầu tư & định giá tài sản",
		},
		{
			value: "financial_econ",
			labelEn: "Financial Economics",
			labelVi: "Kinh tế học tài chính",
		},
		{
			value: "quant_finance",
			labelEn: "Quantitative Finance",
			labelVi: "Tài chính định lượng",
		},
		{
			value: "banking_risk",
			labelEn: "Banking & Risk Management",
			labelVi: "Ngân hàng & quản trị rủi ro",
		},
		{
			value: "development_econ",
			labelEn: "Development Economics",
			labelVi: "Kinh tế phát triển",
		},
	],
	engineering: [
		{
			value: "electrical",
			labelEn: "Electrical & Electronics",
			labelVi: "Kỹ thuật điện & điện tử",
		},
		{
			value: "mechanical",
			labelEn: "Mechanical Engineering",
			labelVi: "Kỹ thuật cơ khí",
		},
		{
			value: "civil_env",
			labelEn: "Civil & Environmental",
			labelVi: "Kỹ thuật dân dụng & môi trường",
		},
		{
			value: "chemical_materials",
			labelEn: "Chemical & Materials",
			labelVi: "Kỹ thuật hóa học & vật liệu",
		},
		{
			value: "robotics",
			labelEn: "Robotics & Mechatronics",
			labelVi: "Robot & cơ điện tử",
		},
		{
			value: "energy_systems",
			labelEn: "Energy Systems",
			labelVi: "Kỹ thuật hệ thống năng lượng",
		},
	],
	data_science: [
		{
			value: "applied_stats",
			labelEn: "Applied Statistics & Causal Inference",
			labelVi: "Thống kê ứng dụng & suy luận nhân quả",
		},
		{
			value: "business_analytics",
			labelEn: "Business Analytics & Decision Science",
			labelVi: "Phân tích kinh doanh & khoa học quyết định",
		},
		{
			value: "computational_social",
			labelEn: "Computational Social Science",
			labelVi: "Khoa học xã hội tính toán",
		},
		{
			value: "data_eng_mlops",
			labelEn: "Data Engineering & MLOps",
			labelVi: "Kỹ thuật dữ liệu & MLOps",
		},
		{
			value: "bioinformatics",
			labelEn: "Bioinformatics & Computational Biology",
			labelVi: "Tin sinh học",
		},
		{
			value: "policy_analytics",
			labelEn: "Public Policy Analytics",
			labelVi: "Phân tích chính sách công",
		},
	],
	design: [
		{
			value: "ux_product",
			labelEn: "UX / Product Design",
			labelVi: "Thiết kế trải nghiệm & sản phẩm",
		},
		{
			value: "graphic",
			labelEn: "Graphic & Visual Communication",
			labelVi: "Thiết kế đồ họa & truyền thông thị giác",
		},
		{
			value: "industrial",
			labelEn: "Industrial & Product Design",
			labelVi: "Thiết kế công nghiệp & sản phẩm",
		},
		{
			value: "interaction_service",
			labelEn: "Interaction & Service Design",
			labelVi: "Thiết kế tương tác & dịch vụ",
		},
		{
			value: "architecture_urban",
			labelEn: "Architecture & Urban Design",
			labelVi: "Kiến trúc & thiết kế đô thị",
		},
		{
			value: "design_research",
			labelEn: "Design Research & Systems",
			labelVi: "Nghiên cứu thiết kế & hệ thống",
		},
	],
	health: [
		{
			value: "public_health",
			labelEn: "Public Health & Epidemiology",
			labelVi: "Y tế công cộng & dịch tễ học",
		},
		{
			value: "global_health_policy",
			labelEn: "Global Health & Policy",
			labelVi: "Y tế toàn cầu & chính sách y tế",
		},
		{
			value: "clinical_research",
			labelEn: "Clinical Research",
			labelVi: "Nghiên cứu lâm sàng",
		},
		{
			value: "biomedical",
			labelEn: "Biomedical Sciences",
			labelVi: "Khoa học y sinh",
		},
		{
			value: "nutrition",
			labelEn: "Nutrition & Food Science",
			labelVi: "Dinh dưỡng & khoa học thực phẩm",
		},
		{
			value: "digital_health",
			labelEn: "Health Informatics & Digital Health",
			labelVi: "Tin học y tế & y tế số",
		},
	],
	other: [],
};

export const ROLE_TYPE_OPTIONS: IntakeOption[] = [
	{
		value: "engineer",
		labelEn: "Engineer / Builder",
		labelVi: "Kỹ sư / Người xây dựng",
	},
	{
		value: "researcher",
		labelEn: "Researcher / Academic",
		labelVi: "Nhà nghiên cứu / Học giả",
	},
	{
		value: "product_manager",
		labelEn: "Product Manager",
		labelVi: "Quản lý sản phẩm",
	},
	{
		value: "founder",
		labelEn: "Founder / Entrepreneur",
		labelVi: "Nhà sáng lập / Doanh nhân",
	},
	{
		value: "analyst",
		labelEn: "Analyst / Strategist",
		labelVi: "Chuyên viên phân tích / Chiến lược",
	},
	{
		value: "policy",
		labelEn: "Policy / Public Sector",
		labelVi: "Chính sách / Khu vực công",
	},
	{
		value: "consultant",
		labelEn: "Consultant / Advisor",
		labelVi: "Tư vấn viên",
	},
];

export const TIMELINE_OPTIONS: IntakeOption[] = [
	{ value: "3_years", labelEn: "Next 3 years", labelVi: "3 năm tới" },
	{ value: "5_years", labelEn: "Next 5 years", labelVi: "5 năm tới" },
	{ value: "10_years", labelEn: "Next 10 years", labelVi: "10 năm tới" },
];

export const ESSAY_TRACK_OPTIONS: IntakeOption[] = [
	{
		value: "scholarship",
		labelEn: "Scholarship essay (contribution-focused)",
		labelVi: "Essay học bổng (tập trung đóng góp)",
	},
	{
		value: "general",
		labelEn: "General admission / SOP",
		labelVi: "SOP / hồ sơ tuyển sinh thông thường",
	},
	{
		value: "both",
		labelEn: "Both scholarship and general",
		labelVi: "Cả hai loại essay",
	},
];

export const SOCIAL_ASPECT_OPTIONS: IntakeOption[] = [
	{ value: "gender", labelEn: "Gender equity", labelVi: "Bình đẳng giới" },
	{
		value: "income",
		labelEn: "Income & poverty",
		labelVi: "Thu nhập & nghèo đói",
	},
	{
		value: "access",
		labelEn: "Access & inclusion",
		labelVi: "Tiếp cận & hòa nhập",
	},
	{
		value: "environmental",
		labelEn: "Environmental sustainability",
		labelVi: "Bền vững môi trường",
	},
	{
		value: "policy",
		labelEn: "Policy & governance",
		labelVi: "Chính sách & quản trị",
	},
];

export const PRIOR_EXPOSURE_OPTIONS: IntakeOption[] = [
	{
		value: "yes",
		labelEn: "Yes, direct hands-on experience",
		labelVi: "Có, tôi đã trực tiếp tham gia",
	},
	{
		value: "indirect",
		labelEn: "Indirect (reading, family, friends)",
		labelVi: "Gián tiếp (đọc/gia đình/bạn bè)",
	},
	{
		value: "no",
		labelEn: "No, this is new to me",
		labelVi: "Chưa, đây là điều mới với tôi",
	},
];

export const IMPACT_AREA_OPTIONS: IntakeOption[] = [
	{
		value: "waste_management",
		labelEn: "Waste Management",
		labelVi: "Quản lý rác thải",
	},
	{
		value: "climate_adaptation",
		labelEn: "Climate Adaptation",
		labelVi: "Thích ứng biến đổi khí hậu",
	},
	{
		value: "renewable_energy",
		labelEn: "Renewable Energy Transition",
		labelVi: "Chuyển đổi năng lượng tái tạo",
	},
	{
		value: "air_quality",
		labelEn: "Air Quality & Pollution",
		labelVi: "Chất lượng không khí & ô nhiễm",
	},
	{
		value: "water_sanitation",
		labelEn: "Water & Sanitation",
		labelVi: "Nước sạch & vệ sinh",
	},
	{
		value: "education_access",
		labelEn: "Education Access",
		labelVi: "Tiếp cận giáo dục",
	},
	{
		value: "education_quality",
		labelEn: "Education Quality & Reform",
		labelVi: "Chất lượng & cải cách giáo dục",
	},
	{
		value: "gender_equity",
		labelEn: "Gender Equity",
		labelVi: "Bình đẳng giới",
	},
	{
		value: "mental_health",
		labelEn: "Mental Health",
		labelVi: "Sức khỏe tinh thần",
	},
	{
		value: "rural_development",
		labelEn: "Rural Development",
		labelVi: "Phát triển nông thôn",
	},
	{
		value: "digital_inclusion",
		labelEn: "Digital Inclusion",
		labelVi: "Bao trùm số",
	},
	{
		value: "healthcare_access",
		labelEn: "Healthcare Access",
		labelVi: "Tiếp cận y tế",
	},
	{
		value: "disability_inclusion",
		labelEn: "Disability Inclusion",
		labelVi: "Hòa nhập cho người khuyết tật",
	},
	{
		value: "ethnic_minority",
		labelEn: "Ethnic Minority Rights",
		labelVi: "Quyền dân tộc thiểu số",
	},
	{ value: "lgbtq", labelEn: "LGBTQ+ Rights", labelVi: "Quyền LGBTQ+" },
	{
		value: "labor_rights",
		labelEn: "Labor Rights & Informal Economy",
		labelVi: "Quyền lao động & kinh tế phi chính thức",
	},
	{
		value: "public_policy",
		labelEn: "Public Policy & Governance",
		labelVi: "Chính sách công & quản trị",
	},
	{
		value: "anti_corruption",
		labelEn: "Anti-Corruption & Transparency",
		labelVi: "Chống tham nhũng & minh bạch",
	},
	{
		value: "financial_inclusion",
		labelEn: "Financial Inclusion",
		labelVi: "Tài chính bao trùm",
	},
	{
		value: "cultural_heritage",
		labelEn: "Cultural Heritage Preservation",
		labelVi: "Bảo tồn di sản văn hóa",
	},
];

export const MAX_IMPACT_AREAS = 2;

export function essayTrackRequiresPillar2(track: string | undefined): boolean {
	return track === "scholarship" || track === "both";
}

export function totalSectionsFor(track: string | undefined): 2 | 3 {
	return essayTrackRequiresPillar2(track) ? 3 : 2;
}

export function getSubFieldOptions(
	targetFieldKey: string | undefined,
): IntakeOption[] {
	if (!targetFieldKey) return [];
	return SUB_FIELDS_BY_TARGET[targetFieldKey as TargetFieldKey] ?? [];
}
