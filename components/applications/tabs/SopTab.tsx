"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { SopEditor } from "@/components/applications/SopEditor";
import { SopFeedbackPanel } from "@/components/applications/SopFeedbackPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetSopQueryKey,
	useGetSop,
	useGetSopFeedback,
	useSaveSop,
} from "@/lib/generated/api/endpoints/applications/applications";
import type { ApplicationSopResponse } from "@/lib/generated/api/models";

interface SopTabProps {
	applicationId: string;
	programName?: string;
	universityName?: string;
}

export function SopTab({
	applicationId,
	programName,
	universityName,
}: SopTabProps) {
	const queryClient = useQueryClient();

	// Fetch SOP data
	const {
		data: sopResponse,
		isLoading: isLoadingSop,
		error: sopError,
	} = useGetSop(applicationId);

	// Save SOP mutation
	const { mutateAsync: saveSop, isPending: isSaving } = useSaveSop();

	// Get feedback mutation (triggered after save)
	const { mutateAsync: getFeedback, isPending: isGettingFeedback } =
		useGetSopFeedback();

	// Parse SOP data
	const sopData = unwrapResponse<ApplicationSopResponse>(sopResponse);

	// Handle save
	const handleSave = useCallback(
		async (content: string) => {
			try {
				await saveSop({
					id: applicationId,
					data: {
						content,
						wordLimit: sopData?.wordLimit,
						prompt: sopData?.prompt,
					},
				});

				// Invalidate queries to refresh data
				await queryClient.invalidateQueries({
					queryKey: getGetSopQueryKey(applicationId),
				});

				// Get new feedback if content is substantial
				const wordCount = content.split(/\s+/).filter(Boolean).length;
				if (wordCount >= 100) {
					try {
						await getFeedback({ id: applicationId });
						await queryClient.invalidateQueries({
							queryKey: getGetSopQueryKey(applicationId),
						});
					} catch {
						// Feedback generation failed, but save succeeded
						console.log("Feedback generation skipped");
					}
				}

				toast.success("Đã lưu thành công");
			} catch {
				toast.error("Lưu thất bại. Vui lòng thử lại.");
				throw new Error("Save failed");
			}
		},
		[applicationId, saveSop, getFeedback, queryClient, sopData],
	);

	// Loading state
	if (isLoadingSop) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
					<p className="text-muted-foreground">Đang tải...</p>
				</div>
			</div>
		);
	}

	// Error state
	if (sopError) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px]">
				<div className="text-center">
					<Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h2 className="text-lg font-semibold text-foreground mb-2">
						Không thể tải dữ liệu SOP
					</h2>
					<p className="text-sm text-muted-foreground">
						{sopError instanceof Error ? sopError.message : "Đã xảy ra lỗi"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Status indicator */}
			{(isSaving || isGettingFeedback) && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2">
					<Loader2 className="w-4 h-4 animate-spin" />
					{isGettingFeedback ? "Đang phân tích bài viết..." : "Đang lưu..."}
				</div>
			)}

			{/* Ideation Section - Collapsible */}
			<Collapsible defaultOpen={!sopData?.content}>
				<Card>
					<CollapsibleTrigger asChild>
						<CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
							<CardTitle className="flex items-center gap-2 text-base">
								<Lightbulb className="w-5 h-5 text-amber-500" />
								Gợi ý trước khi viết
							</CardTitle>
						</CardHeader>
					</CollapsibleTrigger>
					<CollapsibleContent>
						<CardContent className="pt-0">
							<div className="space-y-4">
								{/* Context info */}
								<div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
									<p className="text-sm text-muted-foreground mb-2">
										Bạn đang viết SOP cho:
									</p>
									<p className="font-medium text-foreground">
										{programName || "Chương trình"}
									</p>
									<p className="text-sm text-muted-foreground">
										{universityName || "Trường đại học"}
									</p>
								</div>

								{/* Prompt if available */}
								{sopData?.prompt && (
									<div className="space-y-2">
										<p className="text-sm font-medium text-foreground">
											Câu hỏi/Prompt:
										</p>
										<p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
											{sopData.prompt}
										</p>
									</div>
								)}

								{/* Writing tips */}
								<div className="space-y-2">
									<p className="text-sm font-medium text-foreground">
										Mẹo viết SOP hiệu quả:
									</p>
									<ul className="text-sm text-muted-foreground space-y-1.5">
										<li className="flex items-start gap-2">
											<span className="text-primary font-bold">1.</span>
											<span>
												Bắt đầu với một câu chuyện hoặc trải nghiệm cụ thể
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary font-bold">2.</span>
											<span>
												Giải thích rõ ràng động lực và mục tiêu học tập của bạn
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary font-bold">3.</span>
											<span>
												Liên kết kinh nghiệm quá khứ với mục tiêu tương lai
											</span>
										</li>
										<li className="flex items-start gap-2">
											<span className="text-primary font-bold">4.</span>
											<span>
												Giải thích tại sao chương trình này phù hợp với bạn
											</span>
										</li>
									</ul>
								</div>
							</div>
						</CardContent>
					</CollapsibleContent>
				</Card>
			</Collapsible>

			{/* Main Content - 2 column layout */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Editor - 2/3 width */}
				<div className="lg:col-span-2">
					<SopEditor
						content={sopData?.content ?? ""}
						prompt={sopData?.prompt}
						wordLimit={sopData?.wordLimit}
						wordCount={sopData?.wordCount ?? 0}
						onSave={handleSave}
					/>
				</div>

				{/* Feedback Panel - 1/3 width */}
				<div className="lg:col-span-1">
					<div className="sticky top-4">
						<SopFeedbackPanel
							feedback={sopData?.lastFeedback}
							isLoading={isGettingFeedback}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
