"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MapPin, School, Target, Compass, Award, Sparkles, Star, Brain, CheckCircle2, Circle } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { usePersonaStore } from "@/lib/store/personaStore";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Simulated persona summaries based on traits (for demo purposes)
const PERSONA_SUMMARIES: Record<string, string> = {
	default_vi: "Hoàn thành Discovery để Leaply hiểu rõ hơn về bạn",
	default_en: "Complete Discovery so Leaply can understand you better",
	partial_vi: "Tiếp tục hoàn thành Discovery để có bức tranh đầy đủ về bạn",
	partial_en: "Continue completing Discovery for a complete picture of you",
	// Full persona summary when all 4 tracks are completed
	complete_vi: "Một nhà nghiên cứu trẻ với tư duy hệ thống và đam mê giải quyết vấn đề môi trường. Kết hợp nền tảng khoa học vững chắc với khả năng lãnh đạo và xây dựng mạng lưới, bạn đã chứng minh cam kết tạo tác động xã hội thông qua các dự án như hệ thống giám sát nước IoT và Environmental Youth Network. Điểm mạnh nổi bật là khả năng kết nối công nghệ với nhu cầu thực tế của cộng đồng.",
	complete_en: "A young researcher with systems thinking and passion for solving environmental challenges. Combining a strong scientific foundation with leadership and network-building abilities, you have demonstrated commitment to social impact through projects like the IoT water monitoring system and the Environmental Youth Network. Your standout strength is connecting technology with real community needs.",
	analytical_vi: "Một nhà tư duy hệ thống với khả năng phân tích sắc bén, kết hợp nền tảng khoa học vững chắc với đam mê nghiên cứu giải pháp bền vững cho các thách thức xã hội.",
	analytical_en: "A systematic thinker with sharp analytical skills, combining a strong scientific foundation with a passion for researching sustainable solutions to social challenges.",
	creative_vi: "Người sáng tạo đa năng, luôn tìm kiếm giao điểm giữa nghệ thuật và công nghệ để tạo ra những trải nghiệm ý nghĩa và tác động tích cực đến cộng đồng.",
	creative_en: "A versatile creative, always seeking the intersection of art and technology to create meaningful experiences and positive community impact.",
	leadership_vi: "Nhà lãnh đạo trẻ với tầm nhìn toàn cầu, có khả năng kết nối con người và truyền cảm hứng thay đổi thông qua các dự án cộng đồng có tác động lâu dài.",
	leadership_en: "A young leader with global vision, capable of connecting people and inspiring change through community projects with lasting impact.",
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

	// Generate persona summary based on traits and track completion (simulated AI)
	const getPersonaSummary = () => {
		const lang = language === "vi" ? "vi" : "en";
		
		// Check if all 4 tracks are completed
		const allTracksCompleted = completedTracks === tracks.length && tracks.length === 4;
		
		if (allTracksCompleted) {
			// Show full comprehensive persona summary when all discovery is complete
			return PERSONA_SUMMARIES[`complete_${lang}`];
		}
		
		if (personalityTags.length === 0) {
			return PERSONA_SUMMARIES[`default_${lang}`];
		}
		
		// If some tracks completed but not all, show partial message
		if (completedTracks > 0 && completedTracks < tracks.length) {
			return PERSONA_SUMMARIES[`partial_${lang}`];
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

			{/* Persona Summary - AI Generated (Clean/Minimal) */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Brain className="w-4 h-4 text-muted-foreground" />
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						{t("personaLab", "personaSummary")}
					</span>
				</div>
				<p className="text-sm text-foreground leading-relaxed pl-6 border-l-2 border-border">
					{getPersonaSummary()}
				</p>
			</div>

			{/* Top Personality Traits - Featured (show top 3) */}
			{topTraits.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Star className="w-4 h-4 text-muted-foreground" />
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							{t("personaLab", "topTraits")}
						</span>
					</div>
					<div className="flex flex-wrap gap-2">
						{topTraits.map((trait, index) => (
							<Badge 
								key={trait.id} 
								variant="secondary"
								className="px-3 py-1.5 text-sm font-medium bg-foreground/5 hover:bg-foreground/10 border-0"
							>
								<span className="w-4 h-4 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold mr-2">
									{index + 1}
								</span>
								{trait.label}
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Highlighted Achievement */}
			{highlightedAchievement && (
				<div className="space-y-3">
					<div className="flex items-center gap-2">
						<Award className="w-4 h-4 text-muted-foreground" />
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							{t("personaLab", "highlightedAchievement")}
						</span>
					</div>
					<Card className="border-dashed">
						<CardContent className="p-3">
							<p className="font-medium text-foreground text-sm line-clamp-1">
								{highlightedAchievement.title}
							</p>
							<p className="text-xs text-muted-foreground mt-1 line-clamp-2">
								{highlightedAchievement.summary}
							</p>
						</CardContent>
					</Card>
				</div>
			)}

			{/* Discovery Progress - Compact indicator */}
			<div className="flex items-center justify-between py-3 px-3 rounded-lg bg-muted/30">
				<div className="flex items-center gap-2">
					<Compass className="w-4 h-4 text-muted-foreground" />
					<span className="text-xs font-medium text-muted-foreground">
						{t("personaLab", "discoveryProgress")}
					</span>
				</div>
				<div className="flex items-center gap-1.5">
					{tracks.map((track, index) => (
						<div
							key={track.id}
							className="relative group"
							title={track.title}
						>
							{track.status === "completed" ? (
								<CheckCircle2 className="w-4 h-4 text-primary" />
							) : track.status === "in_progress" ? (
								<Circle className="w-4 h-4 text-primary/60 fill-primary/20" />
							) : (
								<Circle className="w-4 h-4 text-muted-foreground/40" />
							)}
						</div>
					))}
					<span className="text-xs font-semibold text-foreground ml-1">
						{completedTracks}/{tracks.length}
					</span>
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

			{/* Academic Stats - With demo placeholder data */}
			<div className="space-y-3 pt-4 border-t border-border">
				<h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
					{t("personaLab", "academicStats")}
				</h4>
				<div className="grid grid-cols-2 gap-2">
					<div className="p-2 rounded-lg bg-muted/50 text-center">
						<span className="text-xs text-muted-foreground block">GPA</span>
						<span className="text-sm font-semibold text-foreground">{profile?.gpa || "3.85"}/4.0</span>
					</div>
					<div className="p-2 rounded-lg bg-muted/50 text-center">
						<span className="text-xs text-muted-foreground block">{englishTest?.type || "IELTS"}</span>
						<span className="text-sm font-semibold text-foreground">{englishTest?.score || "7.5"}</span>
					</div>
				</div>
				
				{/* Certificates & Achievements */}
				<div className="space-y-2">
					<span className="text-xs text-muted-foreground">{t("personaLab", "certificates") || "Certificates"}</span>
					<div className="flex flex-wrap gap-1.5">
						<Badge variant="outline" className="text-[10px] px-2 py-0.5">
							SAT: 1480
						</Badge>
						<Badge variant="outline" className="text-[10px] px-2 py-0.5">
							AP Environmental Science: 5
						</Badge>
						<Badge variant="outline" className="text-[10px] px-2 py-0.5">
							Cambridge C1 Advanced
						</Badge>
						<Badge variant="outline" className="text-[10px] px-2 py-0.5">
							Google Data Analytics
						</Badge>
					</div>
				</div>
			</div>
		</div>
	);
}




