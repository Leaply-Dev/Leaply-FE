/**
 * @fileoverview Root layout for the entire application.
 * Sets up Next-Intl for i18n and configures global providers.
 * Auth protection handled by middleware (proxy.ts).
 *
 * NOTE: force-dynamic is currently required due to useSearchParams usage in multiple pages.
 * TODO: Refactor pages with useSearchParams to use proper Suspense boundaries for SSG optimization.
 */

import { Agentation } from "agentation";
import type { Metadata } from "next";
import {
	EB_Garamond,
	JetBrains_Mono,
	Plus_Jakarta_Sans,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const dynamic = "force-dynamic";

const plus_jakarta_sans = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
});
const eb_garamond = EB_Garamond({
	variable: "--font-serif",
	subsets: ["latin"],
});
const jetbrains_mono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
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
			{process.env.NODE_ENV === "development" && (
				<head>
					<script
						async
						crossOrigin="anonymous"
						src="https://tweakcn.com/live-preview.min.js"
					/>
				</head>
			)}
			<body
				className={`font-sans ${plus_jakarta_sans.variable} ${eb_garamond.variable} ${jetbrains_mono.variable}`}
			>
				<NextIntlClientProvider>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
				{process.env.NODE_ENV === "development" && <Agentation />}
			</body>
		</html>
	);
}
