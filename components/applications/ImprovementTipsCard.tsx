"use client";

import { ChevronRight, Clock, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const priorityConfig: Record<
	string,
	{ label: string; color: string; bgColor: string }
> = {
	high: {
		label: "Ưu tiên cao",
		color: "text-red-700 dark:text-red-400",
		bgColor: "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800",
	},
	medium: {
		label: "Ưu tiên TB",
		color: "text-amber-700 dark:text-amber-400",
		bgColor:
			"bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800",
	},
	low: {
		label: "Ưu tiên thấp",
		color: "text-blue-700 dark:text-blue-400",
		bgColor:
			"bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800",
	},
};

const categoryLabels: Record<string, string> = {
	academic: "Học thuật",
	test_scores: "Điểm thi",
	experience: "Kinh nghiệm",
	essays: "Bài luận",
	profile: "Hồ sơ",
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
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Lightbulb className="w-5 h-5 text-primary" />
					Gợi ý cải thiện hồ sơ
				</CardTitle>
				<CardDescription>
					Những điều bạn có thể làm để tăng cơ hội trúng tuyển
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-3">
					{tips.tips.map((tip, index) => {
						const priority =
							priorityConfig[tip.priority ?? "low"] ?? priorityConfig.low;
						const categoryLabel =
							categoryLabels[tip.category ?? "profile"] ?? tip.category;

						return (
							<div
								key={`${tip.category}-${index}`}
								className={cn(
									"flex items-start gap-3 p-3 rounded-lg border transition-colors hover:shadow-sm",
									priority.bgColor,
								)}
							>
								<ChevronRight
									className={cn("w-5 h-5 mt-0.5 shrink-0", priority.color)}
								/>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1 flex-wrap">
										<span className={cn("font-medium text-sm", priority.color)}>
											{tip.title}
										</span>
										<Badge variant="outline" className="text-xs">
											{categoryLabel}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{tip.description}
									</p>
									{tip.timeframe && (
										<div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
											<Clock className="w-3 h-3" />
											<span>{tip.timeframe}</span>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
				{tips.generatedAt && (
					<p className="text-xs text-muted-foreground mt-4 text-center">
						Cập nhật: {new Date(tips.generatedAt).toLocaleDateString("vi-VN")}
					</p>
				)}
			</CardContent>
		</Card>
	);
}
