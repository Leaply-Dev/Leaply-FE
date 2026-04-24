"use client";

import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface GraphEmptyStateProps {
	className?: string;
	absolute?: boolean;
}

export function GraphEmptyState({
	className,
	absolute = true,
}: GraphEmptyStateProps) {
	const t = useTranslations("personaLab");

	return (
		<div
			className={`${absolute ? "absolute inset-0" : "h-full"} flex flex-col items-center justify-center text-center p-8 ${className ?? ""}`}
		>
			<div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
				<MessageCircle className="w-8 h-8 text-muted-foreground" />
			</div>
			<h3 className="text-lg font-semibold mb-2">{t("emptyCanvasTitle")}</h3>
			<p className="text-sm text-muted-foreground max-w-xs mb-4">
				{t("emptyCanvasDesc")}
			</p>
			<div className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
				{t("startConversationCta")}
			</div>
		</div>
	);
}
