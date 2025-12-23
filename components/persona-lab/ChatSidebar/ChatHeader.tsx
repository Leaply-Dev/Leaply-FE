"use client";

import { Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { TRACK_COLORS, TRACKS } from "@/lib/constants/tracks";
import { usePersonaStore } from "@/lib/store/personaStore";

export function ChatHeader() {
	const { tracks, currentTrackId, getTrackProgress } = usePersonaStore();
	const { completed, total } = getTrackProgress();
	const overallProgress = (completed / total) * 100;

	const currentTrack = currentTrackId ? tracks[currentTrackId] : null;
	const currentTrackColors = currentTrackId
		? TRACK_COLORS[currentTrackId]
		: null;

	return (
		<div className="px-4 py-3 border-b border-border shrink-0">
			<div className="flex items-center gap-2 mb-2">
				<div className="p-1.5 rounded-lg bg-primary/10">
					<Sparkles className="w-4 h-4 text-primary" />
				</div>
				<div className="flex-1">
					<h2 className="font-semibold text-sm">Discovery Chat</h2>
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
						</div>
					)}
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Progress value={overallProgress} className="h-1.5 flex-1" />
				<span className="text-[10px] text-muted-foreground font-medium">
					{completed}/{total}
				</span>
			</div>
		</div>
	);
}
