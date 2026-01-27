"use client";

import { ChevronDown, FileEdit, Info, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	type SopPhase,
	useSavePrompt,
	useWorkspaceStatus,
} from "@/lib/api/sop-workspace";
import { cn } from "@/lib/utils";
import { IdeationPhase } from "./IdeationPhase";
import { OutlinePhase } from "./OutlinePhase";
import { PhaseProgress } from "./PhaseProgress";
import { ReviewPhase } from "./ReviewPhase";
import { WritingPhase } from "./WritingPhase";

interface SopWorkspaceProps {
	applicationId: string;
}

export function SopWorkspace({ applicationId }: SopWorkspaceProps) {
	const {
		data: status,
		isLoading,
		error,
		refetch,
	} = useWorkspaceStatus(applicationId);
	const savePromptMutation = useSavePrompt();
	const [currentPhase, setCurrentPhase] = useState<SopPhase>("not_started");

	// Sync phase from server
	useEffect(() => {
		if (status?.sopPhase) {
			setCurrentPhase(status.sopPhase);
		}
	}, [status?.sopPhase]);

	const handlePhaseChange = (newPhase: SopPhase) => {
		setCurrentPhase(newPhase);
		refetch(); // Refresh status after phase change
	};

	const handleStartWithPrompt = async (prompt?: string, wordLimit?: number) => {
		// Save prompt if provided
		if (prompt || wordLimit) {
			await savePromptMutation.mutateAsync({
				applicationId,
				data: { prompt, wordLimit },
			});
		}
		handlePhaseChange("ideation");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center p-8">
				<p className="text-muted-foreground mb-4">
					Không thể tải SOP workspace.
				</p>
				<Button onClick={() => refetch()}>Thử lại</Button>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			{/* Phase Progress */}
			<div className="mb-6">
				<PhaseProgress currentPhase={currentPhase} />
			</div>

			{/* Phase Content */}
			<div className="flex-1 min-h-0">
				{currentPhase === "not_started" && (
					<StartPrompt
						currentPrompt={status?.sopPrompt}
						currentWordLimit={status?.wordLimit}
						onStart={handleStartWithPrompt}
						isLoading={savePromptMutation.isPending}
					/>
				)}

				{currentPhase === "ideation" && (
					<IdeationPhase
						applicationId={applicationId}
						onContinue={() => handlePhaseChange("outlining")}
					/>
				)}

				{currentPhase === "outlining" && (
					<OutlinePhase
						applicationId={applicationId}
						onBack={() => handlePhaseChange("ideation")}
						onContinue={() => handlePhaseChange("writing")}
					/>
				)}

				{currentPhase === "writing" && (
					<WritingPhase
						applicationId={applicationId}
						onBack={() => handlePhaseChange("outlining")}
						onContinue={() => handlePhaseChange("review")}
					/>
				)}

				{currentPhase === "review" && (
					<ReviewPhase
						applicationId={applicationId}
						onBack={() => handlePhaseChange("writing")}
						onComplete={() => handlePhaseChange("completed")}
					/>
				)}

				{currentPhase === "completed" && (
					<CompletedState onEdit={() => handlePhaseChange("writing")} />
				)}
			</div>
		</div>
	);
}

interface StartPromptProps {
	currentPrompt?: string;
	currentWordLimit?: number;
	onStart: (prompt?: string, wordLimit?: number) => void;
	isLoading?: boolean;
}

function StartPrompt({
	currentPrompt,
	currentWordLimit,
	onStart,
	isLoading,
}: StartPromptProps) {
	const [promptText, setPromptText] = useState(currentPrompt || "");
	const [wordLimitInput, setWordLimitInput] = useState(
		currentWordLimit?.toString() || "",
	);
	const [showAdvanced, setShowAdvanced] = useState(false);

	const hasEnteredPrompt = promptText.trim().length > 0;

	const handleStart = () => {
		onStart(
			promptText.trim() || undefined,
			wordLimitInput ? Number.parseInt(wordLimitInput, 10) : undefined,
		);
	};

	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader className="text-center">
				<CardTitle className="flex items-center justify-center gap-2">
					<Sparkles className="w-5 h-5 text-primary" />
					Bắt đầu viết SOP
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<p className="text-center text-muted-foreground">
					SOP Helper sẽ hướng dẫn bạn qua 4 bước để viết một bài SOP hoàn chỉnh,
					dựa trên dữ liệu từ Persona Lab của bạn.
				</p>

				<div className="grid grid-cols-2 gap-4 text-sm">
					<div className="bg-muted/50 rounded-lg p-4">
						<div className="font-medium mb-1">1. Ideation</div>
						<p className="text-muted-foreground">Tìm góc viết độc đáo</p>
					</div>
					<div className="bg-muted/50 rounded-lg p-4">
						<div className="font-medium mb-1">2. Outline</div>
						<p className="text-muted-foreground">Cấu trúc bài viết</p>
					</div>
					<div className="bg-muted/50 rounded-lg p-4">
						<div className="font-medium mb-1">3. Writing</div>
						<p className="text-muted-foreground">Viết từng section</p>
					</div>
					<div className="bg-muted/50 rounded-lg p-4">
						<div className="font-medium mb-1">4. Review</div>
						<p className="text-muted-foreground">Đánh giá và hoàn thiện</p>
					</div>
				</div>

				{/* Prompt Input Section */}
				<div className="space-y-3">
					<div>
						<Label htmlFor="sop-prompt" className="text-sm font-medium">
							SOP Prompt / Đề bài
						</Label>
						<p className="text-xs text-muted-foreground mt-1 mb-2">
							Dán đề bài SOP từ website chương trình để AI tạo gợi ý phù hợp hơn
						</p>
						<Textarea
							id="sop-prompt"
							value={promptText}
							onChange={(e) => setPromptText(e.target.value)}
							placeholder="Ví dụ: Describe your purpose for pursuing this graduate program and your career goals..."
							className="min-h-[100px] resize-none"
						/>
					</div>

					{/* Advanced settings */}
					<Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
						<CollapsibleTrigger className="text-sm text-primary flex items-center gap-1 hover:underline">
							<ChevronDown
								className={cn(
									"w-4 h-4 transition-transform",
									showAdvanced && "rotate-180",
								)}
							/>
							Cài đặt nâng cao
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-3">
							<div className="flex items-center gap-3">
								<Label
									htmlFor="word-limit"
									className="text-sm whitespace-nowrap"
								>
									Giới hạn từ:
								</Label>
								<Input
									id="word-limit"
									type="number"
									value={wordLimitInput}
									onChange={(e) => setWordLimitInput(e.target.value)}
									placeholder="500"
									className="w-24"
								/>
								<span className="text-xs text-muted-foreground">từ</span>
							</div>
						</CollapsibleContent>
					</Collapsible>
				</div>

				{/* Info message when no prompt */}
				{!hasEnteredPrompt && (
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700 flex items-start gap-2">
						<Info className="w-4 h-4 mt-0.5 shrink-0" />
						<span>
							Bạn có thể bắt đầu mà không cần prompt, nhưng AI sẽ tạo gợi ý
							chung chung hơn.
						</span>
					</div>
				)}

				<Button
					onClick={handleStart}
					disabled={isLoading}
					className="w-full"
					size="lg"
				>
					{isLoading ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<Sparkles className="w-4 h-4 mr-2" />
					)}
					{hasEnteredPrompt
						? "Bắt đầu với SOP Helper"
						: "Bắt đầu (không có prompt)"}
				</Button>

				<p className="text-xs text-center text-muted-foreground">
					Đảm bảo bạn đã hoàn thành Persona Lab để có kết quả tốt nhất
				</p>
			</CardContent>
		</Card>
	);
}

interface CompletedStateProps {
	onEdit: () => void;
}

function CompletedState({ onEdit }: CompletedStateProps) {
	return (
		<Card className="max-w-2xl mx-auto">
			<CardHeader className="text-center">
				<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
					<Sparkles className="w-8 h-8 text-green-600" />
				</div>
				<CardTitle className="text-green-700">SOP đã hoàn thành!</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 text-center">
				<p className="text-muted-foreground">
					Bài SOP của bạn đã được lưu. Bạn có thể xem và chỉnh sửa bất cứ lúc
					nào.
				</p>

				<div className="flex justify-center gap-3">
					<Button variant="outline" onClick={onEdit}>
						<FileEdit className="w-4 h-4 mr-2" />
						Chỉnh sửa
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
