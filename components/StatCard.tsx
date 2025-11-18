import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
	title: string;
	value: string | number;
	icon: LucideIcon;
	description?: string;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	className?: string;
}

export function StatCard({
	title,
	value,
	icon: Icon,
	description,
	trend,
	className,
}: StatCardProps) {
	return (
		<Card className={cn("overflow-hidden", className)}>
			<CardContent className="p-6">
				<div className="flex items-center justify-between mb-4">
					<div className="p-2 bg-primary/10 rounded-lg">
						<Icon className="w-6 h-6 text-primary" />
					</div>
					{trend && (
						<span
							className={cn(
								"text-sm font-medium",
								trend.isPositive ? "text-green-600" : "text-red-600",
							)}
						>
							{trend.isPositive ? "+" : ""}
							{trend.value}%
						</span>
					)}
				</div>

				<div>
					<p className="text-sm text-muted-foreground mb-1">{title}</p>
					<p className="text-3xl font-bold text-foreground">{value}</p>
					{description && (
						<p className="text-xs text-muted-foreground mt-2">{description}</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
