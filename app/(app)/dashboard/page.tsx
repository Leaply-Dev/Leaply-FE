import { DashboardClient } from "@/components/dashboard/DashboardClient";

/**
 * Dashboard Server Component
 * In development, Server Components cannot access browser-based authentication,
 * so we rely entirely on client-side TanStack Query for data fetching.
 * In production, this could be enhanced to use cookie-based auth via proxy.ts
 */
export default function DashboardPage() {
	// No SSR data fetching - client component handles everything with TanStack Query
	// This avoids 403 errors when server tries to fetch without auth token
	return <DashboardClient />;
}
