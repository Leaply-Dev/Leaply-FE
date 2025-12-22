"use client";

import { Handle, Position } from "@xyflow/react";
import { FileText, Lock } from "lucide-react";
import type { TrackId } from "@/lib/store/personaStore";
import { getTrackColor } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export interface SummaryNodeData {
	track: TrackId;
	state: "locked" | "unlocked";
	layerLabel?: string;
	title?: string;
	content?: string;
	themeTag?: string;
	unlockHint?: string;
	[key: string]: unknown;
}

interface SummaryNodeProps {
	data: SummaryNodeData;
	selected?: boolean;
}

export function SummaryNode({ data, selected }: SummaryNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);

	return (
		<div
			className={cn(
				"relative rounded-xl border-2 shadow-md transition-all duration-200",
				"min-w-[200px] max-w-[220px] px-4 py-3",
				isLocked
					? "bg-muted border-border cursor-pointer hover:border-muted-foreground/50"
					: `bg-background ${colors.borderClass}`,
				selected && "ring-2 ring-offset-2",
				selected && !isLocked && colors.textClass.replace("text-", "ring-"),
			)}
			style={
				!isLocked
					? { borderColor: colors.primary, backgroundColor: colors.light }
					: undefined
			}
		>
			{/* Layer label */}
			<div
				className={cn(
					"text-[10px] font-semibold uppercase tracking-wider mb-1",
					isLocked ? "text-muted-foreground/60" : colors.textClass,
				)}
			>
				{data.layerLabel || "L1: Summary"}
			</div>

			<div className="flex items-start gap-2">
				<div
					className={cn(
						"flex items-center justify-center w-7 h-7 rounded-lg shrink-0",
						isLocked ? "bg-muted-foreground/10" : colors.bgClass,
					)}
				>
					{isLocked ? (
						<Lock className="w-3.5 h-3.5 text-muted-foreground" />
					) : (
						<FileText className={cn("w-3.5 h-3.5", colors.textClass)} />
					)}
				</div>

				<div className="flex-1 min-w-0">
					{isLocked ? (
						<>
							<span className="text-sm font-medium text-muted-foreground">
								Locked
							</span>
							<p className="text-xs text-muted-foreground/70 mt-0.5">
								{data.unlockHint || "Complete this track"}
							</p>
						</>
					) : (
						<>
							<span className="text-sm font-semibold text-foreground line-clamp-2">
								{data.title || "Summary Title"}
							</span>
							{data.themeTag && (
								<span
									className={cn(
										"inline-block text-[10px] px-1.5 py-0.5 rounded mt-1",
										colors.bgClass,
										colors.textClass,
									)}
								>
									{data.themeTag}
								</span>
							)}
						</>
					)}
				</div>
			</div>

			{/* Handles - all sides for flexible connections */}
			<Handle
				type="target"
				position={Position.Top}
				id={Position.Top}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-2 h-2 !opacity-0"
				style={{ backgroundColor: isLocked ? "#9ca3af" : colors.primary }}
			/>
		</div>
	);
}
