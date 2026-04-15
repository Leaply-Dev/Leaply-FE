"use client";

import { AlertCircle, FileText } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { ApplicationResponse, GapDto } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";
import { formatSopStatus } from "@/lib/utils/displayFormatters";

interface InfoTabProps {
	application: ApplicationResponse;
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

export function InfoTab({ application }: InfoTabProps) {
	return (
		<div className="space-y-6">
			{/* SOP Status */}
			<Card>
				<CardContent className="p-4">
					<div className="flex items-center gap-2 mb-1">
						<FileText
							className="w-4 h-4 text-muted-foreground"
							aria-hidden="true"
						/>
						<span className="text-xs font-medium text-muted-foreground">
							Trạng thái SOP
						</span>
					</div>
					<p className="text-lg font-semibold text-foreground">
						{formatSopStatus(application.sopStatus)}
					</p>
				</CardContent>
			</Card>

			{/* Gaps Analysis */}
			{application.gaps && application.gaps.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							<AlertCircle
								className="w-5 h-5 text-amber-500"
								aria-hidden="true"
							/>
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
										<severityConfig.icon
											className="w-5 h-5 mt-0.5 shrink-0"
											aria-hidden="true"
										/>
										<div>
											<p className="font-medium text-sm capitalize">
												{gap.field?.replace("_", " ") ?? ""}
											</p>
											<p className="text-sm opacity-80">{gap.message ?? ""}</p>
										</div>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
