"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { TrackId } from "@/lib/types/persona";
import { BackToTracksButton } from "./BackToTracksButton";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { MessageInput } from "./MessageInput";

export function ChatSidebar() {
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

	// Show loading skeleton while fetching initial state
	if (isLoading && conversationHistory.length === 0) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader />
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
			<ChatHeader />

			{/* Back to tracks button (show during active track) */}
			{currentTrackId && (
				<BackToTracksButton onClick={handleBackToTracks} disabled={isSending} />
			)}

			{/* Messages */}
			<ScrollArea className="flex-1 p-3" type="always">
				<div className="space-y-3">
					{conversationHistory.map((message, index) => (
						<ChatMessage
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
				<div className="flex-shrink-0">
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
export { ChatHeader } from "./ChatHeader";
export { ChatMessage, TypingIndicator } from "./ChatMessage";
export { MessageInput } from "./MessageInput";
export { TrackActionCards } from "./TrackActionCards";
