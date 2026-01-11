"use client";

import { RotateCcw } from "lucide-react";
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
import {
	useConversation,
	useCoverage,
	useResetConversation,
	useSendMessage,
} from "@/lib/hooks/usePersonaConversation";
import { usePersonaStore } from "@/lib/store/personaStore";
import type {
	ConversationMessage,
	Coverage,
	GraphMessageResponse,
	ResetConversationResponse,
} from "@/lib/types/persona";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { MessageInput } from "./MessageInput";

// Default coverage for loading state
const DEFAULT_COVERAGE: Coverage = {
	goals: 0,
	evidence: 0,
	skills: 0,
	values: 0,
	tensions: 0,
};

export function ChatSidebar() {
	const t = useTranslations("personaLab");
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showResetDialog, setShowResetDialog] = useState(false);

	// Local state for conversation messages (accumulated from API responses)
	const [messages, setMessages] = useState<ConversationMessage[]>([]);

	// Store actions for graph updates (canvas will subscribe to these)
	const processGraphUpdate = usePersonaStore(
		(state) => state.processGraphUpdate,
	);
	const clearApiGraph = usePersonaStore((state) => state.clearApiGraph);

	// TanStack Query hooks for API interactions
	const {
		data: conversationData,
		isLoading: isLoadingConversation,
		error: conversationError,
	} = useConversation();

	const { data: coverageData } = useCoverage();

	const sendMessageMutation = useSendMessage();
	const resetMutation = useResetConversation();

	// Initialize messages when conversation data loads
	useEffect(() => {
		if (conversationData?.message && messages.length === 0) {
			setMessages([conversationData.message]);
		}
	}, [conversationData, messages.length]);

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
			// Add user message to local state immediately
			const userMessage: ConversationMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				type: "text",
				content,
				timestamp: new Date().toISOString(),
			};
			setMessages((prev) => [...prev, userMessage]);

			// Send to API
			sendMessageMutation.mutate(content, {
				onSuccess: (data: GraphMessageResponse) => {
					// Add assistant response to messages
					setMessages((prev) => [...prev, data.message]);

					// Update store with graph data (canvas subscribes to this)
					processGraphUpdate(data);

					// If completion is ready, add completion message
					if (data.completionReady) {
						const completionMessage: ConversationMessage = {
							id: `completion-${Date.now()}`,
							role: "assistant",
							type: "completion",
							content: t("conversationComplete"),
							timestamp: new Date().toISOString(),
						};
						setMessages((prev) => [...prev, completionMessage]);
					}
				},
			});
		},
		[sendMessageMutation, t, processGraphUpdate],
	);

	const handleReset = useCallback(() => {
		setShowResetDialog(false);
		resetMutation.mutate(undefined, {
			onSuccess: (data: ResetConversationResponse) => {
				// Reset local messages with new opening message
				setMessages([data.message]);
				// Clear graph data in store
				clearApiGraph();
			},
		});
	}, [resetMutation, clearApiGraph]);

	// Derived state
	const coverage = coverageData?.coverage || DEFAULT_COVERAGE;
	const totalNodeCount = coverageData?.totalNodeCount || 0;
	const completionReady = coverageData?.completionReady || false;
	const isSending = sendMessageMutation.isPending || resetMutation.isPending;
	const error =
		conversationError?.message || sendMessageMutation.error?.message;

	// Show loading skeleton while fetching initial state
	if (isLoadingConversation && messages.length === 0) {
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
							{t("resetConversation")}
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

			{/* Input - always shown for new conversation flow */}
			<div className="flex-shrink-0">
				<MessageInput
					onSend={handleSendMessage}
					disabled={isSending || completionReady}
					placeholder={
						completionReady ? t("conversationComplete") : t("shareYourStory")
					}
				/>
			</div>
		</div>
	);
}

// ============================================
// Legacy ChatSidebar (deprecated)
// Keep for backward compatibility during migration
// ============================================

import type { TrackId } from "@/lib/types/persona";
import { BackToTracksButton } from "./BackToTracksButton";
import { LegacyChatMessage } from "./ChatMessage";

/** @deprecated Use ChatSidebar instead */
export function LegacyChatSidebar() {
	const t = useTranslations("personaLab");
	const {
		conversationHistory,
		currentTrackId,
		isLoading,
		isSending,
		error,
		fetchPersonaState,
		selectTrack,
		sendMessage,
		goBackToTrackSelection,
		extractKeywords,
	} = usePersonaStore();

	const scrollRef = useRef<HTMLDivElement>(null);

	// Fetch persona state on mount
	useEffect(() => {
		fetchPersonaState();
	}, [fetchPersonaState]);

	// Scroll to bottom on new messages
	const messageCount = conversationHistory.length;
	// biome-ignore lint/correctness/useExhaustiveDependencies: messageCount is intentionally used as a trigger
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messageCount]);

	const handleTrackSelect = (trackId: TrackId) => {
		selectTrack(trackId);
	};

	const handleSendMessage = (content: string) => {
		sendMessage(content);
		// Extract keywords in parallel for instant canvas feedback
		if (currentTrackId) {
			extractKeywords(content, currentTrackId);
		}
	};

	const handleBackToTracks = () => {
		goBackToTrackSelection();
	};

	// Placeholder coverage for legacy usage
	const legacyCoverage: Coverage = {
		goals: 0,
		evidence: 0,
		skills: 0,
		values: 0,
		tensions: 0,
	};

	// Show loading skeleton while fetching initial state
	if (isLoading && conversationHistory.length === 0) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader coverage={legacyCoverage} />
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
			{/* Header with progress */}
			<ChatHeader coverage={legacyCoverage} />

			{/* Back to tracks button (show during active track) */}
			{currentTrackId && (
				<BackToTracksButton onClick={handleBackToTracks} disabled={isSending} />
			)}

			{/* Messages */}
			<ScrollArea className="flex-1 p-3" type="always">
				<div className="space-y-3">
					{conversationHistory.map((message, index) => (
						<LegacyChatMessage
							key={`${message.id}-${index}`}
							message={message}
							onTrackSelect={handleTrackSelect}
							isLoading={isSending}
						/>
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

			{/* Input - sticky at bottom, only show when track is active */}
			{currentTrackId && (
				<div className="shrink-0">
					<MessageInput
						onSend={handleSendMessage}
						disabled={isSending}
						placeholder={t("shareYourStory")}
					/>
				</div>
			)}
		</div>
	);
}

export { BackToTracksButton } from "./BackToTracksButton";
// Re-export components for external use
export { ChatHeader, LegacyChatHeader } from "./ChatHeader";
export { ChatMessage, LegacyChatMessage, TypingIndicator } from "./ChatMessage";
export { MessageInput } from "./MessageInput";
export { TrackActionCards } from "./TrackActionCards";
