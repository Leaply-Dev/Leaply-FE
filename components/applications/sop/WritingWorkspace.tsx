"use client";

import {
	ArrowLeft,
	BookOpen,
	Check,
	CheckCircle,
	Circle,
	FileText,
	Loader2,
	Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { TipTapEditor, type TipTapEditorHandle } from "@/components/editor/TipTapEditor";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	type OutlineSectionDto,
	type ReviewResponse,
	type SectionResponse,
	useConfirmOutline,
	useGenerateOutline,
	useIdeation,
	useMarkSectionDone,
	useOutline,
	useReview,
	useSectionFeedback,
	useSections,
	useUpdateSection,
} from "@/lib/api/sop-workspace";
import { cn } from "@/lib/utils";
import { ArchetypeReviewHeader } from "./ArchetypeReviewHeader";
import { PersonaStoryDrawer } from "./PersonaStoryDrawer";
import { VoiceHint } from "./VoiceHint";

interface WritingWorkspaceProps {
	applicationId: string;
	onBack?: () => void;
	onComplete: () => void;
	sopPrompt?: string;
}

export function WritingWorkspace({
	applicationId,
	onBack,
	onComplete,
	sopPrompt,
}: WritingWorkspaceProps) {
	const t = useTranslations("sop");
	const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
	const [sectionContent, setSectionContent] = useState("");
	const [_wordCount, setWordCount] = useState(0);
	const [showReview, setShowReview] = useState(false);
	const [showFullEssay, setShowFullEssay] = useState(false);
	const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [voiceFeedback, setVoiceFeedback] = useState<import("@/lib/generated/api/models").SectionFeedbackResponse | null>(null);

	// Refs to prevent duplicate API calls
	const hasTriggeredGenerate = useRef(false);
	const hasTriggeredConfirm = useRef(false);
	const editorRef = useRef<TipTapEditorHandle>(null);

	const { data: ideation } = useIdeation(applicationId);
	const { data: outline, isLoading: outlineLoading } =
		useOutline(applicationId);
	const { data: sectionsData, isLoading: sectionsLoading } =
		useSections(applicationId);
	const generateOutline = useGenerateOutline();
	const confirmOutline = useConfirmOutline();
	const updateSection = useUpdateSection();
	const markSectionDone = useMarkSectionDone();
	const review = useReview();
	const sectionFeedback = useSectionFeedback();

	const sections = sectionsData?.sections || [];
	const outlineSections = outline?.sections || [];
	const selectedAngle = ideation?.angles?.find(
		(a) => a.id === ideation.selectedAngleId,
	);

	// Sync section content when switching sections
	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally only re-sync on index change to avoid overwriting user input on data refresh
	useEffect(() => {
		const section = sections[selectedSectionIndex];
		if (section) {
			const content = section.content || "";
			setSectionContent(content);
			setWordCount(content.split(/\s+/).filter(Boolean).length);
		}
	}, [selectedSectionIndex]);

	const handleSelectSection = (index: number) => {
		setSelectedSectionIndex(index);
		const section = sections[index];
		if (section) {
			const content = section.content || "";
			setSectionContent(content);
			setWordCount(content.split(/\s+/).filter(Boolean).length);
		}
	};

	// Generate outline if not exists and ideation is complete (only once)
	// biome-ignore lint/correctness/useExhaustiveDependencies: mutate function intentionally excluded to prevent infinite loop
	useEffect(() => {
		if (
			!outlineLoading &&
			!outline &&
			!generateOutline.isPending &&
			!hasTriggeredGenerate.current &&
			ideation?.selectedAngleId // Only generate if angle is selected
		) {
			hasTriggeredGenerate.current = true;
			generateOutline.mutate({ applicationId });
		}
	}, [
		applicationId,
		outline,
		outlineLoading,
		generateOutline.isPending,
		ideation?.selectedAngleId,
	]);

	// Confirm outline after generation (only once)
	// biome-ignore lint/correctness/useExhaustiveDependencies: mutate function intentionally excluded to prevent infinite loop
	useEffect(() => {
		if (
			outline &&
			!sectionsData &&
			!sectionsLoading &&
			!confirmOutline.isPending &&
			!hasTriggeredConfirm.current
		) {
			hasTriggeredConfirm.current = true;
			confirmOutline.mutate(applicationId);
		}
	}, [
		applicationId,
		outline,
		sectionsData,
		sectionsLoading,
		confirmOutline.isPending,
	]);

	const handleSaveSection = async () => {
		try {
			await updateSection.mutateAsync({
				applicationId,
				sectionIndex: selectedSectionIndex,
				data: { content: sectionContent },
			});
			toast.success(t("savedDraft"));
		} catch {
			toast.error(t("saveError2"));
		}
	};

	const handleMarkDone = async () => {
		try {
			await handleSaveSection();
			await markSectionDone.mutateAsync({
				applicationId,
				sectionIndex: selectedSectionIndex,
			});
			toast.success(t("sectionComplete"));

			// Trigger section feedback for voice hint
			try {
				const feedback = await sectionFeedback.mutateAsync({
					applicationId,
					sectionIndex: selectedSectionIndex,
				});
				setVoiceFeedback(feedback);
			} catch {
				// Feedback is optional — don't block on failure
			}

			// Move to next section if available
			if (selectedSectionIndex < sections.length - 1) {
				handleSelectSection(selectedSectionIndex + 1);
			}
		} catch {
			toast.error(t("markDoneError"));
		}
	};

	const handleReview = async () => {
		try {
			// Save current section first
			await handleSaveSection();
			setShowReview(true);
			const result = await review.mutateAsync(applicationId);
			setReviewData(result);
		} catch {
			toast.error(t("reviewError"));
			setShowReview(false);
		}
	};

	const handleComplete = () => {
		setShowReview(false);
		onComplete();
	};

	const isLoading =
		outlineLoading ||
		sectionsLoading ||
		generateOutline.isPending ||
		confirmOutline.isPending;

	const loadingMessage = generateOutline.isPending
		? t("generatingOutline")
		: confirmOutline.isPending
			? t("confirmingOutline")
			: t("loadingWorkspace");

	if (isLoading) {
		return (
			<div className="h-full flex flex-col lg:flex-row gap-4">
				{/* Left Panel Skeleton */}
				<div className="lg:w-64 shrink-0">
					<Card className="h-full">
						<CardHeader className="py-3 px-4 space-y-4">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-9 w-full" />
						</CardHeader>
						<CardContent className="px-2 pb-4 space-y-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<Skeleton key={i} className="h-8 w-full rounded-md" />
							))}
						</CardContent>
					</Card>
				</div>

				{/* Center Panel Skeleton */}
				<div className="flex-1 flex flex-col gap-4 min-w-0">
					<Card className="flex-1 flex flex-col">
						<CardHeader className="py-3 px-4 border-b space-y-4">
							<div className="flex justify-between">
								<div className="flex gap-2">
									<Skeleton className="h-8 w-24" />
									<Skeleton className="h-8 w-24" />
								</div>
								<Skeleton className="h-8 w-32" />
							</div>
							<div className="flex justify-between items-center">
								<Skeleton className="h-6 w-48" />
								<Skeleton className="h-4 w-24" />
							</div>
						</CardHeader>
						<CardContent className="flex-1 p-4 flex flex-col items-center justify-center gap-3">
							<Loader2 className="w-6 h-6 animate-spin text-primary" />
							<p className="text-sm text-muted-foreground animate-pulse text-center max-w-xs">
								{loadingMessage}
							</p>
							<Skeleton className="h-full w-full rounded-md mt-4" />
						</CardContent>
					</Card>
				</div>
			</div>
		);
	}

	const currentOutlineSection = outlineSections[selectedSectionIndex];
	const allDone = sections.every((s) => s.status === "done");
	const guidingQuestions = currentOutlineSection?.guidingQuestions ?? [];

	return (
		<div className="h-full flex flex-col lg:flex-row gap-4">
			{/* Left Panel - Outline Checklist */}
			<div className="lg:w-80 shrink-0 flex flex-col gap-4">
				<Card className="h-full flex flex-col">
					<CardHeader className="py-3 px-4 shrink-0 space-y-4">
						{/* Back Button moved to top */}
						{onBack && (
							<Button
								variant="outline"
								size="sm"
								onClick={onBack}
								className="w-full"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								{t("backToAngle")}
							</Button>
						)}
						{(sopPrompt || selectedAngle) && (
							<div className="space-y-3">
								{sopPrompt && (
									<div className="text-sm">
										<span className="font-semibold text-foreground block mb-1">
											{t("topic")}
										</span>
										<span className="text-muted-foreground">{sopPrompt}</span>
									</div>
								)}
								{selectedAngle && (
									<div className="text-sm">
										<span className="font-semibold text-foreground block mb-1">
											{t("perspective")}
										</span>
										<span className="text-primary font-medium block">
											{selectedAngle.title}
										</span>
										{selectedAngle.hook && (
											<span className="italic text-muted-foreground block mt-1 text-justify">
												"{selectedAngle.hook}"
											</span>
										)}
									</div>
								)}
							</div>
						)}
					</CardHeader>
					<CardContent className="px-2 pb-4 flex-1 min-h-0">
						<ScrollArea className="h-full">
							<div className="space-y-1">
								{outlineSections.map(
									(section: OutlineSectionDto, index: number) => {
										const sectionData = sections[index];
										const isDone = sectionData?.status === "done";
										const isSelected = selectedSectionIndex === index;

										return (
											<button
												key={section.key}
												type="button"
												onClick={() => handleSelectSection(index)}
												className={cn(
													"w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
													isSelected
														? "bg-primary text-primary-foreground font-medium shadow-sm"
														: "hover:bg-muted",
												)}
											>
												{isDone ? (
													<Check
														className={cn(
															"w-4 h-4 shrink-0",
															isSelected
																? "text-primary-foreground"
																: "text-green-600",
														)}
													/>
												) : (
													<Circle
														className={cn(
															"w-4 h-4 shrink-0",
															isSelected
																? "text-primary-foreground/70"
																: "text-muted-foreground",
														)}
													/>
												)}
												<span
													className={cn(
														isDone && !isSelected && "text-muted-foreground",
													)}
												>
													{section.title}
												</span>
											</button>
										);
									},
								)}
							</div>
						</ScrollArea>
					</CardContent>
					<div className="px-4 pb-4 pt-3 border-t shrink-0">
						<Button
							size="sm"
							onClick={handleReview}
							disabled={review.isPending || !allDone}
							className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
						>
							{review.isPending ? (
								<Loader2 className="w-4 h-4 mr-1 animate-spin" />
							) : (
								<Sparkles className="w-4 h-4 mr-1" />
							)}
							{t("reviewWithAI")}
						</Button>
					</div>
				</Card>
			</div>

			{/* Center Panel - Writing Area */}
			<div className="flex-1 flex flex-col gap-4 min-w-0">
				<Card className="flex-1 flex flex-col">
					<CardHeader className="py-3 px-4 border-b shrink-0">
						<div className="flex items-center justify-between">
							<CardTitle className="text-base">
								{currentOutlineSection?.title || t("section")}
							</CardTitle>
							<div className="flex items-center gap-4">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setShowFullEssay(true)}
								>
									<FileText className="w-4 h-4 mr-2" />
									{t("viewFullEssay")}
								</Button>
								<Button
									size="sm"
									onClick={handleMarkDone}
									disabled={markSectionDone.isPending || !sectionContent.trim()}
									className="bg-primary text-primary-foreground hover:bg-primary/90"
								>
									{markSectionDone.isPending ? (
										<Loader2 className="w-4 h-4 mr-1 animate-spin" />
									) : (
										<Check className="w-4 h-4 mr-1" />
									)}
									{t("completePart")}
								</Button>
							</div>
						</div>
						{guidingQuestions.length > 0 && (
							<div className="mt-3 space-y-3">
								<ul className="space-y-2">
									{guidingQuestions.map((question: string, idx: number) => (
										<li
											key={`${idx}-${question}`}
											className="text-sm text-muted-foreground flex items-start gap-2"
										>
											<span className="text-primary font-medium shrink-0">
												{t("suggestionLabel", { index: idx + 1 })}
											</span>
											<span>{question}</span>
										</li>
									))}
								</ul>
							</div>
						)}
						<VoiceHint
							feedback={voiceFeedback}
							onDismiss={() => setVoiceFeedback(null)}
						/>
						{sectionFeedback.isPending && (
							<div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs w-fit">
								<Loader2 className="w-3 h-3 animate-spin" />
								{t("analyzingWritingStyle")}
							</div>
						)}
					</CardHeader>

					<CardContent className="flex-1 p-4 flex flex-col min-h-0">
						<TipTapEditor
							ref={editorRef}
							key={`section-${selectedSectionIndex}`}
							initialContent={sections[selectedSectionIndex]?.content || ""}
							onSave={async (content) => {
								await updateSection.mutateAsync({
									applicationId,
									sectionIndex: selectedSectionIndex,
									data: { content },
								});
								toast.success(t("savedDraft"));
							}}
							onChange={setSectionContent}
							onWordCountChange={setWordCount}
							footerMeta={
								currentOutlineSection?.wordTarget ? (
									<span>
										{t("target") || "Target"}:{" "}
										{currentOutlineSection.wordTarget.min}-
										{currentOutlineSection.wordTarget.max} {t("words")}
									</span>
								) : null
							}
							customActions={
								<Button
									variant="outline"
									size="sm"
									className="h-7 text-xs gap-1.5"
									onClick={() => setDrawerOpen(true)}
								>
									<BookOpen className="w-3 h-3" />
									{t("storiesFromPersonaLab")}
								</Button>
							}
							className="flex-1 border-0 shadow-none rounded-none h-full"
						/>
					</CardContent>
				</Card>
			</div>

			{/* Persona Story Drawer */}
			<PersonaStoryDrawer
				open={drawerOpen}
				onOpenChange={setDrawerOpen}
				applicationId={applicationId}
				sectionIndex={selectedSectionIndex}
				linkedNodeIds={sections[selectedSectionIndex]?.linkedNodeIds}
				onInsertContent={(text) => {
					editorRef.current?.insertContent(text);
				}}
			/>

			{/* Review Dialog */}
			<Dialog open={showReview} onOpenChange={setShowReview}>
				<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-primary" />
							{t("reviewSop")}
						</DialogTitle>
						<DialogDescription>{t("reviewDesc")}</DialogDescription>
					</DialogHeader>

					{!reviewData ? (
						<div className="flex flex-col items-center justify-center py-12 gap-3">
							<Loader2 className="w-8 h-8 animate-spin text-primary" />
							<p className="text-sm font-medium text-foreground">
								{t("aiReviewing")}
							</p>
							<p className="text-xs text-muted-foreground">
								{t("aiReviewingSubtitle")}
							</p>
						</div>
					) : (
						<div className="space-y-6 py-4">
							<ArchetypeReviewHeader strengths={reviewData.strengths} />

							{/* Overall Score */}
							{reviewData.overallScore !== undefined && (
								<div className="text-center">
									<div className="text-4xl font-bold text-primary">
										{reviewData.overallScore}/100
									</div>
									<p className="text-sm text-muted-foreground">
										{t("overallScore")}
									</p>
								</div>
							)}

							{/* Strengths */}
							{reviewData.strengths && reviewData.strengths.length > 0 && (
								<div>
									<h4 className="font-medium text-green-700 mb-2">
										{t("strengths")}
									</h4>
									<ul className="space-y-1">
										{reviewData.strengths.map((s) => (
											<li key={s} className="text-sm flex items-start gap-2">
												<Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
												<span>{s}</span>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* Improvements */}
							{reviewData.improvements &&
								reviewData.improvements.length > 0 && (
									<div>
										<h4 className="font-medium text-amber-700 mb-2">
											{t("improvements")}
										</h4>
										<ul className="space-y-1">
											{reviewData.improvements.map((s) => (
												<li key={s} className="text-sm flex items-start gap-2">
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
								{t("completeSop")}
							</Button>
						</div>
					)}
				</DialogContent>
			</Dialog>

			{/* Full Essay Dialog */}
			<Dialog open={showFullEssay} onOpenChange={setShowFullEssay}>
				<DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<FileText className="w-5 h-5 text-primary" />
							{t("fullEssay")}
						</DialogTitle>
						<DialogDescription>{t("fullEssayPreview")}</DialogDescription>
					</DialogHeader>
					<div className="space-y-6 py-4 prose prose-sm max-w-none dark:prose-invert">
						{sections.map((section: SectionResponse, idx: number) => {
							const hasContent =
								section.content &&
								section.content.trim() !== "" &&
								section.content !== "<p></p>";
							return (
								<div key={section.id}>
									{hasContent ? (
										<div
											// biome-ignore lint/security/noDangerouslySetInnerHtml: TipTap HTML output is trusted editor content
											dangerouslySetInnerHTML={{
												__html: section.content ?? "",
											}}
										/>
									) : (
										<p className="text-muted-foreground italic">
											[{outlineSections[idx]?.title || t("section")}{" "}
											{t("sectionNotStarted")}]
										</p>
									)}
								</div>
							);
						})}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
