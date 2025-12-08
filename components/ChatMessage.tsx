import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
	role: "user" | "assistant";
	content: string;
	timestamp?: string;
	className?: string;
}

export function ChatMessage({
	role,
	content,
	timestamp,
	className,
}: ChatMessageProps) {
	const isAssistant = role === "assistant";

	return (
		<div
			className={cn(
				"flex gap-3 mb-4",
				isAssistant ? "justify-start" : "justify-end",
				className,
			)}
		>
			{isAssistant && (
				<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
					<Bot className="w-5 h-5 text-primary-foreground" />
				</div>
			)}

			<div
				className={cn(
					"max-w-[80%] rounded-lg px-4 py-3",
					isAssistant
						? "bg-card border border-border"
						: "bg-primary text-primary-foreground",
				)}
			>
				<p
					className={cn(
						"text-sm whitespace-pre-wrap",
						isAssistant ? "text-foreground" : "text-primary-foreground",
					)}
				>
					{content}
				</p>
				{timestamp && (
					<p
						className={cn(
							"text-xs mt-1",
							isAssistant
								? "text-muted-foreground"
								: "text-primary-foreground/70",
						)}
					>
						{new Date(timestamp).toLocaleTimeString()}
					</p>
				)}
			</div>

			{!isAssistant && (
				<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
					<User className="w-5 h-5 text-background" />
				</div>
			)}
		</div>
	);
}
