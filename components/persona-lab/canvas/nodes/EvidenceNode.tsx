"use client";

import { Handle, Position } from "@xyflow/react";
import { List, Lock } from "lucide-react";
import type { TrackId } from "@/lib/store/personaStore";
import { getTrackColor } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export interface EvidenceNodeData {
	track: TrackId;
	state: "locked" | "unlocked";
	layerLabel?: string;
	title?: string;
	content?: string;
	unlockHint?: string;
	[key: string]: unknown;
}

interface EvidenceNodeProps {
	data: EvidenceNodeData;
	selected?: boolean;
}

export function EvidenceNode({ data, selected }: EvidenceNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);

	return (
		<div
			className={cn(
				"relative rounded-lg border shadow-sm transition-all duration-200",
				"min-w-[180px] max-w-[200px] px-3 py-2.5",
				isLocked
					? "bg-muted/50 border-border/50 cursor-pointer hover:border-muted-foreground/30"
					: "bg-background/80 border",
				selected && "ring-2 ring-offset-1",
				selected && !isLocked && colors.textClass.replace("text-", "ring-"),
			)}
			style={
				!isLocked
					? {
							borderColor: `${colors.primary}80`,
							backgroundColor: colors.light,
						}
					: undefined
			}
		>
			{/* Layer label */}
			<div
				className={cn(
					"text-[9px] font-medium uppercase tracking-wider mb-1 opacity-70",
					isLocked ? "text-muted-foreground/50" : colors.textClass,
				)}
			>
				{data.layerLabel || "L2: Evidence"}
			</div>

			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex items-center justify-center w-6 h-6 rounded shrink-0",
						isLocked ? "bg-muted-foreground/5" : colors.bgClass,
					)}
				>
					{isLocked ? (
						<Lock className="w-3 h-3 text-muted-foreground/50" />
					) : (
						<List className={cn("w-3 h-3", colors.textClass)} />
					)}
				</div>

				<div className="flex-1 min-w-0">
					{isLocked ? (
						<span className="text-xs text-muted-foreground/60">
							{data.unlockHint || "Answer more questions"}
						</span>
					) : (
						<span className="text-xs font-medium text-foreground/90 line-clamp-2">
							{data.title || "Evidence Point"}
						</span>
					)}
				</div>
			</div>

			{/* Handles - all sides for flexible connections */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#d1d5db" : `${colors.primary}99`,
				}}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#d1d5db" : `${colors.primary}99`,
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#d1d5db" : `${colors.primary}99`,
				}}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#d1d5db" : `${colors.primary}99`,
				}}
			/>
		</div>
	);
}
