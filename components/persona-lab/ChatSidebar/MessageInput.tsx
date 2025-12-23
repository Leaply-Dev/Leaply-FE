"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
	onSend: (content: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export function MessageInput({
	onSend,
	disabled = false,
	placeholder = "Share your thoughts...",
}: MessageInputProps) {
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Auto-resize textarea
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
		}
	}, [input]);

	const handleSend = () => {
		const trimmed = input.trim();
		if (!trimmed || disabled) return;

		onSend(trimmed);
		setInput("");

		// Reset textarea height
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="p-3 border-t border-border shrink-0">
			<div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border border-border focus-within:border-primary/50 transition-colors">
				<textarea
					ref={textareaRef}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none p-1.5 min-h-[36px] max-h-[120px] resize-none text-sm placeholder:text-muted-foreground disabled:opacity-50"
					rows={1}
				/>
				<Button
					onClick={handleSend}
					disabled={!input.trim() || disabled}
					size="icon"
					className="h-8 w-8 rounded-lg shrink-0"
				>
					<ArrowUp className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
