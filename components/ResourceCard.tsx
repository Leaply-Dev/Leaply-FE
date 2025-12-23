"use client";

import { BookOpen, ExternalLink, FileText, Video } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ResourceCardProps {
	title: string;
	summary: string;
	url: string;
	type: "article" | "video" | "guide";
	tags: string[];
	className?: string;
}

const typeConfig = {
	article: { icon: FileText, labelKey: "article" as const },
	video: { icon: Video, labelKey: "video" as const },
	guide: { icon: BookOpen, labelKey: "guide" as const },
};

export function ResourceCard({
	title,
	summary,
	url,
	type,
	tags,
	className,
}: ResourceCardProps) {
	const t = useTranslations("common");
	const config = typeConfig[type];
	const Icon = config.icon;

	return (
		<Card className={cn("hover:shadow-md transition-shadow", className)}>
			<CardHeader>
				<div className="flex items-start gap-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<Icon className="w-5 h-5 text-primary" />
					</div>
					<div className="flex-1">
						<CardTitle className="text-lg mb-1">{title}</CardTitle>
						<Badge variant="secondary" className="text-xs">
							{t(config.labelKey)}
						</Badge>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground mb-4">{summary}</p>

				{tags.length > 0 && (
					<div className="flex flex-wrap gap-2 mb-4">
						{tags.slice(0, 3).map((tag) => (
							<Badge key={tag} variant="outline" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
				)}

				<Link
					href={url}
					className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent font-medium"
				>
					{t("readMore")}
					<ExternalLink className="w-4 h-4" />
				</Link>
			</CardContent>
		</Card>
	);
}
