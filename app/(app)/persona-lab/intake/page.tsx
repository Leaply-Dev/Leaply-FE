"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const IntakeFormClient = dynamic(
	() =>
		import("@/components/persona-lab/intake/IntakeFormClient").then(
			(mod) => mod.IntakeFormClient,
		),
	{
		ssr: false,
		loading: () => (
			<div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-40 w-full" />
				<Skeleton className="h-40 w-full" />
			</div>
		),
	},
);

export default function PersonaLabIntakePage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
			<IntakeFormClient />
		</div>
	);
}
