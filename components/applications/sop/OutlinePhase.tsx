"use client";

import { ArrowLeft, ArrowRight, List, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type OutlineSectionDto,
	useConfirmOutline,
	useGenerateOutline,
	useOutline,
} from "@/lib/api/sop-workspace";

interface OutlinePhaseProps {
	applicationId: string;
	onContinue: () => void;
	onBack: () => void;
}

export function OutlinePhase({
	applicationId,
	onContinue,
	onBack,
}: OutlinePhaseProps) {
	const { data: outline, isLoading, error } = useOutline(applicationId);
	const generateOutline = useGenerateOutline();
	const confirmOutline = useConfirmOutline();

	const handleGenerate = async () => {
		try {
			await generateOutline.mutateAsync({ applicationId });
			toast.success("Đã tạo outline");
		} catch {
			toast.error("Không thể tạo outline. Vui lòng thử lại.");
		}
	};

	const handleContinue = async () => {
		try {
			await confirmOutline.mutateAsync(applicationId);
			onContinue();
		} catch {
			toast.error("Không thể xác nhận outline. Vui lòng thử lại.");
		}
	};

	// Loading
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[300px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	// No outline yet - generate
	const sections = outline?.sections || [];
	if (sections.length === 0 || error) {
		return (
			<Card className="max-w-2xl mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<List className="w-5 h-5 text-blue-500" />
						Tạo Outline
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground">
						AI sẽ tạo outline dựa trên góc viết bạn đã chọn, với các section
						được phân bổ số từ phù hợp.
					</p>

					<Button
						onClick={handleGenerate}
						disabled={generateOutline.isPending}
						className="w-full"
						size="lg"
					>
						{generateOutline.isPending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Đang tạo outline...
							</>
						) : (
							<>
								<Sparkles className="w-4 h-4 mr-2" />
								Tạo Outline
							</>
						)}
					</Button>

					<Button variant="ghost" onClick={onBack} className="w-full">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Quay lại chọn góc viết
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Show outline
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-lg font-semibold text-foreground">
						Outline của bạn
					</h2>
					<p className="text-sm text-muted-foreground">
						Tổng số từ mục tiêu: {outline?.totalWordTarget || 0} từ
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={handleGenerate}
					disabled={generateOutline.isPending}
				>
					{generateOutline.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Sparkles className="w-4 h-4" />
					)}
					<span className="ml-2">Tạo lại</span>
				</Button>
			</div>

			{/* Sections */}
			<div className="space-y-4">
				{sections.map((section: OutlineSectionDto, index: number) => (
					<Card key={section.key}>
						<CardContent className="p-4">
							<div className="flex items-start gap-4">
								{/* Index badge */}
								<div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
									{index + 1}
								</div>

								<div className="flex-1 space-y-2">
									{/* Title and word target */}
									<div className="flex items-center justify-between gap-2">
										<h3 className="font-medium text-foreground">
											{section.title}
										</h3>
										{section.wordTarget && (
											<Badge variant="secondary" className="text-xs">
												{section.wordTarget.min}-{section.wordTarget.max} từ
											</Badge>
										)}
									</div>

									{/* Purpose */}
									{section.purpose && (
										<p className="text-sm text-muted-foreground">
											{section.purpose}
										</p>
									)}

									{/* Guiding questions */}
									{section.guidingQuestions &&
										section.guidingQuestions.length > 0 && (
											<div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
												<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
													Câu hỏi gợi ý:
												</p>
												<ul className="text-sm text-muted-foreground space-y-1">
													{section.guidingQuestions.map((q, i) => (
														<li key={i} className="flex items-start gap-2">
															<span className="text-primary">•</span>
															{q}
														</li>
													))}
												</ul>
											</div>
										)}

									{/* Tip */}
									{section.tip && (
										<p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 inline-block">
											💡 {section.tip}
										</p>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Actions */}
			<div className="flex items-center justify-between pt-4 border-t">
				<Button variant="ghost" onClick={onBack}>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Quay lại
				</Button>

				<Button
					onClick={handleContinue}
					disabled={confirmOutline.isPending}
					size="lg"
				>
					{confirmOutline.isPending ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<ArrowRight className="w-4 h-4 mr-2" />
					)}
					Bắt đầu viết
				</Button>
			</div>
		</div>
	);
}
