"use client";

import { useQueryClient } from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { ensureFreshToken } from "@/lib/api/client";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import type { ArchetypeKey } from "@/lib/config/archetypeConfig";
import type { PartKey, PartsProgress } from "@/lib/config/partsConfig";
import {
	areAllPartsComplete,
	DEFAULT_PARTS_PROGRESS,
} from "@/lib/config/partsConfig";
import {
	type GuidedConversationState as ApiGuidedConversationState,
	type CanvasActionDto,
	type GuidedMessageResponse,
	type PartsStatus,
	type PersonaNodeDto,
	PersonaNodeDtoType,
} from "@/lib/generated/api/models";
import {
	getGetCoverageQueryKey,
	getGetGraphQueryKey,
	getGetPersonaStateQueryKey,
	useGenerateArchetype,
	useResetGuidedConversation,
	useSendGuidedMessage,
	useStartGuidedConversation,
} from "@/lib/hooks/persona";
import { useIsHydrated } from "@/lib/hooks/useStoresHydrated";
import type {
	StarStructureKey,
	GuidedConversationState as StoreGuidedConversationState,
} from "@/lib/store/personaStore";
import {
	type ConversationMessage,
	selectApiGraphNodes,
	selectPartsProgress,
	usePersonaStore,
} from "@/lib/store/personaStore";
import { ArchetypeCelebrationModal } from "../ArchetypeCelebrationModal";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { MessageInput } from "./MessageInput";

/**
 * Convert API PartsStatus to frontend PartsProgress
 */
const convertPartsStatus = (status: PartsStatus): PartsProgress => ({
	part1: (status.part1 as PartsProgress["part1"]) || "not_started",
	part2: (status.part2 as PartsProgress["part2"]) || "not_started",
	part3: (status.part3 as PartsProgress["part3"]) || "not_started",
	part4: (status.part4 as PartsProgress["part4"]) || "not_started",
});

/**
 * Convert API GuidedConversationState to store GuidedConversationState
 */
const convertConversationState = (
	state: ApiGuidedConversationState,
): StoreGuidedConversationState => {
	// Map currentPart number to PartKey
	const partKeys: PartKey[] = ["part1", "part2", "part3", "part4"];
	const currentPart =
		typeof state.currentPart === "number" && state.currentPart >= 1
			? partKeys[state.currentPart - 1] || null
			: null;

	return {
		phase: state.phase === "completed" ? "completed" : ("questioning" as const),
		currentPart,
		currentQuestionId: state.currentQuestionId || null,
		followUpCount: state.followUpCount || 0,
	};
};

export function ChatSidebar() {
	const t = useTranslations("personaLab");
	const queryClient = useQueryClient();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showResetDialog, setShowResetDialog] = useState(false);
	// Track when we started waiting for a response (for "Thought in X" display)
	const [thinkingStartTime, setThinkingStartTime] = useState<number | null>(
		null,
	);
	// Track latest extracted story for display in chat
	const [_latestStory, setLatestStory] = useState<{
		node: PersonaNodeDto;
		gaps: StarStructureKey[];
	} | null>(null);

	// Get messages from store (persisted to localStorage)
	const messages = usePersonaStore((state) => state.graphMessages);
	const addGraphMessage = usePersonaStore((state) => state.addGraphMessage);
	const updateMessageStatus = usePersonaStore(
		(state) => state.updateMessageStatus,
	);
	const clearGraphMessages = usePersonaStore(
		(state) => state.clearGraphMessages,
	);

	// Store actions for graph updates (canvas will subscribe to these)
	const processGraphUpdate = usePersonaStore(
		(state) => state.processGraphUpdate,
	);
	const clearApiGraph = usePersonaStore((state) => state.clearApiGraph);

	// Parts progress from store
	const partsProgress = usePersonaStore(selectPartsProgress);

	// Archetype state
	const archetypeRevealed = usePersonaStore((state) => state.archetypeRevealed);
	const completionReady = usePersonaStore((state) => state.completionReady);

	// Mock mode state (development only)
	const mockMode = usePersonaStore((state) => state.mockMode);
	const mockScenario = usePersonaStore((state) => state.mockScenario);
	const setMockMode = usePersonaStore((state) => state.setMockMode);
	const setMockScenario = usePersonaStore((state) => state.setMockScenario);

	// Consolidated hydration check - waits for ALL stores
	const isHydrated = useIsHydrated();

	// Fetch opening message when no messages exist (for new users or after reset)
	// Only enabled when messages array is empty to avoid re-fetching on refresh
	const shouldFetchOpening = isHydrated && messages.length === 0;

	// Store actions for parts progress
	const setPartsProgress = usePersonaStore((state) => state.setPartsProgress);
	const setConversationState = usePersonaStore(
		(state) => state.setConversationState,
	);
	const setArchetype = usePersonaStore((state) => state.setArchetype);

	const { data: conversationStart, isLoading: isLoadingOpening } =
		useStartGuidedConversation({
			query: { enabled: shouldFetchOpening },
		});

	// Add opening message to store when received
	// biome-ignore lint/correctness/useExhaustiveDependencies: We only want to run this when conversationStart changes and messages is empty
	useEffect(() => {
		const guidedData = unwrapResponse<GuidedMessageResponse>(conversationStart);

		if (guidedData?.message && messages.length === 0) {
			const openingMessage: ConversationMessage = {
				id: guidedData.message.id || `assistant-${Date.now()}`,
				role: "assistant",
				type: "text",
				content: guidedData.message.content || "",
				timestamp: guidedData.message.timestamp || new Date().toISOString(),
			};
			addGraphMessage(openingMessage);

			// Sync parts progress from server
			if (guidedData.partsProgress) {
				setPartsProgress(convertPartsStatus(guidedData.partsProgress));
			}
			// Sync conversation state
			if (guidedData.conversationState) {
				setConversationState(
					convertConversationState(guidedData.conversationState),
				);
			}
		}
	}, [conversationStart]);

	const sendMessageMutation = useSendGuidedMessage();
	const resetMutation = useResetGuidedConversation();
	const generateArchetypeMutation = useGenerateArchetype();

	// Computed state from store
	const apiGraphNodes = usePersonaStore(selectApiGraphNodes);
	const storyNodeCount = apiGraphNodes.filter(
		(n) => n.type === PersonaNodeDtoType.key_story,
	).length;

	// Check if all parts are complete
	const allPartsComplete = areAllPartsComplete(partsProgress);

	// Scroll to bottom on new messages
	const messageCount = messages.length;
	// biome-ignore lint/correctness/useExhaustiveDependencies: messageCount is intentionally used as a trigger
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messageCount, sendMessageMutation.isPending]);

	const handleSendMessage = useCallback(
		async (content: string) => {
			// Ensure token is fresh before starting long-running AI request
			// This prevents "Authentication required" errors mid-conversation
			const tokenFresh = await ensureFreshToken();
			if (!tokenFresh) {
				toast.error(t("sessionExpired"), {
					description: t("pleaseLoginAgain"),
				});
				return;
			}

			// Track when we started thinking
			const startTime = Date.now();
			setThinkingStartTime(startTime);

			// Add user message to store immediately (persisted)
			const userMessage: ConversationMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				type: "text",
				content,
				timestamp: new Date().toISOString(),
				status: "sending",
			};
			addGraphMessage(userMessage);

			// Send to API (guided flow)
			sendMessageMutation.mutate(
				{ data: { content } },
				{
					onSuccess: (response) => {
						// Calculate thinking duration
						const thinkingDuration = Date.now() - startTime;
						setThinkingStartTime(null);

						// Mark user message as sent (prevents duplication in syncWithServer)
						updateMessageStatus(userMessage.id, "sent");

						// Unwrap response - now GuidedMessageResponse
						const guidedData = unwrapResponse<GuidedMessageResponse>(response);

						// Add assistant response to store (persisted)
						if (guidedData?.message) {
							const assistantMessage: ConversationMessage = {
								id: guidedData.message.id || `assistant-${Date.now()}`,
								role:
									(guidedData.message.role as "user" | "assistant") ||
									"assistant",
								type:
									(guidedData.message.type as ConversationMessage["type"]) ||
									"text",
								content: guidedData.message.content || "",
								timestamp:
									guidedData.message.timestamp || new Date().toISOString(),
								thinkingDuration,
								status: "sent",
							};
							addGraphMessage(assistantMessage);
						}

						// Update parts progress from response
						if (guidedData?.partsProgress) {
							setPartsProgress(convertPartsStatus(guidedData.partsProgress));
						}

						// Update conversation state
						if (guidedData?.conversationState) {
							setConversationState(
								convertConversationState(guidedData.conversationState),
							);
						}

						// Process nodes created (for graph visualization)
						if (
							guidedData?.nodesCreated &&
							guidedData.nodesCreated.length > 0
						) {
							// Update store with graph data (canvas subscribes to this)
							processGraphUpdate({
								nodesCreated: guidedData.nodesCreated,
								totalNodeCount: guidedData.totalNodeCount,
								completionReady: guidedData.completionReady,
								// biome-ignore lint/suspicious/noExplicitAny: Partial graph update
							} as any);

							// Check if a key_story was extracted - show it in chat
							const nodesCreated = guidedData.nodesCreated;
							const storyNode = nodesCreated.find(
								(n: PersonaNodeDto) => n.type === "key_story",
							);
							if (storyNode) {
								setLatestStory({ node: storyNode, gaps: [] });
							} else {
								setLatestStory(null);
							}

							// Show toast notification for created nodes
							const storyCount = nodesCreated.filter(
								(n: PersonaNodeDto) => n.type === "key_story",
							).length;
							const detailCount = nodesCreated.filter(
								(n: PersonaNodeDto) => n.type === "detail",
							).length;

							if (storyCount > 0) {
								toast.success("Story captured!", {
									description: `Added ${storyCount} story${storyCount > 1 ? "s" : ""} to your profile`,
								});
							} else if (detailCount > 0) {
								toast.info("Details added", {
									description: `${detailCount} insight${detailCount > 1 ? "s" : ""} added to your graph`,
								});
							}
						}

						// If completion is ready, handle archetype from response
						if (guidedData?.completionReady) {
							// Add completion message
							const completionMessage: ConversationMessage = {
								id: `completion-${Date.now()}`,
								role: "assistant",
								type: "completion",
								content: t("conversationComplete"),
								timestamp: new Date().toISOString(),
							};
							addGraphMessage(completionMessage);

							// Archetype is now auto-generated by backend and included in response
							if (guidedData.archetype?.type) {
								setArchetype(
									guidedData.archetype.type as ArchetypeKey,
									guidedData.archetype.personalizedSummary,
									guidedData.archetype.rarity,
								);
								toast.success(t("archetypeRevealed"), {
									description: t("archetypeRevealedDesc"),
								});
							} else {
								// Fallback: call generate archetype mutation if not in response
								generateArchetypeMutation.mutate(undefined, {
									onSuccess: (archetypeResponse) => {
										const archetypeData =
											unwrapResponse<CanvasActionDto>(archetypeResponse);
										if (archetypeData?.archetype?.type) {
											setArchetype(
												archetypeData.archetype.type as ArchetypeKey,
												archetypeData.archetype.personalizedSummary,
												archetypeData.archetype.rarity,
											);
											toast.success(t("archetypeRevealed"), {
												description: t("archetypeRevealedDesc"),
											});
										}
									},
								});
							}
						}

						// Invalidate queries to refresh data from server
						queryClient.invalidateQueries({
							queryKey: getGetCoverageQueryKey(),
						});
						queryClient.invalidateQueries({
							queryKey: getGetPersonaStateQueryKey(),
						});
						queryClient.invalidateQueries({
							queryKey: getGetGraphQueryKey(),
						});
					},
				},
			);
		},
		[
			sendMessageMutation,
			t,
			processGraphUpdate,
			addGraphMessage,
			updateMessageStatus,
			queryClient,
			generateArchetypeMutation,
			setPartsProgress,
			setConversationState,
			setArchetype,
		],
	);

	const handleReset = useCallback(() => {
		setShowResetDialog(false);
		resetMutation.mutate(undefined, {
			onSuccess: (response) => {
				// Clear messages and add new opening message
				clearGraphMessages();
				const guidedData = unwrapResponse<GuidedMessageResponse>(response);
				if (guidedData?.message) {
					const assistantMessage: ConversationMessage = {
						id: guidedData.message.id || `assistant-${Date.now()}`,
						role: "assistant",
						type: "text",
						content: guidedData.message.content || "",
						timestamp: guidedData.message.timestamp || new Date().toISOString(),
					};
					addGraphMessage(assistantMessage);
				}
				// Reset parts progress from response or to defaults
				if (guidedData?.partsProgress) {
					setPartsProgress(convertPartsStatus(guidedData.partsProgress));
				}
				// Clear graph data in store (also resets parts progress)
				clearApiGraph();
				// Invalidate coverage query to refresh progress bar
				queryClient.invalidateQueries({ queryKey: getGetCoverageQueryKey() });
			},
		});
	}, [
		resetMutation,
		clearApiGraph,
		clearGraphMessages,
		addGraphMessage,
		queryClient,
		setPartsProgress,
	]);

	const isSending = sendMessageMutation.isPending || resetMutation.isPending;
	const error = sendMessageMutation.error?.message;

	// Show loading skeleton while fetching opening message or sending first message
	if (
		!isHydrated ||
		isLoadingOpening ||
		(sendMessageMutation.isPending && messages.length === 0)
	) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader
					partsProgress={DEFAULT_PARTS_PROGRESS}
					completionReady={false}
				/>
				<div className="flex-1 min-h-0 p-4 space-y-4">
					<div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			{/* Archetype celebration modal */}
			<ArchetypeCelebrationModal />

			{/* Header with parts progress */}
			<ChatHeader
				partsProgress={partsProgress}
				storyNodeCount={storyNodeCount}
				completionReady={completionReady || allPartsComplete}
			/>

			{/* Mock Mode Controls (Development Only) */}
			{process.env.NODE_ENV === "development" && (
				<div className="border-b bg-muted/50 p-2">
					<div className="flex items-center justify-between gap-3">
						<div className="flex items-center gap-2">
							<Toggle
								pressed={mockMode}
								onPressedChange={(pressed) => {
									setMockMode(pressed);
									if (!pressed) {
										clearApiGraph();
										clearGraphMessages();
									}
								}}
								size="sm"
								className="h-7"
							>
								Mock mode
							</Toggle>
						</div>
						{mockMode && (
							<Select value={mockScenario} onValueChange={setMockScenario}>
								<SelectTrigger className="h-7 w-35 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="fresh-start">Fresh Start</SelectItem>
									<SelectItem value="building-momentum">Building</SelectItem>
									<SelectItem value="tension-discovery">Tensions</SelectItem>
									<SelectItem value="completion-ready">Complete</SelectItem>
								</SelectContent>
							</Select>
						)}
					</div>
				</div>
			)}

			{/* Reset button with confirmation dialog */}
			<div className="px-3 py-2 border-b border-border flex justify-end">
				<Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
					<DialogTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground hover:text-foreground"
							disabled={isSending}
						>
							<RotateCcw className="w-3 h-3 mr-1" />
							{t("resetData")}
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>{t("resetConfirmTitle")}</DialogTitle>
							<DialogDescription>
								{t("resetConfirmDescription")}
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setShowResetDialog(false)}
							>
								{t("cancel")}
							</Button>
							<Button variant="destructive" onClick={handleReset}>
								{t("confirmReset")}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-3" type="always">
				<div className="space-y-3">
					{messages.map((message, index) => (
						<ChatMessage key={`${message.id}-${index}`} message={message} />
					))}

					{/* Typing indicator */}
					{isSending && <TypingIndicator startTime={thinkingStartTime} />}

					{/* Error message */}
					{error && (
						<div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
							{error}
						</div>
					)}

					<div ref={scrollRef} />
				</div>
			</ScrollArea>

			{/* Input or completion message when done */}
			<div className="shrink-0">
				{(completionReady || allPartsComplete) && archetypeRevealed ? (
					<MessageInput
						onSend={handleSendMessage}
						disabled={true}
						completionMessage={t("conversationCompleteNote")}
					/>
				) : (
					<MessageInput
						onSend={handleSendMessage}
						disabled={isSending}
						placeholder={t("shareYourStory")}
					/>
				)}
			</div>
		</div>
	);
}

// Re-export components for external use
export { ChatHeader } from "./ChatHeader";
export { ChatMessage, TypingIndicator } from "./ChatMessage";
export { MessageInput } from "./MessageInput";
