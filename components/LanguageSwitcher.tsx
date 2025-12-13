"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Language = "en" | "vi";

interface LanguageSwitcherProps {
	className?: string;
	showLabel?: boolean;
	currentLocale: Language;
}

export function LanguageSwitcher({
	className,
	showLabel = false,
	currentLocale,
}: LanguageSwitcherProps) {
	const pathname = usePathname();
	const router = useRouter();

	const languages: { code: Language; label: string; flag: string }[] = [
		{ code: "en", label: "English", flag: "🇺🇸" },
		{ code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
	];

	const currentLang =
		languages.find((l) => l.code === currentLocale) || languages[0];
	const otherLang =
		languages.find((l) => l.code !== currentLocale) || languages[1];

	const switchLanguage = () => {
		// Get the current path without the locale prefix
		const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "");
		// Navigate to the same path with the new locale
		router.push(`/${otherLang.code}${pathWithoutLocale || "/"}`);
	};

	return (
		<button
			type="button"
			onClick={switchLanguage}
			className={cn(
				"flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border",
				"hover:bg-muted hover:border-primary/50 transition-colors",
				"text-sm font-medium text-foreground",
				className,
			)}
			title={`Switch to ${otherLang.label}`}
		>
			<Globe className="w-4 h-4 text-muted-foreground" />
			<span className="text-base">{currentLang.flag}</span>
			{showLabel && (
				<span className="hidden sm:inline">
					{currentLang.code.toUpperCase()}
				</span>
			)}
		</button>
	);
}
