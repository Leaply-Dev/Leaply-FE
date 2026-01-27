"use client";

import { HelpCircle, Lightbulb, Loader2, MessageSquare } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type OutlineSectionDto,
	type SectionResponse,
	useOutline,
	useSectionFeedback,
	useSections,
	useUpdateSection,
} from "@/lib/api/sop-workspace";
import { EvidenceCards } from "./EvidenceCards";
import { SectionNav } from "./SectionNav";

interface WritingPhaseProps {
	applicationId: string;
	onBack: () => void;
	onContinue: () => void;
}

export function WritingPhase({
	applicationId,
	onBack,
	onContinue,
}: WritingPhaseProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	const { data: sectionsData, isLoading: sectionsLoading } =
		useSections(applicationId);
	const { data: outlineData } = useOutline(applicationId);
	const updateSection = useUpdateSection();
	const getSectionFeedback = useSectionFeedback();

	const sections = sectionsData?.sections || [];
	const outlineSections = outlineData?.sections || [];
	const currentSection = sections[currentIndex];
	const currentOutlineSection = outlineSections[currentIndex];

	// Check if all sections are done
	const allDone =
		sections.length > 0 &&
		sections.every((s: SectionResponse) => s.status === "done");

	// Save handler for TipTapEditor
	const handleSave = useCallback(
		async (content: string) => {
			if (!currentSection) return;

			await updateSection.mutateAsync({
				applicationId,
				sectionIndex: currentIndex,
				data: { content },
			});
		},
		[applicationId, currentIndex, currentSection, updateSection],
	);

	// Request feedback
	const handleRequestFeedback = async () => {
		try {
			const feedback = await getSectionFeedback.mutateAsync({
				applicationId,
				sectionIndex: currentIndex,
			});
			toast.success("Đã nhận feedback từ AI");
			// Could show feedback in a modal or side panel
			console.log("Feedback:", feedback);
		} catch {
			toast.error("Không thể lấy feedback. Vui lòng thử lại.");
		}
	};

	// Insert fact from evidence cards
	const handleInsertFact = (fact: string) => {
		// This would need to be coordinated with TipTapEditor
		// For now, copy to clipboard
		navigator.clipboard.writeText(fact);
		toast.success("Đã copy vào clipboard");
	};

	if (sectionsLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (sections.length === 0) {
		return (
			<div className="text-center text-muted-foreground p-8">
				Chưa có section nào. Vui lòng tạo outline trước.
			</div>
		);
	}

	return (
		<div className="flex h-[calc(100vh-200px)] gap-4">
			{/* Left: Section Navigation */}
			<div className="w-[220px] shrink-0 border-r pr-4 overflow-y-auto">
				<SectionNav
					sections={sections}
					currentIndex={currentIndex}
					onSelect={setCurrentIndex}
				/>

				{/* Navigation buttons */}
				<div className="mt-6 space-y-2 pt-4 border-t">
					<Button variant="ghost" size="sm" className="w-full" onClick={onBack}>
						← Quay lại Outline
					</Button>
					{allDone && (
						<Button size="sm" className="w-full" onClick={onContinue}>
							Tiếp tục Review →
						</Button>
					)}
				</div>
			</div>

			{/* Center: Editor */}
			<div className="flex-1 flex flex-col min-w-0">
				{/* Section Header */}
				<div className="mb-4 pb-4 border-b">
					<div className="flex items-center justify-between">
						<h2 className="text-lg font-semibold text-foreground">
							{currentSection?.title || `Section ${currentIndex + 1}`}
						</h2>
						<div className="flex items-center gap-2">
							<Badge
								variant={getWordCountVariant(
									currentSection,
									currentOutlineSection,
								)}
							>
								{currentSection?.wordCount || 0}
								{currentOutlineSection?.wordTarget && (
									<span className="text-muted-foreground">
										/{currentOutlineSection.wordTarget.min}-
										{currentOutlineSection.wordTarget.max}
									</span>
								)}{" "}
								từ
							</Badge>
							{currentSection?.status === "done" && (
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-700"
								>
									Hoàn thành
								</Badge>
							)}
						</div>
					</div>
					{currentOutlineSection?.purpose && (
						<p className="text-sm text-muted-foreground mt-1">
							{currentOutlineSection.purpose}
						</p>
					)}
				</div>

				{/* Editor */}
				<div className="flex-1 min-h-0">
					<TipTapEditor
						key={currentIndex}
						initialContent={currentSection?.content || ""}
						onSave={handleSave}
						placeholder="Bắt đầu viết section này..."
					/>
				</div>
			</div>

			{/* Right: Writing Assistant */}
			<div className="w-[300px] shrink-0 border-l pl-4 overflow-y-auto space-y-4">
				{/* Guiding Questions */}
				{currentOutlineSection?.guidingQuestions &&
					currentOutlineSection.guidingQuestions.length > 0 && (
						<Card>
							<CardHeader className="p-3 pb-2">
								<CardTitle className="text-sm font-medium flex items-center gap-2">
									<HelpCircle className="w-4 h-4 text-blue-500" />
									Câu hỏi gợi ý
								</CardTitle>
							</CardHeader>
							<CardContent className="p-3 pt-0">
								<ul className="space-y-2">
									{currentOutlineSection.guidingQuestions.map(
										(q: string, i: number) => (
											<li
												key={i}
												className="text-sm text-muted-foreground flex gap-2"
											>
												<span className="text-primary shrink-0">•</span>
												{q}
											</li>
										),
									)}
								</ul>
							</CardContent>
						</Card>
					)}

				{/* Tip */}
				{currentOutlineSection?.tip && (
					<Card className="bg-amber-50 border-amber-200">
						<CardContent className="p-3">
							<div className="flex gap-2 text-sm">
								<Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
								<span className="text-amber-800">
									{currentOutlineSection.tip}
								</span>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Evidence Cards */}
				<EvidenceCards
					applicationId={applicationId}
					sectionIndex={currentIndex}
					onInsert={handleInsertFact}
				/>

				{/* Feedback Button */}
				<Button
					variant="outline"
					className="w-full"
					onClick={handleRequestFeedback}
					disabled={
						getSectionFeedback.isPending ||
						!currentSection?.content ||
						currentSection.wordCount < 20
					}
				>
					{getSectionFeedback.isPending ? (
						<>
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
							Đang phân tích...
						</>
					) : (
						<>
							<MessageSquare className="w-4 h-4 mr-2" />
							Xin feedback AI
						</>
					)}
				</Button>
				{currentSection?.content && currentSection.wordCount < 20 && (
					<p className="text-xs text-muted-foreground text-center">
						Viết ít nhất 20 từ để xin feedback
					</p>
				)}
			</div>
		</div>
	);
}

function getWordCountVariant(
	section: SectionResponse | undefined,
	outlineSection: OutlineSectionDto | undefined,
): "default" | "secondary" | "destructive" | "outline" {
	if (!section || !outlineSection?.wordTarget) return "secondary";

	const { wordCount } = section;
	const { min, max } = outlineSection.wordTarget;

	if (wordCount < min) return "outline";
	if (wordCount > max) return "destructive";
	return "default";
}
