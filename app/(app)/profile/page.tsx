"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { PageTransition } from "@/components/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileClient = dynamic(
	() =>
		import("@/components/profile/ProfileClient").then(
			(mod) => mod.ProfileClient,
		),
	{
		ssr: false,
		loading: () => (
			<div className="space-y-6">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-32" />
			</div>
		),
	},
);

function ProfilePageSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-32" />
		</div>
	);
}

export default function ProfilePage() {
	const t = useTranslations("profile");

	return (
		<PageTransition>
			<div className="min-h-full bg-background">
				<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<header className="mb-8">
						<h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
						<p className="text-muted-foreground mt-1">{t("subtitle")}</p>
					</header>
					<Suspense fallback={<ProfilePageSkeleton />}>
						<ProfileClient />
					</Suspense>
				</div>
			</div>
		</PageTransition>
	);
}
