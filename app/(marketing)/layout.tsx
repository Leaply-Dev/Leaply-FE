import { DataInitializer } from "@/components/DataInitializer";
import { Footer } from "@/components/marketing/Footer";
import { Navbar } from "@/components/marketing/Navbar";

export default async function MarketingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={"min-h-screen flex flex-col"}>
			<Navbar />
			<DataInitializer />
			<main className="flex-1 flex flex-col min-h-0">{children}</main>
			<Footer />
		</div>
	);
}
