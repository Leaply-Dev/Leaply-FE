"use client";

import Image from "next/image";
import Link from "next/link";
import {
	MapPin,
	Star,
	DollarSign,
	MessageCircle,
	ExternalLink,
	Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ExploreCardProps {
	id: string;
	name: string;
	country: string;
	region: string;
	city: string;
	ranking: number;
	logo: string;
	averageTuition: number;
	overview: string;
	type?: "public" | "private";
	acceptanceRate?: number;
	className?: string;
	onAskAI?: (universityId: string, universityName: string) => void;
}

export function ExploreCard({
	id,
	name,
	country,
	region,
	city,
	ranking,
	logo,
	averageTuition,
	overview,
	type,
	acceptanceRate,
	className,
	onAskAI,
}: ExploreCardProps) {
	const { t } = useTranslation();
	const { saveUniversity, unsaveUniversity, isSaved } = useUniversitiesStore();
	const saved = isSaved(id);

	const toggleSave = () => {
		if (saved) {
			unsaveUniversity(id);
		} else {
			saveUniversity(id);
		}
	};

	const handleAskAI = () => {
		if (onAskAI) {
			onAskAI(id, name);
		}
	};

	return (
		<Card
			className={cn(
				"overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
				className,
			)}
		>
			<CardContent className="p-0">
				<div className="relative h-48 bg-linear-to-br from-leaf-green/10 to-light-green/5">
					<Image src={logo} alt={name} fill className="object-cover" />

					{/* Ranking Badge - Top Right */}
					<div className="absolute top-4 right-4 flex gap-2">
						<Badge className="bg-card text-foreground border border-border shadow-md">
							<Star className="w-3 h-3 mr-1 fill-warning-orange text-chart-4" />
							#{ranking}
						</Badge>
					</div>

					{/* Type Badge - Top Left */}
					{type && (
						<div className="absolute top-4 left-4">
							<Badge className="bg-card/95 text-foreground border border-border capitalize">
								{t("universities", type)}
							</Badge>
						</div>
					)}
				</div>

				<div className="p-6">
					<h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>

					{/* Key Attributes */}
					<div className="space-y-2 mb-3">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<MapPin className="w-4 h-4 shrink-0" />
							<span>
								{city}, {country}
							</span>
							<Badge variant="outline" className="text-xs ml-auto">
								{region}
							</Badge>
						</div>

						<div className="flex items-center justify-between text-sm">
							<span className="flex items-center gap-1 text-muted-foreground">
								<DollarSign className="w-4 h-4" />$
								{averageTuition.toLocaleString()}{t("universities", "perYear")}
							</span>
							{acceptanceRate && (
								<span className="flex items-center gap-1 text-xs text-muted-foreground">
									<Award className="w-3 h-3" />
									{acceptanceRate}% {t("universities", "acceptance")}
								</span>
							)}
						</div>
					</div>

					<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
						{overview}
					</p>

					{/* Action Buttons */}
					<div className="space-y-2">
						<div className="flex gap-2">
							<Button asChild size="sm" className="flex-1">
								<Link href={`/universities/${id}`}>
									<ExternalLink className="w-4 h-4 mr-2" />
									{t("universities", "viewDetails")}
								</Link>
							</Button>
							<Button
								size="sm"
								variant={saved ? "default" : "outline"}
								onClick={toggleSave}
								className={cn(
									"transition-all px-4",
									saved && "bg-chart-4 hover:bg-chart-4/90",
								)}
							>
								{saved ? "★" : t("universities", "striveForIt")}
							</Button>
						</div>

						{/* Ask AI Button */}
						{onAskAI && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleAskAI}
								className="w-full text-chart-2 hover:text-chart-2/80 hover:bg-chart-2/5"
							>
								<MessageCircle className="w-4 h-4 mr-2" />
								{t("universities", "askAIAboutSchool")}
							</Button>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
