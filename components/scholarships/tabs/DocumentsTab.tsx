"use client";

import { useQueryClient } from "@tanstack/react-query";
import { File, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getGetApplicationQueryKey,
	getGetDocumentsQueryKey,
	useDeleteDocument,
	useUploadDocument,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type { DocumentDto } from "@/lib/generated/api/models";
import { cn } from "@/lib/utils";

interface DocumentsTabProps {
	applicationId: string;
	documents: DocumentDto[];
}

const documentTypeLabels: Record<string, string> = {
	essay: "Bài luận",
	transcript: "Bảng điểm",
	recommendation: "Thư giới thiệu",
	cv: "CV/Resume",
	certificate: "Chứng chỉ",
	other: "Tài liệu khác",
};

const ACCEPTED_FILE_TYPES = {
	"application/pdf": [".pdf"],
	"application/msword": [".doc"],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		".docx",
	],
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DocumentsTab({ applicationId, documents }: DocumentsTabProps) {
	const queryClient = useQueryClient();
	const [selectedDocType, setSelectedDocType] = useState<string>("essay");
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [documentToDelete, setDocumentToDelete] = useState<DocumentDto | null>(
		null,
	);

	const uploadMutation = useUploadDocument();
	const deleteMutation = useDeleteDocument();

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			if (acceptedFiles.length === 0) return;

			const file = acceptedFiles[0];

			if (file.size > MAX_FILE_SIZE) {
				toast.error("File quá lớn", {
					description: "File không được vượt quá 10MB",
				});
				return;
			}

			try {
				await uploadMutation.mutateAsync({
					applicationId,
					data: { file },
					params: { documentType: selectedDocType },
				});

				// Invalidate queries to refresh data
				await queryClient.invalidateQueries({
					queryKey: getGetDocumentsQueryKey(applicationId),
				});
				await queryClient.invalidateQueries({
					queryKey: getGetApplicationQueryKey(applicationId),
				});

				toast.success("Tải lên thành công", {
					description: `${file.name} đã được tải lên`,
				});
			} catch {
				toast.error("Tải lên thất bại", {
					description: "Vui lòng thử lại sau",
				});
			}
		},
		[applicationId, selectedDocType, uploadMutation, queryClient],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: ACCEPTED_FILE_TYPES,
		maxFiles: 1,
		disabled: uploadMutation.isPending,
	});

	const handleDeleteClick = (doc: DocumentDto) => {
		setDocumentToDelete(doc);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!documentToDelete?.id) return;

		try {
			await deleteMutation.mutateAsync({
				applicationId,
				documentId: documentToDelete.id,
			});

			// Invalidate queries to refresh data
			await queryClient.invalidateQueries({
				queryKey: getGetDocumentsQueryKey(applicationId),
			});
			await queryClient.invalidateQueries({
				queryKey: getGetApplicationQueryKey(applicationId),
			});

			toast.success("Xóa thành công", {
				description: `${documentToDelete.fileName} đã được xóa`,
			});
			setDeleteDialogOpen(false);
			setDocumentToDelete(null);
		} catch {
			toast.error("Xóa thất bại", {
				description: "Vui lòng thử lại sau",
			});
		}
	};

	return (
		<div className="space-y-6">
			{/* Upload Section */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Upload className="w-5 h-5" />
						Tải tài liệu lên
					</CardTitle>
					<CardDescription>Hỗ trợ PDF, DOC, DOCX (tối đa 10MB)</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{/* Document Type Selector */}
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">Loại tài liệu:</span>
						<Select value={selectedDocType} onValueChange={setSelectedDocType}>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(documentTypeLabels).map(([value, label]) => (
									<SelectItem key={value} value={value}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Dropzone */}
					<div
						{...getRootProps()}
						className={cn(
							"border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
							isDragActive
								? "border-primary bg-primary/5"
								: "border-muted-foreground/25 hover:border-primary/50",
							uploadMutation.isPending && "opacity-50 cursor-not-allowed",
						)}
					>
						<input {...getInputProps()} />
						{uploadMutation.isPending ? (
							<div className="flex flex-col items-center gap-2">
								<Loader2 className="w-10 h-10 text-primary animate-spin" />
								<p className="text-sm text-muted-foreground">Đang tải lên...</p>
							</div>
						) : isDragActive ? (
							<div className="flex flex-col items-center gap-2">
								<Upload className="w-10 h-10 text-primary" />
								<p className="text-sm font-medium">Thả file vào đây</p>
							</div>
						) : (
							<div className="flex flex-col items-center gap-2">
								<Upload className="w-10 h-10 text-muted-foreground" />
								<p className="text-sm font-medium">
									Kéo thả file hoặc click để chọn
								</p>
								<p className="text-xs text-muted-foreground">
									PDF, DOC, DOCX - Tối đa 10MB
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Documents List */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileText className="w-5 h-5" />
						Tài liệu đã tải lên
					</CardTitle>
					<CardDescription>{documents.length} tài liệu</CardDescription>
				</CardHeader>
				<CardContent>
					{documents.length === 0 ? (
						<div className="text-center py-8">
							<File className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
							<p className="text-sm text-muted-foreground">
								Chưa có tài liệu nào được tải lên
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{documents.map((doc) => (
								<div
									key={doc.id}
									className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
								>
									<div className="flex items-center gap-3 min-w-0">
										<FileText className="w-5 h-5 text-muted-foreground shrink-0" />
										<div className="min-w-0">
											<p className="font-medium text-sm truncate">
												{doc.fileName}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<Badge variant="outline" className="text-xs">
													{documentTypeLabels[doc.documentType ?? "other"] ??
														doc.documentType}
												</Badge>
												{doc.wordCount && doc.wordCount > 0 && (
													<span className="text-xs text-muted-foreground">
														{doc.wordCount.toLocaleString()} từ
													</span>
												)}
												{doc.updatedAt && (
													<span className="text-xs text-muted-foreground">
														{new Date(doc.updatedAt).toLocaleDateString(
															"vi-VN",
														)}
													</span>
												)}
											</div>
										</div>
									</div>
									<Button
										variant="ghost"
										size="icon"
										className="text-destructive hover:text-destructive shrink-0"
										onClick={() => handleDeleteClick(doc)}
									>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Delete Confirmation Dialog */}
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Xác nhận xóa</DialogTitle>
						<DialogDescription>
							Bạn có chắc chắn muốn xóa "{documentToDelete?.fileName}"? Hành
							động này không thể hoàn tác.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							Hủy
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteConfirm}
							disabled={deleteMutation.isPending}
						>
							{deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
