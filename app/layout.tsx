/**
 * @fileoverview Root layout for the entire application.
 * Sets up Next-Intl for i18n and configures global providers.
 * Auth protection handled by middleware (proxy.ts).
 *
 * NOTE: force-dynamic is currently required due to useSearchParams usage in multiple pages.
 * TODO: Refactor pages with useSearchParams to use proper Suspense boundaries for SSG optimization.
 */

import type { Metadata } from "next";
import { Inter, Raleway } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const dynamic = "force-dynamic";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });
const inter = Inter({
	subsets: ["latin"],
	variable: "--font-num",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Leaply - Study Abroad Simplified",
	description:
		"Your personal study abroad mentor. Find your perfect university match with AI-powered recommendations.",
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	return (
		<html lang={locale}>
			<body className={`${raleway.variable} ${inter.variable}`}>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
