"use client";

import { useLanguageStore } from "@/lib/store/languageStore";
import { translations } from "./translations";

type TranslationValue = { en: string; vi: string };

export function useTranslation() {
	const { language } = useLanguageStore();

	const t = (
		section: keyof typeof translations,
		key: string
	): string => {
		const sectionData = translations[section] as Record<string, TranslationValue>;
		const translation = sectionData?.[key];
		if (!translation) {
			console.warn(`Translation not found: ${section}.${key}`);
			return key;
		}
		return translation[language] || translation.en || key;
	};

	return { t, language };
}

