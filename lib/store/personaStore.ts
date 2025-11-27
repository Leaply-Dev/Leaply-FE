import { create } from "zustand";
import { persist } from "zustand/middleware";

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

	// Discovery Actions
	startTrack: (trackId: TrackId) => void;
	answerQuestion: (trackId: TrackId, questionId: string, answer: string) => void;
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
	addEssay: (essay: Omit<Essay, "id" | "createdAt" | "updatedAt" | "wordCount">) => void;
	updateEssay: (essayId: string, updates: Partial<Essay>) => void;
	deleteEssay: (essayId: string) => void;
	addFeedback: (essayId: string, feedback: Omit<EssayFeedback, "id" | "timestamp">) => void;
	setSelectedEssay: (essayId: string | null) => void;

	// Utility
	getTrackProgress: () => { completed: number; total: number };
	getCompletedTracks: () => DiscoveryTrack[];
	resetPersona: () => void;
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
				question: "Hoạt động ngoại khóa nào bạn dành nhiều thời gian và tâm huyết nhất?",
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
				question: "Kể về một lần bạn giúp đỡ người khác hoặc tạo ra sự thay đổi tích cực",
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
				question: "Nếu có thêm thời gian và nguồn lực, bạn muốn làm điều gì để giúp đỡ cộng đồng?",
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
				question: "Kể về một trải nghiệm đã thay đổi cách bạn nhìn nhận cuộc sống",
				hint: "Có thể là thành công, thất bại, hoặc một sự kiện bất ngờ",
				required: true,
			},
			{
				id: "values-3",
				question: "Ai là người ảnh hưởng lớn nhất đến bạn? Họ đã dạy bạn điều gì?",
				hint: "Có thể là người thân, thầy cô, hoặc ai đó bạn ngưỡng mộ",
				required: true,
			},
			{
				id: "values-4",
				question: "Bạn đã từng đối mặt với một quyết định khó khăn về đạo đức chưa? Kể về nó",
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
				question: "Bạn muốn phát triển những kỹ năng hoặc kiến thức gì trong đại học?",
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

// Initial Essay Angles
const initialEssayAngles: EssayAngle[] = [
	{
		id: "angle-growth",
		title: "Personal Growth Story",
		description: "Kể về một trải nghiệm đã thay đổi bạn",
		relevantTracks: ["values", "academic"],
		isPinned: false,
		suggestedFor: ["Common App Essay", "Personal Statement"],
	},
	{
		id: "angle-passion",
		title: "Passion & Curiosity",
		description: "Thể hiện niềm đam mê học thuật hoặc sở thích",
		relevantTracks: ["academic", "future"],
		isPinned: false,
		suggestedFor: ["Why Major Essay", "Supplemental Essays"],
	},
	{
		id: "angle-impact",
		title: "Community Impact",
		description: "Tập trung vào cách bạn đã tạo ra sự thay đổi",
		relevantTracks: ["activities", "values"],
		isPinned: false,
		suggestedFor: ["Activity Essay", "Community Essay"],
	},
	{
		id: "angle-identity",
		title: "Identity & Background",
		description: "Chia sẻ về nền tảng và bản sắc độc đáo của bạn",
		relevantTracks: ["values"],
		isPinned: false,
		suggestedFor: ["Diversity Essay", "Background Essay"],
	},
];

export const usePersonaStore = create<PersonaState>()(
	persist(
		(set, get) => ({
			// Initial State
			tracks: initialTracks,
			activeTrackId: null,
			personalityTags: [],
			keyStories: [],
			essayAngles: initialEssayAngles,
			essays: [],
			selectedEssayId: null,

			// Discovery Actions
			startTrack: (trackId) =>
				set((state) => ({
					tracks: state.tracks.map((track) =>
						track.id === trackId
							? { ...track, status: "in_progress" as TrackStatus }
							: track
					),
					activeTrackId: trackId,
				})),

			answerQuestion: (trackId, questionId, answer) =>
				set((state) => ({
					tracks: state.tracks.map((track) => {
						if (track.id !== trackId) return track;

						const existingIndex = track.answers.findIndex(
							(a) => a.questionId === questionId
						);
						const newAnswer: TrackAnswer = {
							questionId,
							answer,
							timestamp: Date.now(),
						};

						const answers =
							existingIndex >= 0
								? track.answers.map((a, i) =>
										i === existingIndex ? newAnswer : a
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
							? { ...track, currentQuestionIndex: track.currentQuestionIndex + 1 }
							: track
					),
				})),

			previousQuestion: (trackId) =>
				set((state) => ({
					tracks: state.tracks.map((track) =>
						track.id === trackId && track.currentQuestionIndex > 0
							? { ...track, currentQuestionIndex: track.currentQuestionIndex - 1 }
							: track
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
							: track
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
						t.id === tagId ? { ...t, label } : t
					),
				})),

			addKeyStory: (story) =>
				set((state) => ({
					keyStories: [...state.keyStories, { ...story, id: crypto.randomUUID() }],
				})),

			toggleStoryPin: (storyId) =>
				set((state) => ({
					keyStories: state.keyStories.map((s) =>
						s.id === storyId ? { ...s, isPinned: !s.isPinned } : s
					),
				})),

			toggleAnglePin: (angleId) =>
				set((state) => ({
					essayAngles: state.essayAngles.map((a) =>
						a.id === angleId ? { ...a, isPinned: !a.isPinned } : a
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
							: e
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
							: e
					),
				})),

			setSelectedEssay: (essayId) => set({ selectedEssayId: essayId }),

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
					tracks: initialTracks,
					activeTrackId: null,
					personalityTags: [],
					keyStories: [],
					essayAngles: initialEssayAngles,
					essays: [],
					selectedEssayId: null,
				}),
		}),
		{
			name: "leaply-persona-store",
		}
	)
);

