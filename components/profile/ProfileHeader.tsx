"use client";

import { Check, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserMeResponse } from "@/lib/generated/api/models";

interface ProfileHeaderProps {
	userData: UserMeResponse | undefined;
	isLoading: boolean;
}

export function ProfileHeader({ userData, isLoading }: ProfileHeaderProps) {
	const t = useTranslations("profile");

	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getCompletionColor = (completion: number) => {
		if (completion >= 80) return "text-green-500";
		if (completion >= 50) return "text-yellow-500";
		return "text-orange-500";
	};

	if (isLoading) {
		return (
			<Card className="overflow-hidden mb-8">
				<div className="bg-linear-to-r from-primary/10 via-chart-2/10 to-transparent p-6">
					<div className="flex items-center gap-6">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="flex-1 space-y-3">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-2 w-full max-w-xs" />
						</div>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="overflow-hidden mb-8">
			<div className="bg-linear-to-r from-primary/10 via-chart-2/10 to-transparent p-6">
				<div className="flex items-center gap-6">
					<Avatar className="h-20 w-20 border-4 border-background shadow-lg">
						<AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
							{getInitials(userData?.fullName)}
						</AvatarFallback>
					</Avatar>
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-foreground mb-1">
							{userData?.fullName || t("noData")}
						</h2>
						<div className="flex items-center gap-2 text-muted-foreground mb-3 flex-wrap">
							<Mail className="h-4 w-4" />
							<span>{userData?.email}</span>
							{userData?.emailVerified ? (
								<Badge
									variant="secondary"
									className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
								>
									<Check className="h-3 w-3 mr-1" />
									{t("emailVerified")}
								</Badge>
							) : (
								<Badge
									variant="secondary"
									className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
								>
									{t("emailNotVerified")}
								</Badge>
							)}
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span className="text-muted-foreground">
									{t("profileCompletion")}
								</span>
								<span
									className={`font-semibold ${getCompletionColor(userData?.profileCompletion || 0)}`}
								>
									{userData?.profileCompletion || 0}%
								</span>
							</div>
							<Progress
								value={userData?.profileCompletion || 0}
								className="h-2"
							/>
							{(userData?.profileCompletion || 0) < 100 && (
								<p className="text-xs text-muted-foreground">
									{t("completeProfile")}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}
