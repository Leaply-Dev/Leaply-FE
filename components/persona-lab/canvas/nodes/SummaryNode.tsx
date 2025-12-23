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
	zoom?: number;
	isCluster?: boolean;
	childCount?: number;
	[key: string]: unknown;
}

interface SummaryNodeProps {
	data: SummaryNodeData & { showDetails?: boolean };
	selected?: boolean;
}

export function SummaryNode({ data, selected }: SummaryNodeProps) {
	const isLocked = data.state === "locked";
	const colors = getTrackColor(data.track);

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.8;
	const showDetails = isMicroView;

	// Macro View (Deep Zoom Out)
	if (isMacroView) {
		return (
			<div className="group relative flex items-center justify-center">
				<div
					className={cn(
						"w-12 h-12 rounded-full border-4 transition-all duration-500",
						isLocked ? "bg-muted border-border" : "shadow-lg",
					)}
					style={
						!isLocked
							? {
									backgroundColor: colors.primary,
									borderColor: colors.light,
									boxShadow: `0 0 20px ${colors.primary}40`,
								}
							: {}
					}
				/>
				<div className="absolute top-14 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 px-2 py-1 rounded text-[10px] font-bold border border-border">
					{data.title || data.track}
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative rounded-xl border-2 shadow-md transition-all duration-500 cursor-pointer overflow-hidden",
				"min-w-[180px] max-w-[200px] px-4 py-3",
				"hover:shadow-xl hover:scale-[1.02]",
				isLocked ? "bg-muted/50 border-border/50" : "bg-background",
				selected && "ring-2 ring-offset-2",
				selected && !isLocked && colors.textClass.replace("text-", "ring-"),
				!isMicroView && "scale-90 opacity-80",
			)}
			style={
				!isLocked
					? { borderColor: colors.primary, backgroundColor: colors.light }
					: undefined
			}
		>
			{/* Glow effect for unlocked nodes */}
			{!isLocked && (
				<div
					className="absolute -inset-1 opacity-20 blur-xl transition-all group-hover:opacity-30"
					style={{ backgroundColor: colors.primary }}
				/>
			)}

			<div className="relative z-10 flex items-start gap-3">
				<div
					className={cn(
						"flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
						isLocked ? "bg-muted" : colors.bgClass,
					)}
				>
					<FileText
						className={cn(
							"w-4 h-4",
							isLocked ? "text-muted-foreground" : colors.textClass,
						)}
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
							{data.themeTag && isMicroView && (
								<div className="flex flex-wrap gap-1 mt-1.5">
									<span
										className={cn(
											"inline-block text-[10px] px-1.5 py-0.5 rounded-full font-medium",
											colors.bgClass,
										)}
										style={{ color: colors.primary }}
									>
										{data.themeTag}
									</span>
									{data.isCluster && (
										<span className="text-[10px] bg-foreground/10 px-1.5 py-0.5 rounded-full font-bold">
											+{data.childCount} stories
										</span>
									)}
								</div>
							)}
						</>
					)}
				</div>

				{!isLocked && isMicroView && (
					<ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
				)}
			</div>

			{/* Single central handle for organic connections */}
			<Handle
				type="target"
				position={Position.Top}
				className="w-2 h-2 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#9ca3af" : colors.primary,
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				className="w-2 h-2 !opacity-0"
				style={{
					backgroundColor: isLocked ? "#9ca3af" : colors.primary,
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
		</div>
	);
}
