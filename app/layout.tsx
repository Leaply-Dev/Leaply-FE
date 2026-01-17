/**
 * @fileoverview Root layout for the entire application.
 * Sets up Next-Intl for i18n, configures global providers, and forces dynamic rendering for client state consistency.
 */

import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const dynamic = "force-dynamic";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

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
			<body className={raleway.variable}>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
