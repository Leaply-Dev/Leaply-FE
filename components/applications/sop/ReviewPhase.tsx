"use client";

import {
	AlertTriangle,
	ArrowLeft,
	Check,
	Download,
	FileText,
	Loader2,
	Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
	type ReviewResponse,
	useCompile,
	useFullEssay,
	useReview,
} from "@/lib/api/sop-workspace";

interface ReviewPhaseProps {
	applicationId: string;
	onBack: () => void;
	onComplete: () => void;
}

export function ReviewPhase({
	applicationId,
	onBack,
	onComplete,
}: ReviewPhaseProps) {
	const { data: fullEssay, isLoading: essayLoading } =
		useFullEssay(applicationId);
	const review = useReview();
	const compile = useCompile();

	const handleReview = async () => {
		try {
			await review.mutateAsync(applicationId);
			toast.success("Đã nhận review từ AI");
		} catch {
			toast.error("Không thể review. Vui lòng thử lại.");
		}
	};

	const handleCompile = async () => {
		try {
			await compile.mutateAsync(applicationId);
			toast.success("Đã lưu bài SOP hoàn chỉnh!");
			onComplete();
		} catch {
			toast.error("Không thể lưu. Vui lòng thử lại.");
		}
	};

	const handleExport = () => {
		if (!fullEssay?.compiledContent) return;

		const blob = new Blob([fullEssay.compiledContent], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "sop.txt";
		a.click();
		URL.revokeObjectURL(url);
	};

	if (essayLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Review bài SOP
					</h2>
					<p className="text-sm text-muted-foreground">
						Tổng số từ: {fullEssay?.totalWordCount || 0} từ
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleReview}
						disabled={review.isPending}
					>
						{review.isPending ? (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						) : (
							<Sparkles className="w-4 h-4 mr-2" />
						)}
						AI Review
					</Button>
					<Button variant="outline" onClick={handleExport}>
						<Download className="w-4 h-4 mr-2" />
						Xuất file
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left: Full Essay Preview */}
				<div className="lg:col-span-2 space-y-4">
					<Card>
						<CardHeader className="pb-2">
							<CardTitle className="text-base flex items-center gap-2">
								<FileText className="w-4 h-4" />
								Bài viết hoàn chỉnh
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="prose prose-sm max-w-none">
								{fullEssay?.compiledContent ? (
									<div className="whitespace-pre-wrap text-sm leading-relaxed">
										{fullEssay.compiledContent}
									</div>
								) : (
									<p className="text-muted-foreground italic">
										Chưa có nội dung. Vui lòng hoàn thành các section.
									</p>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Section Summary */}
					{fullEssay?.sectionSummary && fullEssay.sectionSummary.length > 0 && (
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-base">Tóm tắt sections</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									{fullEssay.sectionSummary.map(
										(
											s: { title?: string; wordCount: number; status: string },
											i: number,
										) => (
											<div
												key={i}
												className="flex items-center justify-between text-sm py-2 border-b last:border-0"
											>
												<span className="text-foreground">{s.title}</span>
												<div className="flex items-center gap-2">
													<Badge variant="secondary">{s.wordCount} từ</Badge>
													{s.status === "done" ? (
														<Check className="w-4 h-4 text-green-500" />
													) : (
														<AlertTriangle className="w-4 h-4 text-amber-500" />
													)}
												</div>
											</div>
										),
									)}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Right: Review Results */}
				<div className="space-y-4">
					{review.data && <ReviewResultCard review={review.data} />}

					{!review.data && !review.isPending && (
						<Card className="bg-muted/30">
							<CardContent className="p-6 text-center">
								<Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
								<p className="text-sm text-muted-foreground">
									Nhấn &quot;AI Review&quot; để nhận đánh giá chi tiết về bài
									SOP của bạn
								</p>
							</CardContent>
						</Card>
					)}

					{review.isPending && (
						<Card>
							<CardContent className="p-6 text-center">
								<Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
								<p className="text-sm text-muted-foreground">
									Đang phân tích bài viết...
								</p>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Actions */}
			<div className="flex items-center justify-between pt-4 border-t">
				<Button variant="ghost" onClick={onBack}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Quay lại chỉnh sửa
				</Button>

				<Button onClick={handleCompile} disabled={compile.isPending} size="lg">
					{compile.isPending ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<Check className="w-4 h-4 mr-2" />
					)}
					Hoàn thành SOP
				</Button>
			</div>
		</div>
	);
}

function ReviewResultCard({ review }: { review: ReviewResponse }) {
	return (
		<div className="space-y-4">
			{/* Overall Score */}
			<Card>
				<CardHeader className="pb-2">
					<CardTitle className="text-base">Đánh giá tổng quan</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Điểm số</span>
						<span className="text-2xl font-bold text-primary">
							{Math.round((review.overallScore || 0) * 100)}%
						</span>
					</div>
					<Progress value={(review.overallScore || 0) * 100} />
				</CardContent>
			</Card>

			{/* Strengths */}
			{review.strengths && review.strengths.length > 0 && (
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center gap-2">
							<Check className="w-4 h-4 text-green-500" />
							Điểm mạnh
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-1.5">
							{review.strengths.map((s, i) => (
								<li
									key={i}
									className="text-sm text-muted-foreground flex gap-2"
								>
									<span className="text-green-500">✓</span>
									{s}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* Improvements */}
			{review.improvements && review.improvements.length > 0 && (
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center gap-2">
							<AlertTriangle className="w-4 h-4 text-amber-500" />
							Cần cải thiện
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-1.5">
							{review.improvements.map((s, i) => (
								<li
									key={i}
									className="text-sm text-muted-foreground flex gap-2"
								>
									<span className="text-amber-500">!</span>
									{s}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* Consistency Issues */}
			{review.consistencyIssues && review.consistencyIssues.length > 0 && (
				<Card className="border-red-200 bg-red-50">
					<CardHeader className="pb-2">
						<CardTitle className="text-base flex items-center gap-2 text-red-700">
							<AlertTriangle className="w-4 h-4" />
							Vấn đề nhất quán
						</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-1.5">
							{review.consistencyIssues.map((s, i) => (
								<li key={i} className="text-sm text-red-700 flex gap-2">
									<span>•</span>
									{s}
								</li>
							))}
						</ul>
					</CardContent>
				</Card>
			)}

			{/* Prompt Alignment */}
			{review.promptAlignment && (
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-base">Độ phù hợp với prompt</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-muted-foreground">Điểm</span>
							<span className="font-semibold">
								{Math.round((review.promptAlignment.score || 0) * 100)}%
							</span>
						</div>
						<Progress value={(review.promptAlignment.score || 0) * 100} />
						{review.promptAlignment.missedElements &&
							review.promptAlignment.missedElements.length > 0 && (
								<div className="pt-2 border-t">
									<p className="text-xs font-medium text-muted-foreground mb-1">
										Các yếu tố còn thiếu:
									</p>
									<ul className="space-y-1">
										{review.promptAlignment.missedElements.map((e, i) => (
											<li key={i} className="text-xs text-amber-600">
												• {e}
											</li>
										))}
									</ul>
								</div>
							)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
