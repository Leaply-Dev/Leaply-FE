/**
 * @fileoverview Applications page - Server Component wrapper.
 * Wraps the ApplicationsClient in Suspense to handle useSearchParams() hydration.
 */

import { Suspense } from "react";
import { ApplicationsClient } from "@/components/applications/ApplicationsClient";
import { Skeleton } from "@/components/ui/skeleton";

function ApplicationsPageSkeleton() {
	return (
		<div className="p-4 lg:p-0">
			{/* Tab skeleton */}
			<div className="mb-4 lg:mb-0 lg:absolute lg:top-4 lg:left-4 z-10">
				<Skeleton className="h-12 w-64 rounded-xl" />
			</div>

			<div className="flex min-h-[calc(100vh-16rem)]">
				{/* Sidebar skeleton */}
				<div className="w-full lg:w-80 xl:w-96 shrink-0 hidden lg:block">
					<div className="p-4 space-y-4">
						<Skeleton className="h-10 w-full rounded-lg" />
						<Skeleton className="h-12 w-full rounded-lg" />
						<div className="space-y-3 mt-6">
							{[1, 2, 3].map((i) => (
								<Skeleton key={i} className="h-24 w-full rounded-xl" />
							))}
						</div>
					</div>
				</div>

				{/* Dashboard skeleton */}
				<div className="hidden lg:block flex-1 p-6">
					<Skeleton className="h-8 w-64 mb-2" />
					<Skeleton className="h-5 w-48 mb-6" />
					<div className="grid grid-cols-3 gap-4 mb-6">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-24 w-full rounded-xl" />
						))}
					</div>
					<Skeleton className="h-48 w-full rounded-xl" />
				</div>
			</div>
		</div>
	);
}

export default function ApplicationsPage() {
	return (
		<Suspense fallback={<ApplicationsPageSkeleton />}>
			<ApplicationsClient />
		</Suspense>
	);
}
