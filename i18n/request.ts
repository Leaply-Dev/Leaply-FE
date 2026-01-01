import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
	let locale = "vi";

	try {
		const store = await cookies();
		locale = store.get("locale")?.value || "vi";
	} catch {
		// During prerendering (e.g., global-error), cookies() is not available
		// Fall back to default locale
	}

	return {
		locale,
		messages: (await import(`@/messages/${locale}.json`)).default,
	};
});
