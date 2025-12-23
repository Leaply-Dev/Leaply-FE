import { DataInitializer } from "@/components/DataInitializer";
import { Navbar } from "@/components/Navbar";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={`min-h-screen flex flex-col`}>
			<DataInitializer />
			<Navbar />
			<main className="flex-1 flex flex-col min-h-0">{children}</main>
		</div>
	);
}
