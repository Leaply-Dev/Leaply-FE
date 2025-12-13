import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

const locales = ["en", "vi"];
const defaultLocale = "vi";

function getLocale(request: NextRequest): string {
	// Get the preferred locale from the Accept-Language header
	const negotiatorHeaders: Record<string, string> = {};
	request.headers.forEach((value, key) => {
		negotiatorHeaders[key] = value;
	});

	// Negotiator requires mutable array
	const languages = new Negotiator({ headers: negotiatorHeaders }).languages(
		locales as unknown as string[],
	);

	try {
		return matchLocale(languages, locales, defaultLocale);
	} catch {
		return defaultLocale;
	}
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if there is any supported locale in the pathname
	const pathnameHasLocale = locales.some(
		(locale) =>
			pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
	);

	if (pathnameHasLocale) return;

	// Redirect if there is no locale
	const locale = getLocale(request);
	request.nextUrl.pathname = `/${locale}${pathname}`;
	// e.g. incoming request is /dashboard
	// The new URL is now /vi/dashboard
	return NextResponse.redirect(request.nextUrl);
}

export const config = {
	matcher: [
		// Skip all internal paths (_next, static files, api routes)
		"/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
	],
};

