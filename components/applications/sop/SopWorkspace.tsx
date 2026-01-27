"use client";

import { FileEdit, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type SopPhase, useWorkspaceStatus } from "@/lib/api/sop-workspace";
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
	const [currentPhase, setCurrentPhase] = useState<SopPhase>("not_started");

	// Sync phase from server
	useEffect(() => {
		if (status?.currentPhase) {
			setCurrentPhase(status.currentPhase);
		}
	}, [status?.currentPhase]);

	const handlePhaseChange = (newPhase: SopPhase) => {
		setCurrentPhase(newPhase);
		refetch(); // Refresh status after phase change
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
			<div className="text-center text-destructive p-8">
				Không thể tải dữ liệu. Vui lòng thử lại.
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
						hasPrompt={!!status?.sopPrompt}
						wordLimit={status?.wordLimit}
						onStart={() => handlePhaseChange("ideation")}
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
	hasPrompt: boolean;
	wordLimit?: number;
	onStart: () => void;
}

function StartPrompt({ hasPrompt, wordLimit, onStart }: StartPromptProps) {
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

				{wordLimit && (
					<p className="text-center text-sm text-muted-foreground">
						Số từ mục tiêu: <span className="font-medium">{wordLimit} từ</span>
					</p>
				)}

				{!hasPrompt && (
					<div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
						⚠️ Chưa có SOP prompt. Vui lòng thêm prompt từ chương trình trước khi
						bắt đầu.
					</div>
				)}

				<Button
					onClick={onStart}
					disabled={!hasPrompt}
					className="w-full"
					size="lg"
				>
					<Sparkles className="w-4 h-4 mr-2" />
					Bắt đầu với SOP Helper
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
