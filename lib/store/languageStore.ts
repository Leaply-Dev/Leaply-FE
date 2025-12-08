import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "vi";

interface LanguageState {
	language: Language;
	setLanguage: (language: Language) => void;
	toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
	persist(
		(set, get) => ({
			language: "vi", // Default to Vietnamese
			setLanguage: (language) => set({ language }),
			toggleLanguage: () =>
				set({ language: get().language === "en" ? "vi" : "en" }),
		}),
		{
			name: "leaply-language",
		},
	),
);
