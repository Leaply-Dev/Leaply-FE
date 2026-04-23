"use client";

import { Lightbulb, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { SectionFeedbackResponse } from "@/lib/generated/api/models";

interface VoiceHintProps {
	feedback: SectionFeedbackResponse | null;
	onDismiss: () => void;
}

export function VoiceHint({ feedback, onDismiss }: VoiceHintProps) {
	const t = useTranslations("sop");
	const locale = useLocale();
	const isVietnamese = locale === "vi";
	const [open, setOpen] = useState(false);

	if (!feedback?.suggestions) return null;

	const toneSuggestions = feedback.suggestions.filter(
		(s) => s.type === "tone",
	);

	if (toneSuggestions.length === 0) return null;

	return (
		<div className="flex items-start gap-2 px-3 py-2 rounded-md bg-amber-50 border border-amber-200 text-sm">
			<Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
			<div className="flex-1 min-w-0">
				<p className="text-amber-800">
					{t("voiceHintText")}
				</p>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<button
							type="button"
							className="text-xs text-amber-700 underline mt-1 hover:text-amber-900"
						>
							{t("viewYourVoice")}
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-80">
						<div className="space-y-2">
							<h4 className="font-medium text-sm">
								{isVietnamese ? "Gợi ý giọng văn" : "Voice Suggestions"}
							</h4>
							<ul className="space-y-1.5">
								{toneSuggestions.map((s, idx) => (
									<li
										key={idx}
										className="text-xs text-muted-foreground"
									>
										• {s.text}
										{s.reason && (
											<span className="block text-[10px] text-muted-foreground/70 mt-0.5">
												{s.reason}
											</span>
										)}
									</li>
								))}
							</ul>
						</div>
					</PopoverContent>
				</Popover>
			</div>
			<Button
				variant="ghost"
				size="icon"
				className="h-6 w-6 shrink-0 -mr-1 -mt-1"
				onClick={onDismiss}
			>
				<X className="w-3 h-3 text-amber-600" />
			</Button>
		</div>
	);
}
