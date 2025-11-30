"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, MapPin, School, Trophy, Target, Compass, Award, Sparkles, Star } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { usePersonaStore } from "@/lib/store/personaStore";
import { useTranslation } from "@/lib/i18n/useTranslation";

export function ProfileContextSidebar() {
	const { t } = useTranslation();
	const { profile, preferences } = useUserStore();
	const { savedUniversities } = useUniversitiesStore();
	const { tracks, personalityTags, keyStories } = usePersonaStore();

	// Get initials from name
	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Get english test score
	const englishTest = profile?.testScores?.find(
		(t) => t.type === "IELTS" || t.type === "TOEFL" || t.type === "Duolingo"
	);

	// Calculate discovery progress
	const completedTracks = tracks.filter((t) => t.status === "completed").length;
	const discoveryProgress = (completedTracks / tracks.length) * 100;

	// Get top personality trait (first one or pinned)
	const topPersonalityTrait = personalityTags[0];

	// Get highlighted achievement (first pinned story or first story)
	const highlightedAchievement = keyStories.find((s) => s.isPinned) || keyStories[0];

	return (
		<div className="p-6 space-y-6 sticky top-0">
			{/* User Profile Header */}
			<div className="flex flex-col items-center text-center space-y-3">
				<div className="relative">
					<Avatar className="w-20 h-20 border-4 border-primary/10">
						<AvatarImage src={profile?.profilePicture} alt={profile?.fullName} />
						<AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
							{getInitials(profile?.fullName)}
						</AvatarFallback>
					</Avatar>
					<div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm">
						<div className="bg-green-500 w-3 h-3 rounded-full border-2 border-background" />
					</div>
				</div>
				<div>
					<h3 className="font-bold text-lg text-foreground">
						{profile?.fullName || t("personaLab", "noName")}
					</h3>
				<p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
					<MapPin className="w-3 h-3" /> {t("common", "vietnam")}
				</p>
				</div>
			</div>

			{/* Top Personality Trait - Featured */}
			{topPersonalityTrait && (
				<Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-2">
							<Star className="w-4 h-4 text-primary fill-primary" />
							<span className="text-xs font-semibold text-primary uppercase tracking-wider">
								{t("personaLab", "topTrait")}
							</span>
						</div>
						<p className="text-lg font-bold text-foreground">
							{topPersonalityTrait.label}
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							{t("personaLab", "from")} {topPersonalityTrait.source} {t("personaLab", "discoveryWord")}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Highlighted Achievement */}
			{highlightedAchievement && (
				<Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200/50">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-2">
							<Award className="w-4 h-4 text-amber-600" />
							<span className="text-xs font-semibold text-amber-700 dark:text-amber-500 uppercase tracking-wider">
								{t("personaLab", "highlightedAchievement")}
							</span>
						</div>
						<p className="font-semibold text-foreground line-clamp-1">
							{highlightedAchievement.title}
						</p>
						<p className="text-sm text-muted-foreground mt-1 line-clamp-2">
							{highlightedAchievement.summary}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Key Stats */}
			<div className="grid grid-cols-2 gap-3">
				<Card className="bg-primary/5 border-none shadow-none">
					<CardContent className="p-3 flex flex-col items-center justify-center text-center">
						<span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
							GPA
						</span>
						<span className="text-xl font-bold text-primary">
							{profile?.gpa || "--"}
						</span>
					</CardContent>
				</Card>
				<Card className="bg-primary/5 border-none shadow-none">
					<CardContent className="p-3 flex flex-col items-center justify-center text-center">
						<span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
							{englishTest?.type || "IELTS"}
						</span>
						<span className="text-xl font-bold text-primary">
							{englishTest?.score || "--"}
						</span>
					</CardContent>
				</Card>
			</div>

			{/* Discovery Progress */}
			<div className="space-y-3">
				<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
					<Compass className="w-4 h-4" /> {t("personaLab", "discoveryProgress")}
				</h4>
				<div className="space-y-2">
					<div className="flex justify-between text-sm">
						<span className="text-muted-foreground">{t("personaLab", "tracksCompleted")}</span>
						<span className="font-medium">{completedTracks}/{tracks.length}</span>
					</div>
					<Progress value={discoveryProgress} className="h-2" />
				</div>
			</div>

			{/* Target Countries */}
			{preferences?.targetCountries && preferences.targetCountries.length > 0 && (
				<div className="space-y-3">
					<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<Target className="w-4 h-4" /> {t("personaLab", "targetCountries")}
					</h4>
					<div className="flex flex-wrap gap-2">
						{preferences.targetCountries.map((country) => (
							<Badge
								key={country}
								variant="secondary"
								className="text-xs"
							>
								{country}
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Saved Schools */}
			{savedUniversities.length > 0 && (
				<div className="space-y-3">
					<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<School className="w-4 h-4" /> {t("personaLab", "savedSchools")}
					</h4>
					<div className="space-y-2">
						{savedUniversities.slice(0, 3).map((uniId, i) => (
							<div
								key={i}
								className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-sm"
							>
								<span className="font-medium truncate">
									University #{uniId}
								</span>
							</div>
						))}
						{savedUniversities.length > 3 && (
							<p className="text-xs text-muted-foreground text-center">
								+{savedUniversities.length - 3} {t("personaLab", "moreSchools")}
							</p>
						)}
					</div>
				</div>
			)}

			{/* Intended Major */}
			{preferences?.desiredMajors && preferences.desiredMajors.length > 0 && (
				<div className="space-y-3">
					<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<GraduationCap className="w-4 h-4" /> {t("personaLab", "intendedMajor")}
					</h4>
					<div className="flex flex-wrap gap-2">
						{preferences.desiredMajors.slice(0, 2).map((major) => (
							<Badge
								key={major}
								variant="outline"
								className="text-xs border-dashed"
							>
								{major}
							</Badge>
						))}
						{preferences.desiredMajors.length > 2 && (
							<Badge variant="outline" className="text-xs border-dashed">
								+{preferences.desiredMajors.length - 2}
							</Badge>
						)}
					</div>
				</div>
			)}

			{/* Personality Tags */}
			{personalityTags.length > 1 && (
				<div className="space-y-3">
					<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<Sparkles className="w-4 h-4" /> {t("personaLab", "otherTraits")}
					</h4>
					<div className="flex flex-wrap gap-2">
						{personalityTags.slice(1, 5).map((tag) => (
							<Badge
								key={tag.id}
								variant="secondary"
								className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 text-xs dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900"
							>
								{tag.label}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
