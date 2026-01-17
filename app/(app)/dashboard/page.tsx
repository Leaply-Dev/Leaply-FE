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
				{/* Header skeleton */}
				<div className="mb-8">
					<Skeleton className="h-9 w-64 mb-2" />
					<Skeleton className="h-6 w-48" />
				</div>

				{/* Suggested action card skeleton */}
				<div className="mb-8 p-6 border border-border rounded-xl">
					<div className="flex items-start gap-4">
						<Skeleton className="w-14 h-14 rounded-2xl" />
						<div className="flex-1 space-y-3">
							<Skeleton className="h-5 w-24" />
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-10 w-32" />
						</div>
					</div>
				</div>

				{/* Stats grid skeleton - 4 cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					{[1, 2, 3, 4].map((i) => (
						<div key={i} className="p-5 border border-border rounded-xl">
							<div className="flex items-center gap-3 mb-3">
								<Skeleton className="w-10 h-10 rounded-lg" />
								<Skeleton className="h-4 w-16" />
							</div>
							<Skeleton className="h-7 w-12 mb-2" />
							<Skeleton className="h-2 w-full" />
						</div>
					))}
				</div>

				{/* Content grid skeleton - 2 column layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Left column - Applications + Deadlines */}
					<div className="lg:col-span-2 space-y-6">
						{/* Applications skeleton */}
						<div className="border border-border rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-8 w-20" />
							</div>
							<div className="flex gap-4 overflow-hidden">
								{[1, 2, 3].map((i) => (
									<div
										key={i}
										className="min-w-[220px] p-4 border border-border rounded-lg"
									>
										<div className="flex items-start gap-3 mb-3">
											<Skeleton className="h-10 w-10 rounded-full" />
											<div className="flex-1 space-y-2">
												<Skeleton className="h-4 w-24" />
												<Skeleton className="h-3 w-32" />
											</div>
										</div>
										<Skeleton className="h-5 w-16" />
									</div>
								))}
							</div>
						</div>
						{/* Deadlines skeleton */}
						<div className="border border-border rounded-xl p-6">
							<div className="flex items-center justify-between mb-4">
								<Skeleton className="h-6 w-40" />
								<Skeleton className="h-8 w-20" />
							</div>
							<div className="space-y-3">
								{[1, 2].map((i) => (
									<div
										key={i}
										className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
									>
										<div className="flex items-center gap-3">
											<Skeleton className="h-10 w-10 rounded-lg" />
											<div className="space-y-2">
												<Skeleton className="h-4 w-32" />
												<Skeleton className="h-3 w-24" />
											</div>
										</div>
										<Skeleton className="h-5 w-16" />
									</div>
								))}
							</div>
						</div>
					</div>
					{/* Right column - Quick Actions */}
					<div className="space-y-6">
						<div className="border border-border rounded-xl p-6">
							<Skeleton className="h-6 w-32 mb-4" />
							<div className="space-y-2">
								{[1, 2, 3].map((i) => (
									<Skeleton key={i} className="h-10 w-full" />
								))}
							</div>
						</div>
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
