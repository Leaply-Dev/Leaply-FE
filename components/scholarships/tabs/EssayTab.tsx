"use client";

import { useQueryClient } from "@tanstack/react-query";
import { FileEdit, Loader2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplicationQueryKey,
	getGetDocumentsQueryKey,
	useGetEssayContent,
	useSaveEssayContent,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type { DocumentDto } from "@/lib/generated/api/models";

interface EssayTabProps {
	applicationId: string;
	documents: DocumentDto[];
}

export function EssayTab({ applicationId, documents }: EssayTabProps) {
	const queryClient = useQueryClient();

	// Find the current essay document
	const essayDoc = useMemo(() => {
		return documents.find(
			(doc) => doc.documentType === "essay" && doc.isCurrent,
		);
	}, [documents]);

	// Fetch essay content if we have an essay document
	const { data: essayContentResponse, isLoading: isLoadingContent } =
		useGetEssayContent(applicationId, essayDoc?.id ?? "", {
			query: {
				enabled: !!essayDoc?.id,
			},
		});

	const essayContent = unwrapResponse<string>(essayContentResponse) ?? "";

	const saveEssayMutation = useSaveEssayContent();

	const handleSave = useCallback(
		async (content: string) => {
			try {
				await saveEssayMutation.mutateAsync({
					applicationId,
					data: { content },
				});

				// Invalidate queries to refresh documents list
				await queryClient.invalidateQueries({
					queryKey: getGetDocumentsQueryKey(applicationId),
				});
				await queryClient.invalidateQueries({
					queryKey: getGetApplicationQueryKey(applicationId),
				});

				toast.success("Đã lưu bài luận");
			} catch {
				toast.error("Lưu thất bại", {
					description: "Vui lòng thử lại sau",
				});
				throw new Error("Save failed");
			}
		},
		[applicationId, saveEssayMutation, queryClient],
	);

	if (isLoadingContent) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<FileEdit className="w-5 h-5" />
						Viết bài luận
					</CardTitle>
					<CardDescription>
						Sử dụng trình soạn thảo bên dưới để viết bài luận của bạn. Nội dung
						sẽ tự động được lưu sau 2 giây khi bạn ngừng gõ.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<TipTapEditor
						initialContent={essayContent}
						onSave={handleSave}
						placeholder="Bắt đầu viết bài luận của bạn tại đây..."
						debounceMs={2000}
					/>
				</CardContent>
			</Card>

			{/* Essay Tips Card */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Mẹo viết bài luận</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li className="flex items-start gap-2">
							<span className="text-primary font-bold">1.</span>
							<span>
								Bắt đầu bằng một câu chuyện hoặc ví dụ cụ thể để thu hút sự chú
								ý
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary font-bold">2.</span>
							<span>Giải thích rõ ràng lý do bạn phù hợp với học bổng này</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary font-bold">3.</span>
							<span>
								Nêu bật thành tựu và kinh nghiệm liên quan đến tiêu chí xét
								tuyển
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary font-bold">4.</span>
							<span>
								Chia sẻ kế hoạch tương lai và cách học bổng sẽ giúp bạn đạt được
								mục tiêu
							</span>
						</li>
						<li className="flex items-start gap-2">
							<span className="text-primary font-bold">5.</span>
							<span>Kiểm tra lỗi chính tả và ngữ pháp trước khi nộp</span>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	);
}
