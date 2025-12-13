import "server-only";

const dictionaries = {
	en: () => import("@/dictionaries/en.json").then((module) => module.default),
	vi: () => import("@/dictionaries/vi.json").then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const hasLocale = (locale: string): locale is Locale =>
	locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();

export const defaultLocale: Locale = "vi";
export const locales: Locale[] = ["en", "vi"];
