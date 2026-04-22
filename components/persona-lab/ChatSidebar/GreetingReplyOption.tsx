"use client";

import { Button } from "@/components/ui/button";

interface GreetingReplyOptionProps {
	label: string;
	onSelect: () => void;
	disabled?: boolean;
}

export function GreetingReplyOption({
	label,
	onSelect,
	disabled,
}: GreetingReplyOptionProps) {
	return (
		<div className="p-3 border-t border-border shrink-0">
			<div className="flex justify-end">
				<Button
					onClick={onSelect}
					disabled={disabled}
					variant="outline"
					className="rounded-full text-sm border-primary/40 hover:bg-primary/10 hover:border-primary/60"
				>
					{label}
				</Button>
			</div>
		</div>
	);
}
