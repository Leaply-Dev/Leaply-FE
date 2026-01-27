"use client";

import {
	ArrowLeft,
	Check,
	CheckCircle,
	Circle,
	Loader2,
	MessageSquare,
	Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
	type OutlineSectionDto,
	type ReviewResponse,
	type SectionResponse,
	useConfirmOutline,
	useGenerateOutline,
	useMarkSectionDone,
	useOutline,
	useReview,
	useSections,
	useUpdateSection,
} from "@/lib/api/sop-workspace";
import { cn } from "@/lib/utils";

interface WritingWorkspaceProps {
	applicationId: string;
	onBack: () => void;
	onComplete: () => void;
}

export function WritingWorkspace({
	applicationId,
	onBack,
	onComplete,
}: WritingWorkspaceProps) {
	const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
	const [sectionContent, setSectionContent] = useState("");
	const [showReview, setShowReview] = useState(false);
	const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);

	const { data: outline, isLoading: outlineLoading } = useOutline(applicationId);
	const { data: sectionsData, isLoading: sectionsLoading } = useSections(applicationId);
	const generateOutline = useGenerateOutline();
	const confirmOutline = useConfirmOutline();
	const updateSection = useUpdateSection();
	const markSectionDone = useMarkSectionDone();
	const review = useReview();

	const sections = sectionsData?.sections || [];
	const outlineSections = outline?.sections || [];

	// Sync section content when switching sections
	useEffect(() => {
		const section = sections[selectedSectionIndex];
		if (section) {
			setSectionContent(section.content || "");
		}
	}, [selectedSectionIndex, sections]);

	// Generate outline if not exists
	useEffect(() => {
		if (!outlineLoading && !outline && !generateOutline.isPending) {
			generateOutline.mutate({ applicationId });
		}
	}, [applicationId, outline, outlineLoading, generateOutline]);

	// Confirm outline after generation
	useEffect(() => {
		if (outline && !sectionsData && !confirmOutline.isPending) {
			confirmOutline.mutate(applicationId);
		}
	}, [applicationId, outline, sectionsData, confirmOutline]);

	const handleSaveSection = async () => {
		try {
			await updateSection.mutateAsync({
				applicationId,
				sectionIndex: selectedSectionIndex,
				data: { content: sectionContent },
			});
			toast.success("Đã lưu");
		} catch {
			toast.error("Không thể lưu. Vui lòng thử lại.");
		}
	};

	const handleMarkDone = async () => {
		try {
			await handleSaveSection();
			await markSectionDone.mutateAsync({
				applicationId,
				sectionIndex: selectedSectionIndex,
			});
			toast.success("Đã hoàn thành section này");
			// Move to next section if available
			if (selectedSectionIndex < sections.length - 1) {
				setSelectedSectionIndex(selectedSectionIndex + 1);
			}
		} catch {
			toast.error("Không thể đánh dấu hoàn thành");
		}
	};

	const handleReview = async () => {
		try {
			// Save current section first
			await handleSaveSection();
			const result = await review.mutateAsync(applicationId);
			setReviewData(result);
			setShowReview(true);
		} catch {
			toast.error("Không thể tạo review. Vui lòng thử lại.");
		}
	};

	const handleComplete = () => {
		setShowReview(false);
		onComplete();
	};

	const isLoading = outlineLoading || sectionsLoading || generateOutline.isPending || confirmOutline.isPending;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
				<p className="text-sm text-muted-foreground">
					{generateOutline.isPending ? "Đang tạo outline..." : "Đang tải..."}
				</p>
			</div>
		);
	}

	const currentSection = sections[selectedSectionIndex];
	const currentOutlineSection = outlineSections[selectedSectionIndex];
	const allDone = sections.every((s) => s.status === "done");
	const wordCount = sectionContent.split(/\s+/).filter(Boolean).length;

	return (
		<div className="h-full flex flex-col lg:flex-row gap-4">
			{/* Left Panel - Outline Checklist */}
			<div className="lg:w-64 shrink-0">
				<Card className="h-full">
					<CardHeader className="py-3 px-4">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<CheckCircle className="w-4 h-4 text-primary" />
							Outline
						</CardTitle>
					</CardHeader>
					<CardContent className="px-2 pb-4">
						<ScrollArea className="h-[calc(100vh-24rem)]">
							<div className="space-y-1 pr-2">
								{outlineSections.map((section: OutlineSectionDto, index: number) => {
									const sectionData = sections[index];
									const isDone = sectionData?.status === "done";
									const isSelected = selectedSectionIndex === index;

									return (
										<button
											key={section.key}
											type="button"
											onClick={() => setSelectedSectionIndex(index)}
											className={cn(
												"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
												isSelected
													? "bg-primary/10 text-primary"
													: "hover:bg-muted",
											)}
										>
											{isDone ? (
												<Check className="w-4 h-4 text-green-600 shrink-0" />
											) : (
												<Circle className="w-4 h-4 text-muted-foreground shrink-0" />
											)}
											<span className={cn(isDone && "text-muted-foreground")}>
												{section.title}
											</span>
										</button>
									);
								})}
							</div>
						</ScrollArea>

						{/* Back Button */}
						<Button
							variant="ghost"
							size="sm"
							onClick={onBack}
							className="w-full mt-4"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Quay lại
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Center Panel - Writing Area */}
			<div className="flex-1 flex flex-col gap-4 min-w-0">
				<Card className="flex-1 flex flex-col">
					<CardHeader className="py-3 px-4 border-b">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base">
								{currentOutlineSection?.title || "Section"}
							</CardTitle>
							<span className="text-xs text-muted-foreground">
								{wordCount} từ
								{currentOutlineSection?.wordTarget && (
									<> / {currentOutlineSection.wordTarget.min}-{currentOutlineSection.wordTarget.max}</>
								)}
							</span>
						</div>
					</CardHeader>
					<CardContent className="flex-1 p-4 flex flex-col">
						<Textarea
							value={sectionContent}
							onChange={(e) => setSectionContent(e.target.value)}
							placeholder="Viết nội dung section này..."
							className="flex-1 min-h-[200px] resize-none text-sm"
						/>

						{/* Section Actions */}
						<div className="flex items-center justify-between mt-4 pt-4 border-t">
							<Button
								variant="outline"
								size="sm"
								onClick={handleSaveSection}
								disabled={updateSection.isPending}
							>
								{updateSection.isPending && (
									<Loader2 className="w-3 h-3 mr-2 animate-spin" />
								)}
								Lưu
							</Button>

							<Button
								size="sm"
								onClick={handleMarkDone}
								disabled={markSectionDone.isPending || !sectionContent.trim()}
							>
								{markSectionDone.isPending ? (
									<Loader2 className="w-3 h-3 mr-2 animate-spin" />
								) : (
									<Check className="w-3 h-3 mr-2" />
								)}
								Hoàn thành section
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Review Button - Show when all sections are done */}
				{allDone && (
					<Button
						size="lg"
						onClick={handleReview}
						disabled={review.isPending}
						className="w-full"
					>
						{review.isPending ? (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						) : (
							<Sparkles className="w-4 h-4 mr-2" />
						)}
						Review với AI
					</Button>
				)}
			</div>

			{/* Right Panel - Guiding Questions */}
			<div className="lg:w-72 shrink-0">
				<Card className="h-full">
					<CardHeader className="py-3 px-4">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<MessageSquare className="w-4 h-4 text-amber-500" />
							Câu hỏi gợi ý
						</CardTitle>
					</CardHeader>
					<CardContent className="px-4 pb-4">
						<ScrollArea className="h-[calc(100vh-24rem)]">
							{currentOutlineSection?.guidingQuestions &&
							currentOutlineSection.guidingQuestions.length > 0 ? (
								<ul className="space-y-3">
									{currentOutlineSection.guidingQuestions.map(
										(question: string, idx: number) => (
											<li
												key={idx}
												className="text-sm text-muted-foreground flex items-start gap-2"
											>
												<span className="text-primary font-medium shrink-0">
													{idx + 1}.
												</span>
												<span>{question}</span>
											</li>
										),
									)}
								</ul>
							) : (
								<p className="text-sm text-muted-foreground italic">
									Không có câu hỏi gợi ý cho section này.
								</p>
							)}

							{/* Tip */}
							{currentOutlineSection?.tip && (
								<div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
									<p className="text-xs text-amber-800">
										<strong>Tip:</strong> {currentOutlineSection.tip}
									</p>
								</div>
							)}
						</ScrollArea>
					</CardContent>
				</Card>
			</div>

			{/* Review Dialog */}
			<Dialog open={showReview} onOpenChange={setShowReview}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							Review SOP
						</DialogTitle>
						<DialogDescription>
							Đánh giá tổng quan về bài SOP của bạn
						</DialogDescription>
					</DialogHeader>

					{reviewData && (
						<div className="space-y-6 py-4">
							{/* Overall Score */}
							{reviewData.overallScore !== undefined && (
								<div className="text-center">
									<div className="text-4xl font-bold text-primary">
										{reviewData.overallScore}/100
									</div>
									<p className="text-sm text-muted-foreground">Điểm tổng quan</p>
								</div>
							)}

							{/* Strengths */}
							{reviewData.strengths && reviewData.strengths.length > 0 && (
								<div>
									<h4 className="font-medium text-green-700 mb-2">Điểm mạnh</h4>
									<ul className="space-y-1">
										{reviewData.strengths.map((s, i) => (
											<li key={i} className="text-sm flex items-start gap-2">
												<Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
												<span>{s}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Improvements */}
							{reviewData.improvements && reviewData.improvements.length > 0 && (
								<div>
									<h4 className="font-medium text-amber-700 mb-2">Cần cải thiện</h4>
									<ul className="space-y-1">
										{reviewData.improvements.map((s, i) => (
											<li key={i} className="text-sm flex items-start gap-2">
												<Circle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
												<span>{s}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Complete Button */}
							<Button onClick={handleComplete} className="w-full" size="lg">
								<CheckCircle className="w-4 h-4 mr-2" />
								Hoàn thành SOP
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
