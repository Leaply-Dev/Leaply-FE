"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Brain, PartyPopper, Sparkles, User } from "lucide-react";
import { useEffect, useState } from "react";
import type { ConversationMessage } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

// Format thinking duration in a human-readable way (e.g., "1m 4s")
function formatThinkingDuration(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	if (seconds < 60) {
		return `${seconds}s`;
	}
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	if (remainingSeconds === 0) {
		return `${minutes}m`;
	}
	return `${minutes}m ${remainingSeconds}s`;
}

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
			<div className="flex flex-col gap-1 max-w-[85%]">
				<div
					className={cn(
						"px-3 py-2 rounded-xl text-sm",
						isAssistant
							? "bg-muted/50 border border-border rounded-tl-none"
							: "bg-primary text-primary-foreground rounded-tr-none",
					)}
				>
					<MessageContent content={message.content} />
				</div>
				{/* Thinking duration for assistant messages */}
				{isAssistant && message.thinkingDuration && (
					<span className="text-[10px] text-muted-foreground/60 ml-1">
						Thought for {formatThinkingDuration(message.thinkingDuration)}
					</span>
				)}
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

// Agentic action phrases that cycle during loading
const AGENTIC_ACTIONS = [
	"Analyzing your story...",
	"Finding patterns...",
	"Connecting insights...",
	"Arranging narrative...",
	"Discovering themes...",
];

// Format elapsed time in a human-readable way
function formatElapsedTime(ms: number): string {
	const seconds = Math.floor(ms / 1000);
	if (seconds < 60) {
		return `${seconds}s`;
	}
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}m${remainingSeconds}s`;
}

interface TypingIndicatorProps {
	startTime?: number | null;
}

// Agentic loading indicator component
export function TypingIndicator({ startTime }: TypingIndicatorProps) {
	const [actionIndex, setActionIndex] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);

	// Cycle through action phrases
	useEffect(() => {
		const interval = setInterval(() => {
			setActionIndex((prev) => (prev + 1) % AGENTIC_ACTIONS.length);
		}, 2000);
		return () => clearInterval(interval);
	}, []);

	// Track elapsed time
	useEffect(() => {
		if (!startTime) return;

		const interval = setInterval(() => {
			setElapsedTime(Date.now() - startTime);
		}, 1000);

		return () => clearInterval(interval);
	}, [startTime]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="flex gap-2"
		>
			{/* Animated intelligence icon */}
			<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center relative">
				<Brain className="w-3 h-3" />
				{/* Pulsing ring effect */}
				<motion.div
					className="absolute inset-0 rounded-full border-2 border-primary"
					initial={{ scale: 1, opacity: 0.5 }}
					animate={{ scale: 1.5, opacity: 0 }}
					transition={{
						duration: 1.2,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeOut",
					}}
				/>
			</div>

			{/* Agentic action text with skeleton bubble */}
			<div className="bg-muted/50 border border-border px-3 py-2 rounded-xl rounded-tl-none flex flex-col gap-1 min-w-36">
				<div className="flex items-center gap-2">
					{/* Animated sparkle */}
					<motion.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						}}
					>
						<Sparkles className="w-3 h-3 text-primary/60" />
					</motion.div>

					{/* Action text with fade transition */}
					<AnimatePresence mode="wait">
						<motion.span
							key={actionIndex}
							initial={{ opacity: 0, y: 5 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -5 }}
							transition={{ duration: 0.2 }}
							className="text-xs text-muted-foreground"
						>
							{AGENTIC_ACTIONS[actionIndex]}
						</motion.span>
					</AnimatePresence>
				</div>

				{/* Elapsed time indicator */}
				{elapsedTime > 0 && (
					<span className="text-[10px] text-muted-foreground/60">
						{formatElapsedTime(elapsedTime)}
					</span>
				)}
			</div>
		</motion.div>
	);
}
