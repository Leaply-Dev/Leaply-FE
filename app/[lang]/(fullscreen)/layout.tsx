import { Raleway } from "next/font/google";
import { notFound } from "next/navigation";
import {
	getDictionary,
	hasLocale,
	type Locale,
} from "@/app/[lang]/dictionaries";
import { DataInitializer } from "@/components/DataInitializer";
import { Navbar } from "@/components/Navbar";

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

export default async function FullscreenLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ lang: string }>;
}) {
	const { lang } = await params;

	if (!hasLocale(lang)) {
		notFound();
	}

	const dict = await getDictionary(lang as Locale);

	return (
		<div className={`h-screen flex flex-col ${raleway.className}`}>
			<DataInitializer />
			<Navbar locale={lang as Locale} translations={dict} />
			<main className="flex-1 flex flex-col min-h-0 overflow-hidden">
				{children}
			</main>
		</div>
	);
}
