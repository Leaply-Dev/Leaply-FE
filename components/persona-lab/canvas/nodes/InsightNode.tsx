"use client";

import { Handle, Position } from "@xyflow/react";
import { Lightbulb, Lock, Sparkles } from "lucide-react";
import type { TrackId } from "@/lib/store/personaStore";
import { getTrackColor } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export interface InsightNodeData {
	track: TrackId;
	state: "locked" | "unlocked";
	layerLabel?: string;
	title?: string;
	content?: string;
	isAIGenerated?: boolean;
	unlockHint?: string;
	[key: string]: unknown;
}

interface InsightNodeProps {
	data: InsightNodeData;
	selected?: boolean;
}

export function InsightNode({ data, selected }: InsightNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);

	return (
		<div
			className={cn(
				"relative rounded-lg border transition-all duration-200",
				"min-w-[160px] max-w-[180px] px-3 py-2",
				isLocked
					? "bg-muted/30 border-dashed border-border/40 cursor-pointer"
					: "bg-background/60 border-dashed",
				selected && "ring-2 ring-offset-1",
				selected && !isLocked && colors.textClass.replace("text-", "ring-"),
			)}
			style={
				!isLocked
					? {
							borderColor: `${colors.primary}60`,
							backgroundColor: colors.light,
						}
					: undefined
			}
		>
			{/* AI badge for generated insights */}
			{!isLocked && data.isAIGenerated && (
				<div className="absolute -top-2 -right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
					<Sparkles className="w-2.5 h-2.5 text-primary" />
					<span className="text-[8px] font-medium text-primary">AI</span>
				</div>
			)}

			{/* Layer label */}
			<div
				className={cn(
					"text-[9px] font-medium uppercase tracking-wider mb-1 opacity-60",
					isLocked ? "text-muted-foreground/40" : colors.textClass,
				)}
			>
				{data.layerLabel || "L3: Insight"}
			</div>

			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex items-center justify-center w-5 h-5 rounded shrink-0",
						isLocked ? "bg-muted-foreground/5" : colors.bgClass,
					)}
				>
					{isLocked ? (
						<Lock className="w-2.5 h-2.5 text-muted-foreground/40" />
					) : (
						<Lightbulb className={cn("w-2.5 h-2.5", colors.textClass)} />
					)}
				</div>

				<div className="flex-1 min-w-0">
					{isLocked ? (
						<span className="text-[10px] text-muted-foreground/50 italic">
							{data.unlockHint || "Complete track for insights"}
						</span>
					) : (
						<span className="text-[11px] font-medium text-foreground/80 line-clamp-2">
							{data.title || "AI Insight"}
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
					backgroundColor: isLocked ? "#e5e7eb" : `${colors.primary}80`,
				}}
			/>
			<Handle
				type="target"
				position={Position.Left}
				id={Position.Left}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#e5e7eb" : `${colors.primary}80`,
				}}
			/>
			<Handle
				type="target"
				position={Position.Right}
				id={Position.Right}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#e5e7eb" : `${colors.primary}80`,
				}}
			/>
			<Handle
				type="target"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-1.5 h-1.5 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#e5e7eb" : `${colors.primary}80`,
				}}
			/>
		</div>
	);
}
