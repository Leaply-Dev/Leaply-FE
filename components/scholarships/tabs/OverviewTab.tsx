"use client";

import { Award, Building2, Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { ImprovementTipsCard } from "@/components/applications/ImprovementTipsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ScholarshipApplicationResponse } from "@/lib/generated/api/models";

interface OverviewTabProps {
	application: ScholarshipApplicationResponse;
}

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
		color: string;
	}
> = {
	planning: {
		label: "Đang chuẩn bị",
		variant: "secondary",
		color: "text-muted-foreground",
	},
	writing: {
		label: "Đang viết",
		variant: "outline",
		color: "text-blue-600",
	},
	submitted: {
		label: "Đã nộp",
		variant: "default",
		color: "text-primary",
	},
	accepted: {
		label: "Trúng tuyển",
		variant: "default",
		color: "text-green-600",
	},
	rejected: {
		label: "Không đạt",
		variant: "destructive",
		color: "text-red-600",
	},
};

const coverageLabels: Record<string, string> = {
	full: "Toàn phần",
	partial: "Bán phần",
	tuition_only: "Học phí",
	living_expenses: "Sinh hoạt phí",
};

export function OverviewTab({ application }: OverviewTabProps) {
	const config =
		statusConfig[application.status ?? "planning"] ?? statusConfig.planning;

	// Calculate days until deadline
	const getDaysUntilDeadline = () => {
		if (!application.targetDeadline) return null;
		const deadline = new Date(application.targetDeadline);
		const now = new Date();
		const diff = deadline.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const daysUntilDeadline = getDaysUntilDeadline();

	return (
		<div className="space-y-6">
			{/* Scholarship Info Card */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<Award className="w-6 h-6 text-primary" />
							</div>
							<div>
								<CardTitle className="text-xl">
									{application.scholarship?.name}
								</CardTitle>
								<CardDescription className="flex items-center gap-1 mt-1">
									<Building2 className="w-4 h-4" />
									{application.scholarship?.sourceName}
								</CardDescription>
							</div>
						</div>
						<Badge variant={config.variant}>{config.label}</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Coverage Type */}
						<div className="p-4 bg-muted/50 rounded-lg">
							<p className="text-xs text-muted-foreground mb-1">Mức hỗ trợ</p>
							<p className="font-semibold">
								{application.scholarship?.coverageType
									? (coverageLabels[application.scholarship.coverageType] ??
										application.scholarship.coverageType)
									: "Chưa xác định"}
							</p>
						</div>

						{/* Target Deadline */}
						<div className="p-4 bg-muted/50 rounded-lg">
							<p className="text-xs text-muted-foreground mb-1">Hạn nộp</p>
							{application.targetDeadline ? (
								<div>
									<p className="font-semibold">
										{new Date(application.targetDeadline).toLocaleDateString(
											"vi-VN",
										)}
									</p>
									{daysUntilDeadline !== null && daysUntilDeadline > 0 && (
										<p
											className={`text-xs ${
												daysUntilDeadline <= 7
													? "text-red-600"
													: daysUntilDeadline <= 30
														? "text-amber-600"
														: "text-muted-foreground"
											}`}
										>
											Còn {daysUntilDeadline} ngày
										</p>
									)}
								</div>
							) : (
								<p className="text-muted-foreground">Chưa xác định</p>
							)}
						</div>

						{/* Application Deadline from Scholarship */}
						<div className="p-4 bg-muted/50 rounded-lg">
							<p className="text-xs text-muted-foreground mb-1">
								Hạn chót học bổng
							</p>
							{application.scholarship?.applicationDeadline ? (
								<p className="font-semibold">
									{new Date(
										application.scholarship.applicationDeadline,
									).toLocaleDateString("vi-VN")}
								</p>
							) : (
								<p className="text-muted-foreground">Chưa xác định</p>
							)}
						</div>
					</div>

					{/* Notes */}
					{application.notes && (
						<div className="mt-4 p-4 bg-muted/30 rounded-lg">
							<p className="text-xs text-muted-foreground mb-1">Ghi chú</p>
							<p className="text-sm whitespace-pre-wrap">{application.notes}</p>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Documents Count */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span className="text-xs font-medium text-muted-foreground">
								Tài liệu đã nộp
							</span>
						</div>
						<p className="text-2xl font-bold">
							{application.documents?.length ?? 0}
						</p>
					</CardContent>
				</Card>

				{/* Submitted Date */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span className="text-xs font-medium text-muted-foreground">
								Ngày tạo
							</span>
						</div>
						<p className="text-sm font-semibold">
							{application.createdAt
								? new Date(application.createdAt).toLocaleDateString("vi-VN")
								: "—"}
						</p>
					</CardContent>
				</Card>

				{/* Last Updated */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4 text-muted-foreground" />
							<span className="text-xs font-medium text-muted-foreground">
								Cập nhật lần cuối
							</span>
						</div>
						<p className="text-sm font-semibold">
							{application.updatedAt
								? new Date(application.updatedAt).toLocaleDateString("vi-VN")
								: "—"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Improvement Tips */}
			<ImprovementTipsCard tips={application.improvementTips} />

			{/* Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Hành động</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						<Button variant="outline" asChild>
							<Link
								href={`/explore/scholarships/${application.scholarship?.id ?? ""}`}
							>
								<ExternalLink className="w-4 h-4 mr-2" />
								Xem chi tiết học bổng
							</Link>
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
