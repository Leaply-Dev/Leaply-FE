"use client";

import { Sparkles, User } from "lucide-react";
import type {
	ChatMessage as ChatMessageType,
	TrackId,
} from "@/lib/types/persona";
import { cn } from "@/lib/utils";
import { TrackActionCards } from "./TrackActionCards";

interface ChatMessageProps {
	message: ChatMessageType;
	onTrackSelect: (trackId: TrackId) => void;
	isLoading?: boolean;
}

export function ChatMessage({
	message,
	onTrackSelect,
	isLoading = false,
}: ChatMessageProps) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";

	// Render track selection message
	if (
		(message.type === "track_selection" || message.type === "track_complete") &&
		message.actions &&
		message.actions.length > 0
	) {
		return (
			<div className="space-y-2">
				{/* Message bubble */}
				<div className="flex gap-2">
					<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0">
						<Sparkles className="w-3 h-3" />
					</div>
					<div
						className={cn(
							"px-3 py-2 rounded-xl text-sm max-w-[85%]",
							"bg-muted/50 border border-border rounded-tl-none",
							message.type === "track_complete" &&
								"border-primary/30 bg-primary/5",
						)}
					>
						<MessageContent content={message.content} />
					</div>
				</div>

				{/* Track action cards */}
				<TrackActionCards
					tracks={message.actions}
					onSelect={onTrackSelect}
					disabled={isLoading}
				/>
			</div>
		);
	}

	// Regular message bubble
	return (
		<div className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}>
			<div
				className={cn(
					"w-6 h-6 rounded-full flex items-center justify-center shrink-0",
					isAssistant ? "bg-primary text-primary-foreground" : "bg-muted",
				)}
			>
				{isAssistant ? (
					<Sparkles className="w-3 h-3" />
				) : (
					<User className="w-3 h-3" />
				)}
			</div>
			<div
				className={cn(
					"px-3 py-2 rounded-xl text-sm max-w-[85%]",
					isAssistant
						? "bg-muted/50 border border-border rounded-tl-none"
						: "bg-primary text-primary-foreground rounded-tr-none",
				)}
			>
				<MessageContent content={message.content} />
			</div>
		</div>
	);
}

// Helper component to render message content with markdown-like formatting
function MessageContent({ content }: { content: string }) {
	// Simple markdown-like rendering for bold text
	const parts = content.split(/(\*\*.*?\*\*)/g);

	return (
		<span className="whitespace-pre-wrap">
			{parts.map((part, i) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					return (
						<strong key={i} className="font-semibold">
							{part.slice(2, -2)}
						</strong>
					);
				}
				return <span key={i}>{part}</span>;
			})}
		</span>
	);
}

// Typing indicator component
export function TypingIndicator() {
	return (
		<div className="flex gap-2">
			<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
				<Sparkles className="w-3 h-3 animate-pulse" />
			</div>
			<div className="bg-muted/50 border border-border px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1">
				<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
				<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
				<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
			</div>
		</div>
	);
}
