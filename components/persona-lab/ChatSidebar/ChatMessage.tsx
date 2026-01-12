"use client";

import { motion } from "framer-motion";
import { PartyPopper, Sparkles, User } from "lucide-react";
import type { ConversationMessage } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
	message: ConversationMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
	const isUser = message.role === "user";
	const isAssistant = message.role === "assistant";
	const isCompletion = message.type === "completion";

	// Completion message with celebration styling
	if (isCompletion) {
		return (
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.3 }}
				className="space-y-2"
			>
				<div className="flex gap-2">
					<div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
						<PartyPopper className="w-3 h-3" />
					</div>
					<div
						className={cn(
							"px-3 py-2 rounded-xl text-sm max-w-[85%]",
							"bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-tl-none",
						)}
					>
						<MessageContent content={message.content} />
					</div>
				</div>
			</motion.div>
		);
	}

	// Regular message bubble (text or question)
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
			className={cn("flex gap-2", isUser ? "flex-row-reverse" : "flex-row")}
		>
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
		</motion.div>
	);
}

// Helper component to render message content with markdown-like formatting
function MessageContent({ content }: { content: string }) {
	// Simple markdown-like rendering for bold text
	const parts = content.split(/(\*\*.*?\*\*)/g);

	return (
		<span className="whitespace-pre-wrap">
			{parts.map((part, index) => {
				if (part.startsWith("**") && part.endsWith("**")) {
					return (
						<strong key={`${part}-${index}`} className="font-semibold">
							{part.slice(2, -2)}
						</strong>
					);
				}
				return <span key={`text-${index}`}>{part}</span>;
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
