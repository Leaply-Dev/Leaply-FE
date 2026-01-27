"use client";

import { Check, Quote, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AngleDto } from "@/lib/api/sop-workspace";
import { cn } from "@/lib/utils";

interface AngleCardProps {
	angle: AngleDto;
	isSelected: boolean;
	onSelect: () => void;
}

export function AngleCard({ angle, isSelected, onSelect }: AngleCardProps) {
	const fitScorePercent = angle.fitScore
		? Math.round(angle.fitScore * 100)
		: null;

	return (
		<Card
			className={cn(
				"cursor-pointer transition-all hover:shadow-md",
				isSelected && "ring-2 ring-primary border-primary",
			)}
			onClick={onSelect}
		>
			<CardContent className="p-4 space-y-3">
				{/* Header with title and fit score */}
				<div className="flex items-start justify-between gap-2">
					<h3 className="font-semibold text-foreground flex-1">
						{angle.title}
					</h3>
					{fitScorePercent !== null && (
						<Badge
							variant="secondary"
							className={cn(
								"shrink-0",
								fitScorePercent >= 80 && "bg-green-100 text-green-700",
								fitScorePercent >= 60 &&
									fitScorePercent < 80 &&
									"bg-amber-100 text-amber-700",
								fitScorePercent < 60 && "bg-muted text-muted-foreground",
							)}
						>
							<Sparkles className="w-3 h-3 mr-1" />
							{fitScorePercent}%
						</Badge>
					)}
				</div>

				{/* Hook suggestion */}
				{angle.hook && (
					<div className="bg-muted/50 rounded-lg p-3 text-sm">
						<div className="flex items-start gap-2">
							<Quote className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
							<p className="text-muted-foreground italic">{angle.hook}</p>
						</div>
					</div>
				)}

				{/* Fit reason */}
				{angle.fitReason && (
					<p className="text-sm text-muted-foreground">{angle.fitReason}</p>
				)}

				{/* Tags */}
				{angle.relevantTags && angle.relevantTags.length > 0 && (
					<div className="flex flex-wrap gap-1.5">
						{angle.relevantTags.map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
				)}

				{/* Select button */}
				<Button
					variant={isSelected ? "default" : "outline"}
					size="sm"
					className="w-full mt-2"
					onClick={(e) => {
						e.stopPropagation();
						onSelect();
					}}
				>
					{isSelected ? (
						<>
							<Check className="w-4 h-4 mr-2" />
							Đã chọn
						</>
					) : (
						"Chọn góc này"
					)}
				</Button>
			</CardContent>
		</Card>
	);
}
