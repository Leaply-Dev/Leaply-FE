"use client";

import { m } from "framer-motion";
import { Check, Circle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
	getCompletedPartsCount,
	PART_KEYS,
	PARTS_CONFIG,
	type PartKey,
	type PartsProgress as PartsProgressType,
} from "@/lib/config/partsConfig";

interface PartsProgressProps {
	progress: PartsProgressType;
	showLabels?: boolean;
}

interface PartIndicatorProps {
	partKey: PartKey;
	status: "not_started" | "in_progress" | "done";
	showLabel?: boolean;
}

function PartIndicator({
	partKey,
	status,
	showLabel = true,
}: PartIndicatorProps) {
	const config = PARTS_CONFIG[partKey];
	const t = useTranslations("personaLab");

	const getIcon = () => {
		switch (status) {
			case "done":
				return (
					<m.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.3 }}
						className="rounded-full p-1"
						style={{ backgroundColor: config.color }}
					>
						<Check className="w-3 h-3 text-white" />
					</m.div>
				);
			case "in_progress":
				return (
					<m.div
						animate={{ rotate: 360 }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "linear",
						}}
						className="p-0.5"
					>
						<Loader2 className="w-4 h-4" style={{ color: config.color }} />
					</m.div>
				);
			default:
				return (
					<Circle
						className="w-4 h-4 text-muted-foreground/50"
						strokeWidth={1.5}
					/>
				);
		}
	};

	const getLocalizedName = () => {
		const key = `part${partKey.slice(-1)}Name` as keyof typeof t;
		// TypeScript workaround for dynamic keys
		try {
			return t(key as "part1Name" | "part2Name" | "part3Name" | "part4Name");
		} catch {
			return config.name;
		}
	};

	return (
		<div className="flex flex-col items-center gap-1 group relative">
			{/* Tooltip */}
			<div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
				<div className="bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap border border-border">
					{getLocalizedName()}:{" "}
					{status === "done"
						? t("statusCompleted")
						: status === "in_progress"
							? t("statusInProgress")
							: t("statusNotStarted")}
				</div>
			</div>

			{/* Status indicator */}
			<div
				className={`
					w-8 h-8 rounded-full flex items-center justify-center
					transition-all duration-300
					${status === "done" ? "bg-transparent" : ""}
				`}
				style={{
					boxShadow:
						status === "in_progress"
							? `0 0 0 2px white, 0 0 0 4px ${config.color}`
							: undefined,
				}}
			>
				{getIcon()}
			</div>

			{/* Label */}
			{showLabel && (
				<span
					className={`
						text-[9px] truncate max-w-12 text-center transition-colors
						${status === "done" ? "text-foreground font-medium" : "text-muted-foreground"}
					`}
					style={{ color: status === "done" ? config.color : undefined }}
				>
					{getLocalizedName()}
				</span>
			)}
		</div>
	);
}

export function PartsProgress({
	progress,
	showLabels = true,
}: PartsProgressProps) {
	const t = useTranslations("personaLab");
	const completedCount = getCompletedPartsCount(progress);

	return (
		<div className="w-full">
			{/* Summary */}
			<div className="flex items-center justify-between mb-3">
				<span className="text-xs text-muted-foreground">
					{t("partsProgress")}
				</span>
				<span className="text-xs font-medium text-primary">
					{t("partsComplete", { count: completedCount })}
				</span>
			</div>

			{/* Parts indicators */}
			<div className="flex items-center justify-between gap-2">
				{PART_KEYS.map((partKey, index) => (
					<div key={partKey} className="flex items-center gap-2">
						<PartIndicator
							partKey={partKey}
							status={progress[partKey]}
							showLabel={showLabels}
						/>
						{/* Connector line between parts */}
						{index < PART_KEYS.length - 1 && (
							<div
								className={`
									flex-1 h-0.5 min-w-4 max-w-8 rounded-full transition-colors
									${progress[partKey] === "done" ? "bg-primary/50" : "bg-muted"}
								`}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
