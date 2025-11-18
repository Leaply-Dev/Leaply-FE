"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, Globe } from "lucide-react";
import { AIMatchCard } from "@/components/AIMatchCard";
import { ExploreCard } from "@/components/ExploreCard";
import {
	FilterQuestionnaire,
	type FilterState,
} from "@/components/FilterQuestionnaire";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { useUserStore } from "@/lib/store/userStore";
import { mockUniversities } from "@/lib/data/universities";
import { calculateFitScore } from "@/lib/utils/fitScore";
import {
	PageTransition,
	StaggerContainer,
	StaggerItem,
	SlideUp,
} from "@/components/PageTransition";

export default function UniversitiesPage() {
	const router = useRouter();
	const { universities, setUniversities } = useUniversitiesStore();
	const { profile, preferences } = useUserStore();
	const [activeMode, setActiveMode] = useState<"ai-match" | "explore-all">(
		"ai-match",
	);
	const [searchInput, setSearchInput] = useState("");
	const [filterState, setFilterState] = useState<FilterState>({
		regions: [],
		majors: [],
		tuitionRange: null,
	});

	useEffect(() => {
		// Initialize universities on mount
		if (universities.length === 0) {
			setUniversities(mockUniversities);
		}
	}, [universities.length, setUniversities]);

	// Get unique regions and majors for filter options
	const availableRegions = useMemo(() => {
		const regions = Array.from(
			new Set(mockUniversities.map((uni) => uni.region)),
		);
		return regions.map((region) => ({
			value: region,
			label: region,
			count: mockUniversities.filter((uni) => uni.region === region).length,
		}));
	}, []);

	const availableMajors = useMemo(() => {
		return [
			{ value: "Computer Science", label: "Computer Science" },
			{ value: "Engineering", label: "Engineering" },
			{ value: "Business", label: "Business" },
			{ value: "Medicine", label: "Medicine" },
			{ value: "Arts", label: "Arts & Humanities" },
			{ value: "Sciences", label: "Natural Sciences" },
			{ value: "Social Sciences", label: "Social Sciences" },
			{ value: "Law", label: "Law" },
		];
	}, []);

	// Apply filters and search
	const filteredUniversities = useMemo(() => {
		let filtered = [...universities];

		// Search filter
		if (searchInput) {
			const query = searchInput.toLowerCase();
			filtered = filtered.filter(
				(uni) =>
					uni.name.toLowerCase().includes(query) ||
					uni.city.toLowerCase().includes(query) ||
					uni.country.toLowerCase().includes(query) ||
					uni.region.toLowerCase().includes(query),
			);
		}

		// Region filter
		if (filterState.regions.length > 0) {
			filtered = filtered.filter((uni) =>
				filterState.regions.includes(uni.region),
			);
		}

		// Tuition filter
		if (filterState.tuitionRange) {
			filtered = filtered.filter(
				(uni) =>
					uni.averageTuition >= filterState.tuitionRange!.min &&
					uni.averageTuition <= filterState.tuitionRange!.max,
			);
		}

		// Major filter (simplified - in production would match against actual programs)
		// For now, we'll just keep all universities if major filter is active
		// as we don't have detailed program data for all universities

		return filtered;
	}, [universities, searchInput, filterState]);

	// For AI Match mode: filter and sort by fit score
	const aiMatchedUniversities = useMemo(() => {
		if (!profile) return [];

		const withScores = filteredUniversities.map((uni) => ({
			...uni,
			fitScore: calculateFitScore(uni, profile, preferences),
		}));

		// Only show universities with fit score > 40
		return withScores
			.filter((uni) => uni.fitScore >= 40)
			.sort((a, b) => b.fitScore - a.fitScore)
			.slice(0, 12); // Show top 12 matches
	}, [filteredUniversities, profile, preferences]);

	// For Explore All mode: sort by ranking
	const exploreAllUniversities = useMemo(() => {
		return [...filteredUniversities].sort((a, b) => a.ranking - b.ranking);
	}, [filteredUniversities]);

	const handleAskAI = (_universityId: string, universityName: string) => {
		// Navigate to chatbot with pre-filled question
		router.push(
			`/chatbot?question=${encodeURIComponent(`Tell me more about ${universityName}`)}`,
		);
	};

	const _displayUniversities =
		activeMode === "ai-match" ? aiMatchedUniversities : exploreAllUniversities;

	return (
		<PageTransition>
			{/* Hero Section */}
			<section className="relative bg-background py-16 overflow-hidden">
				{/* Background Image */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/hero.png"
						alt="Hero background"
						fill
						className="object-cover opacity-20"
						priority
						quality={90}
					/>
					{/* Overlay for better text readability */}
					<div className="absolute inset-0" />
				</div>

				{/* Content */}
				<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<SlideUp>
						<div className="text-center mb-8">
							<h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
								Discover Your Perfect Match
							</h1>
							<p className="text-xl text-muted-foreground">
								Personalized recommendations or explore 1000+ universities
								worldwide
							</p>
						</div>

						{/* Search Bar */}
						<div className="max-w-3xl mx-auto">
							<div className="flex gap-3 bg-card rounded-xl p-2 shadow-lg">
								<div className="flex-1 flex items-center gap-3 px-3">
									<Search className="w-5 h-5 text-muted-foreground" />
									<Input
										value={searchInput}
										onChange={(e) => setSearchInput(e.target.value)}
										placeholder="Search universities, programs, or countries..."
										className="border-0 focus-visible:ring-0 text-foreground"
									/>
								</div>
							</div>
						</div>
					</SlideUp>
				</div>
			</section>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Mode Switch Tabs */}
				<div className="mb-8">
					<Tabs
						value={activeMode}
						onValueChange={(value) => setActiveMode(value as "ai-match" | "explore-all")}
						className="w-full"
					>
						<div className="flex justify-center mb-2">
							<TabsList className="grid w-full max-w-md grid-cols-2">
								<TabsTrigger
									type="button"
									value="ai-match"
									className="flex items-center gap-2"
								>
									<Sparkles className="w-4 h-4" />
									AI Match
								</TabsTrigger>
								<TabsTrigger
									type="button"
									value="explore-all"
									className="flex items-center gap-2"
								>
									<Globe className="w-4 h-4" />
									Explore All
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="ai-match" className="mt-0">
							<div className="space-y-6">
								{/* AI Match Description */}
								<div className="text-center max-w-2xl mx-auto">
									<p className="text-muted-foreground">
										{profile ? (
											<>
												Based on your profile, we've found{" "}
												<span className="font-semibold text-primary">
													{aiMatchedUniversities.length} universities
												</span>{" "}
												that may be a great fit for you
											</>
										) : (
											"Complete your profile to see personalized AI recommendations"
										)}
									</p>
								</div>

								{/* Results Grid - AI Match Cards */}
								<StaggerContainer>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{aiMatchedUniversities.map((university) => (
											<StaggerItem key={university.id}>
												<AIMatchCard
													id={university.id}
													name={university.name}
													country={university.country}
													city={university.city}
													ranking={university.ranking}
													logo={university.logo}
													averageTuition={university.averageTuition}
													overview={university.overview}
													onAskAI={handleAskAI}
												/>
											</StaggerItem>
										))}
									</div>
								</StaggerContainer>

								{aiMatchedUniversities.length === 0 && (
									<div className="text-center py-16">
										<Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-xl font-semibold text-foreground mb-2">
											{profile ? "No matches found" : "Complete your profile"}
										</h3>
										<p className="text-muted-foreground mb-6">
											{profile
												? "Try adjusting your search or preferences to see more results"
												: "Complete your profile and preferences to see personalized university matches"}
										</p>
										{!profile && (
											<Button onClick={() => router.push("/onboarding")}>
												Complete Profile
											</Button>
										)}
									</div>
								)}
							</div>
						</TabsContent>

						<TabsContent value="explore-all" className="mt-0">
							<div className="space-y-6">
								{/* Filter Questionnaire */}
								<FilterQuestionnaire
									availableRegions={availableRegions}
									availableMajors={availableMajors}
									filters={filterState}
									onFiltersChange={setFilterState}
								/>

								{/* Results Header */}
								<div className="flex items-center justify-between">
									<div>
										<h2 className="text-2xl font-bold text-foreground">
											All Universities
										</h2>
										<p className="text-sm text-muted-foreground mt-1">
											Showing {exploreAllUniversities.length} results
										</p>
									</div>
								</div>

								{/* Results Grid - Explore Cards */}
								<StaggerContainer>
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{exploreAllUniversities.map((university) => (
											<StaggerItem key={university.id}>
												<ExploreCard
													id={university.id}
													name={university.name}
													country={university.country}
													region={university.region}
													city={university.city}
													ranking={university.ranking}
													logo={university.logo}
													averageTuition={university.averageTuition}
													overview={university.overview}
													type={university.type}
													acceptanceRate={university.acceptanceRate}
													onAskAI={handleAskAI}
												/>
											</StaggerItem>
										))}
									</div>
								</StaggerContainer>

								{exploreAllUniversities.length === 0 && (
									<div className="text-center py-16">
										<Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
										<h3 className="text-xl font-semibold text-foreground mb-2">
											No universities found
										</h3>
										<p className="text-muted-foreground">
											Try adjusting your filters or search query to see more
											results
										</p>
									</div>
								)}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</PageTransition>
	);
}
