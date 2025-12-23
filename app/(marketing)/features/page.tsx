"use client";

import {
	ArrowRight,
	Bell,
	Calendar,
	CheckSquare,
	FileText,
	Globe,
	Lightbulb,
	MessageSquare,
	PenTool,
	Search,
	Shield,
	Sparkles,
	Star,
	Target,
	TrendingUp,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureConfig {
	id: string;
	titleKey: string;
	taglineKey: string;
	descKey: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	benefits: {
		icon: React.ComponentType<{ className?: string }>;
		titleKey: string;
		descKey: string;
	}[];
}

const featureConfigs: FeatureConfig[] = [
	{
		id: "explore",
		titleKey: "exploreTitle",
		taglineKey: "exploreTagline",
		descKey: "exploreDesc",
		icon: Globe,
		color: "bg-blue-500",
		benefits: [
			{
				icon: Search,
				titleKey: "exploreBenefit1Title",
				descKey: "exploreBenefit1Desc",
			},
			{
				icon: Target,
				titleKey: "exploreBenefit2Title",
				descKey: "exploreBenefit2Desc",
			},
			{
				icon: Star,
				titleKey: "exploreBenefit3Title",
				descKey: "exploreBenefit3Desc",
			},
		],
	},
	{
		id: "applications",
		titleKey: "applicationsTitle",
		taglineKey: "applicationsTagline",
		descKey: "applicationsDesc",
		icon: FileText,
		color: "bg-amber-500",
		benefits: [
			{
				icon: Calendar,
				titleKey: "applicationsBenefit1Title",
				descKey: "applicationsBenefit1Desc",
			},
			{
				icon: Bell,
				titleKey: "applicationsBenefit2Title",
				descKey: "applicationsBenefit2Desc",
			},
			{
				icon: CheckSquare,
				titleKey: "applicationsBenefit3Title",
				descKey: "applicationsBenefit3Desc",
			},
		],
	},
	{
		id: "persona-lab",
		titleKey: "personaLabTitle",
		taglineKey: "personaLabTagline",
		descKey: "personaLabDesc",
		icon: Sparkles,
		color: "bg-primary",
		benefits: [
			{
				icon: Lightbulb,
				titleKey: "personaLabBenefit1Title",
				descKey: "personaLabBenefit1Desc",
			},
			{
				icon: PenTool,
				titleKey: "personaLabBenefit2Title",
				descKey: "personaLabBenefit2Desc",
			},
			{
				icon: MessageSquare,
				titleKey: "personaLabBenefit3Title",
				descKey: "personaLabBenefit3Desc",
			},
		],
	},
];

const additionalBenefitConfigs = [
	{ icon: Shield, titleKey: "benefit1Title", descKey: "benefit1Desc" },
	{ icon: Users, titleKey: "benefit2Title", descKey: "benefit2Desc" },
	{ icon: TrendingUp, titleKey: "benefit3Title", descKey: "benefit3Desc" },
];

function FeatureSection({
	feature,
	index,
}: {
	feature: FeatureConfig;
	index: number;
}) {
	const t = useTranslations("features");
	const isEven = index % 2 === 0;
	const Icon = feature.icon;

	return (
		<section
			id={feature.id}
			className={cn(
				"py-20 scroll-mt-20",
				isEven ? "bg-background" : "bg-muted/50",
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={cn(
						"grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
						!isEven && "lg:grid-flow-dense",
					)}
				>
					{/* Content */}
					<div className={cn(!isEven && "lg:col-start-2")}>
						<SlideUp>
							<div
								className={cn(
									"inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6",
									feature.color,
									"text-white",
								)}
							>
								<Icon className="w-4 h-4" />
								{t(feature.titleKey)}
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{t(feature.taglineKey)}
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								{t(feature.descKey)}
							</p>

							<div className="space-y-6">
								{feature.benefits.map((benefit) => {
									const BenefitIcon = benefit.icon;
									return (
										<div key={benefit.titleKey} className="flex gap-4">
											<div
												className={cn(
													`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${feature.color}/10`,
												)}
											>
												<BenefitIcon
													className={cn(
														"w-6 h-6",
														feature.id === "explore" && "text-blue-500",
														feature.id === "applications" && "text-amber-500",
														feature.id === "persona-lab" && "text-primary",
													)}
												/>
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{t(benefit.titleKey)}
												</h3>
												<p className="text-muted-foreground text-sm">
													{t(benefit.descKey)}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							<div className="mt-10">
								<Button size="lg" asChild>
									<Link href="/register">
										{t("startUsing")}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
						</SlideUp>
					</div>

					{/* Visual */}
					<div className={cn(!isEven && "lg:col-start-1")}>
						<SlideUp delay={0.1}>
							<div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-linear-to-br from-muted to-muted/50 border border-border shadow-xl">
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center p-8">
										<div
											className={cn(
												`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${feature.color}/20`,
											)}
										>
											<Icon
												className={cn(
													"w-10 h-10",
													feature.id === "explore" && "text-blue-500",
													feature.id === "applications" && "text-amber-500",
													feature.id === "persona-lab" && "text-primary",
												)}
											/>
										</div>
										<p className="text-muted-foreground text-sm">
											{t(feature.titleKey)} Preview
										</p>
									</div>
								</div>
							</div>
						</SlideUp>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function FeaturesPage() {
	const t = useTranslations("features");

	return (
		<PageTransition>
			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="relative bg-background py-20 md:py-28 overflow-hidden">
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
						<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
					</div>

					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								{t("heroTitle")}
								<br />
								<span className="text-primary">{t("heroTitleHighlight")}</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
								{t("heroSubtitle")}
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								{featureConfigs.map((feature) => {
									const Icon = feature.icon;
									return (
										<Link
											key={feature.id}
											href={`#${feature.id}`}
											className={cn(
												"inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border",
												"hover:border-primary hover:bg-primary/5 transition-colors",
											)}
										>
											<Icon className="w-4 h-4 text-primary" />
											<span className="text-sm font-medium">
												{t(feature.titleKey)}
											</span>
										</Link>
									);
								})}
							</div>
						</SlideUp>
					</div>
				</section>

				{/* Feature Sections */}
				{featureConfigs.map((feature, index) => (
					<FeatureSection key={feature.id} feature={feature} index={index} />
				))}

				{/* Additional Benefits */}
				<section className="py-20 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
									{t("additionalTitle")}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
									{t("additionalSubtitle")}
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{additionalBenefitConfigs.map((benefit) => {
									const Icon = benefit.icon;
									return (
										<StaggerItem key={benefit.titleKey}>
											<Card className="h-full text-center hover:shadow-lg transition-shadow">
												<CardContent className="p-8">
													<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
														<Icon className="w-7 h-7 text-primary" />
													</div>
													<h3 className="text-lg font-semibold text-foreground mb-2">
														{t(benefit.titleKey)}
													</h3>
													<p className="text-muted-foreground text-sm">
														{t(benefit.descKey)}
													</p>
												</CardContent>
											</Card>
										</StaggerItem>
									);
								})}
							</div>
						</StaggerContainer>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 bg-primary">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
								{t("ctaTitle")}
							</h2>
							<p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
								{t("ctaSubtitle")}
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									variant="secondary"
									className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
									asChild
								>
									<Link href="/register">
										{t("startFree")}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
									asChild
								>
									<Link href="/about">{t("aboutUs")}</Link>
								</Button>
							</div>
						</SlideUp>
					</div>
				</section>
			</div>
		</PageTransition>
	);
}
