"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { useUserStore } from "@/lib/store/userStore";
import { calculateFitScore, getFitScoreColor } from "@/lib/utils/fitScore";
import { cn } from "@/lib/utils";

interface UniversityCardProps {
	id: string;
	name: string;
	country: string;
	city: string;
	ranking: number;
	logo: string;
	averageTuition: number;
	overview: string;
	showFitScore?: boolean;
	className?: string;
}

export function UniversityCard({
	id,
	name,
	country,
	city,
	ranking,
	logo,
	averageTuition,
	overview,
	showFitScore = true,
	className,
}: UniversityCardProps) {
	const { saveUniversity, unsaveUniversity, isSaved, universities } =
		useUniversitiesStore();
	const { profile, preferences } = useUserStore();
	const saved = isSaved(id);

	const university = universities.find((u) => u.id === id);
	const fitScore =
		university && showFitScore
			? calculateFitScore(university, profile, preferences)
			: null;

	const toggleSave = () => {
		if (saved) {
			unsaveUniversity(id);
		} else {
			saveUniversity(id);
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
					<div className="absolute top-4 right-4 flex gap-2">
						<Badge className="bg-card text-foreground border border-border">
							<Star className="w-3 h-3 mr-1 fill-warning-orange text-chart-4" />
							#{ranking}
						</Badge>
					</div>
					{fitScore !== null && fitScore > 0 && (
						<div className="absolute top-4 left-4">
							<Badge
								className={cn(
									"bg-card border-2 font-semibold",
									getFitScoreColor(fitScore),
								)}
							>
								<TrendingUp className="w-3 h-3 mr-1" />
								{fitScore}% Match
							</Badge>
						</div>
					)}
				</div>

				<div className="p-6">
					<h3 className="text-xl font-semibold text-foreground mb-2">{name}</h3>

					<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
						<span className="flex items-center gap-1">
							<MapPin className="w-4 h-4" />
							{city}, {country}
						</span>
						<span className="flex items-center gap-1">
							<DollarSign className="w-4 h-4" />$
							{averageTuition.toLocaleString()}/year
						</span>
					</div>

					<p className="text-sm text-muted-foreground mb-4 line-clamp-2">
						{overview}
					</p>

					<div className="flex gap-2">
						<Button asChild size="sm" className="flex-1">
							<Link href={`/universities/${id}`}>View Details</Link>
						</Button>
						<Button
							size="sm"
							variant={saved ? "default" : "outline"}
							onClick={toggleSave}
						>
							{saved ? "★" : "☆"}
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
