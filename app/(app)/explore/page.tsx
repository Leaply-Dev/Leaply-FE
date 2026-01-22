/**
 * @fileoverview Explore page with Programs and Scholarships tabs.
 * Dynamically loads search clients based on user selection and manages tab navigation via URL params.
 */

"use client";

import { Award, GraduationCap } from "lucide-react";
import dynamicImport from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dynamic import for ExploreClient (405 lines - large component with complex state)
const ExploreClient = dynamicImport(
	() =>
		import("@/components/explore/ExploreClient").then(
			(mod) => mod.ExploreClient,
		),
	{
		ssr: false, // Client-side only due to auth and complex state management
		loading: () => <ExplorePageSkeleton />,
	},
);

// Dynamic import for ScholarshipExploreClient
const ScholarshipExploreClient = dynamicImport(
	() =>
		import("@/components/explore/scholarship/ScholarshipExploreClient").then(
			(mod) => mod.ScholarshipExploreClient,
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
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab = searchParams.get("tab") || "programs";

	const handleTabChange = (value: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", value);
		router.push(`/explore?${params.toString()}`, { scroll: false });
	};

	return (
		<PageTransition className="flex flex-col min-h-screen">
			{/* Top-Level Tabs: Programs | Scholarships */}
			<div className="border-b border-border bg-background sticky top-0 z-40">
				<div className="container mx-auto px-6">
					<Tabs
						value={activeTab}
						onValueChange={handleTabChange}
						className="w-full"
					>
						<TabsList className="h-14 w-full justify-start gap-1 bg-transparent p-0 rounded-none border-b-0">
							<TabsTrigger
								value="programs"
								className="relative h-14 rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2 font-semibold"
							>
								<GraduationCap className="w-5 h-5" />
								<span>Programs</span>
							</TabsTrigger>
							<TabsTrigger
								value="scholarships"
								className="relative h-14 rounded-none border-b-2 border-transparent px-6 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none gap-2 font-semibold"
							>
								<Award className="w-5 h-5" />
								<span>Scholarships</span>
							</TabsTrigger>
						</TabsList>

						<TabsContent value="programs" className="mt-0 border-0 p-0">
							<ExploreClient />
						</TabsContent>

						<TabsContent value="scholarships" className="mt-0 border-0 p-0">
							<ScholarshipExploreClient />
						</TabsContent>
					</Tabs>
				</div>
			</div>
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
