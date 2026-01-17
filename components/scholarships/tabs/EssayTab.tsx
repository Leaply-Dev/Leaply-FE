"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	ClipboardList,
	FileEdit,
	Lightbulb,
	Loader2,
	Sparkles,
} from "lucide-react";
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
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
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

/**
 * Placeholder component for AI Feedback panel
 * Will be connected to backend when essay feedback endpoint is available
 */
function EssayFeedbackPlaceholder() {
	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-3 shrink-0">
				<CardTitle className="text-base flex items-center gap-2">
					<Sparkles className="w-4 h-4 text-primary" />
					Phản hồi AI
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-1">
				<div className="text-center py-8">
					<Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
					<p className="text-sm text-muted-foreground mb-2">
						Tính năng đang phát triển
					</p>
					<p className="text-xs text-muted-foreground">
						Phản hồi AI cho bài luận học bổng sẽ sớm có mặt
					</p>
				</div>
			</CardContent>
		</Card>
	);
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
		<div className="flex gap-6 h-full">
			{/* Left Column - Editor */}
			<div className="flex-1 flex flex-col min-w-0 space-y-4">
				{/* Collapsible Writing Tips */}
				<Collapsible defaultOpen={false}>
					<Card>
						<CollapsibleTrigger asChild>
							<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
								<CardTitle className="text-base flex items-center gap-2">
									<ClipboardList className="w-4 h-4" />
									Mẹo viết bài luận
								</CardTitle>
							</CardHeader>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<CardContent className="pt-0">
								<ul className="space-y-2 text-sm text-muted-foreground">
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">1.</span>
										<span>
											Bắt đầu bằng một câu chuyện hoặc ví dụ cụ thể để thu hút
											sự chú ý
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">2.</span>
										<span>
											Giải thích rõ ràng lý do bạn phù hợp với học bổng này
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">3.</span>
										<span>
											Nêu bật thành tựu và kinh nghiệm liên quan đến tiêu chí
											xét tuyển
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">4.</span>
										<span>
											Chia sẻ kế hoạch tương lai và cách học bổng sẽ giúp bạn
											đạt được mục tiêu
										</span>
									</li>
									<li className="flex items-start gap-2">
										<span className="text-primary font-bold">5.</span>
										<span>Kiểm tra lỗi chính tả và ngữ pháp trước khi nộp</span>
									</li>
								</ul>
							</CardContent>
						</CollapsibleContent>
					</Card>
				</Collapsible>

				{/* Editor Card */}
				<Card className="flex-1 flex flex-col">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<FileEdit className="w-5 h-5" />
							Viết bài luận
						</CardTitle>
						<CardDescription>
							Nội dung sẽ tự động được lưu sau 2 giây khi bạn ngừng gõ.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1">
						<ScrollArea className="h-[calc(100vh-24rem)]">
							<TipTapEditor
								initialContent={essayContent}
								onSave={handleSave}
								placeholder="Bắt đầu viết bài luận của bạn tại đây..."
								debounceMs={2000}
							/>
						</ScrollArea>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - AI Feedback Panel */}
			<div className="w-80 shrink-0">
				<div className="sticky top-4">
					<EssayFeedbackPlaceholder />
				</div>
			</div>
		</div>
	);
}
