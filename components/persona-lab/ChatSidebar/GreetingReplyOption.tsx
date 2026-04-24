"use client";

import { Button } from "@/components/ui/button";

interface GreetingReplyOptionProps {
	options: string[];
	onSelect: (value: string) => void;
	disabled?: boolean;
}

export function GreetingReplyOption({
	options,
	onSelect,
	disabled,
}: GreetingReplyOptionProps) {
	return (
		<div
			className="p-3 border-t border-border shrink-0"
			data-tour="persona-chat-input"
		>
			<div className="flex flex-wrap justify-end gap-2">
				{options.map((label) => (
					<Button
						key={label}
						onClick={() => onSelect(label)}
						disabled={disabled}
						variant="outline"
						className="rounded-full text-sm border-primary/40 hover:bg-primary/10 hover:border-primary/60"
					>
						{label}
					</Button>
				))}
			</div>
		</div>
	);
}
