"use client";

import { Check, ChevronRight } from "lucide-react";
import { TRACK_COLORS } from "@/lib/constants/tracks";
import type { TrackAction, TrackId } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

interface TrackActionCardsProps {
	tracks: TrackAction[];
	onSelect: (trackId: TrackId) => void;
	disabled?: boolean;
}

export function TrackActionCards({
	tracks,
	onSelect,
	disabled = false,
}: TrackActionCardsProps) {
	return (
		<div className="space-y-1.5 pl-8 mt-2">
			{tracks.map((track, idx) => {
				const colors = TRACK_COLORS[track.trackId];
				const isCompleted = track.status === "completed";

				return (
					<button
						key={track.trackId}
						type="button"
						onClick={() => !isCompleted && !disabled && onSelect(track.trackId)}
						disabled={isCompleted || disabled}
						className={cn(
							"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm",
							"border hover:border-2",
							(isCompleted || disabled) && "opacity-50 cursor-not-allowed",
						)}
						style={{
							borderColor: `${colors.primary}40`,
							backgroundColor: `${colors.primary}05`,
						}}
					>
						<span className="text-xs font-mono text-muted-foreground w-4">
							{idx + 1}.
						</span>
						<span className="text-lg">{track.icon}</span>
						<span className="flex-1 font-medium">{track.displayName}</span>
						{isCompleted ? (
							<Check className="w-4 h-4 text-primary" />
						) : (
							<ChevronRight className="w-4 h-4 text-muted-foreground" />
						)}
					</button>
				);
			})}
		</div>
	);
}
