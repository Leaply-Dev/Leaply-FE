import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import "./globals.css";

const raleway = Raleway({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Leaply - Study Abroad Simplified",
	description:
		"Your personal study abroad mentor. Find your perfect university match with AI-powered recommendations.",
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
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
			</body>
		</html>
	);
}
