"use client";

import { FileText, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface ProgramDocumentsTabProps {
	applicationId: string;
}

/**
 * Documents tab for program applications.
 * Currently shows a placeholder - backend endpoints are not yet implemented.
 */
export function ProgramDocumentsTab({
	applicationId: _applicationId,
}: ProgramDocumentsTabProps) {
	return (
		<div className="space-y-6">
			{/* Upload Section - Coming Soon */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Upload className="w-5 h-5" />
						Tải tài liệu lên
						<Badge variant="secondary" className="ml-2">
							Sắp ra mắt
						</Badge>
					</CardTitle>
					<CardDescription>
						Tính năng tải tài liệu cho chương trình học đang được phát triển
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="border-2 border-dashed rounded-lg p-8 text-center border-muted-foreground/25">
						<Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm font-medium text-muted-foreground">
							Tính năng sẽ hỗ trợ tải lên các tài liệu như:
						</p>
						<div className="flex flex-wrap justify-center gap-2 mt-3">
							<Badge variant="outline">CV/Resume</Badge>
							<Badge variant="outline">Bảng điểm</Badge>
							<Badge variant="outline">Thư giới thiệu</Badge>
							<Badge variant="outline">Chứng chỉ</Badge>
						</div>
						<p className="text-xs text-muted-foreground mt-4">
							Hỗ trợ PDF, DOC, DOCX - Tối đa 10MB
						</p>
					</div>
				</CardContent>
			</Card>

			{/* Documents List - Empty State */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="w-5 h-5" />
						Tài liệu đã tải lên
					</CardTitle>
					<CardDescription>0 tài liệu</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm text-muted-foreground">
							Chưa có tài liệu nào được tải lên
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
