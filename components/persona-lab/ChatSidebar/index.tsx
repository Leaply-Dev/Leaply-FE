"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
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
import type { CoverageMetrics } from "@/lib/generated/api/models";
import {
	getGetCoverageQueryKey,
	useCoverage,
	useResetConversation,
	useSendMessage,
	useStartConversation,
} from "@/lib/hooks/persona";
import {
	type ConversationMessage,
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

	// TanStack Query hooks for API interactions
	const { data: coverageData } = useCoverage();

	// Fetch opening message when no messages exist (for new users or after reset)
	// Only enabled when messages array is empty to avoid re-fetching on refresh
	const shouldFetchOpening = messages.length === 0;
	const { data: conversationStart, isLoading: isLoadingOpening } =
		useStartConversation({
			query: { enabled: shouldFetchOpening },
		});

	// Add opening message to store when received
	// biome-ignore lint/correctness/useExhaustiveDependencies: We only want to run this when conversationStart changes and messages is empty
	useEffect(() => {
		if (conversationStart?.data?.message && messages.length === 0) {
			const openingMessage: ConversationMessage = {
				id: conversationStart.data.message.id || `assistant-${Date.now()}`,
				role: "assistant",
				type: "text",
				content: conversationStart.data.message.content || "",
				timestamp:
					conversationStart.data.message.timestamp || new Date().toISOString(),
			};
			addGraphMessage(openingMessage);
		}
	}, [conversationStart]);

	const sendMessageMutation = useSendMessage();
	const resetMutation = useResetConversation();

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
			// Add user message to store immediately (persisted)
			const userMessage: ConversationMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				type: "text",
				content,
				timestamp: new Date().toISOString(),
			};
			addGraphMessage(userMessage);

			// Send to API
			sendMessageMutation.mutate(
				{ data: { content } },
				{
					onSuccess: (response) => {
						// Response is already unwrapped by mutator (GraphMessageResponse)
						// Add assistant response to store (persisted)
						if (response?.message) {
							const assistantMessage: ConversationMessage = {
								id: response.message.id || `assistant-${Date.now()}`,
								role:
									(response.message.role as "user" | "assistant") ||
									"assistant",
								type:
									(response.message.type as ConversationMessage["type"]) ||
									"text",
								content: response.message.content || "",
								timestamp:
									response.message.timestamp || new Date().toISOString(),
							};
							addGraphMessage(assistantMessage);
						}

						// Update store with graph data (canvas subscribes to this)
						if (response) {
							processGraphUpdate(response);
						}

						// If completion is ready, add completion message
						if (response?.completionReady) {
							const completionMessage: ConversationMessage = {
								id: `completion-${Date.now()}`,
								role: "assistant",
								type: "completion",
								content: t("conversationComplete"),
								timestamp: new Date().toISOString(),
							};
							addGraphMessage(completionMessage);
						}
					},
				},
			);
		},
		[sendMessageMutation, t, processGraphUpdate, addGraphMessage],
	);

	const handleReset = useCallback(() => {
		setShowResetDialog(false);
		resetMutation.mutate(undefined, {
			onSuccess: (data) => {
				// Clear messages and add new opening message
				clearGraphMessages();
				// Reset API returns message as a string, create ConversationMessage from it
				if (data?.message) {
					const assistantMessage: ConversationMessage = {
						id: `assistant-${Date.now()}`,
						role: "assistant",
						type: "text",
						content: typeof data.message === "string" ? data.message : "",
						timestamp: new Date().toISOString(),
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
	const coverage: CoverageMetrics = {
		goals: coverageData?.data?.goals ?? 0,
		evidence: coverageData?.data?.evidence ?? 0,
		skills: coverageData?.data?.skills ?? 0,
		values: coverageData?.data?.values ?? 0,
		tensions: coverageData?.data?.tensions ?? 0,
		lowestCategory: coverageData?.data?.lowestCategory,
		overallProgress: coverageData?.data?.overallProgress ?? 0,
	};
	const totalNodeCount = 0; // Not available in CoverageMetrics, use 0 as default
	const completionReady = (coverage.overallProgress ?? 0) >= 100;
	const isSending = sendMessageMutation.isPending || resetMutation.isPending;
	const error = sendMessageMutation.error?.message;

	// Show loading skeleton while fetching opening message or sending first message
	if (
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
				completionReady={completionReady}
			/>

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
					{isSending && <TypingIndicator />}

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
