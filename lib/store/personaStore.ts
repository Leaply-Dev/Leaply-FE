import { create } from "zustand";
import { persist } from "zustand/middleware";
import { personaApi } from "@/lib/api/personaApi";

// Discovery Track Types
export type TrackId = "academic" | "activities" | "values" | "future";
export type TrackStatus = "not_started" | "in_progress" | "completed";

export interface TrackQuestion {
	id: string;
	question: string;
	hint?: string;
	required?: boolean;
}

export interface TrackAnswer {
	questionId: string;
	answer: string;
	timestamp: number;
}

export interface DiscoveryTrack {
	id: TrackId;
	title: string;
	description: string;
	icon: string;
	status: TrackStatus;
	currentQuestionIndex: number;
	questions: TrackQuestion[];
	answers: TrackAnswer[];
	completedAt?: number;
}

// Persona Types
export interface PersonalityTag {
	id: string;
	label: string;
	source: TrackId;
	isEditable: boolean;
}

export interface KeyStory {
	id: string;
	title: string;
	summary: string;
	sourceTrack: TrackId;
	sourceQuestionId: string;
	isPinned: boolean;
}

export interface EssayAngle {
	id: string;
	title: string;
	description: string;
	relevantTracks: TrackId[];
	isPinned: boolean;
	suggestedFor?: string[]; // Essay types this angle works well for
}

// Canvas Types
export type NodeLayer = "core" | "summary" | "evidence" | "insight";
export type ViewMode = "list" | "canvas";

export interface VisibleLayers {
	core: boolean;
	summary: boolean;
	evidence: boolean;
	insight: boolean;
}

// Essay Types
export type EssayStatus = "draft" | "submitted" | "reviewed";

export interface EssayFeedback {
	id: string;
	observation: string;
	recommendation: string;
	timestamp: number;
}

export interface Essay {
	id: string;
	schoolName: string;
	schoolId?: string;
	essayType: string;
	prompt: string;
	content: string;
	status: EssayStatus;
	wordCount: number;
	wordLimit?: number;
	feedback: EssayFeedback[];
	createdAt: number;
	updatedAt: number;
}

// Store State
interface PersonaState {
	// Discovery
	tracks: DiscoveryTrack[];
	activeTrackId: TrackId | null;

	// Persona
	personalityTags: PersonalityTag[];
	keyStories: KeyStory[];
	essayAngles: EssayAngle[];

	// Essays
	essays: Essay[];
	selectedEssayId: string | null;

	// API Loading
	isLoading: boolean;
	error: string | null;

	// Canvas
	viewMode: ViewMode;
	selectedNodeId: string | null;
	visibleLayers: VisibleLayers;

	// Discovery Actions
	startTrack: (trackId: TrackId) => void;
	answerQuestion: (
		trackId: TrackId,
		questionId: string,
		answer: string,
	) => void;
	nextQuestion: (trackId: TrackId) => void;
	previousQuestion: (trackId: TrackId) => void;
	completeTrack: (trackId: TrackId) => void;
	setActiveTrack: (trackId: TrackId | null) => void;

	// Persona Actions
	addPersonalityTag: (tag: Omit<PersonalityTag, "id">) => void;
	removePersonalityTag: (tagId: string) => void;
	updatePersonalityTag: (tagId: string, label: string) => void;
	addKeyStory: (story: Omit<KeyStory, "id">) => void;
	toggleStoryPin: (storyId: string) => void;
	toggleAnglePin: (angleId: string) => void;

	// Essay Actions
	addEssay: (
		essay: Omit<Essay, "id" | "createdAt" | "updatedAt" | "wordCount">,
	) => void;
	updateEssay: (essayId: string, updates: Partial<Essay>) => void;
	deleteEssay: (essayId: string) => void;
	addFeedback: (
		essayId: string,
		feedback: Omit<EssayFeedback, "id" | "timestamp">,
	) => void;
	setSelectedEssay: (essayId: string | null) => void;

	// Canvas Actions
	setViewMode: (mode: ViewMode) => void;
	setSelectedNode: (nodeId: string | null) => void;
	setVisibleLayers: (layers: VisibleLayers) => void;
	toggleLayer: (layer: NodeLayer) => void;

	// Utility
	getTrackProgress: () => { completed: number; total: number };
	getCompletedTracks: () => DiscoveryTrack[];
	resetPersona: () => void;

	// Async Actions
	initializeStore: () => Promise<void>;
	generateInsightAsync: (trackId: TrackId) => Promise<void>;
}

// Initial Discovery Tracks
const initialTracks: DiscoveryTrack[] = [
	{
		id: "academic",
		title: "Academic Journey",
		description: "Khám phá hành trình học thuật và những thành tựu của bạn",
		icon: "📚",
		status: "not_started",
		currentQuestionIndex: 0,
		questions: [
			{
				id: "academic-1",
				question: "Môn học nào khiến bạn hứng thú nhất? Tại sao?",
				hint: "Hãy nghĩ về những lúc bạn thực sự tò mò và muốn tìm hiểu sâu hơn",
				required: true,
			},
			{
				id: "academic-2",
				question: "Kể về một dự án học thuật hoặc nghiên cứu bạn tự hào nhất",
				hint: "Có thể là bài luận, project, cuộc thi, hoặc nghiên cứu cá nhân",
				required: true,
			},
			{
				id: "academic-3",
				question: "Thử thách học thuật lớn nhất bạn đã vượt qua là gì?",
				hint: "Hãy mô tả cách bạn đã đối mặt và giải quyết nó",
				required: true,
			},
			{
				id: "academic-4",
				question: "Bạn học tốt nhất theo cách nào?",
				hint: "VD: Thực hành, đọc, thảo luận nhóm, tự nghiên cứu...",
				required: false,
			},
			{
				id: "academic-5",
				question: "Nếu có thể nghiên cứu bất kỳ chủ đề nào, đó sẽ là gì?",
				hint: "Đừng giới hạn bản thân - hãy mơ lớn!",
				required: true,
			},
		],
		answers: [],
	},
	{
		id: "activities",
		title: "Activities & Impact",
		description: "Khám phá những hoạt động và tác động bạn đã tạo ra",
		icon: "🌟",
		status: "not_started",
		currentQuestionIndex: 0,
		questions: [
			{
				id: "activities-1",
				question:
					"Hoạt động ngoại khóa nào bạn dành nhiều thời gian và tâm huyết nhất?",
				hint: "Câu lạc bộ, tình nguyện, thể thao, nghệ thuật, công việc...",
				required: true,
			},
			{
				id: "activities-2",
				question: "Bạn đã đóng vai trò lãnh đạo hoặc khởi xướng điều gì?",
				hint: "Có thể là dự án nhỏ hoặc sáng kiến trong cộng đồng của bạn",
				required: true,
			},
			{
				id: "activities-3",
				question:
					"Kể về một lần bạn giúp đỡ người khác hoặc tạo ra sự thay đổi tích cực",
				hint: "Tập trung vào tác động cụ thể bạn đã tạo ra",
				required: true,
			},
			{
				id: "activities-4",
				question: "Kỹ năng nào bạn đã phát triển qua các hoạt động này?",
				hint: "VD: Làm việc nhóm, giao tiếp, quản lý thời gian, giải quyết vấn đề...",
				required: false,
			},
			{
				id: "activities-5",
				question:
					"Nếu có thêm thời gian và nguồn lực, bạn muốn làm điều gì để giúp đỡ cộng đồng?",
				required: true,
			},
		],
		answers: [],
	},
	{
		id: "values",
		title: "Values & Turning Points",
		description: "Khám phá giá trị cốt lõi và những bước ngoặt định hình bạn",
		icon: "💎",
		status: "not_started",
		currentQuestionIndex: 0,
		questions: [
			{
				id: "values-1",
				question: "3 giá trị quan trọng nhất với bạn là gì? Tại sao?",
				hint: "VD: Công bằng, sáng tạo, trung thực, gia đình, tự do...",
				required: true,
			},
			{
				id: "values-2",
				question:
					"Kể về một trải nghiệm đã thay đổi cách bạn nhìn nhận cuộc sống",
				hint: "Có thể là thành công, thất bại, hoặc một sự kiện bất ngờ",
				required: true,
			},
			{
				id: "values-3",
				question:
					"Ai là người ảnh hưởng lớn nhất đến bạn? Họ đã dạy bạn điều gì?",
				hint: "Có thể là người thân, thầy cô, hoặc ai đó bạn ngưỡng mộ",
				required: true,
			},
			{
				id: "values-4",
				question:
					"Bạn đã từng đối mặt với một quyết định khó khăn về đạo đức chưa? Kể về nó",
				hint: "Hãy mô tả cách bạn suy nghĩ và đưa ra quyết định",
				required: false,
			},
			{
				id: "values-5",
				question: "Điều gì khiến bạn khác biệt so với những người xung quanh?",
				hint: "Nghĩ về góc nhìn, kinh nghiệm, hoặc cách tiếp cận độc đáo của bạn",
				required: true,
			},
		],
		answers: [],
	},
	{
		id: "future",
		title: "Future Vision",
		description: "Khám phá ước mơ và tầm nhìn tương lai của bạn",
		icon: "🚀",
		status: "not_started",
		currentQuestionIndex: 0,
		questions: [
			{
				id: "future-1",
				question: "Trong 10 năm nữa, bạn muốn đang làm gì?",
				hint: "Hãy mô tả một ngày lý tưởng trong cuộc sống tương lai",
				required: true,
			},
			{
				id: "future-2",
				question: "Vấn đề nào trên thế giới bạn muốn góp phần giải quyết?",
				hint: "Có thể là vấn đề lớn như biến đổi khí hậu hoặc nhỏ hơn trong cộng đồng",
				required: true,
			},
			{
				id: "future-3",
				question: "Tại sao bạn chọn học đại học ở nước ngoài?",
				hint: "Nghĩ về những gì bạn hy vọng đạt được từ trải nghiệm này",
				required: true,
			},
			{
				id: "future-4",
				question:
					"Bạn muốn phát triển những kỹ năng hoặc kiến thức gì trong đại học?",
				required: false,
			},
			{
				id: "future-5",
				question: "Bạn muốn được nhớ đến như thế nào?",
				hint: "Hãy nghĩ về legacy - di sản bạn muốn để lại",
				required: true,
			},
		],
		answers: [],
	},
];

// Initial Essay Angles for Higher Education (Graduate) Applications
const initialEssayAngles: EssayAngle[] = [
	{
		id: "angle-growth",
		title: "Personal Growth Story",
		description:
			"Kể về một trải nghiệm đã thay đổi bạn và định hình mục tiêu học thuật",
		relevantTracks: ["values", "academic"],
		isPinned: false,
		suggestedFor: ["Personal Statement"],
	},
	{
		id: "angle-passion",
		title: "Research Interest",
		description:
			"Thể hiện niềm đam mê nghiên cứu và lĩnh vực bạn muốn theo đuổi",
		relevantTracks: ["academic", "future"],
		isPinned: false,
		suggestedFor: ["Research Statement", "Why Us Essay"],
	},
	{
		id: "angle-impact",
		title: "Academic & Professional Goals",
		description:
			"Tập trung vào mục tiêu học thuật và nghề nghiệp sau khi tốt nghiệp",
		relevantTracks: ["activities", "future"],
		isPinned: false,
		suggestedFor: ["Personal Statement", "Why Us Essay"],
	},
	{
		id: "angle-identity",
		title: "Unique Perspective",
		description: "Chia sẻ góc nhìn độc đáo bạn mang đến cho chương trình học",
		relevantTracks: ["values"],
		isPinned: false,
		suggestedFor: ["Diversity Essay", "Personal Statement"],
	},
];

// Demo placeholder data for personality tags
const demoPersonalityTags: PersonalityTag[] = [
	{
		id: "tag-1",
		label: "Analytical Thinker",
		source: "academic",
		isEditable: false,
	},
	{
		id: "tag-2",
		label: "Collaborative Leader",
		source: "activities",
		isEditable: false,
	},
	{ id: "tag-3", label: "Impact-Driven", source: "values", isEditable: false },
	{
		id: "tag-4",
		label: "Research-Oriented",
		source: "academic",
		isEditable: true,
	},
	{
		id: "tag-5",
		label: "Cross-Cultural Communicator",
		source: "activities",
		isEditable: true,
	},
	{ id: "tag-6", label: "Systems Thinker", source: "future", isEditable: true },
];

// Demo placeholder data for key stories - rich narratives for Alex Kim
const demoKeyStories: KeyStory[] = [
	{
		id: "story-1",
		title: "Building a Water Quality Monitoring System",
		summary:
			"What started as a school science project became my most impactful work. I designed and deployed an IoT-based water quality monitoring system for 3 rural communities in the Mekong Delta. Working with local fishermen who initially distrusted technology, I learned that the best engineering serves people, not the other way around. The system reduced waterborne diseases by 40% in pilot areas and taught me that real innovation requires deep community engagement.",
		sourceTrack: "academic",
		sourceQuestionId: "academic-2",
		isPinned: true,
	},
	{
		id: "story-2",
		title: "Leading the Environmental Youth Network",
		summary:
			"At 16, I sent 50 cold emails to environmental clubs across Southeast Asia with a wild idea: what if young people collaborated across borders on local environmental projects? Only 3 responded. But from those 3 responses, I built a network of 500+ young environmental advocates across 5 countries. We organized 12 regional workshops and secured $50K in micro-grants. The biggest lesson wasn't about environmentalism—it was about the power of persistence and authentic connection.",
		sourceTrack: "activities",
		sourceQuestionId: "activities-2",
		isPinned: true,
	},
	{
		id: "story-3",
		title: "Overcoming the Fear of Public Speaking",
		summary:
			"In 9th grade, I literally froze during a 2-minute class presentation—couldn't say a word for 30 seconds that felt like hours. That humiliation became my motivation. I joined Toastmasters, initially shaking so badly I had to grip the podium. Two years and 47 speeches later, I delivered a TEDx talk on sustainable innovation to 800+ attendees. Speaking is still nerve-wracking, but I've learned that courage isn't the absence of fear—it's speaking anyway.",
		sourceTrack: "values",
		sourceQuestionId: "values-2",
		isPinned: false,
	},
	{
		id: "story-4",
		title: "Saving the Family Craft Business",
		summary:
			"My grandmother's bamboo weaving business was dying—young people weren't buying traditional handicrafts. Instead of accepting this, I spent my summer break building an e-commerce store, photographing products with natural lighting, and writing stories about each artisan. I introduced sustainable packaging made from rice husks. Revenue increased 60% in one year. More importantly, my grandmother said I gave her work 'meaning for the new generation.' Tradition and innovation aren't opposites.",
		sourceTrack: "activities",
		sourceQuestionId: "activities-3",
		isPinned: false,
	},
	{
		id: "story-5",
		title: "Research on Renewable Energy Access",
		summary:
			"Why don't rural Vietnamese families adopt solar energy even when it saves money? This question drove my independent research interviewing 45 families across 3 provinces. I discovered it wasn't about cost—it was about trust and after-sales support. My findings were published in a local journal and cited by 2 NGOs in their policy recommendations. This research taught me that understanding human behavior is as crucial as understanding technology.",
		sourceTrack: "academic",
		sourceQuestionId: "academic-5",
		isPinned: false,
	},
	{
		id: "story-6",
		title: "Grandmother's Lesson on Sustainability",
		summary:
			"Before I knew the word 'sustainability,' I watched my grandmother harvest rainwater in ceramic jars, compost kitchen waste for her garden, and repair clothes instead of discarding them. She wasn't an environmentalist—she was simply resourceful. Her practices, born from necessity, taught me that sustainability isn't a modern invention but traditional wisdom we've forgotten. My research direction and values trace back to her small garden in District 7.",
		sourceTrack: "values",
		sourceQuestionId: "values-3",
		isPinned: true,
	},
	{
		id: "story-7",
		title: "The Drought That Changed Everything",
		summary:
			"Summer 2022, I volunteered in Ninh Thuận—Vietnam's driest province. I met Mr. Hai, a farmer who lost his entire dragon fruit harvest to drought. He showed me his empty reservoir and said, 'The rain will come back. It always does.' But climate data shows it won't—not the same way. That moment transformed my academic interests from theoretical environmental science to urgently practical water resource management. Mr. Hai's optimism deserves solutions that match it.",
		sourceTrack: "future",
		sourceQuestionId: "future-2",
		isPinned: false,
	},
	{
		id: "story-8",
		title: "The Chemistry Competition Failure",
		summary:
			"I prepared for the National Chemistry Olympiad for 8 months, sacrificing weekends and social life. I placed 47th—not even close to qualifying. The disappointment was crushing. But reviewing my mistakes, I realized I'd been memorizing formulas without understanding underlying principles. I changed my entire learning approach, focused on conceptual understanding, and the following year placed 3rd. That 'failure' taught me more than any victory could have.",
		sourceTrack: "academic",
		sourceQuestionId: "academic-3",
		isPinned: false,
	},
	{
		id: "story-9",
		title: "Mentoring First-Gen Applicants",
		summary:
			"When I started helping first-generation college applicants with their essays, I expected to teach. Instead, I learned. Students from rural provinces shared experiences that challenged my assumptions about opportunity and merit. One student's essay about farming with her mother at 4 AM before school made my own 'challenges' feel privileged. This mentoring experience reshaped how I think about education access and my own responsibility to pay it forward.",
		sourceTrack: "activities",
		sourceQuestionId: "activities-5",
		isPinned: true,
	},
	{
		id: "story-10",
		title: "The Honesty That Cost Me",
		summary:
			"During a group research project, I discovered our data had a significant error that would change our conclusions. Reporting it meant redoing two months of work and potentially affecting everyone's grades. I reported it anyway. Some teammates were angry, but our advisor later said it was the most important lesson we could learn: scientific integrity matters more than convenience. That decision still defines how I approach research.",
		sourceTrack: "values",
		sourceQuestionId: "values-4",
		isPinned: false,
	},
];

// Enhanced demo essay angles
const demoEssayAngles: EssayAngle[] = [
	{
		id: "angle-growth",
		title: "The Intersection of Technology and Tradition",
		description:
			"Explore how your experience modernizing the family business while preserving cultural values demonstrates your ability to bridge innovation with heritage—a unique perspective for sustainability studies.",
		relevantTracks: ["values", "activities"],
		isPinned: true,
		suggestedFor: ["Personal Statement", "Why Us Essay"],
	},
	{
		id: "angle-passion",
		title: "From Local Water Crisis to Global Solutions",
		description:
			"Connect your water monitoring project to your broader vision for environmental engineering, showing how hands-on problem-solving in your community sparked research interests at a global scale.",
		relevantTracks: ["academic", "future"],
		isPinned: true,
		suggestedFor: ["Research Statement", "Personal Statement"],
	},
	{
		id: "angle-impact",
		title: "Building Networks for Systemic Change",
		description:
			"Use your Environmental Youth Network experience to illustrate your understanding that complex problems require collaborative solutions—positioning yourself as someone who builds movements, not just projects.",
		relevantTracks: ["activities", "future"],
		isPinned: false,
		suggestedFor: ["Leadership Essay", "Why Us Essay"],
	},
	{
		id: "angle-identity",
		title: "Finding Voice Through Action",
		description:
			"Your transformation from shy student to TEDx speaker, driven by purpose rather than self-interest, reveals authentic growth and the power of meaningful motivation.",
		relevantTracks: ["values"],
		isPinned: false,
		suggestedFor: ["Diversity Essay", "Personal Statement"],
	},
	{
		id: "angle-research",
		title: "Research as Service",
		description:
			"Frame your research on renewable energy access not just as academic inquiry but as a commitment to democratizing solutions—showing how scholarship and social impact intertwine in your approach.",
		relevantTracks: ["academic", "values"],
		isPinned: false,
		suggestedFor: ["Research Statement", "Why Us Essay"],
	},
];

// Demo essay data for showcase
const demoEssays: Essay[] = [
	{
		id: "demo-essay-1",
		schoolName: "Stanford University",
		schoolId: "stanford",
		essayType: "Personal Statement",
		prompt:
			"The Stanford community is deeply curious and driven to learn in and out of the classroom. Reflect on an idea or experience that makes you genuinely excited about learning.",
		content: `Growing up in Ho Chi Minh City, I never expected that my grandmother's small bamboo weaving workshop would become my greatest classroom. Every summer, I watched her transform simple bamboo strips into intricate patterns, her weathered hands moving with a precision that no machine could replicate.

When I was fifteen, I noticed fewer young people visiting her shop. "Traditional crafts are dying," she told me one evening, her voice carrying both acceptance and sadness. That night, I couldn't sleep. How could something so beautiful, so culturally significant, simply fade away?

I started with a simple question: Could technology save tradition? Using my basic coding skills, I built a small e-commerce website for her products. But more importantly, I documented each weaving technique through video tutorials, creating a digital archive of knowledge that had been passed down for generations.

The project grew beyond what I imagined. Local artisans began reaching out, asking to be featured. I learned about supply chain management, digital marketing, and the delicate balance between modernization and authenticity. When a Hong Kong design studio discovered our platform and commissioned a collaboration collection, I realized that innovation doesn't mean abandoning the past—it means finding new ways to carry it forward.

This experience fundamentally changed how I approach learning. I no longer see subjects as isolated disciplines. When I study economics, I think about sustainable livelihoods. When I code, I imagine preserving cultural heritage. When I research environmental science, I remember my grandmother teaching me that every bamboo grove must be harvested thoughtfully to ensure future growth.

Stanford's interdisciplinary approach excites me because it mirrors this philosophy. I want to explore how technology can amplify rather than replace human creativity, how business models can sustain cultural practices, and how environmental sustainability connects to community resilience.`,
		status: "reviewed",
		wordCount: 298,
		wordLimit: 650,
		feedback: [
			{
				id: "fb-1",
				observation:
					"Your opening with the grandmother's workshop is compelling, but the transition to the e-commerce solution feels a bit rushed. The reader wants to see more of your emotional journey.",
				recommendation:
					"Consider adding a paragraph about your initial failed attempts or doubts. Showing vulnerability makes your eventual success more impactful.",
				timestamp: Date.now() - 86400000 * 2,
			},
			{
				id: "fb-2",
				observation:
					"The connection to Stanford is clear but could be more specific. 'Interdisciplinary approach' is generic.",
				recommendation:
					"Name specific Stanford programs, professors, or initiatives that align with your interests. For example, mention the d.school's design thinking methodology or specific courses that bridge technology and cultural preservation.",
				timestamp: Date.now() - 86400000 * 1,
			},
		],
		createdAt: Date.now() - 86400000 * 7,
		updatedAt: Date.now() - 86400000 * 1,
	},
];

// Demo tracks with completed status for demo
const demoTracks: DiscoveryTrack[] = [
	{
		...initialTracks[0],
		status: "completed",
		completedAt: Date.now() - 86400000 * 7,
		answers: [
			{
				questionId: "academic-1",
				answer:
					"Environmental Science và Chemistry là hai môn khiến tôi hứng thú nhất. Tôi bị cuốn hút bởi cách các hệ sinh thái hoạt động và làm thế nào khoa học có thể giải quyết các vấn đề môi trường thực tế.",
				timestamp: Date.now() - 86400000 * 7,
			},
			{
				questionId: "academic-2",
				answer:
					"Dự án thiết kế hệ thống giám sát chất lượng nước sử dụng IoT cho 3 cộng đồng nông thôn ở Đồng bằng sông Cửu Long.",
				timestamp: Date.now() - 86400000 * 7,
			},
			{
				questionId: "academic-3",
				answer:
					"Thử thách lớn nhất là khi nghiên cứu độc lập về rào cản áp dụng năng lượng mặt trời - tôi phải tự học phương pháp nghiên cứu định tính từ đầu.",
				timestamp: Date.now() - 86400000 * 7,
			},
			{
				questionId: "academic-4",
				answer:
					"Tôi học tốt nhất qua thực hành và dự án thực tế, kết hợp với thảo luận nhóm để mở rộng góc nhìn.",
				timestamp: Date.now() - 86400000 * 7,
			},
			{
				questionId: "academic-5",
				answer:
					"Nếu có thể, tôi muốn nghiên cứu về công nghệ xử lý nước chi phí thấp cho các cộng đồng nông thôn.",
				timestamp: Date.now() - 86400000 * 7,
			},
		],
	},
	{
		...initialTracks[1],
		status: "completed",
		completedAt: Date.now() - 86400000 * 5,
		answers: [
			{
				questionId: "activities-1",
				answer:
					"Environmental Youth Network - mạng lưới thanh niên hoạt động môi trường mà tôi đồng sáng lập và dành phần lớn thời gian ngoại khóa.",
				timestamp: Date.now() - 86400000 * 5,
			},
			{
				questionId: "activities-2",
				answer:
					"Tôi sáng lập và phát triển mạng lưới 500+ thanh niên hoạt động môi trường khắp Đông Nam Á, tổ chức 12 hội thảo khu vực.",
				timestamp: Date.now() - 86400000 * 5,
			},
			{
				questionId: "activities-3",
				answer:
					"Giúp hiện đại hóa doanh nghiệp thủ công truyền thống của gia đình bằng cách giới thiệu e-commerce và bao bì bền vững, tăng doanh thu 60%.",
				timestamp: Date.now() - 86400000 * 5,
			},
			{
				questionId: "activities-4",
				answer:
					"Kỹ năng quản lý dự án, giao tiếp đa văn hóa, gây quỹ và xây dựng quan hệ đối tác.",
				timestamp: Date.now() - 86400000 * 5,
			},
			{
				questionId: "activities-5",
				answer:
					"Tôi muốn tạo một nền tảng kết nối các nhà nghiên cứu trẻ với cộng đồng địa phương để giải quyết vấn đề môi trường.",
				timestamp: Date.now() - 86400000 * 5,
			},
		],
	},
	{
		...initialTracks[2],
		status: "completed",
		completedAt: Date.now() - 86400000 * 3,
		answers: [
			{
				questionId: "values-1",
				answer:
					"Trung thực, Tác động và Sự kiên trì. Tôi tin vào việc làm đúng ngay cả khi không ai nhìn thấy, tạo thay đổi thực sự, và không bỏ cuộc trước khó khăn.",
				timestamp: Date.now() - 86400000 * 3,
			},
			{
				questionId: "values-2",
				answer:
					"Chuyến đi tình nguyện đầu tiên đến vùng bị ảnh hưởng bởi hạn hán đã thay đổi hoàn toàn cách tôi nhìn nhận vai trò của khoa học trong giải quyết vấn đề xã hội.",
				timestamp: Date.now() - 86400000 * 3,
			},
			{
				questionId: "values-3",
				answer:
					"Bà ngoại tôi - người đã dạy tôi rằng giá trị thực sự nằm ở cách ta đối xử với người khác và môi trường xung quanh.",
				timestamp: Date.now() - 86400000 * 3,
			},
			{
				questionId: "values-4",
				answer:
					"Khi phải quyết định có nên công khai sai sót trong báo cáo của nhóm hay không. Tôi chọn trung thực dù biết có thể ảnh hưởng đến điểm số.",
				timestamp: Date.now() - 86400000 * 3,
			},
			{
				questionId: "values-5",
				answer:
					"Khả năng kết nối các lĩnh vực tưởng như không liên quan - từ công nghệ đến văn hóa truyền thống - để tạo ra giải pháp sáng tạo.",
				timestamp: Date.now() - 86400000 * 3,
			},
		],
	},
	{
		...initialTracks[3],
		status: "completed",
		completedAt: Date.now() - 86400000 * 1,
		answers: [
			{
				questionId: "future-1",
				answer:
					"Tôi muốn đang dẫn dắt một nhóm nghiên cứu về công nghệ môi trường bền vững, đồng thời điều hành một social enterprise hỗ trợ cộng đồng nông thôn tiếp cận giải pháp sạch.",
				timestamp: Date.now() - 86400000 * 1,
			},
			{
				questionId: "future-2",
				answer:
					"Tiếp cận nước sạch và năng lượng tái tạo cho các cộng đồng dễ bị tổn thương, đặc biệt trong bối cảnh biến đổi khí hậu.",
				timestamp: Date.now() - 86400000 * 1,
			},
			{
				questionId: "future-3",
				answer:
					"Tôi muốn tiếp cận nghiên cứu tiên tiến, học hỏi từ các chuyên gia hàng đầu, và xây dựng mạng lưới quốc tế để mang kiến thức về phục vụ cộng đồng.",
				timestamp: Date.now() - 86400000 * 1,
			},
			{
				questionId: "future-4",
				answer:
					"Kỹ năng nghiên cứu định lượng, thiết kế hệ thống bền vững, và khả năng chuyển giao công nghệ phù hợp với bối cảnh địa phương.",
				timestamp: Date.now() - 86400000 * 1,
			},
			{
				questionId: "future-5",
				answer:
					"Tôi muốn được nhớ đến như người đã giúp cầu nối giữa nghiên cứu khoa học và nhu cầu thực tế của cộng đồng, tạo ra những thay đổi có ý nghĩa lâu dài.",
				timestamp: Date.now() - 86400000 * 1,
			},
		],
	},
];

export const usePersonaStore = create<PersonaState>()(
	persist(
		(set, get) => ({
			// Initial State - with demo data for showcase
			tracks: demoTracks,
			activeTrackId: null,
			personalityTags: demoPersonalityTags,
			keyStories: demoKeyStories,
			essayAngles: demoEssayAngles,
			essays: demoEssays,
			selectedEssayId: "demo-essay-1",

			// API Loading
			isLoading: false,
			error: null,

			// Canvas State
			viewMode: "canvas" as ViewMode,
			selectedNodeId: null,
			visibleLayers: {
				core: true,
				summary: true,
				evidence: true,
				insight: true,
			},

			// Discovery Actions
			startTrack: (trackId) =>
				set((state) => ({
					tracks: state.tracks.map((track) =>
						track.id === trackId
							? { ...track, status: "in_progress" as TrackStatus }
							: track,
					),
					activeTrackId: trackId,
				})),

			answerQuestion: (trackId, questionId, answer) =>
				set((state) => ({
					tracks: state.tracks.map((track) => {
						if (track.id !== trackId) return track;

						const existingIndex = track.answers.findIndex(
							(a) => a.questionId === questionId,
						);
						const newAnswer: TrackAnswer = {
							questionId,
							answer,
							timestamp: Date.now(),
						};

						const answers =
							existingIndex >= 0
								? track.answers.map((a, i) =>
									i === existingIndex ? newAnswer : a,
								)
								: [...track.answers, newAnswer];

						return { ...track, answers };
					}),
				})),

			nextQuestion: (trackId) =>
				set((state) => ({
					tracks: state.tracks.map((track) =>
						track.id === trackId &&
							track.currentQuestionIndex < track.questions.length - 1
							? {
								...track,
								currentQuestionIndex: track.currentQuestionIndex + 1,
							}
							: track,
					),
				})),

			previousQuestion: (trackId) =>
				set((state) => ({
					tracks: state.tracks.map((track) =>
						track.id === trackId && track.currentQuestionIndex > 0
							? {
								...track,
								currentQuestionIndex: track.currentQuestionIndex - 1,
							}
							: track,
					),
				})),

			completeTrack: (trackId) =>
				set((state) => ({
					tracks: state.tracks.map((track) =>
						track.id === trackId
							? {
								...track,
								status: "completed" as TrackStatus,
								completedAt: Date.now(),
							}
							: track,
					),
					activeTrackId: null,
				})),

			setActiveTrack: (trackId) => set({ activeTrackId: trackId }),

			// Persona Actions
			addPersonalityTag: (tag) =>
				set((state) => ({
					personalityTags: [
						...state.personalityTags,
						{ ...tag, id: crypto.randomUUID() },
					],
				})),

			removePersonalityTag: (tagId) =>
				set((state) => ({
					personalityTags: state.personalityTags.filter((t) => t.id !== tagId),
				})),

			updatePersonalityTag: (tagId, label) =>
				set((state) => ({
					personalityTags: state.personalityTags.map((t) =>
						t.id === tagId ? { ...t, label } : t,
					),
				})),

			addKeyStory: (story) =>
				set((state) => ({
					keyStories: [
						...state.keyStories,
						{ ...story, id: crypto.randomUUID() },
					],
				})),

			toggleStoryPin: (storyId) =>
				set((state) => ({
					keyStories: state.keyStories.map((s) =>
						s.id === storyId ? { ...s, isPinned: !s.isPinned } : s,
					),
				})),

			toggleAnglePin: (angleId) =>
				set((state) => ({
					essayAngles: state.essayAngles.map((a) =>
						a.id === angleId ? { ...a, isPinned: !a.isPinned } : a,
					),
				})),

			// Essay Actions
			addEssay: (essay) =>
				set((state) => ({
					essays: [
						...state.essays,
						{
							...essay,
							id: crypto.randomUUID(),
							wordCount: essay.content.split(/\s+/).filter(Boolean).length,
							createdAt: Date.now(),
							updatedAt: Date.now(),
						},
					],
				})),

			updateEssay: (essayId, updates) =>
				set((state) => ({
					essays: state.essays.map((e) =>
						e.id === essayId
							? {
								...e,
								...updates,
								wordCount: updates.content
									? updates.content.split(/\s+/).filter(Boolean).length
									: e.wordCount,
								updatedAt: Date.now(),
							}
							: e,
					),
				})),

			deleteEssay: (essayId) =>
				set((state) => ({
					essays: state.essays.filter((e) => e.id !== essayId),
					selectedEssayId:
						state.selectedEssayId === essayId ? null : state.selectedEssayId,
				})),

			addFeedback: (essayId, feedback) =>
				set((state) => ({
					essays: state.essays.map((e) =>
						e.id === essayId
							? {
								...e,
								feedback: [
									...e.feedback,
									{
										...feedback,
										id: crypto.randomUUID(),
										timestamp: Date.now(),
									},
								],
								status: "reviewed" as EssayStatus,
								updatedAt: Date.now(),
							}
							: e,
					),
				})),

			setSelectedEssay: (essayId) => set({ selectedEssayId: essayId }),

			// Canvas Actions
			setViewMode: (mode) => set({ viewMode: mode }),
			setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
			setVisibleLayers: (layers) => set({ visibleLayers: layers }),
			toggleLayer: (layer) =>
				set((state) => ({
					visibleLayers: {
						...state.visibleLayers,
						[layer]: !state.visibleLayers[layer],
					},
				})),

			// Utility
			getTrackProgress: () => {
				const tracks = get().tracks;
				const completed = tracks.filter((t) => t.status === "completed").length;
				return { completed, total: tracks.length };
			},

			getCompletedTracks: () => {
				return get().tracks.filter((t) => t.status === "completed");
			},

			resetPersona: () =>
				set({
					tracks: demoTracks,
					activeTrackId: null,
					personalityTags: demoPersonalityTags,
					keyStories: demoKeyStories,
					essayAngles: demoEssayAngles,
					essays: demoEssays,
					selectedEssayId: "demo-essay-1",
					viewMode: "canvas" as ViewMode,
					selectedNodeId: null,
					visibleLayers: {
						core: true,
						summary: true,
						evidence: true,
						insight: true,
					},
				}),

			// Async Actions
			initializeStore: async () => {
				set({ isLoading: true, error: null });
				try {
					const data = await personaApi.getPersonaData();
					if (data.tracks.length > 0) {
						set({
							tracks: data.tracks,
							keyStories: data.keyStories,
							personalityTags: data.personalityTags,
							essayAngles: data.essayAngles,
						});
					}
				} catch (err) {
					set({ error: (err as Error).message });
				} finally {
					set({ isLoading: false });
				}
			},

			generateInsightAsync: async (trackId) => {
				set({ isLoading: true, error: null });
				try {
					const { insight, angles } = await personaApi.generateInsight(trackId);
					set((state) => ({
						essayAngles: [
							...state.essayAngles,
							{
								id: `insight-${trackId}-${Date.now()}`,
								title: `AI Insight: ${trackId}`,
								description: insight,
								relevantTracks: [trackId],
								isPinned: false,
								suggestedFor: angles
							}
						]
					}));
				} catch (err) {
					set({ error: (err as Error).message });
				} finally {
					set({ isLoading: false });
				}
			},
		}),
		{
			name: "leaply-persona-store",
		},
	),
);
