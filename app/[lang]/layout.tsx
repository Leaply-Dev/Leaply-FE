import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import { hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import type { LayoutProps } from "next";
import { LocaleSync } from "@/components/LocaleSync";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Leaply - Study Abroad Simplified",
	description:
		"Your personal study abroad mentor. Find your perfect university match with AI-powered recommendations.",
};

export async function generateStaticParams() {
	return [{ lang: "en" }, { lang: "vi" }];
}

export default async function RootLayout({
	children,
	params,
}: LayoutProps<"[lang]">) {
	const { lang } = await params;

	// Validate that the incoming `lang` parameter is valid
	if (!hasLocale(lang)) {
		notFound();
	}

	return (
		<html lang={lang}>
			<body className={inter.variable}>
				<LocaleSync locale={lang as Locale} />
				{children}
			</body>
		</html>
	);
}

