"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, MapPin, School, Target, Compass, Award, Sparkles, Star, Brain } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { usePersonaStore } from "@/lib/store/personaStore";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Simulated persona summaries based on traits (for demo purposes)
const PERSONA_SUMMARIES: Record<string, string> = {
	default_vi: "Hoàn thành Discovery để Leaply hiểu rõ hơn về bạn",
	default_en: "Complete Discovery so Leaply can understand you better",
	analytical_vi: "Tư duy phân tích sắc bén, đam mê giải quyết vấn đề phức tạp",
	analytical_en: "Sharp analytical thinker, passionate about solving complex problems",
	creative_vi: "Sáng tạo và đổi mới, luôn tìm cách tiếp cận mới",
	creative_en: "Creative and innovative, always seeking new approaches",
	leadership_vi: "Có khả năng lãnh đạo và truyền cảm hứng cho người khác",
	leadership_en: "Natural leader with ability to inspire others",
};

export function ProfileContextSidebar() {
	const { t, language } = useTranslation();
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
		(test) => test.type === "IELTS" || test.type === "TOEFL" || test.type === "Duolingo"
	);

	// Calculate discovery progress
	const completedTracks = tracks.filter((track) => track.status === "completed").length;
	const discoveryProgress = (completedTracks / tracks.length) * 100;

	// Get top 3 personality traits
	const topTraits = personalityTags.slice(0, 3);

	// Get highlighted achievement (first pinned story or first story)
	const highlightedAchievement = keyStories.find((s) => s.isPinned) || keyStories[0];

	// Generate persona summary based on traits (simulated AI)
	const getPersonaSummary = () => {
		const lang = language === "vi" ? "vi" : "en";
		if (personalityTags.length === 0) {
			return PERSONA_SUMMARIES[`default_${lang}`];
		}
		// Simple simulation - in real app this would be AI-generated
		const firstTrait = personalityTags[0]?.label?.toLowerCase() || "";
		if (firstTrait.includes("analytical") || firstTrait.includes("phân tích")) {
			return PERSONA_SUMMARIES[`analytical_${lang}`];
		}
		if (firstTrait.includes("creative") || firstTrait.includes("sáng tạo")) {
			return PERSONA_SUMMARIES[`creative_${lang}`];
		}
		if (firstTrait.includes("leader") || firstTrait.includes("lãnh đạo")) {
			return PERSONA_SUMMARIES[`leadership_${lang}`];
		}
		// Default summary combining traits
		return personalityTags.slice(0, 2).map(tag => tag.label).join(" • ");
	};

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

			{/* Persona Summary - AI Generated (Simulated) */}
			<Card className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-violet-200/50">
				<CardContent className="p-4">
					<div className="flex items-center gap-2 mb-2">
						<Brain className="w-4 h-4 text-violet-600" />
						<span className="text-xs font-semibold text-violet-700 dark:text-violet-400 uppercase tracking-wider">
							{t("personaLab", "personaSummary")}
						</span>
					</div>
					<p className="text-sm text-foreground leading-relaxed">
						{getPersonaSummary()}
					</p>
				</CardContent>
			</Card>

			{/* Top Personality Traits - Featured (show top 3) */}
			{topTraits.length > 0 && (
				<Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
					<CardContent className="p-4">
						<div className="flex items-center gap-2 mb-3">
							<Star className="w-4 h-4 text-primary fill-primary" />
							<span className="text-xs font-semibold text-primary uppercase tracking-wider">
								{t("personaLab", "topTraits")}
							</span>
						</div>
						<div className="space-y-2">
							{topTraits.map((trait, index) => (
								<div key={trait.id} className="flex items-center gap-2">
									<span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">
										{index + 1}
									</span>
									<span className="text-sm font-medium text-foreground">
										{trait.label}
									</span>
								</div>
							))}
						</div>
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

			{/* Other Personality Traits (beyond top 3) */}
			{personalityTags.length > 3 && (
				<div className="space-y-3">
					<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
						<Sparkles className="w-4 h-4" /> {t("personaLab", "otherTraits")}
					</h4>
					<div className="flex flex-wrap gap-2">
						{personalityTags.slice(3, 7).map((tag) => (
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

			{/* Academic Stats - De-emphasized */}
			{(profile?.gpa || englishTest) && (
				<div className="space-y-3 pt-4 border-t border-border">
					<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						{t("personaLab", "academicStats")}
					</h4>
					<div className="grid grid-cols-2 gap-2">
						{profile?.gpa && (
							<div className="p-2 rounded-lg bg-muted/50 text-center">
								<span className="text-xs text-muted-foreground block">GPA</span>
								<span className="text-sm font-semibold text-foreground">{profile.gpa}</span>
							</div>
						)}
						{englishTest && (
							<div className="p-2 rounded-lg bg-muted/50 text-center">
								<span className="text-xs text-muted-foreground block">{englishTest.type}</span>
								<span className="text-sm font-semibold text-foreground">{englishTest.score}</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

