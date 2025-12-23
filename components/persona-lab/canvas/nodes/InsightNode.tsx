"use client";

import { Handle, Position } from "@xyflow/react";
import { Lightbulb, Sparkles, ChevronRight } from "lucide-react";
import type { TrackId } from "@/lib/store/personaStore";
import { getTrackColor } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export interface InsightNodeData {
	track: TrackId;
	state: "locked" | "unlocked";
	title?: string;
	isAIGenerated?: boolean;
	zoom?: number;
	[key: string]: unknown;
}

interface InsightNodeProps {
	data: InsightNodeData & { showDetails?: boolean };
	selected?: boolean;
}

export function InsightNode({ data, selected }: InsightNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.8;

	return (
		<div
			className={cn(
				"relative rounded-lg transition-all duration-300 cursor-pointer",
				"min-w-[130px] max-w-[150px] px-3 py-2.5",
				"hover:shadow-md hover:scale-[1.02]",
				isLocked
					? "bg-muted/20 border border-dashed border-border/50"
					: "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900",
				selected && "ring-2 ring-amber-400 ring-offset-1",
				isMacroView && "opacity-0 scale-50 pointer-events-none",
				!isMicroView && !isMacroView && "scale-90 opacity-80",
			)}
		>
			<div className="flex items-center gap-2">
				<div
					className={cn(
						"flex items-center justify-center w-6 h-6 rounded shrink-0",
						isLocked
							? "bg-muted"
							: "bg-gradient-to-br from-amber-400 to-orange-500",
					)}
				>
					{isLocked ? (
						<Lightbulb className="w-3 h-3 text-muted-foreground" />
					) : (
						<Sparkles className="w-3 h-3 text-white" />
					)}
				</div>

				<div className="flex-1 min-w-0">
					{isLocked ? (
						<span className="text-xs text-muted-foreground">
							Insight pending...
						</span>
					) : (
						<span className="text-xs font-medium text-foreground line-clamp-2">
							{data.title || "AI Insight"}
						</span>
					)}
				</div>

				{!isLocked && (
					<ChevronRight className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
				)}
			</div>

			{/* AI indicator for unlocked */}
			{!isLocked && data.isAIGenerated && (
				<div className="mt-1.5 flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400">
					<Sparkles className="w-2.5 h-2.5" />
					<span>AI Generated</span>
				</div>
			)}

			{/* Single central handle for organic connections */}
			<Handle
				type="target"
				position={Position.Top}
				className="w-1.5 h-1.5 !opacity-0 !bg-amber-500"
				style={{
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="w-1.5 h-1.5 !opacity-0 !bg-amber-500"
				style={{
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
		</div>
	);
}
