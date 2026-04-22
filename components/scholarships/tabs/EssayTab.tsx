"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ClipboardList, FileEdit, Lightbulb, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { EssayPromptHeader } from "@/components/essays/EssayPromptHeader";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useSaveScholarshipEssayPrompt } from "@/lib/api/scholarship-essay";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetApplicationQueryKey,
	getGetDocumentsQueryKey,
	useGetEssayContent,
	useSaveEssayContent,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type {
	DocumentDto,
	ScholarshipApplicationResponse,
} from "@/lib/generated/api/models";

interface EssayTabProps {
	applicationId: string;
	documents: DocumentDto[];
	application?: ScholarshipApplicationResponse;
}

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

export function EssayTab({
	applicationId,
	documents,
	application,
}: EssayTabProps) {
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
	const { mutateAsync: saveEssayPrompt } = useSaveScholarshipEssayPrompt();

	const handleSavePrompt = useCallback(
		async (values: { prompt?: string; wordLimit?: number }) => {
			await saveEssayPrompt({ applicationId, data: values });
		},
		[applicationId, saveEssayPrompt],
	);

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
			<div className="flex gap-6 h-full">
				<div className="flex-1 flex flex-col min-w-0 space-y-4">
					<Card>
						<CardHeader className="pb-2">
							<Skeleton className="h-6 w-48" />
						</CardHeader>
					</Card>
					<Card className="flex-1">
						<CardHeader>
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-4 w-64 mt-2" />
						</CardHeader>
						<CardContent className="flex-1">
							<Skeleton className="h-full w-full rounded-md" />
						</CardContent>
					</Card>
				</div>
				<div className="w-80 shrink-0">
					<Card className="h-48">
						<CardHeader>
							<Skeleton className="h-6 w-32" />
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								<Skeleton className="h-12 w-12 rounded-full mx-auto" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4 mx-auto" />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	return (
		<div className="flex gap-6 h-full">
			{/* Editor - Hidden: Legacy view, waiting for unified SOP */}
			<div className="flex-1 flex flex-col min-w-0 space-y-4">
				<EssayPromptHeader
					prompt={application?.essayPrompt}
					wordLimit={application?.essayWordLimit}
					onSave={handleSavePrompt}
				/>

				{/* Coming Soon - Unified SOP Workspace */}
				<Card className="flex-1 flex flex-col">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Sparkles className="w-5 h-5" />
							Viết bài luận
						</CardTitle>
						<CardDescription>
							Tính năng AI đang được phát triển. Sử dụng Persona Lab để xây dựng
							câu chuyện trước.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex-1">
						<div className="text-center py-8">
							<Lightbulb className="w-16 h-16 text-primary mx-auto mb-4" />
							<p className="text-lg font-medium mb-2">
								Xây dựng câu chuyện của bạn
							</p>
							<p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
								Kể câu chuyện cá nhân tại Persona Lab để AI tạo gợi ý và nội
								dung bài luận xứng đáng với học bổng
							</p>
							<div className="flex justify-center gap-3">
								<Button asChild>
									<Link href="/persona-lab">
										<Sparkles className="w-4 h-4 mr-2" />
										Mở Persona Lab
									</Link>
								</Button>
								<Button
									variant="outline"
									onClick={() => window.location.reload()}
								>
									<FileEdit className="w-4 h-4 mr-2" />
									Thử lại sau
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Right Column - Link to Persona Lab */}
			<div className="w-80 shrink-0">
				<div className="sticky top-4">
					<EssayFeedbackPlaceholder />
				</div>
			</div>
		</div>
	);
}
