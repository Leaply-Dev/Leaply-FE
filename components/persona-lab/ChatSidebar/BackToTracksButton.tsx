"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// ============================================
// DEPRECATED: Track-based flow component
// This component is part of the legacy track-based conversation flow.
// Use the new graph-based conversation flow (ChatSidebar) instead.
// ============================================

interface BackToTracksButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

/**
 * @deprecated Use the new graph-based conversation flow instead.
 * This component is only kept for backward compatibility during migration.
 * The new flow uses dynamic conversation based on coverage gaps, not tracks.
 */
export function BackToTracksButton({
	onClick,
	disabled = false,
}: BackToTracksButtonProps) {
	const t = useTranslations("personaLab");

	return (
		<div className="px-3 py-2 border-b border-border/50 bg-muted/30">
			<Button
				variant="ghost"
				size="sm"
				onClick={onClick}
				disabled={disabled}
				className="text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
			>
				<ArrowLeft className="w-3 h-3 mr-1.5" />
				{t("backToTracks")}
			</Button>
		</div>
	);
}
