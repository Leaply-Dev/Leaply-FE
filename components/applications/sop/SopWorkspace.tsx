"use client";

import { FileEdit, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	type SopPhase,
	useSavePrompt,
	useWorkspaceStatus,
} from "@/lib/api/sop-workspace";
import { IdeationPhase } from "./IdeationPhase";
import { WritingWorkspace } from "./WritingWorkspace";

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
			// Map old phases to new simplified phases
			const phase = status.sopPhase;
			if (phase === "outlining" || phase === "writing" || phase === "review") {
				setCurrentPhase("writing");
			} else {
				setCurrentPhase(phase);
			}
		}
	}, [status?.sopPhase]);

	const handlePhaseChange = (newPhase: SopPhase) => {
		setCurrentPhase(newPhase);
		refetch();
	};

	const handleStartWithPrompt = async (prompt?: string, wordLimit?: number) => {
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
						onContinue={() => handlePhaseChange("writing")}
					/>
				)}

				{currentPhase === "writing" && (
					<WritingWorkspace
						applicationId={applicationId}
						onBack={() => handlePhaseChange("ideation")}
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

	const handleStart = () => {
		onStart(
			promptText.trim() || undefined,
			wordLimitInput ? Number.parseInt(wordLimitInput, 10) : undefined,
		);
	};

	return (
		<Card className="max-w-xl mx-auto">
			<CardHeader className="text-center pb-4">
				<CardTitle className="flex items-center justify-center gap-2 text-lg">
					<Sparkles className="w-5 h-5 text-primary" />
					Viết SOP
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* SOP Prompt Input */}
				<div className="space-y-2">
					<Label htmlFor="sop-prompt" className="text-sm font-medium">
						Dán đề bài SOP (tùy chọn)
					</Label>
					<Textarea
						id="sop-prompt"
						value={promptText}
						onChange={(e) => setPromptText(e.target.value)}
						placeholder="VD: Describe your purpose for pursuing this graduate program..."
						className="min-h-[80px] resize-none text-sm"
					/>
				</div>

				{/* Word Limit Input */}
				<div className="flex items-center gap-3">
					<Label htmlFor="word-limit" className="text-sm whitespace-nowrap">
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

				{/* Start Button */}
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
					Bắt đầu
				</Button>
			</CardContent>
		</Card>
	);
}

interface CompletedStateProps {
	onEdit: () => void;
}

function CompletedState({ onEdit }: CompletedStateProps) {
	return (
		<Card className="max-w-xl mx-auto">
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
