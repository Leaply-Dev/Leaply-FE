"use client";

import { FileText, Info } from "lucide-react";
import { TipTapEditor } from "@/components/editor/TipTapEditor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SopEditorProps {
	content: string;
	prompt?: string;
	wordLimit?: number;
	wordCount?: number;
	onSave: (content: string) => Promise<void>;
	isLoading?: boolean;
}

export function SopEditor({
	content,
	prompt,
	wordLimit,
	wordCount = 0,
	onSave,
	isLoading,
}: SopEditorProps) {
	const wordProgress = wordLimit
		? Math.min((wordCount / wordLimit) * 100, 100)
		: 0;
	const isOverLimit = wordLimit ? wordCount > wordLimit : false;
	const isNearLimit = wordLimit ? wordCount >= wordLimit * 0.9 : false;

	if (isLoading) {
		return (
			<Card className="h-full">
				<CardHeader className="pb-3">
					<CardTitle className="text-base flex items-center gap-2">
						<FileText className="w-4 h-4" />
						Statement of Purpose
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4 animate-pulse">
						<div className="h-8 bg-muted rounded w-full" />
						<div className="h-64 bg-muted rounded w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{/* Prompt Section */}
			{prompt && (
				<Collapsible defaultOpen>
					<Card>
						<CollapsibleTrigger className="w-full">
							<CardHeader className="pb-3 hover:bg-muted/30 transition-colors">
								<CardTitle className="text-sm flex items-center justify-between">
									<span className="flex items-center gap-2">
										<Info className="w-4 h-4 text-primary" />
										Đề bài / Câu hỏi
									</span>
									<Badge variant="outline" className="text-xs font-normal">
										Nhấn để thu gọn
									</Badge>
								</CardTitle>
							</CardHeader>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<CardContent className="pt-0">
								<p className="text-sm text-muted-foreground whitespace-pre-wrap">
									{prompt}
								</p>
							</CardContent>
						</CollapsibleContent>
					</Card>
				</Collapsible>
			)}

			{/* Word Limit Progress */}
			{wordLimit && (
				<div className="flex items-center gap-4 px-1">
					<div className="flex-1">
						<Progress
							value={wordProgress}
							className={cn(
								"h-2",
								isOverLimit && "[&>div]:bg-destructive",
								isNearLimit && !isOverLimit && "[&>div]:bg-amber-500",
							)}
						/>
					</div>
					<span
						className={cn(
							"text-sm font-medium tabular-nums",
							isOverLimit && "text-destructive",
							isNearLimit && !isOverLimit && "text-amber-600",
						)}
					>
						{wordCount.toLocaleString()} / {wordLimit.toLocaleString()} từ
					</span>
				</div>
			)}

			{/* Editor */}
			<TipTapEditor
				initialContent={content}
				onSave={onSave}
				placeholder="Viết Statement of Purpose của bạn tại đây..."
				debounceMs={3000}
				className="min-h-[500px]"
			/>
		</div>
	);
}
