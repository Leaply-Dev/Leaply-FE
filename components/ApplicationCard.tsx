"use client";

import { Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
	id: string;
	universityName: string;
	program: string;
	status:
		| "draft"
		| "submitted"
		| "under_review"
		| "accepted"
		| "waitlisted"
		| "rejected";
	submissionDate?: string;
	decisionDeadline?: string;
	className?: string;
}

const statusConfig = {
	draft: { label: "Draft", variant: "secondary" as const },
	submitted: { label: "Submitted", variant: "info" as const },
	under_review: { label: "Under Review", variant: "warning" as const },
	accepted: { label: "Accepted", variant: "success" as const },
	waitlisted: { label: "Waitlisted", variant: "warning" as const },
	rejected: { label: "Rejected", variant: "destructive" as const },
};

export function ApplicationCard({
	id,
	universityName,
	program,
	status,
	submissionDate,
	decisionDeadline,
	className,
}: ApplicationCardProps) {
	const { t } = useTranslation();
	const statusLabel = t("applications", `status.${status}`);
	const config = { ...statusConfig[status], label: statusLabel };

	return (
		<Card className={cn("hover:shadow-md transition-shadow", className)}>
			<CardHeader>
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<CardTitle className="text-lg">{universityName}</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">{program}</p>
					</div>
					<Badge variant={config.variant}>{config.label}</Badge>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-2 mb-4">
					{submissionDate && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<FileText className="w-4 h-4" />
							<span>
								{t("applications", "submitted")}:{" "}
								{new Date(submissionDate).toLocaleDateString()}
							</span>
						</div>
					)}
					{decisionDeadline && (
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Calendar className="w-4 h-4" />
							<span>
								{t("applications", "decisionBy")}:{" "}
								{new Date(decisionDeadline).toLocaleDateString()}
							</span>
						</div>
					)}
				</div>
				<Button asChild size="sm" variant="outline" className="w-full">
					<Link href={`/dashboard/applications/${id}`}>
						{t("applications", "viewApplication")}
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
}
