// Force dynamic rendering to avoid prerender issues with client state and translations
export const dynamic = "force-dynamic";

export default function ApplicationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
