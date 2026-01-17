/**
 * @fileoverview SOP (Statement of Purpose) editor page for program applications.
 * Provides a rich text editor with AI feedback panel.
 */

"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";
import { SopEditor } from "@/components/applications/SopEditor";
import { SopFeedbackPanel } from "@/components/applications/SopFeedbackPanel";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetSopQueryKey,
	useGetSop,
	useGetSopFeedback,
	useSaveSop,
} from "@/lib/generated/api/endpoints/applications/applications";
import type {
	ApplicationSopResponse,
	SopFeedbackDto,
} from "@/lib/generated/api/models";

export default function SopPage() {
	const params = useParams();
	const applicationId = params.id as string;
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
			<PageTransition>
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center">
						<Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
						<p className="text-muted-foreground">Đang tải...</p>
					</div>
				</div>
			</PageTransition>
		);
	}

	// Error state
	if (sopError) {
		return (
			<PageTransition>
				<div className="flex flex-col items-center justify-center min-h-[60vh]">
					<div className="text-center">
						<GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
						<h2 className="text-lg font-semibold text-foreground mb-2">
							Không thể tải dữ liệu
						</h2>
						<p className="text-sm text-muted-foreground mb-4">
							{sopError instanceof Error ? sopError.message : "Đã xảy ra lỗi"}
						</p>
						<Button asChild variant="outline">
							<Link href="/dashboard/applications">
								<ArrowLeft className="w-4 h-4 mr-2" />
								Quay lại
							</Link>
						</Button>
					</div>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="container max-w-7xl mx-auto px-4 py-6">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<Button asChild variant="ghost" size="icon">
						<Link href="/dashboard/applications">
							<ArrowLeft className="w-5 h-5" />
						</Link>
					</Button>
					<div>
						<h1 className="text-xl font-bold text-foreground">
							Statement of Purpose
						</h1>
						<p className="text-sm text-muted-foreground">
							Viết và nhận phản hồi từ AI cho SOP của bạn
						</p>
					</div>
					{(isSaving || isGettingFeedback) && (
						<div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
							<Loader2 className="w-4 h-4 animate-spin" />
							{isGettingFeedback ? "Đang phân tích..." : "Đang lưu..."}
						</div>
					)}
				</div>

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
						<div className="sticky top-20">
							<SopFeedbackPanel
								feedback={sopData?.lastFeedback}
								isLoading={isGettingFeedback}
							/>
						</div>
					</div>
				</div>
			</div>
		</PageTransition>
	);
}
