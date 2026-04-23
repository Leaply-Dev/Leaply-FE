import { DataInitializer } from "@/components/DataInitializer";
import { Navbar } from "@/components/Navbar";
import { TourProvider } from "@/components/tour";

export default async function AppLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<TourProvider>
			<div className="h-screen flex flex-col">
				<DataInitializer />
				<Navbar />
				<main className="flex-1 overflow-y-auto pt-16">{children}</main>
			</div>
		</TourProvider>
	);
}
