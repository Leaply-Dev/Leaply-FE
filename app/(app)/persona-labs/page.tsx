"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";

const PersonaLabsClient = dynamic(
	() =>
		import("@/components/persona-labs/PersonaLabsClient").then(
			(mod) => mod.PersonaLabsClient,
		),
	{
		ssr: false,
		loading: () => (
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Skeleton className="h-8 w-64 mb-4" />
				<Skeleton className="h-4 w-full max-w-md mb-8" />
				<div className="space-y-4">
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
			</div>
		),
	},
);

function PersonaLabsPageSkeleton() {
	return (
		<PageTransition>
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Skeleton className="h-8 w-64 mb-4" />
				<Skeleton className="h-4 w-full max-w-md mb-8" />
				<div className="space-y-4">
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
			</div>
		</PageTransition>
	);
}

export default function PersonaLabsPage() {
	const t = useTranslations("personaLabs");

	return (
		<PageTransition>
			<div className="min-h-full bg-background">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<header className="mb-8">
						<h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
						<p className="text-muted-foreground mt-1">{t("subtitle")}</p>
					</header>
					<Suspense fallback={<PersonaLabsPageSkeleton />}>
						<PersonaLabsClient />
					</Suspense>
				</div>
			</div>
		</PageTransition>
	);
}
