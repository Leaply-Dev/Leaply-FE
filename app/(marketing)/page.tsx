/**
 * @fileoverview Landing page with hero, features, how-it-works, and CTA sections.
 * Includes session expiration alert, parallax visuals, university carousel, and multi-step journey explainer.
 */

"use client";

import { m } from "framer-motion";
import {
	AlertCircle,
	ArrowRight,
	Bot,
	Brain,
	ChevronDown,
	FileCheck,
	Globe,
	MapPin,
	School,
	Sparkles,
	Target,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import {
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	FEATURED_UNIVERSITIES,
	FEATURES,
	HOW_IT_WORKS_STEPS,
} from "@/lib/data/marketing-config";

interface StepVisual {
	step: number;
	icon: React.ComponentType<{
		className?: string;
		style?: React.CSSProperties;
	}>;
	color: string;
	title: string;
	imagePath: string;
}

function ScrollHighlightStep({ children }: { children: React.ReactNode }) {
	return <div className="relative">{children}</div>;
}

function ParallaxVisual() {
	const [activeStep, setActiveStep] = React.useState(1);
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	React.useEffect(() => {
		if (!mounted) return;

		const observerOptions = {
			root: null,
			rootMargin: "-40% 0px -40% 0px",
			threshold: 0,
		};

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const stepElement = entry.target as HTMLElement;
					const stepNumber = stepElement.getAttribute("data-step");
					if (stepNumber) {
						setActiveStep(Number.parseInt(stepNumber, 10));
					}
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		const setupObserver = () => {
			const steps = document.querySelectorAll<HTMLDivElement>("[data-step]");
			if (steps.length > 0) {
				// biome-ignore lint/suspicious/useIterableCallbackReturn: it still can be used
				steps.forEach((step) => observer.observe(step));
				return true;
			}
			return false;
		};

		if (!setupObserver()) {
			const timeoutId = setTimeout(setupObserver, 200);
			return () => {
				clearTimeout(timeoutId);
				observer.disconnect();
			};
		}

		return () => observer.disconnect();
	}, [mounted]);

	const stepVisuals: StepVisual[] = [
		{
			step: 1,
			icon: Users,
			color: "#95CA55",
			title: "Profile Setup",
			imagePath: "/how-it-works/step-1.png",
		},
		{
			step: 2,
			icon: Brain,
			color: "#4CA8D3",
			title: "AI Matching",
			imagePath: "/how-it-works/step-2.png",
		},
		{
			step: 3,
			icon: FileCheck,
			color: "#E8A634",
			title: "Application Tracking",
			imagePath: "/how-it-works/step-3.png",
		},
		{
			step: 4,
			icon: Sparkles,
			color: "#95CA55",
			title: "AI Enhancement",
			imagePath: "/how-it-works/step-4.png",
		},
	];

	const currentVisual = stepVisuals[activeStep - 1];
	const Icon = currentVisual.icon;

	return (
		<div className="relative w-full h-full bg-card rounded-2xl shadow-2xl p-8 overflow-hidden">
			<m.div
				className="absolute inset-0 opacity-5"
				animate={{
					background: `radial-gradient(circle at 50% 50%, ${currentVisual.color} 0%, transparent 70%)`,
				}}
				transition={{ duration: 0.6, ease: "easeOut" }}
			/>
			<div className="relative flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<div
						className="w-12 h-12 rounded-xl flex items-center justify-center"
						style={{ backgroundColor: `${currentVisual.color}20` }}
					>
						<Icon className="w-6 h-6" style={{ color: currentVisual.color }} />
					</div>
					<div>
						<p className="text-sm text-muted-foreground font-medium">
							Step {currentVisual.step}
						</p>
						<p className="text-lg font-bold text-foreground">
							{currentVisual.title}
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					{[1, 2, 3, 4].map((step) => (
						<div
							key={step}
							className={`w-2 h-2 rounded-full transition-all duration-300 ${step === activeStep ? "bg-primary" : "bg-muted"}`}
							style={{
								width: step === activeStep ? "24px" : "8px",
								backgroundColor:
									step === activeStep ? currentVisual.color : undefined,
							}}
						/>
					))}
				</div>
			</div>
			<div className="relative h-[450px] w-full rounded-xl overflow-hidden flex items-center justify-center">
				<Image
					src={currentVisual.imagePath}
					alt={currentVisual.title}
					fill
					className="object-contain p-4"
					priority={activeStep === 1}
				/>
			</div>
		</div>
	);
}

export default function HomePage() {
	const t = useTranslations("landing");
	const tNav = useTranslations("nav");
	const tAuth = useTranslations("auth");
	const searchParams = useSearchParams();
	const [showExpiredAlert, setShowExpiredAlert] = useState(false);

	// Check for session expired parameter
	useEffect(() => {
		const expired = searchParams.get("expired");
		if (expired === "true") {
			setShowExpiredAlert(true);
			// Auto-hide after 10 seconds
			const timer = setTimeout(() => {
				setShowExpiredAlert(false);
			}, 10000);
			return () => clearTimeout(timer);
		}
	}, [searchParams]);

	const marqueeUniversities = [
		...FEATURED_UNIVERSITIES,
		...FEATURED_UNIVERSITIES,
	];

	return (
		<div className="min-h-screen">
			{/* Session Expired Alert */}
			{showExpiredAlert && (
				<div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
					<Alert variant="destructive" className="shadow-lg">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>{tAuth("sessionExpired")}</AlertTitle>
						<AlertDescription>
							{tAuth("sessionExpiredMessage")}
						</AlertDescription>
						<button
							type="button"
							onClick={() => setShowExpiredAlert(false)}
							className="absolute top-2 right-2 p-1 rounded-md hover:bg-destructive/10 transition-colors"
							aria-label="Close"
						>
							<span className="sr-only">Close</span>
							<svg
								className="h-4 w-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Close notification</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</Alert>
				</div>
			)}

			{/* Hero Section */}
			<section className="relative bg-background py-20 md:py-32 overflow-hidden">
				<div className="absolute inset-0 z-0">
					<Image
						src="/hero.png"
						alt="Hero background"
						fill
						className="object-cover opacity-15"
						priority
						quality={90}
					/>
					<div className="absolute inset-0 bg-linear-to-b from-background/50 via-transparent to-background" />
				</div>

				<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
					<m.div
						className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
						animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
						transition={{
							duration: 6,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					/>
					<m.div
						className="absolute bottom-20 right-[10%] w-80 h-80 bg-chart-2/10 rounded-full blur-3xl"
						animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
						transition={{
							duration: 8,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					/>
				</div>

				<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex flex-col items-center gap-8">
						<SlideUp>
							<div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
								<Sparkles className="w-4 h-4" />
								{t("badge")}
							</div>
						</SlideUp>
						<SlideUp delay={0.05}>
							<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
								{t("heroTitle")}
								<br />
								<span className="text-primary">{t("heroTitleHighlight")}</span>
							</h1>
						</SlideUp>
						<SlideUp delay={0.1}>
							<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl">
								{t("heroSubtitle")}
							</p>
						</SlideUp>
						<SlideUp delay={0.15}>
							<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mt-4">
								<Button
									size="lg"
									className="text-lg px-8 py-6 sm:min-w-[220px] shadow-lg shadow-primary/25"
									asChild
								>
									<Link href="/register">
										{t("ctaStart")}
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="text-lg px-8 py-6 sm:min-w-[220px]"
									asChild
								>
									<Link href="#features">
										{t("ctaLearnMore")}
										<ChevronDown className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
							<p className="text-sm text-muted-foreground mt-4">
								{t("alreadyHaveAccount")}{" "}
								<Link
									href="/login"
									className="text-primary hover:underline font-medium"
								>
									{tNav("login")}
								</Link>
							</p>
						</SlideUp>
					</div>
				</div>
			</section>

			{/* Top Universities Section */}
			<section className="py-16 bg-muted">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{t("universitiesTitle")}
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								{t("universitiesSubtitle")}
							</p>
						</SlideUp>
					</div>

					<div className="relative overflow-hidden">
						<div className="absolute inset-y-0 left-0 w-16 bg-linear-to-r from-muted to-transparent pointer-events-none" />
						<div className="absolute inset-y-0 right-0 w-16 bg-linear-to-l from-muted to-transparent pointer-events-none" />
						<div className="marquee-track flex items-center gap-10 py-6">
							{marqueeUniversities.map((university, index) => (
								<div
									key={`${university.name}-${index}`}
									className="flex items-center shrink-0"
								>
									<div className="relative w-32 h-16">
										<Image
											src={university.logo}
											alt={university.name}
											fill
											className="object-contain"
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 bg-background scroll-mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="mb-16">
						<SlideUp>
							<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight max-w-xl">
									<span className="relative inline-block">
										<span className="absolute inset-x-0 bottom-1 h-3 bg-accent/60 rounded-md" />
										<span className="relative">{t("featuresTitle")}</span>
									</span>{" "}
									{t("featuresTitleSuffix")}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl">
									{t("featuresSubtitle")}
								</p>
							</div>
						</SlideUp>
					</div>

					<StaggerContainer>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{FEATURES.map((feature) => {
								const Icon = feature.icon;
								return (
									<StaggerItem key={feature.titleKey}>
										<Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200 group">
											<CardContent className="p-6 flex flex-col h-full gap-4">
												<div className="p-3 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
													<Icon className="w-6 h-6 text-primary" />
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-foreground mb-2">
														{t(feature.titleKey)}
													</h3>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{t(feature.descKey)}
													</p>
												</div>
												<div className="mt-auto pt-4">
													<Link
														href={feature.href}
														className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
													>
														{t("learnMore")}
														<ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
													</Link>
												</div>
											</CardContent>
										</Card>
									</StaggerItem>
								);
							})}
						</div>
					</StaggerContainer>
				</div>
			</section>

			{/* How It Works Section */}
			<section id="how-it-works" className="py-20 bg-muted scroll-mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<SlideUp>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{t("howItWorksTitle")}
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								{t("howItWorksSubtitle")}
							</p>
						</SlideUp>
					</div>

					{/* Desktop */}
					<div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start hidden">
						<div className="space-y-32 py-12">
							{HOW_IT_WORKS_STEPS.map((item) => (
								<ScrollHighlightStep key={item.step}>
									<div className="relative" data-step={item.step}>
										<div className="flex items-start gap-6 mb-6">
											<div className="shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
												{item.step}
											</div>
											<div className="flex-1 pt-2">
												<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
													{t(item.titleKey)}
												</h3>
											</div>
										</div>
										<div className="space-y-4 mb-6">
											<div className="flex justify-end gap-3">
												<div className="max-w-[85%] rounded-lg px-4 py-3 bg-primary text-primary-foreground shadow-sm">
													<p className="text-base leading-relaxed">
														{t(item.quoteKey)}
													</p>
												</div>
												<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
													<User className="w-5 h-5 text-background" />
												</div>
											</div>
											<div className="flex justify-start gap-3">
												<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
													<Bot className="w-5 h-5 text-primary-foreground" />
												</div>
												<div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border shadow-sm">
													<p className="text-base text-foreground leading-relaxed">
														{t(item.descKey)}
													</p>
												</div>
											</div>
										</div>
									</div>
								</ScrollHighlightStep>
							))}
						</div>
						<div className="sticky top-24 h-[600px] flex items-center justify-center">
							<ParallaxVisual />
						</div>
					</div>

					{/* Mobile */}
					<div className="lg:hidden space-y-24">
						{HOW_IT_WORKS_STEPS.map((item) => (
							<ScrollHighlightStep key={item.step}>
								<div className="relative">
									<div className="flex items-start gap-6 mb-6">
										<div className="shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
											{item.step}
										</div>
										<div className="flex-1 pt-2">
											<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
												{t(item.titleKey)}
											</h3>
										</div>
									</div>
									<div className="space-y-4 mb-6">
										<div className="flex justify-end gap-3">
											<div className="max-w-[85%] rounded-lg px-4 py-3 bg-primary text-primary-foreground shadow-sm">
												<p className="text-base leading-relaxed">
													{t(item.quoteKey)}
												</p>
											</div>
											<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
												<User className="w-5 h-5 text-background" />
											</div>
										</div>
										<div className="flex justify-start gap-3">
											<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
												<Bot className="w-5 h-5 text-primary-foreground" />
											</div>
											<div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border shadow-sm">
												<p className="text-base text-foreground leading-relaxed">
													{t(item.descKey)}
												</p>
											</div>
										</div>
									</div>
								</div>
							</ScrollHighlightStep>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 cta-pattern text-secondary-foreground/90 relative overflow-hidden">
				<div className="absolute inset-0 bg-background/40 z-0" />
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<SlideUp>
						<div className="inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
							<Sparkles className="w-4 h-4" />
							{t("ctaFree")}
						</div>
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							{t("ctaTitle")}
						</h2>
						<p className="text-lg md:text-xl mb-10 text-secondary-foreground/90 max-w-2xl mx-auto">
							{t("ctaSubtitle")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								variant="secondary"
								className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-lg px-8 py-6"
								asChild
							>
								<Link href="/register">
									{t("ctaCreateAccount")}
									<ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-transparent border-secondary-foreground text-secondary-foreground/90 hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
								asChild
							>
								{/* TODO: Add tNav.login translation key when i18n namespace is extended */}
								<Link href="/login">{tNav("login")}</Link>
							</Button>
						</div>
					</SlideUp>
				</div>
			</section>

			<style>{`
				@keyframes leaply-marquee {
					from { transform: translateX(0); }
					to { transform: translateX(-50%); }
				}
				.marquee-track {
					width: max-content;
					animation: leaply-marquee 30s linear infinite;
				}
				.cta-pattern {
					--s: 185px;
					/* Converted colors to hex for consistency if needed, but keeping vars is fine */
					--c1: #9bdb70;
					--c2: #e3ffd1;
					--c3: #638e57;
					--_g: 0 120deg,#0000 0;
					background:
						conic-gradient(at calc(250%/3) calc(100%/3),var(--c3) var(--_g)),
						conic-gradient(from -120deg at calc( 50%/3) calc(100%/3),var(--c2) var(--_g)),
						conic-gradient(from  120deg at calc(100%/3) calc(250%/3),var(--c1) var(--_g)),
						conic-gradient(from  120deg at calc(200%/3) calc(250%/3),var(--c1) var(--_g)),
						conic-gradient(from -180deg at calc(100%/3) 50%,var(--c2)  60deg,var(--c1) var(--_g)),
						conic-gradient(from   60deg at calc(200%/3) 50%,var(--c1)  60deg,var(--c3) var(--_g)),
						conic-gradient(from  -60deg at 50% calc(100%/3),var(--c1) 120deg,var(--c2) 0 240deg,var(--c3) 0);
					background-size: calc(var(--s)*sqrt(3)) var(--s);
				}
			`}</style>
		</div>
	);
}
