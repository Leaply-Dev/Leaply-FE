"use client";

import { Circle, Lightbulb } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ImprovementTipsDto } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

interface ImprovementTipsCardProps {
	tips: ImprovementTipsDto | undefined;
	className?: string;
}

const priorityColors: Record<string, string> = {
	high: "text-red-500 fill-red-500",
	medium: "text-amber-500 fill-amber-500",
	low: "text-blue-500 fill-blue-500",
};

export function ImprovementTipsCard({
	tips,
	className,
}: ImprovementTipsCardProps) {
	if (!tips?.tips || tips.tips.length === 0) {
		return null;
	}

	return (
		<Card className={cn("", className)}>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Lightbulb className="w-4 h-4 text-primary" />
					Gợi ý cải thiện
				</CardTitle>
				<CardDescription className="text-xs">
					Những việc cần làm để tăng cơ hội trúng tuyển
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<ul className="space-y-2">
					{tips.tips.map((tip, index) => {
						const colorClass =
							priorityColors[tip.priority ?? "low"] ?? priorityColors.low;

						return (
							<li
								key={`${tip.category}-${index}`}
								className="flex items-start gap-2 text-sm"
							>
								<Circle className={cn("w-2 h-2 mt-1.5 shrink-0", colorClass)} />
								<span className="text-foreground">{tip.title}</span>
							</li>
						);
					})}
				</ul>
			</CardContent>
		</Card>
	);
}
