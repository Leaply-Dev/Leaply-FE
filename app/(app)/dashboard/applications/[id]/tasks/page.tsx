"use client";

import { ArrowLeft, CheckSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function TasksPage() {
	const t = useTranslations("tasks");
	const router = useRouter();

	return (
		<PageTransition>
			<PageContainer>
				<Button variant="ghost" onClick={() => router.back()} className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back
				</Button>

				<Card>
					<CardContent className="flex flex-col items-center justify-center py-16">
						<CheckSquare className="w-16 h-16 text-muted-foreground mb-4" />
						<h1 className="text-2xl font-bold text-foreground mb-2">
							{t("title")}
						</h1>
						<p className="text-muted-foreground text-center max-w-md">
							Task management feature is coming soon. You&apos;ll be able to track
							all your application tasks and deadlines here.
						</p>
					</CardContent>
				</Card>
			</PageContainer>
		</PageTransition>
	);
}
