"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/lib/store/languageStore";
import type {Locale} from "@/app/[lang]/dictionaries";

export function LocaleSync({ locale }: { locale: Locale }) {
	const { setLanguage } = useLanguageStore();

	useEffect(() => {
		// Sync the URL locale with the language store
		setLanguage(locale);
	}, [locale, setLanguage]);

	return null;
}

