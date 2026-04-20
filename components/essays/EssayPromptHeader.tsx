"use client";

import { FileText, Loader2, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EssayPromptHeaderProps {
	prompt?: string;
	wordLimit?: number;
	onSave: (values: { prompt?: string; wordLimit?: number }) => Promise<void>;
}

export function EssayPromptHeader({
	prompt,
	wordLimit,
	onSave,
}: EssayPromptHeaderProps) {
	const t = useTranslations("applications.prompt");
	const [open, setOpen] = useState(false);
	const [draftPrompt, setDraftPrompt] = useState(prompt ?? "");
	const [draftWordLimit, setDraftWordLimit] = useState(
		wordLimit ? String(wordLimit) : "",
	);
	const [isSaving, setIsSaving] = useState(false);

	const openDialog = () => {
		setDraftPrompt(prompt ?? "");
		setDraftWordLimit(wordLimit ? String(wordLimit) : "");
		setOpen(true);
	};

	const handleSave = async () => {
		setIsSaving(true);
		try {
			const parsed = draftWordLimit
				? Number.parseInt(draftWordLimit, 10)
				: undefined;
			await onSave({
				prompt: draftPrompt.trim() || undefined,
				wordLimit:
					parsed !== undefined && Number.isFinite(parsed) && parsed > 0
						? parsed
						: undefined,
			});
			setOpen(false);
		} catch {
			toast.error(t("editTitle"));
		} finally {
			setIsSaving(false);
		}
	};

	const hasPrompt = !!prompt?.trim();

	return (
		<>
			<Card>
				<CardContent className="p-4 flex items-start gap-3">
					<FileText className="w-4 h-4 mt-1 text-primary shrink-0" />
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between gap-2 mb-1">
							<span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
								{t("header")}
							</span>
							{wordLimit ? (
								<span className="text-xs text-muted-foreground">
									{wordLimit} {t("wordLimitSuffix")}
								</span>
							) : null}
						</div>
						{hasPrompt ? (
							<p className="text-sm text-foreground whitespace-pre-wrap">
								{prompt}
							</p>
						) : (
							<p className="text-sm text-muted-foreground italic">
								{t("empty")}
							</p>
						)}
					</div>
					<Button
						variant="ghost"
						size="sm"
						onClick={openDialog}
						className="shrink-0"
					>
						<Pencil className="w-3.5 h-3.5 mr-1.5" />
						{t("edit")}
					</Button>
				</CardContent>
			</Card>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("editTitle")}</DialogTitle>
						<DialogDescription>{t("editDescription")}</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="prompt-header-text">{t("header")}</Label>
							<Textarea
								id="prompt-header-text"
								value={draftPrompt}
								onChange={(e) => setDraftPrompt(e.target.value)}
								className="min-h-[120px] resize-none text-sm"
							/>
						</div>
						<div className="flex items-center gap-3">
							<Label
								htmlFor="prompt-header-limit"
								className="text-sm whitespace-nowrap"
							>
								{t("wordLimitLabel")}
							</Label>
							<Input
								id="prompt-header-limit"
								type="number"
								inputMode="numeric"
								min={1}
								value={draftWordLimit}
								onChange={(e) => setDraftWordLimit(e.target.value)}
								className="w-28"
							/>
							<span className="text-xs text-muted-foreground">
								{t("wordLimitSuffix")}
							</span>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isSaving}
						>
							{t("edit")}
						</Button>
						<Button onClick={handleSave} disabled={isSaving}>
							{isSaving ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									{t("saving")}
								</>
							) : (
								t("save")
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
