// Persona Lab API Client
// Aligned with backend API specification

import {
	createInitialTracks,
	TRACK_EMOJIS,
	TRACKS,
} from "@/lib/constants/tracks";
import type {
	ArchetypeCandidate,
	ArchetypeHints,
	ArchetypeType,
	BackToTrackResponse,
	CanvasNode,
	ChatMessage,
	ConversationMessage,
	ConversationStartResponse,
	Coverage,
	CoverageResponse,
	GraphEdge,
	GraphMessageResponse,
	GraphNode,
	KeywordResponse,
	MessageResponse,
	NodeExpandResponse,
	NodeType,
	PersonaState,
	RedoTrackResponse,
	ResetConversationResponse,
	StarStructure,
	TrackAction,
	TrackId,
	TrackSelectResponse,
	TrackStatus,
} from "@/lib/types/persona";
import type {
	GraphMeta,
	PersonaEdgeDto,
	PersonaGraphResponse,
	PersonaNodeDto,
} from "@/lib/types/persona-graph";
import { apiClient } from "./client";

// API configuration - Use feature flag to switch between mock and real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

// Mock delay to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique IDs with crypto for better uniqueness
let idCounter = 0;
const generateId = () => {
	idCounter += 1;
	return `${Date.now()}-${idCounter}-${Math.random().toString(36).substring(2, 11)}`;
};

// ============================================
// Mock Data & State (for demo mode)
// ============================================

// Mock conversation state
interface MockConversationState {
	currentTrackId: TrackId | null;
	coreQuestionIndex: number;
	followUpIndex: number;
	tracks: Record<TrackId, TrackStatus>;
	nodes: CanvasNode[];
	conversationHistory: ChatMessage[];
}

let mockState: MockConversationState = {
	currentTrackId: null,
	coreQuestionIndex: 0,
	followUpIndex: 0,
	tracks: {
		future_vision: "not_started",
		academic_journey: "not_started",
		activities_impact: "not_started",
		values_turning_points: "not_started",
	},
	nodes: [],
	conversationHistory: [],
};

// ============================================
// New Graph-Based Conversation Mock State
// ============================================

interface GraphConversationState {
	messages: ConversationMessage[];
	graphNodes: GraphNode[];
	graphEdges: GraphEdge[];
	coverage: Coverage;
	completionReady: boolean;
	totalNodeCount: number;
	starGaps: Map<string, (keyof StarStructure)[]>;
	voiceSamples: string[];
}

let graphMockState: GraphConversationState = {
	messages: [],
	graphNodes: [],
	graphEdges: [],
	coverage: {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	},
	completionReady: false,
	totalNodeCount: 0,
	starGaps: new Map(),
	voiceSamples: [],
};

// Reset graph mock state
export function resetGraphMockState() {
	graphMockState = {
		messages: [],
		graphNodes: [],
		graphEdges: [],
		coverage: {
			goals: 0,
			evidence: 0,
			skills: 0,
			values: 0,
			tensions: 0,
		},
		completionReady: false,
		totalNodeCount: 0,
		starGaps: new Map(),
		voiceSamples: [],
	};
}

// Coverage categories for question targeting (unused for now, prepared for future use)
const _COVERAGE_CATEGORIES = [
	"goals",
	"evidence",
	"skills",
	"values",
	"tensions",
] as const;

// Questions based on coverage gaps
const COVERAGE_QUESTIONS: Record<keyof Coverage, string[]> = {
	goals: [
		"5-10 năm sau, bạn hình dung bản thân đang làm gì và ở đâu?",
		"Vấn đề nào bạn muốn góp phần giải quyết qua sự nghiệp của mình?",
		"Điều gì thúc đẩy bạn dậy sớm mỗi ngày và bắt đầu làm việc?",
	],
	evidence: [
		"Hãy kể về một dự án hoặc thành tựu bạn tự hào nhất. Bạn đã đóng vai trò gì?",
		"Có thành tích cụ thể nào (số liệu, giải thưởng) bạn muốn chia sẻ?",
		"Bạn đã lãnh đạo hoặc tổ chức điều gì? Kết quả ra sao?",
	],
	skills: [
		"Kỹ năng nào bạn cảm thấy là điểm mạnh nhất của mình?",
		"Bạn đã phát triển khả năng này như thế nào qua thời gian?",
		"Trong tình huống thử thách, bạn thường xử lý như thế nào?",
	],
	values: [
		"3 giá trị quan trọng nhất với bạn là gì? Tại sao?",
		"Điều gì bạn sẽ không bao giờ thỏa hiệp dù trong hoàn cảnh nào?",
		"Ai ảnh hưởng lớn nhất đến quan điểm sống của bạn?",
	],
	tensions: [
		"Có khi nào bạn phải đối mặt với sự mâu thuẫn giữa các giá trị của mình không?",
		"Trải nghiệm nào đã thay đổi hoàn toàn cách nhìn của bạn về một điều gì đó?",
		"Có điều gì về bản thân trước đây mà bạn đã chọn thay đổi?",
	],
};

// STAR follow-up questions
const STAR_FOLLOWUPS: Record<keyof StarStructure, string> = {
	situation:
		"Bạn có thể mô tả bối cảnh cụ thể hơn không? Khi đó đang xảy ra chuyện gì?",
	task: "Thử thách hoặc nhiệm vụ cụ thể bạn cần giải quyết là gì?",
	action: "Bạn đã làm gì cụ thể? Có thể mô tả các bước bạn thực hiện?",
	result: "Kết quả cuối cùng như thế nào? Có số liệu hoặc thành tích cụ thể?",
	emotion: "Cảm giác của bạn khi trải qua điều đó như thế nào?",
	insight: "Nhìn lại, bạn đã học được điều gì quan trọng từ trải nghiệm này?",
};

// Reset mock state (useful for testing)
export function resetMockState() {
	mockState = {
		currentTrackId: null,
		coreQuestionIndex: 0,
		followUpIndex: 0,
		tracks: {
			future_vision: "not_started",
			academic_journey: "not_started",
			activities_impact: "not_started",
			values_turning_points: "not_started",
		},
		nodes: [],
		conversationHistory: [],
	};
}

// Mock questions per track (4 core questions each)
const MOCK_QUESTIONS: Record<TrackId, string[]> = {
	future_vision: [
		"5-10 năm sau, một ngày làm việc điển hình của bạn như thế nào? Hãy mô tả chi tiết: bạn làm gì, ở đâu, với ai?",
		"Vấn đề nào bạn muốn góp phần giải quyết qua công việc của mình?",
		"Tại sao bạn chọn học thạc sĩ ở nước ngoài thay vì trong nước hoặc đi làm ngay?",
		"Chương trình hoặc trường nào bạn đang hướng đến? Điều gì thu hút bạn về họ?",
	],
	academic_journey: [
		"Môn học hoặc dự án nào khiến bạn hứng thú nhất trong quá trình học? Tại sao?",
		"Thử thách học thuật lớn nhất bạn đã vượt qua là gì?",
		"Nếu được nghiên cứu bất kỳ chủ đề nào không giới hạn, đó sẽ là gì?",
		"Có giáo sư hoặc mentor nào ảnh hưởng lớn đến định hướng học thuật của bạn?",
	],
	activities_impact: [
		"Hoạt động nào bạn dành nhiều thời gian và tâm huyết nhất ngoài việc học?",
		"Bạn đã khởi xướng hoặc lãnh đạo điều gì? Kết quả ra sao?",
		"Kể về một lần bạn tạo ra thay đổi tích cực cho người khác hoặc cộng đồng.",
		"Kỹ năng hoặc bài học quan trọng nhất bạn học được từ hoạt động ngoại khóa là gì?",
	],
	values_turning_points: [
		"3 giá trị quan trọng nhất với bạn là gì? Tại sao những giá trị đó?",
		"Trải nghiệm nào đã thay đổi cách bạn nhìn nhận cuộc sống hoặc bản thân?",
		"Ai ảnh hưởng lớn nhất đến con người bạn hôm nay? Họ dạy bạn điều gì?",
		"Điều gì khiến bạn khác biệt so với những người có background tương tự?",
	],
};

// Mock follow-up questions
const MOCK_FOLLOWUPS = {
	detail: [
		"Cụ thể bạn đã làm gì trong tình huống đó? Có thể cho ví dụ cụ thể không?",
		"Bạn có thể mô tả chi tiết hơn không? Chuyện gì đã xảy ra?",
		"Kết quả cụ thể như thế nào? Có số liệu hoặc thành tích nào đáng nhớ?",
	],
	emotion: [
		"Cảm giác của bạn như thế nào khi trải qua điều đó? Có moment nào đặc biệt không?",
		"Điều gì đã thay đổi trong bạn sau trải nghiệm đó?",
		"Nếu nhìn lại, bạn đã học được gì quan trọng từ việc này?",
	],
};

// ============================================
// Helper Functions
// ============================================

function createTrackActions(): TrackAction[] {
	return (Object.keys(TRACKS) as TrackId[]).map((trackId) => ({
		trackId,
		displayName: TRACKS[trackId].displayName,
		icon: TRACK_EMOJIS[trackId],
		status: mockState.tracks[trackId],
	}));
}

function createWelcomeMessage(): ChatMessage {
	return {
		id: generateId(),
		role: "assistant",
		content:
			"Chào bạn! Tôi là mentor AI của Leaply, sẵn sàng giúp bạn khám phá câu chuyện cá nhân cho hành trình du học.\n\nChúng ta sẽ cùng nhau đi qua 4 chủ đề khám phá. Hãy chọn một chủ đề để bắt đầu:",
		type: "track_selection",
		timestamp: new Date().toISOString(),
		actions: createTrackActions(),
	};
}

function getRandomFollowup(type: "detail" | "emotion"): string {
	const followups = MOCK_FOLLOWUPS[type];
	return followups[Math.floor(Math.random() * followups.length)];
}

function shouldCreateNode(): boolean {
	// 60% chance to create a node after follow-up 2
	return Math.random() > 0.4;
}

// Calculate total questions answered across all tracks
function calculateTotalQuestionsAnswered(): number {
	let total = 0;
	for (const trackId of Object.keys(mockState.tracks) as TrackId[]) {
		const status = mockState.tracks[trackId];
		if (status === "completed") {
			total += 12; // 4 core × 3 interactions
		} else if (
			status === "in_progress" &&
			trackId === mockState.currentTrackId
		) {
			total += mockState.coreQuestionIndex * 3 + mockState.followUpIndex;
		}
	}
	return total;
}

// Generate archetype hints based on questions answered
function generateArchetypeHints(): ArchetypeHints | undefined {
	const totalQ = calculateTotalQuestionsAnswered();

	if (totalQ < 6) {
		return undefined; // Not enough data
	}

	const archetypeTypes: ArchetypeType[] = [
		"innovator",
		"bridge_builder",
		"scholar",
		"advocate",
		"pioneer",
		"craftsman",
		"resilient",
		"catalyst",
	];

	// Determine confidence level
	let confidence: ArchetypeHints["confidence"];
	let spreadFactor: number;
	if (totalQ >= 24) {
		confidence = "final";
		spreadFactor = 0.4; // Very differentiated
	} else if (totalQ >= 18) {
		confidence = "strong";
		spreadFactor = 0.3;
	} else if (totalQ >= 12) {
		confidence = "emerging";
		spreadFactor = 0.2;
	} else {
		confidence = "early";
		spreadFactor = 0.1; // Close together
	}

	// Generate pseudo-random but consistent probabilities
	const seed = totalQ * 7 + mockState.nodes.length * 3;
	const shuffled = [...archetypeTypes].sort(
		(a, b) => ((a.charCodeAt(0) + seed) % 13) - ((b.charCodeAt(0) + seed) % 13),
	);

	// Calculate probabilities with spread based on confidence
	const base = 100 / 3; // ~33% base for top 3
	const top3 = shuffled.slice(0, 3);
	const probabilities = [
		Math.round(base + spreadFactor * 50),
		Math.round(base),
		Math.round(base - spreadFactor * 50),
	];

	// Mock evidence snippets
	const evidenceSnippets: Record<ArchetypeType, string> = {
		innovator: "Your creative approach to problem-solving",
		bridge_builder: "Your ability to connect different perspectives",
		scholar: "Your deep intellectual curiosity",
		advocate: "Your passion for making a difference",
		pioneer: "Your willingness to explore new paths",
		craftsman: "Your dedication to mastering your craft",
		resilient: "Your strength in overcoming challenges",
		catalyst: "Your ability to inspire change in others",
	};

	const candidates: ArchetypeCandidate[] = top3.map((type, i) => ({
		type,
		probability: probabilities[i],
		evidence: evidenceSnippets[type],
	}));

	return {
		totalQuestionsAnswered: totalQ,
		confidence,
		candidates,
	};
}

// Simple keyword extraction for mock
function extractMockKeywords(content: string): string[] {
	const stopWords = new Set([
		"tôi",
		"mình",
		"là",
		"có",
		"được",
		"của",
		"và",
		"với",
		"trong",
		"cho",
		"i",
		"me",
		"my",
		"we",
		"the",
		"a",
		"an",
		"is",
		"are",
		"was",
		"were",
		"to",
		"of",
		"in",
		"for",
		"on",
		"with",
		"at",
		"by",
		"from",
		"as",
	]);

	const words = content
		.toLowerCase()
		.replace(
			/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g,
			" ",
		)
		.split(/\s+/)
		.filter((w) => w.length >= 3 && !stopWords.has(w));

	// Count frequency
	const freq: Record<string, number> = {};
	for (const w of words) {
		freq[w] = (freq[w] || 0) + 1;
	}

	// Return top 2
	return Object.entries(freq)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 2)
		.map(([word]) => word);
}

function generateMockNode(
	trackId: TrackId,
	type: NodeType = "story",
): CanvasNode {
	const titles: Record<NodeType, string[]> = {
		story: [
			"Personal transformation moment",
			"Key learning experience",
			"Defining challenge overcome",
			"Meaningful connection made",
		],
		evidence: [
			"Leadership achievement",
			"Academic milestone",
			"Project success",
			"Measurable impact",
		],
		insight: [
			"Self-awareness realization",
			"Values clarification",
			"Growth mindset shift",
			"Purpose discovery",
		],
		archetype: ["Your identity archetype"],
	};

	const typeOptions = titles[type];
	const title = typeOptions[Math.floor(Math.random() * typeOptions.length)];

	return {
		id: generateId(),
		type,
		title,
		content: `This ${type} was extracted from your conversation in the ${TRACKS[trackId].displayName} track. It represents a meaningful aspect of your personal narrative.`,
		sourceTrackId: trackId,
		createdAt: new Date().toISOString(),
	};
}

// ============================================
// Graph Conversation Helper Functions
// ============================================

function getLowestCoverageCategory(): keyof Coverage {
	const entries = Object.entries(graphMockState.coverage) as [
		keyof Coverage,
		number,
	][];
	entries.sort((a, b) => a[1] - b[1]);
	return entries[0][0];
}

function getQuestionForCategory(category: keyof Coverage): string {
	const questions = COVERAGE_QUESTIONS[category];
	const usedCount = Math.floor(graphMockState.coverage[category] / 20);
	const questionIndex = Math.min(usedCount, questions.length - 1);
	return questions[questionIndex];
}

function updateCoverage(category: keyof Coverage, amount: number): void {
	graphMockState.coverage[category] = Math.min(
		100,
		graphMockState.coverage[category] + amount,
	);
}

function checkCompletionReady(): boolean {
	const allAbove60 = Object.values(graphMockState.coverage).every(
		(v) => v >= 60,
	);
	const hasEnoughNodes = graphMockState.totalNodeCount >= 15;
	return allAbove60 || hasEnoughNodes;
}

function generateGraphNode(
	content: string,
	category: keyof Coverage,
): GraphNode {
	const nodeId = generateId();
	const starGaps: (keyof StarStructure)[] = [];

	// Randomly determine which STAR elements are missing
	const starElements: (keyof StarStructure)[] = [
		"situation",
		"task",
		"action",
		"result",
	];
	for (const element of starElements) {
		if (Math.random() > 0.6) {
			starGaps.push(element);
		}
	}

	// Create partial structured content
	const structuredContent: StarStructure = {};
	if (!starGaps.includes("situation")) {
		structuredContent.situation = "Extracted from your response...";
	}
	if (!starGaps.includes("task")) {
		structuredContent.task = "The challenge you faced...";
	}
	if (!starGaps.includes("action")) {
		structuredContent.action = "Steps you took...";
	}
	if (!starGaps.includes("result")) {
		structuredContent.result = "The outcome achieved...";
	}

	if (starGaps.length > 0) {
		graphMockState.starGaps.set(nodeId, starGaps);
	}

	const node: GraphNode = {
		id: nodeId,
		type: "key_story",
		layer: 2,
		title: content.slice(0, 50) + (content.length > 50 ? "..." : ""),
		content: content.slice(0, 200),
		structuredContent,
		tags: [category, "story"],
		bestFor: ["personal_statement", "why_mba"],
		wordCountPotential: "150-200",
		essayAngle: `This story demonstrates your ${category}`,
	};

	return node;
}

function generateGraphEdge(
	sourceNodeId: string,
	targetNodeId: string,
	isTension: boolean = false,
): GraphEdge {
	const connectionLabels: (
		| "enables"
		| "builds_on"
		| "supports"
		| "complements"
	)[] = ["enables", "builds_on", "supports", "complements"];
	const tensionLabels: (
		| "contradicts"
		| "evolved_from"
		| "challenged_by"
		| "transformed"
	)[] = ["contradicts", "evolved_from", "challenged_by", "transformed"];

	const labels = isTension ? tensionLabels : connectionLabels;
	const label = labels[Math.floor(Math.random() * labels.length)];

	return {
		id: generateId(),
		sourceNodeId,
		targetNodeId,
		edgeType: isTension ? "tension" : "connection",
		label,
		strength: 0.5 + Math.random() * 0.5,
	};
}

function extractVoiceSample(content: string): string | null {
	// Extract notable phrases (sentences with strong emotion or unique phrasing)
	const sentences = content.split(/[.!?]/).filter((s) => s.trim().length > 20);
	if (sentences.length > 0 && Math.random() > 0.6) {
		const sample =
			sentences[Math.floor(Math.random() * sentences.length)].trim();
		graphMockState.voiceSamples.push(sample);
		return sample;
	}
	return null;
}

// ============================================
// Mock Graph Data Generator
// ============================================

function generateMockGraphData(): PersonaGraphResponse {
	const nodes: PersonaNodeDto[] = [];
	const edges: PersonaEdgeDto[] = [];

	// Layer 0: Profile Summary (center)
	const completedTracks = Object.values(mockState.tracks).filter(
		(s) => s === "completed",
	).length;
	const hasProfile = completedTracks >= 2;

	if (hasProfile) {
		const profileNode: PersonaNodeDto = {
			id: "profile-summary-1",
			type: "profile_summary",
			layer: 0,
			title: "Hồ sơ cá nhân",
			description:
				"Bạn là người có tư duy sáng tạo, luôn tìm kiếm cách tiếp cận mới cho những vấn đề phức tạp. Với nền tảng học thuật vững chắc và kinh nghiệm hoạt động ngoại khóa phong phú.",
			tags: ["leadership", "innovation", "impact"],
			primaryArchetype: "innovator",
			secondaryArchetype: "bridge_builder",
			archetypeSummary:
				"The Innovator with Bridge Builder tendencies - creating novel solutions while connecting diverse perspectives.",
			sourceTrackId: null,
			sourceQuestionId: null,
			confidence: 0.85,
			createdAt: new Date().toISOString(),
		};
		nodes.push(profileNode);
	}

	// Layer 1: Essay Angles (inner ring)
	const essayAngles: PersonaNodeDto[] = [
		{
			id: "angle-1",
			type: "essay_angle",
			layer: 1,
			title: "Người tiên phong đổi mới",
			description:
				"Từ những trải nghiệm của bạn, nổi bật lên hình ảnh một người luôn dẫn đầu trong việc tìm kiếm giải pháp sáng tạo.",
			tags: ["innovation", "leadership", "problem-solving"],
			sourceTrackId: "future_vision",
			sourceQuestionId: null,
			confidence: 0.82,
			createdAt: new Date().toISOString(),
		},
		{
			id: "angle-2",
			type: "essay_angle",
			layer: 1,
			title: "Cầu nối văn hóa",
			description:
				"Khả năng kết nối các quan điểm khác nhau và tạo ra sự hiểu biết chung là một điểm mạnh đáng chú ý.",
			tags: ["culture", "communication", "diversity"],
			sourceTrackId: "activities_impact",
			sourceQuestionId: null,
			confidence: 0.78,
			createdAt: new Date().toISOString(),
		},
		{
			id: "angle-3",
			type: "essay_angle",
			layer: 1,
			title: "Học giả tò mò",
			description:
				"Sự đam mê học hỏi và khám phá tri thức mới thể hiện qua mọi câu chuyện bạn chia sẻ.",
			tags: ["curiosity", "learning", "academic"],
			sourceTrackId: "academic_journey",
			sourceQuestionId: null,
			confidence: 0.75,
			createdAt: new Date().toISOString(),
		},
	];

	// Only add angles if we have some completed tracks
	if (completedTracks >= 1) {
		nodes.push(...essayAngles.slice(0, Math.min(completedTracks + 1, 3)));
	}

	// Layer 2: Key Stories (outer ring) - convert existing nodes
	const storyNodes: PersonaNodeDto[] = mockState.nodes
		.filter((n) => n.type === "story")
		.map((n, _idx) => ({
			id: `story-${n.id}`,
			type: "key_story" as const,
			layer: 2 as const,
			title: n.title,
			description: n.content,
			tags: ["experience", "growth"],
			sourceTrackId: n.sourceTrackId,
			sourceQuestionId: null,
			confidence: 0.7 + Math.random() * 0.2,
			createdAt: n.createdAt,
		}));

	nodes.push(...storyNodes);

	// Layer 3: Details (outermost) - convert evidence/insight nodes
	const detailNodes: PersonaNodeDto[] = mockState.nodes
		.filter((n) => n.type === "evidence" || n.type === "insight")
		.map((n) => ({
			id: `detail-${n.id}`,
			type: "detail" as const,
			layer: 3 as const,
			title: n.title,
			description: n.content,
			tags:
				n.type === "evidence"
					? ["evidence", "fact"]
					: ["insight", "reflection"],
			sourceTrackId: n.sourceTrackId,
			sourceQuestionId: null,
			confidence: 0.6 + Math.random() * 0.3,
			createdAt: n.createdAt,
		}));

	nodes.push(...detailNodes);

	// Generate edges
	// Profile -> Angles
	if (hasProfile) {
		for (const angle of nodes.filter((n) => n.type === "essay_angle")) {
			edges.push({
				id: `edge-profile-${angle.id}`,
				source: "profile-summary-1",
				target: angle.id,
				strength: 0.8 + Math.random() * 0.2,
				createdAt: new Date().toISOString(),
			});
		}
	}

	// Angles -> Stories (based on sourceTrackId)
	for (const angle of nodes.filter((n) => n.type === "essay_angle")) {
		const relatedStories = storyNodes.filter(
			(s) => s.sourceTrackId === angle.sourceTrackId,
		);
		for (const story of relatedStories) {
			edges.push({
				id: `edge-${angle.id}-${story.id}`,
				source: angle.id,
				target: story.id,
				strength: 0.6 + Math.random() * 0.3,
				createdAt: new Date().toISOString(),
			});
		}
	}

	// Stories -> Details (pair details with stories from same track)
	for (const story of storyNodes) {
		const relatedDetails = detailNodes.filter(
			(d) => d.sourceTrackId === story.sourceTrackId,
		);
		// Connect to first 2 related details
		for (const detail of relatedDetails.slice(0, 2)) {
			edges.push({
				id: `edge-${story.id}-${detail.id}`,
				source: story.id,
				target: detail.id,
				strength: 0.5 + Math.random() * 0.4,
				createdAt: new Date().toISOString(),
			});
		}
	}

	// Calculate metadata
	const nodeCountByLayer: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
	for (const node of nodes) {
		nodeCountByLayer[node.layer] = (nodeCountByLayer[node.layer] || 0) + 1;
	}

	const allTags = nodes.flatMap((n) => n.tags);
	const tagCounts: Record<string, number> = {};
	for (const tag of allTags) {
		tagCounts[tag] = (tagCounts[tag] || 0) + 1;
	}
	const topTags = Object.entries(tagCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([tag]) => tag);

	const meta: GraphMeta = {
		nodeCountByLayer,
		topTags,
		hasProfileSummary: hasProfile,
		totalNodes: nodes.length,
		totalEdges: edges.length,
	};

	return { nodes, edges, meta };
}

// ============================================
// Mock API Implementation
// ============================================

const mockPersonaApi = {
	// GET /api/v1/persona - Fetch full persona state
	async getPersonaState(): Promise<PersonaState> {
		await delay(800);

		// If no conversation history, create welcome message
		if (mockState.conversationHistory.length === 0) {
			mockState.conversationHistory.push(createWelcomeMessage());
		}

		const tracks = createInitialTracks();
		for (const trackId of Object.keys(tracks) as TrackId[]) {
			tracks[trackId].status = mockState.tracks[trackId];
		}

		return {
			userId: "demo_user",
			tracks,
			nodes: mockState.nodes,
			archetype: null,
			conversationHistory: mockState.conversationHistory,
			currentTrackId: mockState.currentTrackId,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	},

	// POST /api/v1/persona/track/select - Select a track to start/continue
	async selectTrack(trackId: TrackId): Promise<TrackSelectResponse> {
		await delay(600);

		mockState.currentTrackId = trackId;
		mockState.tracks[trackId] = "in_progress";
		mockState.coreQuestionIndex = 0;
		mockState.followUpIndex = 0;

		const track = TRACKS[trackId];
		const questions = MOCK_QUESTIONS[trackId] || [];

		if (questions.length === 0) {
			console.error(`personaApi: No questions found for track ${trackId}`);
			throw new Error(
				`Technical error: Missing questions for track ${trackId}`,
			);
		}

		const firstQuestion = questions[0];

		const message: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content: `Tuyệt vời! Hãy bắt đầu khám phá ${track.displayName} của bạn.\n\n${firstQuestion}`,
			type: "text",
			timestamp: new Date().toISOString(),
		};

		mockState.conversationHistory.push(message);

		return {
			message,
			trackStatus: "in_progress",
			currentTrackId: trackId,
		};
	},

	// POST /api/v1/persona/message - Send message in current track conversation
	async sendMessage(content: string): Promise<MessageResponse> {
		await delay(1000);

		if (!mockState.currentTrackId) {
			throw new Error("No track selected");
		}

		// Add user message to history
		const userMessage: ChatMessage = {
			id: generateId(),
			role: "user",
			content,
			type: "text",
			timestamp: new Date().toISOString(),
		};
		mockState.conversationHistory.push(userMessage);

		const trackId = mockState.currentTrackId;
		let responseMessage: ChatMessage;
		const canvasActions: CanvasNode[] = [];

		// Follow-up flow: Core Q -> Follow-up 1 -> Follow-up 2 -> Next Core Q
		if (mockState.followUpIndex === 0) {
			// After core question answer, ask for details
			responseMessage = {
				id: generateId(),
				role: "assistant",
				content: getRandomFollowup("detail"),
				type: "text",
				timestamp: new Date().toISOString(),
			};
			mockState.followUpIndex = 1;
		} else if (mockState.followUpIndex === 1) {
			// After detail answer, ask for emotion/insight
			responseMessage = {
				id: generateId(),
				role: "assistant",
				content: getRandomFollowup("emotion"),
				type: "text",
				timestamp: new Date().toISOString(),
			};
			mockState.followUpIndex = 2;
		} else {
			// After emotion answer, possibly create node and move to next question
			mockState.followUpIndex = 0;
			mockState.coreQuestionIndex++;

			// Maybe create a node
			if (shouldCreateNode()) {
				const nodeTypes: NodeType[] = ["story", "evidence", "insight"];
				const nodeType =
					nodeTypes[Math.floor(Math.random() * nodeTypes.length)];
				const newNode = generateMockNode(trackId, nodeType);
				mockState.nodes.push(newNode);
				canvasActions.push(newNode);
			}

			// Check if track is complete
			if (mockState.coreQuestionIndex >= MOCK_QUESTIONS[trackId].length) {
				// Track complete!
				mockState.tracks[trackId] = "completed";
				mockState.currentTrackId = null;

				// Check if all tracks complete
				const allComplete = (
					Object.values(mockState.tracks) as TrackStatus[]
				).every((s) => s === "completed");

				if (allComplete) {
					// Reveal archetype!
					responseMessage = {
						id: generateId(),
						role: "assistant",
						content: `Chúc mừng! 🎊 Bạn đã hoàn thành tất cả 4 discovery tracks!\n\nSau khi phân tích toàn bộ câu chuyện của bạn, tôi nhận ra bạn là **The Innovator** - người tạo ra giải pháp mới cho những vấn đề phức tạp.\n\nBạn có thể xem chi tiết archetype và các insights trên canvas bên phải.`,
						type: "track_complete",
						timestamp: new Date().toISOString(),
						canvasActions: [
							{
								action: "reveal_archetype",
								archetype: {
									type: "innovator" as ArchetypeType,
									personalizedSummary:
										"Từ những câu chuyện bạn chia sẻ, tôi thấy rõ khả năng sáng tạo và tư duy giải quyết vấn đề của bạn. Bạn không chỉ nhìn thấy thách thức mà còn tìm ra cách tiếp cận mới.",
								},
							},
						],
					};

					mockState.conversationHistory.push(responseMessage);

					return {
						message: responseMessage,
						trackStatus: "completed",
						currentTrackId: null,
						allTracksComplete: true,
					};
				}

				// Track complete but not all done
				responseMessage = {
					id: generateId(),
					role: "assistant",
					content: `Tuyệt vời! 🎉 Bạn đã hoàn thành ${TRACKS[trackId].displayName}!\n\nTôi đã thu thập được nhiều insight quý giá. Bạn muốn khám phá track nào tiếp theo?`,
					type: "track_complete",
					timestamp: new Date().toISOString(),
					actions: createTrackActions().filter((a) => a.status !== "completed"),
					canvasActions:
						canvasActions.length > 0
							? canvasActions.map((n) => ({ action: "add" as const, node: n }))
							: undefined,
				};

				mockState.conversationHistory.push(responseMessage);

				return {
					message: responseMessage,
					trackStatus: "completed",
					currentTrackId: null,
				};
			}

			// Move to next core question
			const questions = MOCK_QUESTIONS[trackId] || [];
			const nextQuestion = questions[mockState.coreQuestionIndex];

			if (!nextQuestion) {
				console.error(
					`personaApi: Question at index ${mockState.coreQuestionIndex} missing for track ${trackId}`,
				);
				throw new Error(
					"I've run out of questions for this track. Let's try another one!",
				);
			}

			const acknowledgment =
				content.length > 50
					? "Cảm ơn bạn đã chia sẻ chi tiết! "
					: "Cảm ơn bạn! ";

			responseMessage = {
				id: generateId(),
				role: "assistant",
				content: `${acknowledgment}\n\nCâu tiếp theo: ${nextQuestion}`,
				type: "text",
				timestamp: new Date().toISOString(),
				canvasActions:
					canvasActions.length > 0
						? canvasActions.map((n) => ({ action: "add" as const, node: n }))
						: undefined,
			};
		}

		mockState.conversationHistory.push(responseMessage);

		return {
			message: responseMessage,
			conversationState: {
				coreQuestionIndex: mockState.coreQuestionIndex,
				followUpIndex: mockState.followUpIndex,
				totalCoreQuestions: 4,
			},
			trackStatus: mockState.tracks[trackId],
			currentTrackId: trackId,
			archetypeHints: generateArchetypeHints(),
		};
	},

	// POST /api/v1/persona/extract-keywords - Extract keywords for canvas
	async extractKeywords(
		content: string,
		trackId: string,
	): Promise<KeywordResponse> {
		await delay(300); // Fast response

		const keywords = extractMockKeywords(content);

		return {
			keywords,
			trackId,
		};
	},

	// POST /api/v1/persona/track/back - Go back to track selection
	async goBackToTrackSelection(): Promise<BackToTrackResponse> {
		await delay(400);

		mockState.currentTrackId = null;

		const message: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content:
				"Không sao! Bạn có thể quay lại track này bất cứ lúc nào.\n\nBạn muốn khám phá track nào?",
			type: "track_selection",
			timestamp: new Date().toISOString(),
			actions: createTrackActions(),
		};

		mockState.conversationHistory.push(message);

		return {
			message,
			currentTrackId: null,
		};
	},

	// POST /api/v1/persona/track/{trackId}/redo - Reset and redo a completed track
	async redoTrack(trackId: TrackId): Promise<RedoTrackResponse> {
		await delay(600);

		// Remove nodes from this track
		const removedNodeIds = mockState.nodes
			.filter((n) => n.sourceTrackId === trackId)
			.map((n) => n.id);

		mockState.nodes = mockState.nodes.filter(
			(n) => n.sourceTrackId !== trackId,
		);

		// Reset track state
		mockState.tracks[trackId] = "in_progress";
		mockState.currentTrackId = trackId;
		mockState.coreQuestionIndex = 0;
		mockState.followUpIndex = 0;

		const firstQuestion = MOCK_QUESTIONS[trackId][0];

		const message: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content: `Đã reset ${TRACKS[trackId].displayName}. Hãy bắt đầu lại nhé!\n\n${firstQuestion}`,
			type: "text",
			timestamp: new Date().toISOString(),
			canvasActions: removedNodeIds.map((id) => ({
				action: "remove" as const,
				nodeId: id,
			})),
		};

		mockState.conversationHistory.push(message);

		return {
			message,
			trackStatus: "in_progress",
			currentTrackId: trackId,
			removedNodeIds,
		};
	},

	// GET /api/v1/persona/graph - Fetch persona graph with nodes and edges
	async getPersonaGraph(): Promise<PersonaGraphResponse> {
		await delay(600);
		return generateMockGraphData();
	},

	// ============================================
	// New Graph-Based Conversation API (v2)
	// ============================================

	// GET /v1/persona/conversation - Start/continue conversation
	async getConversation(): Promise<ConversationStartResponse> {
		await delay(600);

		// If no messages yet, create opening question
		if (graphMockState.messages.length === 0) {
			const category = getLowestCoverageCategory();
			const question = getQuestionForCategory(category);

			const message: ConversationMessage = {
				id: generateId(),
				role: "assistant",
				content: `Chào bạn! Tôi là mentor AI của Leaply, sẵn sàng giúp bạn khám phá câu chuyện cá nhân cho hành trình du học.\n\nHãy bắt đầu với câu hỏi đầu tiên:\n\n${question}`,
				type: "question",
				timestamp: new Date().toISOString(),
			};

			graphMockState.messages.push(message);
		}

		return {
			message: graphMockState.messages[graphMockState.messages.length - 1],
			coverage: { ...graphMockState.coverage },
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},

	// POST /v1/persona/conversation/message - Send message
	async sendConversationMessage(
		content: string,
	): Promise<GraphMessageResponse> {
		await delay(1000);

		// Add user message
		const userMessage: ConversationMessage = {
			id: generateId(),
			role: "user",
			content,
			type: "text",
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(userMessage);

		// Determine which category this response covers
		const category = getLowestCoverageCategory();

		// Update coverage (random 10-25 increase)
		const coverageIncrease = 10 + Math.floor(Math.random() * 15);
		updateCoverage(category, coverageIncrease);

		// Maybe create a node (60% chance)
		const nodesCreated: GraphNode[] = [];
		const edgesCreated: GraphEdge[] = [];
		let starGapsForLastStory: (keyof StarStructure)[] | null = null;

		if (Math.random() > 0.4) {
			const newNode = generateGraphNode(content, category);
			nodesCreated.push(newNode);
			graphMockState.graphNodes.push(newNode);
			graphMockState.totalNodeCount++;

			// Check for STAR gaps
			const gaps = graphMockState.starGaps.get(newNode.id);
			if (gaps && gaps.length > 0) {
				starGapsForLastStory = gaps;
			}

			// Maybe create edges to existing nodes (40% chance per existing node, max 2)
			const existingNodes = graphMockState.graphNodes.filter(
				(n) => n.id !== newNode.id,
			);
			let edgeCount = 0;
			for (const existingNode of existingNodes) {
				if (edgeCount >= 2) break;
				if (Math.random() > 0.6) {
					const isTension = Math.random() > 0.8; // 20% chance of tension edge
					const edge = generateGraphEdge(
						existingNode.id,
						newNode.id,
						isTension,
					);
					edgesCreated.push(edge);
					graphMockState.graphEdges.push(edge);
					edgeCount++;
				}
			}
		}

		// Extract voice sample
		const voiceSample = extractVoiceSample(content);

		// Check completion
		graphMockState.completionReady = checkCompletionReady();

		// Generate response
		let responseContent: string;
		let messageType: "text" | "question" | "completion" = "question";

		if (graphMockState.completionReady) {
			responseContent =
				"Tuyệt vời! 🎉 Bạn đã hoàn thành quá trình khám phá cá nhân!\n\nTôi đã thu thập được đủ thông tin để giúp bạn viết essay. Hãy xem lại các nodes trên canvas để chuẩn bị cho bước tiếp theo.";
			messageType = "completion";
		} else if (starGapsForLastStory && starGapsForLastStory.length > 0) {
			// Ask for missing STAR element
			const gap = starGapsForLastStory[0];
			responseContent = `Cảm ơn bạn đã chia sẻ! ${STAR_FOLLOWUPS[gap]}`;
		} else {
			// Ask next question based on lowest coverage
			const nextCategory = getLowestCoverageCategory();
			const nextQuestion = getQuestionForCategory(nextCategory);
			responseContent = `Cảm ơn bạn! Đây là một câu chuyện rất thú vị.\n\nCâu tiếp theo: ${nextQuestion}`;
		}

		const assistantMessage: ConversationMessage = {
			id: generateId(),
			role: "assistant",
			content: responseContent,
			type: messageType,
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(assistantMessage);

		return {
			message: assistantMessage,
			nodesCreated,
			edgesCreated,
			coverage: { ...graphMockState.coverage },
			voiceSample,
			completionReady: graphMockState.completionReady,
			starGapsForLastStory,
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},

	// POST /v1/persona/conversation/reset - Reset conversation
	async resetConversation(): Promise<ResetConversationResponse> {
		await delay(500);

		resetGraphMockState();

		const message: ConversationMessage = {
			id: generateId(),
			role: "assistant",
			content:
				"Đã reset cuộc trò chuyện. Hãy bắt đầu lại từ đầu!\n\n5-10 năm sau, bạn hình dung bản thân đang làm gì và ở đâu?",
			type: "question",
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(message);

		return {
			success: true,
			message,
		};
	},

	// POST /v1/persona/node/{nodeId}/expand - Expand node for more detail
	async expandNode(nodeId: string): Promise<NodeExpandResponse> {
		await delay(800);

		const gaps = graphMockState.starGaps.get(nodeId);
		let responseContent: string;

		if (gaps && gaps.length > 0) {
			const gap = gaps[0];
			responseContent = STAR_FOLLOWUPS[gap];

			// Remove this gap (user is now providing it)
			const remainingGaps = gaps.slice(1);
			if (remainingGaps.length > 0) {
				graphMockState.starGaps.set(nodeId, remainingGaps);
			} else {
				graphMockState.starGaps.delete(nodeId);
			}
		} else {
			responseContent =
				"Bạn có thể chia sẻ thêm chi tiết về trải nghiệm này không?";
		}

		const message: ConversationMessage = {
			id: generateId(),
			role: "assistant",
			content: responseContent,
			type: "question",
			timestamp: new Date().toISOString(),
		};
		graphMockState.messages.push(message);

		return {
			message,
			nodesCreated: [],
			edgesCreated: [],
			coverage: { ...graphMockState.coverage },
			voiceSample: null,
			completionReady: graphMockState.completionReady,
			starGapsForLastStory: gaps ? gaps.slice(1) : null,
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},

	// GET /v1/persona/coverage - Get current coverage
	async getCoverage(): Promise<CoverageResponse> {
		await delay(300);

		return {
			coverage: { ...graphMockState.coverage },
			completionReady: graphMockState.completionReady,
			totalNodeCount: graphMockState.totalNodeCount,
		};
	},
};

// ============================================
// Real API Implementation (for production)
// Uses apiClient for authenticated requests
// ============================================

const realPersonaApi = {
	async getPersonaState(): Promise<PersonaState> {
		return apiClient.get<PersonaState>("/v1/persona");
	},

	async selectTrack(trackId: TrackId): Promise<TrackSelectResponse> {
		return apiClient.post<TrackSelectResponse>("/v1/persona/track/select", {
			trackId,
		});
	},

	async sendMessage(content: string): Promise<MessageResponse> {
		return apiClient.post<MessageResponse>("/v1/persona/message", {
			content,
		});
	},

	async goBackToTrackSelection(): Promise<BackToTrackResponse> {
		return apiClient.post<BackToTrackResponse>("/v1/persona/track/back", {});
	},

	async redoTrack(trackId: TrackId): Promise<RedoTrackResponse> {
		return apiClient.post<RedoTrackResponse>(
			`/v1/persona/track/${trackId}/redo`,
			{},
		);
	},

	async extractKeywords(
		content: string,
		trackId: string,
	): Promise<KeywordResponse> {
		return apiClient.post<KeywordResponse>("/v1/persona/extract-keywords", {
			content,
			trackId,
		});
	},

	async getPersonaGraph(): Promise<PersonaGraphResponse> {
		return apiClient.get<PersonaGraphResponse>("/v1/persona/graph");
	},

	// ============================================
	// New Graph-Based Conversation API (v2)
	// ============================================

	async getConversation(): Promise<ConversationStartResponse> {
		return apiClient.get<ConversationStartResponse>("/v1/persona/conversation");
	},

	async sendConversationMessage(
		content: string,
	): Promise<GraphMessageResponse> {
		return apiClient.post<GraphMessageResponse>(
			"/v1/persona/conversation/message",
			{
				content,
			},
		);
	},

	async resetConversation(): Promise<ResetConversationResponse> {
		return apiClient.post<ResetConversationResponse>(
			"/v1/persona/conversation/reset",
			{},
		);
	},

	async expandNode(nodeId: string): Promise<NodeExpandResponse> {
		return apiClient.post<NodeExpandResponse>(
			`/v1/persona/node/${nodeId}/expand`,
			{},
		);
	},

	async getCoverage(): Promise<CoverageResponse> {
		return apiClient.get<CoverageResponse>("/v1/persona/coverage");
	},
};

// ============================================
// Export the appropriate API based on environment
// ============================================

export const personaApi = USE_MOCK ? mockPersonaApi : realPersonaApi;

// Export types for consumers
export type {
	PersonaState,
	TrackSelectResponse,
	MessageResponse,
	BackToTrackResponse,
	RedoTrackResponse,
	PersonaGraphResponse,
	// New graph-based conversation types
	ConversationStartResponse,
	GraphMessageResponse,
	ResetConversationResponse,
	NodeExpandResponse,
	CoverageResponse,
	Coverage,
	GraphNode,
	GraphEdge,
	ConversationMessage,
};
