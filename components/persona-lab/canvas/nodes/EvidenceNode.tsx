"use client";

import { Handle, Position } from "@xyflow/react";
import { BookOpen, ChevronRight } from "lucide-react";
import type { TrackId } from "@/lib/store/personaStore";
import { getTrackColor } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export interface EvidenceNodeData {
	track: TrackId;
	state: "locked" | "unlocked";
	title: string;
	content?: string;
	unlockHint?: string;
	zoom?: number;
	[key: string]: unknown;
}

interface EvidenceNodeProps {
	data: EvidenceNodeData & { showDetails?: boolean };
	selected?: boolean;
}

export function EvidenceNode({ data, selected }: EvidenceNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.8;

	return (
		<div
			className={cn(
				"relative rounded-lg border shadow-sm transition-all duration-300 cursor-pointer",
				"min-w-[140px] max-w-[160px] px-3 py-2.5",
				"hover:shadow-md hover:scale-[1.02]",
				isLocked
					? "bg-muted/30 border-border/40"
					: "bg-background border-border",
				selected && "ring-2 ring-offset-1",
				selected && !isLocked && colors.textClass.replace("text-", "ring-"),
				isMacroView && "opacity-0 scale-50 pointer-events-none",
				!isMicroView && !isMacroView && "scale-90 opacity-80",
			)}
		>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex items-center justify-center w-6 h-6 rounded shrink-0",
						isLocked ? "bg-muted" : colors.bgClass,
					)}
				>
					<BookOpen
						className={cn("w-3 h-3", isLocked ? "text-muted-foreground" : colors.textClass)}
						style={!isLocked ? { color: colors.primary } : undefined}
					/>
				</div>

				<div className="flex-1 min-w-0">
					<span className="text-xs font-semibold text-foreground line-clamp-1">
						{data.title || "Evidence"}
					</span>
					{(!data.zoom || data.zoom > 0.8) && data.content && (
						<p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 leading-tight">
							{data.content}
						</p>
					)}
				</div>

				{!isLocked && (
					<ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
				)}
			</div>

			{/* Handles */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-1.5 h-1.5 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
		</div>
	);
}
