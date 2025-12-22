"use client";

import {
	ArrowLeft,
	BookOpen,
	Calendar,
	DollarSign,
	Globe,
	MapPin,
	Star,
	Users,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/Layout";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUniversities } from "@/lib/data/universities";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";

export default function UniversityDetailPage() {
	const params = useParams();
	const router = useRouter();
	const {
		universities,
		setUniversities,
		saveUniversity,
		unsaveUniversity,
		isSaved,
	} = useUniversitiesStore();
	const [activeTab, setActiveTab] = useState<
		"overview" | "programs" | "admissions" | "financials"
	>("overview");

	useEffect(() => {
		if (universities.length === 0) {
			setUniversities(mockUniversities);
		}
	}, [universities.length, setUniversities]);

	const university = universities.find((uni) => uni.id === params.id);
	const saved = university ? isSaved(university.id) : false;

	if (!university) {
		return (
			<PageContainer>
				<div className="text-center py-16">
					<h1 className="text-2xl font-bold text-foreground mb-2">
						University not found
					</h1>
					<Button onClick={() => router.push("/explore")}>
						Back to Universities
					</Button>
				</div>
			</PageContainer>
		);
	}

	const toggleSave = () => {
		if (saved) {
			unsaveUniversity(university.id);
		} else {
			saveUniversity(university.id);
		}
	};

	const tabs = [
		{ id: "overview", label: "Overview" },
		{ id: "programs", label: "Programs" },
		{ id: "admissions", label: "Admissions" },
		{ id: "financials", label: "Financials" },
	] as const;

	return (
		<PageTransition>
			<PageContainer>
				{/* Back Button */}
				<Button variant="ghost" onClick={() => router.back()} className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Universities
				</Button>

				{/* Header */}
				<SlideUp>
					<Card className="mb-8">
						<CardContent className="p-0">
							<div className="relative w-full overflow-hidden">
								{/* Background Image */}
								<div className="relative w-full h-0 pb-[56.25%]">
									<Image
										src={university.logo}
										alt={university.name}
										fill
										className="object-cover"
										priority
									/>
								</div>
								{/* Dark overlay for better text visibility */}
								<div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/30 to-black/60" />

								{/* University Name Overlay */}
								<div className="absolute inset-0 flex items-end p-8">
									<div className="text-white">
										<h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
											{university.name}
										</h1>
										<div className="flex flex-wrap items-center gap-4">
											<span className="flex items-center gap-1 drop-shadow-md">
												<MapPin className="w-4 h-4" />
												{university.city}, {university.country}
											</span>
											{university.foundingYear && (
												<span className="flex items-center gap-1 drop-shadow-md">
													<Calendar className="w-4 h-4" />
													Founded {university.foundingYear}
												</span>
											)}
											{university.type && (
												<Badge
													variant="secondary"
													className="capitalize bg-card/20 backdrop-blur-sm border-white/30 text-white"
												>
													{university.type}
												</Badge>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className="p-8">
								<div className="flex justify-end gap-3 mb-6">
									<Button
										variant={saved ? "default" : "outline"}
										onClick={toggleSave}
									>
										{saved ? "Saved" : "Save"}
									</Button>
									<Button>Apply Now</Button>
								</div>

								{/* Key Stats */}
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
										<Star className="w-8 h-8 text-primary" />
										<div>
											<p className="text-2xl font-bold text-foreground">
												#{university.ranking}
											</p>
											<p className="text-xs text-muted-foreground">
												World Ranking
											</p>
										</div>
									</div>
									{university.acceptanceRate && (
										<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
											<Users className="w-8 h-8 text-primary" />
											<div>
												<p className="text-2xl font-bold text-foreground">
													{university.acceptanceRate}%
												</p>
												<p className="text-xs text-muted-foreground">
													Acceptance Rate
												</p>
											</div>
										</div>
									)}
									<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
										<DollarSign className="w-8 h-8 text-primary" />
										<div>
											<p className="text-2xl font-bold text-foreground">
												${(university.averageTuition / 1000).toFixed(0)}K
											</p>
											<p className="text-xs text-muted-foreground">
												Avg. Tuition/Year
											</p>
										</div>
									</div>
									{university.websiteUrl && (
										<div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
											<Globe className="w-8 h-8 text-primary" />
											<div>
												<a
													href={university.websiteUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm font-medium text-primary hover:text-accent"
												>
													Visit Website
												</a>
												<p className="text-xs text-muted-foreground">
													Official Site
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</SlideUp>

				{/* Tabs */}
				<div className="border-b border-border mb-6">
					<div className="flex gap-6">
						{tabs.map((tab) => (
							<button
								type="button"
								key={`${tab.id}-${tab.label}`}
								onClick={() => setActiveTab(tab.id)}
								className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
									activeTab === tab.id
										? "border-primary text-primary"
										: "border-transparent text-muted-foreground hover:text-foreground"
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>
				</div>

				{/* Tab Content */}
				<div className="space-y-6">
					{activeTab === "overview" && (
						<SlideUp>
							<Card>
								<CardHeader>
									<CardTitle>About {university.name}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground leading-relaxed">
										{university.overview}
									</p>
								</CardContent>
							</Card>

							{university.reviews && university.reviews.length > 0 && (
								<Card>
									<CardHeader>
										<CardTitle>Student Reviews</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{university.reviews.map((review) => (
											<div
												key={review.id}
												className="border-b border-border last:border-0 pb-4 last:pb-0"
											>
												<div className="flex items-center gap-2 mb-2">
													<div className="flex gap-1">
														{[...Array(review.rating)].map((_, i) => (
															<Star
																key={`${review.id}-${i}`}
																className="w-4 h-4 fill-warning-orange text-chart-4"
															/>
														))}
													</div>
													<span className="font-medium text-foreground">
														{review.author}
													</span>
													<span className="text-sm text-muted-foreground">
														• {new Date(review.date).toLocaleDateString()}
													</span>
												</div>
												<p className="text-muted-foreground">
													{review.comment}
												</p>
											</div>
										))}
									</CardContent>
								</Card>
							)}
						</SlideUp>
					)}

					{activeTab === "programs" && (
						<SlideUp>
							<Card>
								<CardHeader>
									<CardTitle>Available Programs</CardTitle>
								</CardHeader>
								<CardContent>
									{university.programs && university.programs.length > 0 ? (
										<div className="space-y-4">
											{university.programs.map((program) => (
												<div
													key={program.id}
													className="p-4 border border-border rounded-lg"
												>
													<div className="flex items-start justify-between mb-2">
														<div>
															<h3 className="font-semibold text-foreground">
																{program.name}
															</h3>
															<div className="flex items-center gap-2 mt-1">
																<Badge variant="outline" className="capitalize">
																	{program.level}
																</Badge>
																<span className="text-sm text-muted-foreground">
																	{program.duration}
																</span>
															</div>
														</div>
														<p className="font-semibold text-primary">
															${program.tuition.toLocaleString()}/year
														</p>
													</div>
													{program.requirements && (
														<div className="mt-3">
															<p className="text-sm font-medium text-muted-foreground mb-1">
																Requirements:
															</p>
															<ul className="text-sm text-muted-foreground list-disc list-inside">
																{program.requirements.map((req, idx) => (
																	<li key={`${program.id}-${idx}`}>{req}</li>
																))}
															</ul>
														</div>
													)}
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground">
											Program information coming soon.
										</p>
									)}
								</CardContent>
							</Card>
						</SlideUp>
					)}

					{activeTab === "admissions" && (
						<SlideUp>
							<Card>
								<CardHeader>
									<CardTitle>Admission Requirements</CardTitle>
								</CardHeader>
								<CardContent>
									{university.applicationRequirements &&
									university.applicationRequirements.length > 0 ? (
										<div className="space-y-4">
											{university.applicationRequirements.map((req, idx) => (
												<div key={`${req.type}-${idx}`} className="flex gap-4">
													<div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
														<BookOpen className="w-4 h-4 text-primary" />
													</div>
													<div className="flex-1">
														<h3 className="font-semibold text-foreground mb-1">
															{req.type}
														</h3>
														<p className="text-sm text-muted-foreground mb-1">
															{req.description}
														</p>
														{req.deadline && (
															<p className="text-sm text-primary">
																Deadline:{" "}
																{new Date(req.deadline).toLocaleDateString()}
															</p>
														)}
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="text-muted-foreground">
											Please visit the official website for detailed admission
											requirements.
										</p>
									)}
								</CardContent>
							</Card>
						</SlideUp>
					)}

					{activeTab === "financials" && (
						<SlideUp>
							<Card className="mb-6">
								<CardHeader>
									<CardTitle>Tuition & Fees</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3">
										<div className="flex justify-between items-center pb-3 border-b border-border">
											<span className="text-muted-foreground">
												Average Annual Tuition
											</span>
											<span className="font-semibold text-foreground">
												${university.averageTuition.toLocaleString()}
											</span>
										</div>
										<p className="text-sm text-muted-foreground">
											* Costs may vary by program. Additional fees for housing,
											meals, and materials apply.
										</p>
									</div>
								</CardContent>
							</Card>

							{university.scholarships &&
								university.scholarships.length > 0 && (
									<Card>
										<CardHeader>
											<CardTitle>Available Scholarships</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											{university.scholarships.map((scholarship) => (
												<div
													key={scholarship.id}
													className="p-4 border border-border rounded-lg"
												>
													<div className="flex items-start justify-between mb-2">
														<h3 className="font-semibold text-foreground">
															{scholarship.name}
														</h3>
														<Badge variant="success">
															Up to ${scholarship.amount.toLocaleString()}
														</Badge>
													</div>
													<p className="text-sm text-muted-foreground mb-3">
														{scholarship.description}
													</p>
													<div>
														<p className="text-sm font-medium text-muted-foreground mb-1">
															Eligibility:
														</p>
														<ul className="text-sm text-muted-foreground list-disc list-inside">
															{scholarship.eligibility.map((criteria, idx) => (
																<li key={`${scholarship.id}-${idx}`}>
																	{criteria}
																</li>
															))}
														</ul>
													</div>
												</div>
											))}
										</CardContent>
									</Card>
								)}
						</SlideUp>
					)}
				</div>
			</PageContainer>
		</PageTransition>
	);
}
