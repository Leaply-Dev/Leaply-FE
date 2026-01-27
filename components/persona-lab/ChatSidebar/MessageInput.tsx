"use client";

import { ArrowUp, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Character limits matching backend validation
const MIN_CHARS = 10;
const MAX_CHARS = 5000;

interface MessageInputProps {
	onSend: (content: string) => void;
	disabled?: boolean;
	placeholder?: string;
	/**
	 * When set, shows a completion message instead of the input.
	 * Used when all parts are complete and archetype is revealed.
	 */
	completionMessage?: string;
}

export function MessageInput({
	onSend,
	disabled = false,
	placeholder,
	completionMessage,
}: MessageInputProps) {
	const t = useTranslations("personaLab");
	const defaultPlaceholder = placeholder ?? t("shareYourStory");
	const [input, setInput] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const charCount = input.trim().length;
	const isBelowMin = charCount < MIN_CHARS;
	const isAboveMax = charCount > MAX_CHARS;
	const canSend = !isBelowMin && !isAboveMax && !disabled;

	// Auto-resize textarea based on content
	// biome-ignore lint/correctness/useExhaustiveDependencies: input is intentionally a dependency to trigger resize
	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "auto";
			textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
		}
	}, [input]);

	const handleSend = () => {
		const trimmed = input.trim();
		if (!canSend || !trimmed) return;

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

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value;
		// Allow typing but cap at max + some buffer for user feedback
		if (value.length <= MAX_CHARS + 100) {
			setInput(value);
		}
	};

	// Show completion message instead of input when conversation is complete
	if (completionMessage) {
		return (
			<div className="p-4 border-t border-border shrink-0">
				<div className="flex items-center justify-center gap-2 bg-muted/30 p-4 rounded-xl border border-border text-center">
					<Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
					<span className="text-sm text-muted-foreground">
						{completionMessage}
					</span>
				</div>
			</div>
		);
	}

	return (
		<div className="p-3 border-t border-border shrink-0">
			<div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border border-border focus-within:border-primary/50 transition-colors">
				<textarea
					ref={textareaRef}
					value={input}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder={defaultPlaceholder}
					disabled={disabled}
					className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none p-1.5 min-h-9 max-h-30 resize-none text-sm placeholder:text-muted-foreground disabled:opacity-50"
					rows={1}
				/>
				<Button
					onClick={handleSend}
					disabled={!canSend}
					size="icon"
					className={cn(
						"h-8 w-8 rounded-lg shrink-0 transition-all",
						!canSend && "opacity-50 cursor-not-allowed",
					)}
				>
					<ArrowUp className="w-4 h-4" />
				</Button>
			</div>

			{/* Character counter */}
			<div className="flex justify-end mt-1.5 px-1">
				<span
					className={cn(
						"text-xs transition-colors",
						charCount === 0
							? "text-muted-foreground/50"
							: isBelowMin
								? "text-amber-500"
								: isAboveMax
									? "text-destructive"
									: "text-muted-foreground",
					)}
				>
					{charCount === 0 ? (
						<span className="text-muted-foreground/50">
							{t("minCharacters", { count: MIN_CHARS })}
						</span>
					) : isBelowMin ? (
						<span>
							{t("moreCharactersNeeded", { count: MIN_CHARS - charCount })}
						</span>
					) : (
						<span>
							{charCount.toLocaleString()}/{MAX_CHARS.toLocaleString()}
						</span>
					)}
				</span>
			</div>
		</div>
	);
}
