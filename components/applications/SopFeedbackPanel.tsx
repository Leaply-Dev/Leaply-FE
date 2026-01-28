"use client";

import { CheckCircle2, Lightbulb, Sparkles, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { SopFeedbackDto } from "@/lib/generated/api/models";

interface SopFeedbackPanelProps {
	feedback: SopFeedbackDto | null | undefined;
	isLoading?: boolean;
}

export function SopFeedbackPanel({
	feedback,
	isLoading,
}: SopFeedbackPanelProps) {
	if (isLoading) {
		return (
			<Card className="h-full">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<Sparkles className="w-4 h-4" />
						Phản hồi AI
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 animate-pulse">
						<div className="h-4 bg-muted rounded w-3/4" />
						<div className="h-4 bg-muted rounded w-1/2" />
						<div className="h-4 bg-muted rounded w-2/3" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!feedback) {
		return (
			<Card className="h-full">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<Sparkles className="w-4 h-4" />
						Phản hồi AI
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-center py-8">
						<Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
						<p className="text-sm text-muted-foreground">
							Viết ít nhất 100 từ để nhận phản hồi từ AI
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-full flex flex-col">
			<CardHeader className="pb-3 shrink-0">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base flex items-center gap-2">
						<Sparkles className="w-4 h-4 text-primary" />
						Phản hồi AI
					</CardTitle>
					{feedback.round && (
						<Badge variant="outline" className="text-xs">
							Vòng {feedback.round}
						</Badge>
					)}
				</div>
				{feedback.generatedAt && (
					<p className="text-xs text-muted-foreground">
						{new Date(feedback.generatedAt).toLocaleString("vi-VN")}
					</p>
				)}
			</CardHeader>
			<CardContent className="flex-1 overflow-hidden">
				<ScrollArea className="h-full pr-4">
					<div className="space-y-6">
						{/* Strengths */}
						{feedback.strengths && feedback.strengths.length > 0 && (
							<div>
								<h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
									<CheckCircle2 className="w-4 h-4 text-green-500" />
									Điểm mạnh
								</h4>
								<ul className="space-y-2">
									{feedback.strengths.map((strength, index) => (
										<li
											key={`strength-${index}`}
											className="text-sm text-muted-foreground flex items-start gap-2"
										>
											<span className="text-green-500 mt-1">+</span>
											{strength}
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Improvements */}
						{feedback.improvements && feedback.improvements.length > 0 && (
							<div>
								<h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
									<TriangleAlert className="w-4 h-4 text-amber-500" />
									Cần cải thiện
								</h4>
								<ul className="space-y-3">
									{feedback.improvements.map((improvement, index) => (
										<li key={`improvement-${index}`} className="text-sm">
											<div className="flex items-start gap-2 text-muted-foreground">
												<span className="text-amber-500 mt-1">!</span>
												<div>
													{improvement.point && (
														<p className="font-medium text-foreground">
															{improvement.point}
														</p>
													)}
													{improvement.suggestion && (
														<p className="text-muted-foreground mt-1">
															{improvement.suggestion}
														</p>
													)}
												</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						)}

						{/* Structure Note */}
						{feedback.structureNote && (
							<div>
								<h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
									<Lightbulb className="w-4 h-4 text-blue-500" />
									Ghi chú cấu trúc
								</h4>
								<p className="text-sm text-muted-foreground">
									{feedback.structureNote}
								</p>
							</div>
						)}

						{/* Persona Suggestion */}
						{feedback.personaSuggestion && (
							<div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
								<h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
									<Sparkles className="w-4 h-4 text-primary" />
									Gợi ý cá nhân hóa
								</h4>
								<p className="text-sm text-muted-foreground">
									{feedback.personaSuggestion}
								</p>
							</div>
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
