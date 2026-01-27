"use client";

import { BookOpen, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "academic" | "passionate" | "direct";

interface ToneSelectorProps {
	value?: Tone;
	onChange: (tone: Tone) => void;
}

const tones = [
	{
		key: "academic" as const,
		label: "Academic",
		description: "Formal, analytical, research-focused",
		icon: BookOpen,
	},
	{
		key: "passionate" as const,
		label: "Passionate",
		description: "Emotional, story-driven, personal",
		icon: Heart,
	},
	{
		key: "direct" as const,
		label: "Direct",
		description: "Clear, concise, action-oriented",
		icon: Zap,
	},
];

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
	return (
		<div className="space-y-3">
			<p className="text-sm font-medium text-foreground">Chọn giọng văn</p>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				{tones.map((tone) => {
					const Icon = tone.icon;
					const isSelected = value === tone.key;

					return (
						<button
							key={tone.key}
							type="button"
							onClick={() => onChange(tone.key)}
							className={cn(
								"flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all text-left",
								isSelected
									? "border-primary bg-primary/5"
									: "border-border hover:border-primary/50 hover:bg-muted/50",
							)}
						>
							<Icon
								className={cn(
									"w-6 h-6",
									isSelected ? "text-primary" : "text-muted-foreground",
								)}
							/>
							<div className="text-center">
								<p
									className={cn(
										"font-medium text-sm",
										isSelected ? "text-primary" : "text-foreground",
									)}
								>
									{tone.label}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									{tone.description}
								</p>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
