"use client";

import {
	Award,
	Calendar,
	CheckCircle2,
	DollarSign,
	FileText,
} from "lucide-react";
import { ImprovementTipsCard } from "@/components/applications/ImprovementTipsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ScholarshipApplicationResponse } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";
import { formatCoverageTypeI18n } from "@/lib/utils/displayFormatters";

interface OverviewTabProps {
	application: ScholarshipApplicationResponse;
	onUpdateStatus?: (status: string) => Promise<boolean>;
}

export function OverviewTab({ application, onUpdateStatus }: OverviewTabProps) {
	// Calculate days until deadline
	const getDaysUntilDeadline = () => {
		if (!application.targetDeadline) return null;
		const deadline = new Date(application.targetDeadline);
		const now = new Date();
		const diff = deadline.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const daysUntilDeadline = getDaysUntilDeadline();

	const handleStatusChange = async (newStatus: string) => {
		if (onUpdateStatus) {
			await onUpdateStatus(newStatus);
		}
	};

	return (
		<div className="space-y-6">
			{/* Quick Stats Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Status */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<CheckCircle2
								className="w-4 h-4 text-muted-foreground"
								aria-hidden="true"
							/>
							<span className="text-xs font-medium text-muted-foreground">
								Trạng thái
							</span>
						</div>
						<Select
							value={application.status}
							onValueChange={handleStatusChange}
						>
							<SelectTrigger className="w-full h-8 text-sm mt-1">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="planning">Đang chuẩn bị</SelectItem>
								<SelectItem value="writing">Đang viết</SelectItem>
								<SelectItem value="submitted">Đã nộp</SelectItem>
							</SelectContent>
						</Select>
					</CardContent>
				</Card>

				{/* Coverage Type */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<DollarSign
								className="w-4 h-4 text-muted-foreground"
								aria-hidden="true"
							/>
							<span className="text-xs font-medium text-muted-foreground">
								Mức hỗ trợ
							</span>
						</div>
						<p className="text-lg font-semibold text-foreground">
							{formatCoverageTypeI18n(application.scholarship?.coverageType)}
						</p>
					</CardContent>
				</Card>

				{/* Deadline */}
				<Card
					className={cn(
						daysUntilDeadline !== null &&
							daysUntilDeadline <= 7 &&
							"border-red-200 bg-red-50",
					)}
				>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar
								className="w-4 h-4 text-muted-foreground"
								aria-hidden="true"
							/>
							<span className="text-xs font-medium text-muted-foreground">
								Hạn nộp
							</span>
						</div>
						{application.targetDeadline ? (
							<>
								<p className="text-sm font-semibold text-foreground">
									{new Date(application.targetDeadline).toLocaleDateString(
										"vi-VN",
									)}
								</p>
								{daysUntilDeadline !== null && daysUntilDeadline > 0 && (
									<p
										className={cn(
											"text-xs font-medium",
											daysUntilDeadline <= 7
												? "text-red-600"
												: daysUntilDeadline <= 30
													? "text-amber-600"
													: "text-muted-foreground",
										)}
									>
										Còn {daysUntilDeadline} ngày
									</p>
								)}
							</>
						) : application.scholarship?.applicationDeadline ? (
							<>
								<p className="text-sm font-semibold text-foreground">
									{new Date(
										application.scholarship.applicationDeadline,
									).toLocaleDateString("vi-VN")}
								</p>
								<p className="text-xs text-muted-foreground">
									Hạn chót học bổng
								</p>
							</>
						) : (
							<p className="text-sm text-muted-foreground">Chưa xác định</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Additional Info Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Documents Count */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<FileText
								className="w-4 h-4 text-muted-foreground"
								aria-hidden="true"
							/>
							<span className="text-xs font-medium text-muted-foreground">
								Tài liệu đã nộp
							</span>
						</div>
						<p className="text-lg font-semibold">
							{application.documents?.length ?? 0}
						</p>
					</CardContent>
				</Card>

				{/* Updated Date */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar
								className="w-4 h-4 text-muted-foreground"
								aria-hidden="true"
							/>
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

				{/* Created Date */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Award
								className="w-4 h-4 text-muted-foreground"
								aria-hidden="true"
							/>
							<span className="text-xs font-medium text-muted-foreground">
								Ngày thêm
							</span>
						</div>
						<p className="text-sm font-semibold">
							{application.createdAt
								? new Date(application.createdAt).toLocaleDateString("vi-VN")
								: "—"}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Notes */}
			{application.notes && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Ghi chú</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm whitespace-pre-wrap">{application.notes}</p>
					</CardContent>
				</Card>
			)}

			{/* Improvement Tips */}
			<ImprovementTipsCard tips={application.improvementTips} />
		</div>
	);
}
