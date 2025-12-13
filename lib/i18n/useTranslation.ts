"use client";

import { useParams } from "next/navigation";
import type { Locale } from "@/app/[lang]/dictionaries";
import enDict from "@/dictionaries/en.json";
import viDict from "@/dictionaries/vi.json";

type Dictionary = typeof enDict;

const dictionaries: Record<Locale, Dictionary> = {
	en: enDict,
	vi: viDict,
};

export function useTranslation() {
	const params = useParams();
	const language = (params.lang as Locale) || "vi";
	const dict = dictionaries[language];

	const t = (section: keyof Dictionary, key: string): string => {
		const sectionData = dict[section];

		if (!sectionData) {
			console.warn(`Translation section not found: ${section}`);
			return key;
		}

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

		if (typeof translation === "string") {
			return translation;
		}

		console.warn(`Translation not found: ${section}.${key}`);
		return key;
	};

	return { t, language };
}
