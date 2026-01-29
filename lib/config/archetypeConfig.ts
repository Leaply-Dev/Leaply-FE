/**
 * Archetype Configuration for Persona Lab
 *
 * Defines the 8 archetype types with their visual styling, descriptions,
 * rarity percentages, and essay strength recommendations.
 *
 * These archetypes are unified with the backend ArchetypeType enum.
 */

export type ArchetypeKey =
	| "innovator"
	| "scholar"
	| "bridge_builder"
	| "advocate"
	| "pioneer"
	| "resilient"
	| "creator"
	| "leader";

export interface ArchetypeConfig {
	title: string;
	titleVi: string;
	tagline: string;
	taglineVi: string;
	description: string;
	descriptionVi: string;
	essayStrengths: string[];
	essayStrengthsVi: string[];
	color: string;
	image: string;
	rarity: number; // Percentage of users with this archetype
}

export const ARCHETYPE_CONFIG: Record<ArchetypeKey, ArchetypeConfig> = {
	innovator: {
		title: "The Innovator",
		titleVi: "Người Tiên Phong",
		tagline: "Creating novel solutions to complex problems",
		taglineVi: "Tạo ra giải pháp mới cho những vấn đề phức tạp",
		description:
			"You see possibilities where others see obstacles. Your mind naturally gravitates toward improvement and invention.",
		descriptionVi:
			"Bạn nhìn thấy cơ hội nơi người khác thấy trở ngại. Tâm trí bạn tự nhiên hướng đến cải tiến và sáng chế.",
		essayStrengths: [
			"Problem-solving narratives",
			"Technical creativity",
			"Future-oriented vision",
		],
		essayStrengthsVi: [
			"Kể chuyện giải quyết vấn đề",
			"Sáng tạo kỹ thuật",
			"Tầm nhìn hướng tương lai",
		],
		color: "#10B981",
		image: "/images/archetypes/innovator.svg",
		rarity: 12,
	},
	scholar: {
		title: "The Scholar",
		titleVi: "Học Giả",
		tagline: "Driven by intellectual curiosity and depth",
		taglineVi: "Được thúc đẩy bởi sự tò mò trí tuệ và chiều sâu",
		description:
			"Knowledge isn't just useful to you—it's exciting. You pursue understanding for its own sake.",
		descriptionVi:
			"Kiến thức không chỉ hữu ích với bạn—nó còn thú vị. Bạn theo đuổi sự hiểu biết vì chính nó.",
		essayStrengths: [
			"Research motivation",
			"Intellectual journey",
			"Deep expertise",
		],
		essayStrengthsVi: [
			"Động lực nghiên cứu",
			"Hành trình trí tuệ",
			"Chuyên môn sâu",
		],
		color: "#8B5CF6",
		image: "/images/archetypes/scholar.svg",
		rarity: 15,
	},
	bridge_builder: {
		title: "The Bridge Builder",
		titleVi: "Người Kết Nối",
		tagline: "Connecting disparate worlds and people",
		taglineVi: "Kết nối các thế giới và con người khác nhau",
		description:
			"You thrive at intersections—between cultures, disciplines, or communities. Your strength lies in translation and synthesis.",
		descriptionVi:
			"Bạn tỏa sáng ở những giao điểm—giữa các văn hóa, ngành nghề, hay cộng đồng. Sức mạnh của bạn nằm ở khả năng kết nối và tổng hợp.",
		essayStrengths: [
			"Cross-cultural narratives",
			"Interdisciplinary thinking",
			"Collaboration stories",
		],
		essayStrengthsVi: [
			"Câu chuyện đa văn hóa",
			"Tư duy liên ngành",
			"Câu chuyện hợp tác",
		],
		color: "#3B82F6",
		image: "/images/archetypes/bridge_builder.svg",
		rarity: 10,
	},
	advocate: {
		title: "The Advocate",
		titleVi: "Người Vận Động",
		tagline: "Fighting for causes and communities",
		taglineVi: "Đấu tranh cho các mục đích và cộng đồng",
		description:
			"You're driven by purpose beyond personal gain. You channel your energy toward meaningful impact.",
		descriptionVi:
			"Bạn được thúc đẩy bởi mục đích lớn hơn lợi ích cá nhân. Bạn dồn năng lượng vào những tác động có ý nghĩa.",
		essayStrengths: [
			"Social impact narratives",
			"Community leadership",
			"Values-driven decisions",
		],
		essayStrengthsVi: [
			"Câu chuyện tác động xã hội",
			"Lãnh đạo cộng đồng",
			"Quyết định theo giá trị",
		],
		color: "#EC4899",
		image: "/images/archetypes/advocate.svg",
		rarity: 11,
	},
	pioneer: {
		title: "The Pioneer",
		titleVi: "Người Mở Đường",
		tagline: "Venturing into uncharted territory",
		taglineVi: "Dám bước vào lãnh thổ chưa được khám phá",
		description:
			"You're drawn to firsts—first in your family, first to try something new. Uncertainty motivates you.",
		descriptionVi:
			"Bạn bị thu hút bởi những cái 'đầu tiên'—người đầu tiên trong gia đình, người đầu tiên thử điều mới. Sự không chắc chắn thúc đẩy bạn.",
		essayStrengths: [
			"First-generation narratives",
			"Risk-taking stories",
			"Trailblazing moments",
		],
		essayStrengthsVi: [
			"Câu chuyện thế hệ đầu tiên",
			"Câu chuyện dám mạo hiểm",
			"Những khoảnh khắc tiên phong",
		],
		color: "#F59E0B",
		image: "/images/archetypes/pioneer.svg",
		rarity: 9,
	},
	resilient: {
		title: "The Resilient",
		titleVi: "Người Kiên Cường",
		tagline: "Transforming challenges into growth",
		taglineVi: "Biến thách thức thành động lực phát triển",
		description:
			"Your story is defined by how you responded to setbacks. Setbacks become setups for comebacks.",
		descriptionVi:
			"Câu chuyện của bạn được định nghĩa bởi cách bạn phản ứng trước thất bại. Thất bại trở thành bước đệm cho sự trở lại.",
		essayStrengths: [
			"Overcoming adversity",
			"Growth from failure",
			"Perseverance stories",
		],
		essayStrengthsVi: [
			"Vượt qua nghịch cảnh",
			"Phát triển từ thất bại",
			"Câu chuyện kiên trì",
		],
		color: "#EF4444",
		image: "/images/archetypes/resilient.svg",
		rarity: 13,
	},
	creator: {
		title: "The Creator",
		titleVi: "Người Sáng Tạo",
		tagline: "Expressing ideas through artistic vision",
		taglineVi: "Thể hiện ý tưởng qua tầm nhìn nghệ thuật",
		description:
			"You see the world through a unique lens and feel compelled to express your perspective through creative means.",
		descriptionVi:
			"Bạn nhìn thế giới qua một lăng kính độc đáo và cảm thấy thôi thúc thể hiện góc nhìn của mình qua sáng tạo.",
		essayStrengths: [
			"Artistic journey stories",
			"Creative problem-solving",
			"Unique perspective narratives",
		],
		essayStrengthsVi: [
			"Câu chuyện hành trình nghệ thuật",
			"Giải quyết vấn đề sáng tạo",
			"Góc nhìn độc đáo",
		],
		color: "#A855F7",
		image: "/images/archetypes/creator.svg",
		rarity: 12,
	},
	leader: {
		title: "The Leader",
		titleVi: "Người Lãnh Đạo",
		tagline: "Inspiring and guiding others toward goals",
		taglineVi: "Truyền cảm hứng và dẫn dắt người khác đạt mục tiêu",
		description:
			"You naturally step up when situations call for direction. Leadership for you isn't about authority—it's about empowering those around you.",
		descriptionVi:
			"Bạn tự nhiên bước lên khi tình huống cần sự dẫn dắt. Lãnh đạo với bạn không phải về quyền lực—mà về trao quyền cho những người xung quanh.",
		essayStrengths: [
			"Team leadership stories",
			"Challenge and growth narratives",
			"Vision and impact examples",
		],
		essayStrengthsVi: [
			"Câu chuyện lãnh đạo đội nhóm",
			"Thử thách và phát triển",
			"Tầm nhìn và tác động",
		],
		color: "#14B8A6",
		image: "/images/archetypes/leader.svg",
		rarity: 18,
	},
} as const;

/**
 * Get archetype config by type
 */
export function getArchetypeConfig(
	type: ArchetypeKey | string | undefined | null,
): ArchetypeConfig | null {
	if (!type) return null;
	const normalizedType = type.toLowerCase() as ArchetypeKey;
	return ARCHETYPE_CONFIG[normalizedType] ?? null;
}

/**
 * All archetype types for iteration
 */
export const ARCHETYPE_TYPES = Object.keys(ARCHETYPE_CONFIG) as ArchetypeKey[];
