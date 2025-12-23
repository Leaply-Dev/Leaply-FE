"use client";

import { Handle, Position } from "@xyflow/react";
import { Target, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CoreNodeData {
	state: "locked" | "unlocked";
	archetype?: string;
	subtitle?: string;
	unlockHint?: string;
	zoom?: number;
	[key: string]: unknown;
}

interface CoreNodeProps {
	data: CoreNodeData;
	selected?: boolean;
}

export function CoreNode({ data, selected }: CoreNodeProps) {
	const isLocked = data.state === "locked";

	return (
		<div
			className={cn(
				"relative rounded-2xl border-2 shadow-lg transition-all duration-200 cursor-pointer",
				"min-w-[200px] px-6 py-5",
				"hover:shadow-xl hover:scale-[1.02]",
				isLocked
					? "bg-muted border-border"
					: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary",
				selected && "ring-2 ring-primary ring-offset-2",
			)}
		>
			{/* Glow effect for unlocked state */}
			{!isLocked && (
				<div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl -z-10 animate-pulse" />
			)}

			<div className="flex flex-col items-center gap-3 text-center">
				<div
					className={cn(
						"flex items-center justify-center w-12 h-12 rounded-full",
						isLocked
							? "bg-muted-foreground/20"
							: "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg",
					)}
				>
					{isLocked ? (
						<Target className="w-6 h-6 text-muted-foreground" />
					) : (
						<Sparkles className="w-6 h-6 animate-pulse" />
					)}
				</div>

				{isLocked ? (
					<>
						<span className="text-sm font-medium text-muted-foreground">
							Your Archetype
						</span>
						{(!data.zoom || data.zoom > 0.6) && (
							<span className="text-xs text-muted-foreground/70 max-w-[160px]">
								{data.unlockHint || "Complete all topics to discover"}
							</span>
						)}
					</>
				) : (
					<>
						<span className="text-lg font-bold text-foreground">
							{data.archetype || "The Innovator"}
						</span>
						{(!data.zoom || data.zoom > 0.6) && (
							<span className="text-sm text-muted-foreground max-w-[180px]">
								{data.subtitle || "Your unique identity"}
							</span>
						)}
					</>
				)}
			</div>

			{/* Single central handle for organic connections */}
			<Handle
				type="source"
				position={Position.Bottom}
				className="w-2 h-2 !bg-primary !opacity-0"
				style={{
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
			{/* We add a secondary target handle at same position to allow incoming connections if needed by React Flow logic, 
			    though often one handle is enough if type is generic. For now, let's stick to source as main anchor 
			    or standard target/source pair at center. */}
			<Handle
				type="target"
				position={Position.Top}
				className="w-2 h-2 !bg-primary !opacity-0"
				style={{
					left: "50%",
					top: "50%",
					transform: "translate(-50%, -50%)",
				}}
			/>
		</div>
	);
}
