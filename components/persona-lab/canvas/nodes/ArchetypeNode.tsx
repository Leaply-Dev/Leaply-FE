"use client";

import { Handle, Position } from "@xyflow/react";
import { Lock, Sparkles, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { ARCHETYPES } from "@/lib/constants/archetypes";
import type { ArchetypeHints, ArchetypeType } from "@/lib/types/persona";
import { cn } from "@/lib/utils";

export interface ArchetypeNodeData {
	state: "locked" | "revealed";
	archetypeType?: ArchetypeType;
	personalizedSummary?: string;
	overallProgress?: number; // 0-100 percentage
	completedTracks?: number; // 0-4 completed tracks
	totalTracks?: number; // 4 total tracks
	archetypeHints?: ArchetypeHints | null; // Progressive hints
	zoom?: number;
	[key: string]: unknown;
}

// Confidence level labels
const CONFIDENCE_LABELS: Record<string, string> = {
	early: "Early Signal",
	emerging: "Emerging Pattern",
	strong: "Strong Signal",
	final: "Confirmed",
};

interface ArchetypeNodeProps {
	data: ArchetypeNodeData;
	selected?: boolean;
}

export function ArchetypeNode({ data, selected }: ArchetypeNodeProps) {
	const t = useTranslations("personaLab");
	const isLocked = data.state === "locked";
	const archetype = data.archetypeType ? ARCHETYPES[data.archetypeType] : null;
	const overallProgress = data.overallProgress ?? 0;
	const completedTracks = data.completedTracks ?? 0;
	const totalTracks = data.totalTracks ?? 4;
	const hints = data.archetypeHints;
	const hasHints = hints && hints.candidates && hints.candidates.length > 0;

	const isMacroView = data.zoom && data.zoom < 0.5;
	const isMicroView = !data.zoom || data.zoom > 0.6;

	// Macro View - Show icon with progress ring
	if (isMacroView) {
		return (
			<div className="group relative flex items-center justify-center">
				{/* Progress ring */}
				<svg className="w-20 h-20 -rotate-90">
					{/* Background circle */}
					<circle
						cx="40"
						cy="40"
						r="36"
						fill="none"
						stroke="currentColor"
						strokeWidth="4"
						className="text-muted"
					/>
					{/* Progress circle */}
					{isLocked && (
						<circle
							cx="40"
							cy="40"
							r="36"
							fill="none"
							stroke="hsl(var(--primary))"
							strokeWidth="4"
							strokeLinecap="round"
							strokeDasharray={`${(overallProgress / 100) * 226.2} 226.2`}
							className="transition-all duration-500"
						/>
					)}
				</svg>
				{/* Center icon */}
				<div
					className={cn(
						"absolute w-14 h-14 rounded-full border-4 transition-all duration-500 flex items-center justify-center",
						isLocked
							? "bg-muted border-border"
							: "bg-gradient-to-br from-primary to-primary/80 border-primary/20 shadow-2xl",
					)}
				>
					{isLocked ? (
						<Lock className="w-6 h-6 text-muted-foreground" />
					) : (
						<Sparkles className="w-6 h-6 text-white animate-pulse" />
					)}
				</div>
				{/* Progress text */}
				{isLocked && (
					<div className="absolute -bottom-6 text-[10px] font-bold text-muted-foreground">
						{completedTracks}/{totalTracks}
					</div>
				)}
				{/* Hidden handles for connections */}
				<Handle
					type="source"
					position={Position.Top}
					id={Position.Top}
					className="!opacity-0"
				/>
				<Handle
					type="source"
					position={Position.Right}
					id={Position.Right}
					className="!opacity-0"
				/>
				<Handle
					type="source"
					position={Position.Bottom}
					id={Position.Bottom}
					className="!opacity-0"
				/>
				<Handle
					type="source"
					position={Position.Left}
					id={Position.Left}
					className="!opacity-0"
				/>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"relative rounded-2xl border-2 shadow-lg transition-all duration-300 cursor-pointer",
				"min-w-[180px] max-w-[220px] px-6 py-5",
				"hover:shadow-2xl hover:scale-[1.02]",
				isLocked
					? "bg-muted border-border"
					: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary",
				selected && "ring-2 ring-primary ring-offset-2",
			)}
		>
			{/* Glow effect for revealed state */}
			{!isLocked && (
				<div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl -z-10 animate-pulse" />
			)}

			<div className="flex flex-col items-center gap-3 text-center relative z-10">
				{/* Icon with progress ring */}
				<div className="relative">
					{/* Progress ring for locked state */}
					{isLocked && (
						<svg className="absolute -inset-2 w-[72px] h-[72px] -rotate-90">
							{/* Background circle */}
							<circle
								cx="36"
								cy="36"
								r="32"
								fill="none"
								stroke="currentColor"
								strokeWidth="3"
								className="text-muted-foreground/20"
							/>
							{/* Progress circle */}
							<circle
								cx="36"
								cy="36"
								r="32"
								fill="none"
								stroke="hsl(var(--primary))"
								strokeWidth="3"
								strokeLinecap="round"
								strokeDasharray={`${(overallProgress / 100) * 201.1} 201.1`}
								className="transition-all duration-500"
							/>
						</svg>
					)}
					<div
						className={cn(
							"flex items-center justify-center w-14 h-14 rounded-full transition-all",
							isLocked
								? "bg-muted-foreground/20"
								: "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg",
						)}
					>
						{isLocked ? (
							<Lock className="w-6 h-6 text-muted-foreground" />
						) : (
							<Sparkles className="w-7 h-7 animate-pulse" />
						)}
					</div>
				</div>

				{/* Content */}
				{isLocked ? (
					<>
						<span className="text-sm font-semibold text-muted-foreground">
							{t("yourArchetype")}
						</span>
						{isMicroView && (
							<>
								{/* Show hints if available */}
								{hasHints ? (
									<div className="w-full space-y-2 mt-1">
										{/* Confidence badge */}
										<div className="flex items-center justify-center gap-1.5">
											<TrendingUp className="w-3 h-3 text-primary" />
											<span className="text-[10px] font-medium text-primary">
												{CONFIDENCE_LABELS[hints.confidence] ||
													hints.confidence}
											</span>
										</div>

										{/* Probability bars */}
										<div className="space-y-1.5">
											{hints.candidates.map((candidate, idx) => {
												const archetypeDef = ARCHETYPES[candidate.type];
												return (
													<div key={candidate.type} className="space-y-0.5">
														<div className="flex items-center justify-between text-[10px]">
															<span
																className={cn(
																	"font-medium truncate max-w-[100px]",
																	idx === 0
																		? "text-foreground"
																		: "text-muted-foreground",
																)}
															>
																{archetypeDef?.title || candidate.type}
															</span>
															<span
																className={cn(
																	"font-bold",
																	idx === 0
																		? "text-primary"
																		: "text-muted-foreground",
																)}
															>
																{candidate.probability}%
															</span>
														</div>
														<div className="h-1.5 bg-muted rounded-full overflow-hidden">
															<div
																className={cn(
																	"h-full rounded-full transition-all duration-500",
																	idx === 0
																		? "bg-primary"
																		: idx === 1
																			? "bg-primary/60"
																			: "bg-primary/30",
																)}
																style={{ width: `${candidate.probability}%` }}
															/>
														</div>
														{idx === 0 && candidate.evidence && (
															<p className="text-[9px] text-muted-foreground/70 italic truncate">
																↳ {candidate.evidence}
															</p>
														)}
													</div>
												);
											})}
										</div>
									</div>
								) : (
									<>
										{/* Progress indicator (no hints yet) */}
										<div className="flex items-center gap-2">
											<span className="text-lg font-bold text-primary">
												{completedTracks}/{totalTracks}
											</span>
											<span className="text-xs text-muted-foreground">
												{t("tracksCompleted")}
											</span>
										</div>
										<span className="text-xs text-muted-foreground/70 max-w-[160px]">
											{t("completeAllTracks")}
										</span>
									</>
								)}
							</>
						)}
					</>
				) : (
					<>
						<span className="text-lg font-bold text-foreground">
							{archetype?.title || t("yourArchetype")}
						</span>
						{isMicroView && archetype && (
							<>
								<span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
									{archetype.tagline}
								</span>
								{data.personalizedSummary && (
									<p className="text-xs text-muted-foreground max-w-[180px] line-clamp-3 mt-1">
										{data.personalizedSummary}
									</p>
								)}
							</>
						)}
					</>
				)}
			</div>

			{/* Handles for connections - all sides */}
			<Handle
				type="source"
				position={Position.Top}
				id={Position.Top}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
			<Handle
				type="source"
				position={Position.Right}
				id={Position.Right}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
			<Handle
				type="source"
				position={Position.Bottom}
				id={Position.Bottom}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
			<Handle
				type="source"
				position={Position.Left}
				id={Position.Left}
				className="w-2 h-2 !bg-primary !opacity-0 hover:!opacity-100"
			/>
		</div>
	);
}
