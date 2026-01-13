"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import {
	type CoverageMetrics,
	type PersonaNodeDto,
	PersonaNodeDtoType,
} from "@/lib/generated/api/models";
import {
	getGetCoverageQueryKey,
	getGetGraphQueryKey,
	getGetPersonaStateQueryKey,
	useCoverage,
	useResetConversation,
	useSendMessage,
	useStartConversation,
	useSynthesizeProfile,
} from "@/lib/hooks/persona";
import type { StarStructureKey } from "@/lib/store/personaStore";
import {
	type ConversationMessage,
	selectApiGraphNodes,
	usePersonaStore,
} from "@/lib/store/personaStore";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { MessageInput } from "./MessageInput";

// Default coverage for loading state
const DEFAULT_COVERAGE: CoverageMetrics = {
	goals: 0,
	evidence: 0,
	skills: 0,
	values: 0,
	tensions: 0,
	overallProgress: 0,
};

export function ChatSidebar() {
	const t = useTranslations("personaLab");
	const router = useRouter();
	const queryClient = useQueryClient();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showResetDialog, setShowResetDialog] = useState(false);
	// Track when we started waiting for a response (for "Thought in X" display)
	const [thinkingStartTime, setThinkingStartTime] = useState<number | null>(
		null,
	);
	// Track latest extracted story for display in chat
	const [latestStory, setLatestStory] = useState<{
		node: PersonaNodeDto;
		gaps: StarStructureKey[];
	} | null>(null);

	// Get messages from store (persisted to localStorage)
	const messages = usePersonaStore((state) => state.graphMessages);
	const addGraphMessage = usePersonaStore((state) => state.addGraphMessage);
	const clearGraphMessages = usePersonaStore(
		(state) => state.clearGraphMessages,
	);

	// Store actions for graph updates (canvas will subscribe to these)
	const processGraphUpdate = usePersonaStore(
		(state) => state.processGraphUpdate,
	);
	const clearApiGraph = usePersonaStore((state) => state.clearApiGraph);

	// Mock mode state (development only)
	const mockMode = usePersonaStore((state) => state.mockMode);
	const mockScenario = usePersonaStore((state) => state.mockScenario);
	const setMockMode = usePersonaStore((state) => state.setMockMode);
	const setMockScenario = usePersonaStore((state) => state.setMockScenario);

	// TanStack Query hooks for API interactions
	const { data: coverageData } = useCoverage();

	// Hydration check to prevent premature fetching
	const hydrated = usePersonaStore((state) => state._hasHydrated);

	// Fetch opening message when no messages exist (for new users or after reset)
	// Only enabled when messages array is empty to avoid re-fetching on refresh
	const shouldFetchOpening = hydrated && messages.length === 0;
	const { data: conversationStart, isLoading: isLoadingOpening } =
		useStartConversation({
			query: { enabled: shouldFetchOpening },
		});

	// Add opening message to store when received
	// biome-ignore lint/correctness/useExhaustiveDependencies: We only want to run this when conversationStart changes and messages is empty
	useEffect(() => {
		// Response is ApiResponseGraphMessageResponse (mutator returns wrapped response)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const graphData = (conversationStart as any)?.data ?? conversationStart;
		if (graphData?.message && messages.length === 0) {
			const openingMessage: ConversationMessage = {
				id: graphData.message.id || `assistant-${Date.now()}`,
				role: "assistant",
				type: "text",
				content: graphData.message.content || "",
				timestamp: graphData.message.timestamp || new Date().toISOString(),
			};
			addGraphMessage(openingMessage);
		}
	}, [conversationStart]);

	const sendMessageMutation = useSendMessage();
	const resetMutation = useResetConversation();
	const synthesizeProfileMutation = useSynthesizeProfile();

	// Computed state from store
	const apiGraphNodes = usePersonaStore(selectApiGraphNodes);
	const storyNodeCount = apiGraphNodes.filter(
		(n) => n.type === PersonaNodeDtoType.key_story,
	).length;

	// Scroll to bottom on new messages
	const messageCount = messages.length;
	// biome-ignore lint/correctness/useExhaustiveDependencies: messageCount is intentionally used as a trigger
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messageCount, sendMessageMutation.isPending]);

	const handleSendMessage = useCallback(
		(content: string) => {
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

			// Send to API
			sendMessageMutation.mutate(
				{ data: { content } },
				{
					onSuccess: (response) => {
						// Calculate thinking duration
						const thinkingDuration = Date.now() - startTime;
						setThinkingStartTime(null);

						// Response is ApiResponseGraphMessageResponse (mutator returns wrapped response)
						console.log("🐛 [ChatSidebar] Raw API Response:", response);
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						const graphData = (response as any)?.data ?? response;
						console.log("🐛 [ChatSidebar] Parsed GraphData:", graphData);

						if (!graphData?.message) {
							console.warn(
								"🐛 [ChatSidebar] No message found in response data",
							);
						}

						// Add assistant response to store (persisted)
						if (graphData?.message) {
							const assistantMessage: ConversationMessage = {
								id: graphData.message.id || `assistant-${Date.now()}`,
								role:
									(graphData.message.role as "user" | "assistant") ||
									"assistant",
								type:
									(graphData.message.type as ConversationMessage["type"]) ||
									"text",
								content: graphData.message.content || "",
								timestamp:
									graphData.message.timestamp || new Date().toISOString(),
								thinkingDuration,
								status: "sent",
							};
							addGraphMessage(assistantMessage);
						}

						// Update store with graph data (canvas subscribes to this)
						if (graphData) {
							processGraphUpdate(graphData);

							// Check if a key_story was extracted - show it in chat
							const nodesCreated = graphData.nodesCreated ?? [];
							const storyNode = nodesCreated.find(
								(n: PersonaNodeDto) => n.type === "key_story",
							);
							if (storyNode) {
								const gaps = (graphData.starGapsForLastStory ??
									[]) as StarStructureKey[];
								setLatestStory({ node: storyNode, gaps });
							} else {
								setLatestStory(null);
							}

							// Show toast notification for created nodes
							if (nodesCreated.length > 0) {
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
						}

						// If completion is ready, add completion message
						if (graphData?.completionReady) {
							const completionMessage: ConversationMessage = {
								id: `completion-${Date.now()}`,
								role: "assistant",
								type: "completion",
								content: t("conversationComplete"),
								timestamp: new Date().toISOString(),
							};
							addGraphMessage(completionMessage);
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

						// Check for auto-synthesis (10+ story nodes)
						const currentNodes = usePersonaStore.getState().apiGraphNodes;
						const currentStoryCount = currentNodes.filter(
							(n) => n.type === PersonaNodeDtoType.key_story,
						).length;
						const hasProfile = currentNodes.some(
							(n) => n.type === PersonaNodeDtoType.profile_summary,
						);

						if (currentStoryCount >= 10 && !hasProfile) {
							console.log(
								"🤖 [ChatSidebar] Auto-triggering profile synthesis...",
							);
							synthesizeProfileMutation.mutate(undefined, {
								onSuccess: (node) => {
									toast.success(t("profileUnlocked"), {
										description: t("profileUnlockedDesc"),
									});
									// Add the new node to the graph
									processGraphUpdate({
										nodesCreated: [node],
									} as any);
								},
							});
						}
					},
				},
			);
		},
		[
			sendMessageMutation,
			t,
			processGraphUpdate,
			addGraphMessage,
			queryClient,
			synthesizeProfileMutation,
		],
	);

	const handleReset = useCallback(() => {
		setShowResetDialog(false);
		resetMutation.mutate(undefined, {
			onSuccess: (response) => {
				// Clear messages and add new opening message
				clearGraphMessages();
				// Response is ApiResponseGraphMessageResponse (mutator returns wrapped response)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const graphData = (response as any)?.data ?? response;
				if (graphData?.message) {
					const assistantMessage: ConversationMessage = {
						id: graphData.message.id || `assistant-${Date.now()}`,
						role: "assistant",
						type: "text",
						content: graphData.message.content || "",
						timestamp: graphData.message.timestamp || new Date().toISOString(),
					};
					addGraphMessage(assistantMessage);
				}
				// Clear graph data in store
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
	]);

	// Derived state - use CoverageMetrics directly from API
	// Response is ApiResponseCoverageMetrics (mutator returns wrapped response)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const coverageInner = (coverageData as any)?.data ?? coverageData;
	const coverage: CoverageMetrics = {
		goals: coverageInner?.goals ?? 0,
		evidence: coverageInner?.evidence ?? 0,
		skills: coverageInner?.skills ?? 0,
		values: coverageInner?.values ?? 0,
		tensions: coverageInner?.tensions ?? 0,
		lowestCategory: coverageInner?.lowestCategory,
		overallProgress: coverageInner?.overallProgress ?? 0,
	};
	const totalNodeCount = 0; // Not available in CoverageMetrics, use 0 as default
	const completionReady = (coverage.overallProgress ?? 0) >= 100;
	const isSending = sendMessageMutation.isPending || resetMutation.isPending;
	const error = sendMessageMutation.error?.message;

	// Show loading skeleton while fetching opening message or sending first message
	if (
		!hydrated ||
		isLoadingOpening ||
		(sendMessageMutation.isPending && messages.length === 0)
	) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader
					coverage={DEFAULT_COVERAGE}
					totalNodeCount={0}
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
			{/* Header with coverage progress */}
			<ChatHeader
				coverage={coverage}
				totalNodeCount={totalNodeCount}
				storyNodeCount={storyNodeCount}
				completionReady={completionReady}
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

			{/* Input or CTA when complete */}
			<div className="shrink-0">
				{completionReady ? (
					<div className="p-3 border-t border-border">
						<Button
							className="w-full"
							onClick={() => router.push("/applications")}
						>
							{t("goToApplications")}
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
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
