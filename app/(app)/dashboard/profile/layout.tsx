/**
 * @fileoverview Profile layout wrapper.
 * Forces dynamic rendering to avoid prerender issues with client state and translations.
 */

export const dynamic = "force-dynamic";

export default function ProfileLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
