"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Language = "en" | "vi";

interface LanguageSwitcherProps {
	className?: string;
	currentLocale?: Language;
}

export function LanguageSwitcher({
	className,
	currentLocale,
}: LanguageSwitcherProps) {
	const router = useRouter();
	const locale = useLocale();
	const activeLocale = currentLocale || (locale as Language);

	const languages: { code: Language; label: string; flag: string }[] = [
		{ code: "en", label: "English", flag: "🇺🇸" },
		{ code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
	];

	const currentLang =
		languages.find((l) => l.code === activeLocale) || languages[0];

	const handleLanguageChange = (newLocale: Language) => {
		// Using Cookie Store API with fallback for older browsers
		if ("cookieStore" in window) {
			(window.cookieStore as CookieStore).set({
				name: "locale",
				value: newLocale,
				path: "/",
				expires: Date.now() + 31536000 * 1000,
				sameSite: "lax",
			});
		} else {
			// biome-ignore lint/suspicious/noDocumentCookie: Fallback for browsers without Cookie Store API
			document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
		}
		router.refresh();
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className={className}>
					<span className="text-sm font-medium">
						{currentLang.code.toUpperCase()}
					</span>
					<span className="sr-only">Toggle language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{languages.map((language) => (
					<DropdownMenuItem
						key={language.code}
						onClick={() => handleLanguageChange(language.code)}
					>
						<span className="mr-2">{language.flag}</span>
						{language.label}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
