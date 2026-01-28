/**
 * @fileoverview Dashboard page with application tracking and analytics.
 * Dynamically loads the dashboard client component with suspense-based loading skeleton.
 */

"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import for DashboardClient (566 lines - large component)
const DashboardClient = dynamic(
	() =>
		import("@/components/dashboard/DashboardClient").then(
			(mod) => mod.DashboardClient,
		),
	{
		ssr: false, // Client-side only due to auth requirements
		loading: () => <DashboardPageSkeleton />,
	},
);

// Loading skeleton for dashboard - matches redesigned layout
function DashboardPageSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header & Stats Strip Strip skeleton */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
					<div className="space-y-2">
						<Skeleton className="h-9 w-64" />
						<Skeleton className="h-6 w-48" />
					</div>
					<div className="flex gap-3">
						<Skeleton className="h-10 w-32 rounded-full" />
						<Skeleton className="h-10 w-32 rounded-full" />
						<Skeleton className="h-10 w-32 rounded-full" />
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left column - Suggested + Applications */}
					<div className="lg:col-span-2 space-y-8">
						{/* Suggested banner skeleton */}
						<Skeleton className="h-20 w-full rounded-xl" />

						{/* Applications table skeleton */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-40" />
							<div className="border border-border/50 rounded-xl overflow-hidden">
								<div className="bg-muted/30 h-10 w-full" />
								<div className="p-4 space-y-4">
									{[1, 2, 3].map((i) => (
										<div key={i} className="flex items-center gap-4">
											<Skeleton className="h-10 w-10 rounded-full" />
											<div className="flex-1 space-y-2">
												<Skeleton className="h-4 w-1/3" />
												<Skeleton className="h-3 w-1/4" />
											</div>
											<Skeleton className="h-6 w-16" />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Right column - Deadlines + Widget */}
					<div className="space-y-8">
						{/* Deadlines skeleton */}
						<div className="space-y-4">
							<Skeleton className="h-6 w-32" />
							<div className="border border-border/50 rounded-xl p-4 space-y-4">
								{[1, 2, 3].map((i) => (
									<div key={i} className="flex gap-3">
										<Skeleton className="h-10 w-10 rounded-lg" />
										<div className="flex-1 space-y-2">
											<Skeleton className="h-4 w-full" />
											<Skeleton className="h-3 w-2/3" />
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Help widget skeleton */}
						<Skeleton className="h-32 w-full rounded-xl" />
					</div>
				</div>
			</div>
		</div>
	);
}

/**
 * Dashboard Server Component
 * In development, Server Components cannot access browser-based authentication,
 * so we rely entirely on client-side TanStack Query for data fetching.
 * In production, this could be enhanced to use cookie-based auth via proxy.ts
 */
export default function DashboardPage() {
	// No SSR data fetching - client component handles everything with TanStack Query
	// This avoids 403 errors when server tries to fetch without auth token
	return (
		<Suspense fallback={<DashboardPageSkeleton />}>
			<DashboardClient />
		</Suspense>
	);
}
