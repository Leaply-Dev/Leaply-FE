import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const SUPPORTED_LOCALES = ["vi", "en"];

export default getRequestConfig(async () => {
	let locale = "vi";

	try {
		const store = await cookies();
		const cookieLocale = store.get("locale")?.value;
		// Validate locale against supported values to prevent dynamic import errors
		if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
			locale = cookieLocale;
		}
	} catch {
		// During prerendering (e.g., global-error), cookies() is not available
		// Fall back to default locale
	}

	return {
		locale,
		messages: (await import(`@/messages/${locale}.json`)).default,
	};
});
