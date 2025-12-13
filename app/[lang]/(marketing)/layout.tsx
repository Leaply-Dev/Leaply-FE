import { Raleway } from "next/font/google";
import { type LayoutProps } from "next";
import { getDictionary, hasLocale, type Locale } from "@/app/[lang]/dictionaries";
import { notFound } from "next/navigation";
import { DataInitializer } from "@/components/DataInitializer";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";

const raleway = Raleway({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
	title: "Leaply - Your AI-Powered Study Abroad Companion",
	description:
		"Discover universities, manage applications, and get personalized guidance for studying abroad with Leaply.",
	icons: {
		icon: "/icon.ico",
	},
};

export default async function MarketingLayout({
	children,
	params,
}: LayoutProps<"[lang]">) {
	const { lang } = await params;
	
	if (!hasLocale(lang)) {
		notFound();
	}
	
	const dict = await getDictionary(lang as Locale);

	return (
		<div className={`min-h-screen flex flex-col ${raleway.className}`}>
			<DataInitializer />
			<Navbar locale={lang as Locale} translations={dict} />
			<main className="flex-1 flex flex-col min-h-0">{children}</main>
			<Footer />
		</div>
	);
}
