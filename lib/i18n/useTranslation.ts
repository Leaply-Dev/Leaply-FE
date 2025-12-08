"use client";

import { useLanguageStore } from "@/lib/store/languageStore";
import { translations } from "./translations";

type TranslationValue = { en: string; vi: string };

export function useTranslation() {
	const { language } = useLanguageStore();

	const t = (section: keyof typeof translations, key: string): string => {
		const sectionData = translations[section];

		// Support nested keys with dot notation (e.g., "greeting.morning")
		const keys = key.split(".");
		let translation: unknown = sectionData;

		for (const k of keys) {
			if (translation && typeof translation === "object" && k in translation) {
				translation = (translation as Record<string, unknown>)[k];
			} else {
				console.warn(`Translation not found: ${section}.${key}`);
				return key;
			}
		}

		// Check if we have a valid translation object with en/vi
		if (translation && typeof translation === "object" && "en" in translation) {
			const translationObj = translation as TranslationValue;
			return translationObj[language] || translationObj.en || key;
		}

		console.warn(`Translation not found: ${section}.${key}`);
		return key;
	};

	return { t, language };
}
