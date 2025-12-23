"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BackToTracksButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

export function BackToTracksButton({
	onClick,
	disabled = false,
}: BackToTracksButtonProps) {
	return (
		<div className="px-3 pb-2">
			<Button
				variant="ghost"
				size="sm"
				onClick={onClick}
				disabled={disabled}
				className="text-xs text-muted-foreground hover:text-foreground"
			>
				<ArrowLeft className="w-3 h-3 mr-1" />
				Back to tracks
			</Button>
		</div>
	);
}
