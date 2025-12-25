import { DataInitializer } from "@/components/DataInitializer";
import { Navbar } from "@/components/Navbar";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="h-screen flex flex-col overflow-hidden">
			<DataInitializer />
			<Navbar />
			<main className="flex-1 flex flex-col min-h-0 overflow-hidden">
				{children}
			</main>
		</div>
	);
}
