"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { TourStep } from "@/lib/store/tourStore";
import { cn } from "@/lib/utils";

interface TourTooltipProps {
	step: TourStep;
	stepIndex: number;
	totalSteps: number;
	targetRect: DOMRect | null;
	onNext: () => void;
	onSkip: () => void;
}

const TOOLTIP_WIDTH = 320;
const TOOLTIP_MARGIN = 16;
const ARROW_SIZE = 8;

function getTooltipPosition(
	targetRect: DOMRect | null,
	placement: TourStep["placement"],
	tooltipWidth: number,
	tooltipHeight: number,
): {
	top: number;
	left: number;
	arrowClass: string;
	arrowStyle: React.CSSProperties;
} {
	if (!targetRect) {
		// Center on screen if no target
		return {
			top: window.innerHeight / 2 - tooltipHeight / 2,
			left: window.innerWidth / 2 - tooltipWidth / 2,
			arrowClass: "hidden",
			arrowStyle: {},
		};
	}

	const padding = 8;
	const top = targetRect.top - padding;
	const left = targetRect.left - padding;
	const width = targetRect.width + padding * 2;
	const height = targetRect.height + padding * 2;
	const right = left + width;
	const bottom = top + height;

	let posTop = 0;
	let posLeft = 0;
	let finalPlacement = placement;

	// Calculate preferred position
	const calcPosition = (p: TourStep["placement"]) => {
		switch (p) {
			case "top":
				return {
					t: top - tooltipHeight - TOOLTIP_MARGIN,
					l: left + width / 2 - tooltipWidth / 2,
				};
			case "bottom":
				return {
					t: bottom + TOOLTIP_MARGIN,
					l: left + width / 2 - tooltipWidth / 2,
				};
			case "left":
				return {
					t: top + height / 2 - tooltipHeight / 2,
					l: left - tooltipWidth - TOOLTIP_MARGIN,
				};
			case "right":
				return {
					t: top + height / 2 - tooltipHeight / 2,
					l: right + TOOLTIP_MARGIN,
				};
		}
	};

	// Try placement, flip if off-screen
	const positions: TourStep["placement"][] = [
		placement,
		"bottom",
		"top",
		"right",
		"left",
	];
	for (const p of positions) {
		const { t, l } = calcPosition(p);
		if (
			t >= TOOLTIP_MARGIN &&
			l >= TOOLTIP_MARGIN &&
			t + tooltipHeight <= window.innerHeight - TOOLTIP_MARGIN &&
			l + tooltipWidth <= window.innerWidth - TOOLTIP_MARGIN
		) {
			posTop = t;
			posLeft = l;
			finalPlacement = p;
			break;
		}
	}

	// If none fit, just use the preferred and clamp
	if (posTop === 0 && posLeft === 0) {
		const { t, l } = calcPosition(placement);
		posTop = Math.max(
			TOOLTIP_MARGIN,
			Math.min(t, window.innerHeight - tooltipHeight - TOOLTIP_MARGIN),
		);
		posLeft = Math.max(
			TOOLTIP_MARGIN,
			Math.min(l, window.innerWidth - tooltipWidth - TOOLTIP_MARGIN),
		);
	}

	// Arrow positioning
	const arrowStyle: React.CSSProperties = {};
	let arrowClass = "";

	switch (finalPlacement) {
		case "top":
			arrowClass = "absolute left-1/2 -translate-x-1/2 -bottom-2";
			arrowStyle.borderLeft = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderRight = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderTop = "8px solid hsl(var(--card))";
			break;
		case "bottom":
			arrowClass = "absolute left-1/2 -translate-x-1/2 -top-2";
			arrowStyle.borderLeft = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderRight = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderBottom = "8px solid hsl(var(--card))";
			break;
		case "left":
			arrowClass = "absolute top-1/2 -translate-y-1/2 -right-2";
			arrowStyle.borderTop = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderBottom = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderLeft = "8px solid hsl(var(--card))";
			break;
		case "right":
			arrowClass = "absolute top-1/2 -translate-y-1/2 -left-2";
			arrowStyle.borderTop = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderBottom = `${ARROW_SIZE}px solid transparent`;
			arrowStyle.borderRight = "8px solid hsl(var(--card))";
			break;
	}

	return { top: posTop, left: posLeft, arrowClass, arrowStyle };
}

export function TourTooltip({
	step,
	stepIndex,
	totalSteps,
	targetRect,
	onNext,
	onSkip,
}: TourTooltipProps) {
	const t = useTranslations("tour");
	const tooltipRef = useRef<HTMLDivElement>(null);
	const [tooltipSize, setTooltipSize] = useState({
		width: TOOLTIP_WIDTH,
		height: 200,
	});
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (tooltipRef.current) {
			const rect = tooltipRef.current.getBoundingClientRect();
			setTooltipSize({ width: rect.width, height: rect.height });
		}
	}, [step.id]);

	// Trigger enter animation after mount
	useEffect(() => {
		const timer = setTimeout(() => setVisible(true), 50);
		return () => clearTimeout(timer);
	}, [step.id]);

	const { top, left, arrowClass, arrowStyle } = getTooltipPosition(
		targetRect,
		step.placement,
		tooltipSize.width,
		tooltipSize.height,
	);

	const isLastStep = stepIndex === totalSteps - 1;

	return (
		<div
			ref={tooltipRef}
			className={cn(
				"fixed z-[70] pointer-events-auto transition-all duration-300 ease-out",
				visible
					? "opacity-100 translate-y-0 scale-100"
					: "opacity-0 translate-y-2 scale-95",
			)}
			style={{
				top,
				left,
				width: TOOLTIP_WIDTH,
			}}
		>
			<div
				className={cn(
					"relative bg-card border border-border rounded-xl shadow-xl p-5",
				)}
			>
				{/* Arrow */}
				<div className={arrowClass} style={arrowStyle} />

				{/* Step indicator */}
				<div className="flex items-center gap-2 mb-3">
					<div className="flex gap-1.5">
						{Array.from({ length: totalSteps }).map((_, i) => (
							<div
								key={i}
								className={cn(
									"h-1.5 rounded-full transition-all duration-300",
									i === stepIndex
										? "w-6 bg-primary"
										: i < stepIndex
											? "w-1.5 bg-primary/60"
											: "w-1.5 bg-muted",
								)}
							/>
						))}
					</div>
					<span className="text-xs text-muted-foreground ml-auto">
						{t("progress", { current: stepIndex + 1, total: totalSteps })}
					</span>
				</div>

				{/* Title */}
				<h3 className="text-base font-semibold text-foreground mb-1.5">
					{t(step.titleKey)}
				</h3>

				{/* Description */}
				<p className="text-sm text-muted-foreground leading-relaxed mb-5">
					{t(step.descriptionKey)}
				</p>

				{/* Actions */}
				<div className="flex items-center justify-between gap-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={onSkip}
						className="text-muted-foreground hover:text-foreground"
					>
						{t("skip")}
					</Button>
					<Button size="sm" onClick={onNext} className="gap-1.5">
						{isLastStep ? t("finish") : t("next")}
					</Button>
				</div>
			</div>
		</div>
	);
}
