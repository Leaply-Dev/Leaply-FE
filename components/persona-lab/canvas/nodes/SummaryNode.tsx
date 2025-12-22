"use client";

import { Handle, Position } from "@xyflow/react";
import { FileText, ChevronRight } from "lucide-react";
import type { TrackId } from "@/lib/store/personaStore";
import { getTrackColor } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export interface SummaryNodeData {
	track: TrackId;
	state: "locked" | "unlocked";
	title?: string;
	brief?: string;
	themeTag?: string;
	unlockHint?: string;
	[key: string]: unknown;
}

interface SummaryNodeProps {
	data: SummaryNodeData & { showDetails?: boolean };
	selected?: boolean;
}

export function SummaryNode({ data, selected }: SummaryNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);
	const showDetails = data.showDetails !== false;

	return (
		<div
			className={cn(
				"relative rounded-xl border-2 shadow-md transition-all duration-300 cursor-pointer",
				"min-w-[180px] max-w-[200px] px-4 py-3",
				"hover:shadow-lg hover:scale-[1.05]",
				isLocked
					? "bg-muted/50 border-border/50"
					: "bg-background",
				selected && "ring-2 ring-offset-2",
				selected && !isLocked && colors.textClass.replace("text-", "ring-"),
				!showDetails && "scale-90",
			)}
			style={
				!isLocked
					? { borderColor: colors.primary, backgroundColor: colors.light }
					: undefined
			}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
						isLocked ? "bg-muted" : colors.bgClass,
					)}
				>
					<FileText
						className={cn("w-4 h-4", isLocked ? "text-muted-foreground" : colors.textClass)}
						style={!isLocked ? { color: colors.primary } : undefined}
					/>
				</div>

				<div className="flex-1 min-w-0">
					{isLocked ? (
						<>
							<span className="text-sm font-medium text-muted-foreground">
								Keep sharing...
							</span>
							<p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">
								{data.unlockHint || "Complete this topic"}
							</p>
						</>
					) : (
						<>
							<span className="text-sm font-semibold text-foreground line-clamp-2">
								{data.title || "Your Story"}
							</span>
							{data.themeTag && showDetails && (
								<span
									className={cn(
										"inline-block text-[10px] px-1.5 py-0.5 rounded mt-1.5",
										colors.bgClass,
									)}
									style={{ color: colors.primary }}
								>
									{data.themeTag}
								</span>
							)}
						</>
					)}
				</div>

				{!isLocked && showDetails && (
					<ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
				)}
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
