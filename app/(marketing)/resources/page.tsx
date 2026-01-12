"use client";

import { BookOpen, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { PageContainer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";

export default function ResourcesPage() {
	const t = useTranslations("resources");

	return (
		<PageTransition>
			<PageContainer>
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						{t("title")}
					</h1>
					<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
				</div>

				{/* Coming Soon State */}
				<div className="flex flex-col items-center justify-center py-24 text-center">
					<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
						<BookOpen className="w-10 h-10 text-primary" />
					</div>
					<h2 className="text-2xl font-semibold text-foreground mb-3">
						Coming Soon
					</h2>
					<p className="text-muted-foreground max-w-md mb-8">
						We're working on curating helpful resources for your university
						application journey. Check back soon!
					</p>
					<div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
						<Search className="w-4 h-4" />
						<span>Resources will include guides, articles, and videos</span>
					</div>
				</div>
			</PageContainer>
		</PageTransition>
	);
}
