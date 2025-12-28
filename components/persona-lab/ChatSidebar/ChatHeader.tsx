"use client";

import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
	calculateOverallProgress,
	calculateTrackProgress,
	getQuestionProgress,
	TRACK_COLORS,
} from "@/lib/constants/tracks";
import { usePersonaStore } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

export function ChatHeader() {
	const t = useTranslations("personaLab");
	const { tracks, currentTrackId } = usePersonaStore();

	const currentTrack = currentTrackId ? tracks[currentTrackId] : null;
	const currentTrackColors = currentTrackId
		? TRACK_COLORS[currentTrackId]
		: null;

	// Calculate progress
	const overallProgress = useMemo(
		() => calculateOverallProgress(tracks),
		[tracks],
	);

	const currentTrackProgress = useMemo(() => {
		if (!currentTrack) return null;
		return {
			percentage: calculateTrackProgress(currentTrack),
			questions: getQuestionProgress(currentTrack),
		};
	}, [currentTrack]);

	return (
		<div className="px-4 py-3 border-b border-border shrink-0">
			<div className="flex items-center gap-2 mb-2">
				<div className="p-1.5 rounded-lg bg-primary/10">
					<Sparkles className="w-4 h-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-sm">{t("discoveryChat")}</h2>
					{currentTrack && currentTrackColors && (
						<div className="flex items-center gap-2 mt-1">
							<span
								className="text-xs px-1.5 py-0.5 rounded font-medium"
								style={{
									backgroundColor: `${currentTrackColors.primary}20`,
									color: currentTrackColors.primary,
								}}
							>
								{currentTrack.displayName}
							</span>
							{currentTrackProgress && (
								<span className="text-[10px] text-muted-foreground">
									{currentTrackProgress.questions.current}/
									{currentTrackProgress.questions.total} {t("questions")}
								</span>
							)}
						</div>
					)}
				</div>
			</div>

			{/* Progress bar with percentage */}
			<div className="flex items-center gap-2">
				<div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
					<div
						className={cn(
							"h-full rounded-full transition-all duration-500 ease-out",
							"bg-gradient-to-r from-primary to-primary/80",
						)}
						style={{ width: `${overallProgress}%` }}
					/>
				</div>
				<span className="text-xs font-semibold text-primary min-w-[2.5rem] text-right">
					{overallProgress}%
				</span>
			</div>
		</div>
	);
}
