/**
 * @fileoverview Explore page — program catalog and compare.
 * The scholarship explore tab was removed; scholarships now appear inside the
 * Chiến lược tab.
 */

"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic import for ExploreClient (large client component with complex state)
const ExploreClient = dynamic(
	() =>
		import("@/components/explore/ExploreClient").then(
			(mod) => mod.ExploreClient,
		),
	{
		ssr: false,
		loading: () => <ExplorePageSkeleton />,
	},
);

// Loading skeleton for explore page
function ExplorePageSkeleton() {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header skeleton */}
				<div className="mb-8">
					<Skeleton className="h-9 w-48 mb-4" />
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex gap-2">
							<Skeleton className="h-10 w-24" />
							<Skeleton className="h-10 w-24" />
						</div>
						<div className="flex gap-2 ml-auto">
							<Skeleton className="h-10 w-32" />
							<Skeleton className="h-10 w-28" />
						</div>
					</div>
				</div>

				{/* AI Match section skeleton */}
				<div className="mb-8">
					<div className="flex items-center gap-2 mb-4">
						<div className="w-5 h-5 bg-primary/20 rounded" />
						<Skeleton className="h-6 w-32" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="p-4 border border-border rounded-xl">
								<div className="flex items-start gap-3 mb-3">
									<Skeleton className="w-12 h-12 rounded-full" />
									<div className="flex-1">
										<Skeleton className="h-5 w-32 mb-2" />
										<Skeleton className="h-4 w-24" />
									</div>
								</div>
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
								</div>
								<div className="mt-4 flex justify-between items-center">
									<Skeleton className="h-5 w-16" />
									<Skeleton className="h-8 w-20" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Manual programs grid skeleton */}
				<div>
					<div className="flex items-center gap-2 mb-4">
						<div className="w-5 h-5 bg-muted rounded" />
						<Skeleton className="h-6 w-40" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<div key={i} className="p-4 border border-border rounded-xl">
								<div className="flex items-start gap-3 mb-3">
									<Skeleton className="w-12 h-12 rounded-full" />
									<div className="flex-1">
										<Skeleton className="h-4 w-28 mb-1" />
										<Skeleton className="h-5 w-36 mb-2" />
									</div>
								</div>
								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-2/3 mb-4" />
								<div className="flex justify-between items-center">
									<Skeleton className="h-5 w-12" />
									<Skeleton className="h-8 w-16" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function ExplorePageContent() {
	const t = useTranslations("explore");

	return (
		<PageTransition className="flex flex-col min-h-screen">
			<div className="border-b border-border bg-background">
				<div className="container mx-auto px-6 pt-10 pb-5">
					<h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.2] pb-1">
						{t("heroTitle")}{" "}
						<span className="inline-block bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-[1.15] pb-1">
							{t("heroProgram")}
						</span>
					</h1>
				</div>
			</div>
			<ExploreClient />
		</PageTransition>
	);
}

export default function ExplorePage() {
	return (
		<Suspense fallback={<ExplorePageSkeleton />}>
			<ExplorePageContent />
		</Suspense>
	);
}
