import "@/app/globals.css";
import { Raleway } from "next/font/google";
import { DataInitializer } from "@/components/DataInitializer";
import { Footer } from "@/components/Footer";
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={raleway.className}>
			<body className="min-h-screen flex flex-col">
				<DataInitializer />
				<Navbar />
				<main className="flex-1 flex flex-col min-h-0">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
