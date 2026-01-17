"use client";

import { AlertCircle, Calendar, CheckCircle2, FileText } from "lucide-react";
import { ImprovementTipsCard } from "@/components/applications/ImprovementTipsCard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { ApplicationResponse, GapDto } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";
import { formatSopStatus } from "@/lib/utils/displayFormatters";

interface InfoTabProps {
	application: ApplicationResponse;
	onUpdateStatus?: (status: string) => Promise<boolean>;
}

const gapSeverityConfig: Record<
	string,
	{ color: string; icon: typeof AlertCircle }
> = {
	critical: {
		color: "text-red-600 bg-red-50 border-red-200",
		icon: AlertCircle,
	},
	warning: {
		color: "text-amber-600 bg-amber-50 border-amber-200",
		icon: AlertCircle,
	},
	info: {
		color: "text-blue-600 bg-blue-50 border-blue-200",
		icon: AlertCircle,
	},
};

export function InfoTab({ application, onUpdateStatus }: InfoTabProps) {
	// Calculate days until deadline
	const getDaysUntilDeadline = () => {
		if (!application.program?.nextDeadline) return null;
		const deadline = new Date(application.program.nextDeadline);
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
							<CheckCircle2 className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
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

				{/* SOP Status */}
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<FileText className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
							<span className="text-xs font-medium text-muted-foreground">
								Trạng thái SOP
							</span>
						</div>
						<p className="text-lg font-semibold text-foreground">
							{formatSopStatus(application.sopStatus)}
						</p>
					</CardContent>
				</Card>

				{/* Next Deadline */}
				<Card
					className={cn(
						daysUntilDeadline !== null &&
							daysUntilDeadline <= 7 &&
							"border-red-200 bg-red-50",
					)}
				>
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-1">
							<Calendar className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
							<span className="text-xs font-medium text-muted-foreground">
								Hạn chót tiếp theo
							</span>
						</div>
						{application.program?.nextDeadline ? (
							<>
								<p className="text-sm font-semibold text-foreground">
									{new Date(
										application.program.nextDeadline,
									).toLocaleDateString("vi-VN")}
								</p>
								{daysUntilDeadline !== null && (
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
						) : (
							<p className="text-sm text-muted-foreground">Chưa có</p>
						)}
					</CardContent>
				</Card>
			</div>

			{/* Gaps Analysis */}
			{application.gaps && application.gaps.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<AlertCircle className="w-5 h-5 text-amber-500" aria-hidden="true" />
							Điểm cần cải thiện
						</CardTitle>
						<CardDescription>
							Các yếu tố bạn cần cải thiện để tăng cơ hội trúng tuyển
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{application.gaps?.map((gap: GapDto) => {
								const severityConfig =
									gapSeverityConfig[gap.severity ?? "info"] ||
									gapSeverityConfig.info;
								return (
									<div
										key={gap.field}
										className={cn(
											"flex items-start gap-3 p-3 rounded-lg border",
											severityConfig.color,
										)}
									>
										<severityConfig.icon className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
										<div>
											<p className="font-medium text-sm capitalize">
												{gap.field?.replace("_", " ") ?? ""}
											</p>
											<p className="text-sm opacity-80">
												{gap.message ?? ""}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Improvement Tips */}
			<ImprovementTipsCard tips={application.improvementTips} />

			{/* Next Intake Info */}
			{application.program?.nextIntake && (
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Kỳ nhập học</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-lg font-semibold">
							{application.program?.nextIntake}
						</p>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
