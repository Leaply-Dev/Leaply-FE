"use client";

import { useLanguageStore, type Language } from "@/lib/store/languageStore";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
	className?: string;
	showLabel?: boolean;
}

export function LanguageSwitcher({ className, showLabel = false }: LanguageSwitcherProps) {
	const { language, setLanguage } = useLanguageStore();

	const languages: { code: Language; label: string; flag: string }[] = [
		{ code: "en", label: "English", flag: "🇺🇸" },
		{ code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
	];

	const currentLang = languages.find((l) => l.code === language) || languages[0];
	const otherLang = languages.find((l) => l.code !== language) || languages[1];

	return (
		<button
			type="button"
			onClick={() => setLanguage(otherLang.code)}
			className={cn(
				"flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border",
				"hover:bg-muted hover:border-primary/50 transition-colors",
				"text-sm font-medium text-foreground",
				className
			)}
			title={`Switch to ${otherLang.label}`}
		>
			<Globe className="w-4 h-4 text-muted-foreground" />
			<span className="text-base">{currentLang.flag}</span>
			{showLabel && <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>}
		</button>
	);
}

