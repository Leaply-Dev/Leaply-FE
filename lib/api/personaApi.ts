// Persona Lab API Client
// Aligned with backend API specification

import {
	createInitialTracks,
	TRACK_EMOJIS,
	TRACKS,
} from "@/lib/constants/tracks";
import type {
	ArchetypeType,
	BackToTrackResponse,
	CanvasNode,
	ChatMessage,
	MessageResponse,
	NodeType,
	PersonaState,
	RedoTrackResponse,
	TrackAction,
	TrackId,
	TrackSelectResponse,
	TrackStatus,
} from "@/lib/types/persona";

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true" || true; // Default to mock for demo

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

function createTrackActions(currentTrackId: TrackId | null): TrackAction[] {
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
		actions: createTrackActions(null),
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
		const firstQuestion = MOCK_QUESTIONS[trackId][0];

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
					actions: createTrackActions(null).filter(
						(a) => a.status !== "completed",
					),
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
			const nextQuestion = MOCK_QUESTIONS[trackId][mockState.coreQuestionIndex];
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
			actions: createTrackActions(null),
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
};

// ============================================
// Real API Implementation (for production)
// ============================================

const realPersonaApi = {
	async getPersonaState(): Promise<PersonaState> {
		const response = await fetch(`${API_BASE_URL}/persona`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch persona state: ${response.statusText}`);
		}

		return response.json();
	},

	async selectTrack(trackId: TrackId): Promise<TrackSelectResponse> {
		const response = await fetch(`${API_BASE_URL}/persona/track/select`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ trackId }),
		});

		if (!response.ok) {
			throw new Error(`Failed to select track: ${response.statusText}`);
		}

		return response.json();
	},

	async sendMessage(content: string): Promise<MessageResponse> {
		const response = await fetch(`${API_BASE_URL}/persona/message`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ content }),
		});

		if (!response.ok) {
			throw new Error(`Failed to send message: ${response.statusText}`);
		}

		return response.json();
	},

	async goBackToTrackSelection(): Promise<BackToTrackResponse> {
		const response = await fetch(`${API_BASE_URL}/persona/track/back`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			throw new Error(`Failed to go back: ${response.statusText}`);
		}

		return response.json();
	},

	async redoTrack(trackId: TrackId): Promise<RedoTrackResponse> {
		const response = await fetch(
			`${API_BASE_URL}/persona/track/${trackId}/redo`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to redo track: ${response.statusText}`);
		}

		return response.json();
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
};
