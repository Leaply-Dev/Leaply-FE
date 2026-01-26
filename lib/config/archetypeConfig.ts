/**
 * Archetype Configuration for Persona Lab
 *
 * Defines the 6 archetype types with their visual styling, descriptions,
 * and essay strength recommendations.
 */

import { ArchetypeDtoType } from "@/lib/generated/api/models";

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
}

export const ARCHETYPE_CONFIG: Record<ArchetypeDtoType, ArchetypeConfig> = {
	[ArchetypeDtoType.innovator]: {
		title: "The Innovator",
		titleVi: "Người Tiên Phong",
		tagline: "Creating novel solutions to complex problems",
		taglineVi: "Tạo ra giải pháp mới cho những vấn đề phức tạp",
		description:
			"You see possibilities where others see obstacles. Your mind naturally gravitates toward new approaches and unconventional solutions. You thrive when given the freedom to experiment and reimagine how things could be done.",
		descriptionVi:
			"Bạn nhìn thấy cơ hội nơi người khác thấy trở ngại. Tâm trí bạn tự nhiên hướng đến những cách tiếp cận mới và giải pháp độc đáo. Bạn tỏa sáng khi được tự do thử nghiệm và tái định hình cách làm việc.",
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
	},
	[ArchetypeDtoType.community_builder]: {
		title: "The Community Builder",
		titleVi: "Người Xây Dựng Cộng Đồng",
		tagline: "Connecting people and building relationships",
		taglineVi: "Kết nối mọi người và xây dựng mối quan hệ",
		description:
			"You have a natural gift for bringing people together. You understand that meaningful change happens through collaboration and relationships. Your strength lies in creating spaces where diverse voices can be heard and valued.",
		descriptionVi:
			"Bạn có năng khiếu tự nhiên trong việc gắn kết mọi người. Bạn hiểu rằng thay đổi có ý nghĩa xảy ra thông qua hợp tác và các mối quan hệ. Điểm mạnh của bạn nằm ở việc tạo ra không gian nơi những tiếng nói đa dạng được lắng nghe và trân trọng.",
		essayStrengths: [
			"Collaboration stories",
			"Leadership through service",
			"Cross-cultural experiences",
		],
		essayStrengthsVi: [
			"Câu chuyện hợp tác",
			"Lãnh đạo phục vụ",
			"Trải nghiệm đa văn hóa",
		],
		color: "#3B82F6",
		image: "/images/archetypes/community_builder.svg",
	},
	[ArchetypeDtoType.scholar]: {
		title: "The Scholar",
		titleVi: "Học Giả",
		tagline: "Driven by intellectual curiosity and depth",
		taglineVi: "Được thúc đẩy bởi sự tò mò trí tuệ và chiều sâu",
		description:
			"Your passion for learning goes beyond grades and degrees. You dive deep into subjects that fascinate you, seeking to understand not just the 'what' but the 'why.' Knowledge, to you, is a lifelong pursuit.",
		descriptionVi:
			"Đam mê học hỏi của bạn vượt xa điểm số và bằng cấp. Bạn đào sâu vào những chủ đề hấp dẫn, tìm kiếm hiểu không chỉ 'cái gì' mà còn 'tại sao.' Với bạn, kiến thức là hành trình suốt đời.",
		essayStrengths: [
			"Research experiences",
			"Academic passion projects",
			"Intellectual growth narratives",
		],
		essayStrengthsVi: [
			"Kinh nghiệm nghiên cứu",
			"Dự án đam mê học thuật",
			"Câu chuyện phát triển trí tuệ",
		],
		color: "#8B5CF6",
		image: "/images/archetypes/scholar.svg",
	},
	[ArchetypeDtoType.creative]: {
		title: "The Creative",
		titleVi: "Người Sáng Tạo",
		tagline: "Expressing ideas through artistic vision",
		taglineVi: "Thể hiện ý tưởng qua tầm nhìn nghệ thuật",
		description:
			"You see the world through a unique lens and feel compelled to express your perspective. Whether through art, writing, music, or design, creativity is how you make sense of life and share your vision with others.",
		descriptionVi:
			"Bạn nhìn thế giới qua một lăng kính độc đáo và cảm thấy thôi thúc thể hiện góc nhìn của mình. Dù qua nghệ thuật, viết lách, âm nhạc hay thiết kế, sáng tạo là cách bạn hiểu cuộc sống và chia sẻ tầm nhìn với người khác.",
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
		color: "#EC4899",
		image: "/images/archetypes/creative.svg",
	},
	[ArchetypeDtoType.leader]: {
		title: "The Leader",
		titleVi: "Người Lãnh Đạo",
		tagline: "Inspiring and guiding others toward goals",
		taglineVi: "Truyền cảm hứng và dẫn dắt người khác đạt mục tiêu",
		description:
			"You naturally step up when situations call for direction. You inspire confidence in others and help teams navigate challenges. Leadership for you isn't about authority—it's about empowering those around you.",
		descriptionVi:
			"Bạn tự nhiên bước lên khi tình huống cần sự dẫn dắt. Bạn truyền niềm tin cho người khác và giúp đội nhóm vượt qua thử thách. Lãnh đạo với bạn không phải về quyền lực—mà về trao quyền cho những người xung quanh.",
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
		color: "#F59E0B",
		image: "/images/archetypes/leader.svg",
	},
	[ArchetypeDtoType.problem_solver]: {
		title: "The Problem Solver",
		titleVi: "Người Giải Quyết Vấn Đề",
		tagline: "Breaking down complex challenges systematically",
		taglineVi: "Phân tích thử thách phức tạp một cách có hệ thống",
		description:
			"You approach challenges with methodical precision. Where others see chaos, you see patterns and solutions waiting to be discovered. Your analytical mindset helps you break down complex problems into manageable pieces.",
		descriptionVi:
			"Bạn tiếp cận thử thách với sự chính xác có phương pháp. Nơi người khác thấy hỗn loạn, bạn thấy quy luật và giải pháp đang chờ được khám phá. Tư duy phân tích giúp bạn chia nhỏ vấn đề phức tạp thành những phần dễ quản lý.",
		essayStrengths: [
			"Analytical thinking examples",
			"Systematic approach stories",
			"Impact through methodology",
		],
		essayStrengthsVi: [
			"Ví dụ tư duy phân tích",
			"Câu chuyện tiếp cận có hệ thống",
			"Tác động qua phương pháp",
		],
		color: "#6366F1",
		image: "/images/archetypes/problem_solver.svg",
	},
} as const;

/**
 * Get archetype config by type
 */
export function getArchetypeConfig(
	type: ArchetypeDtoType | string | undefined,
): ArchetypeConfig | null {
	if (!type) return null;
	return ARCHETYPE_CONFIG[type as ArchetypeDtoType] ?? null;
}

/**
 * All archetype types for iteration
 */
export const ARCHETYPE_TYPES = Object.keys(
	ARCHETYPE_CONFIG,
) as ArchetypeDtoType[];
