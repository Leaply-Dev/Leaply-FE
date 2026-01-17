/**
 * @fileoverview SOP editor layout wrapper.
 * Forces dynamic rendering to avoid prerender issues with client state.
 */

export const dynamic = "force-dynamic";

export default function SopLayout({ children }: { children: React.ReactNode }) {
	return children;
}
