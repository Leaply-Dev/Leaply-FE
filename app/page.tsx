"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	GraduationCap,
	Brain,
	Target,
	Globe,
	ArrowRight,
	Sparkles,
	Users,
	FileCheck,
	Bot,
	User,
	School,
	MapPin,
	ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	StaggerContainer,
	StaggerItem,
	SlideUp,
} from "@/components/PageTransition";
import { motion } from "framer-motion";

// Social proof stats
const stats = [
	{ value: "2,000+", label: "Học sinh tin tưởng", icon: Users },
	{ value: "1,500+", label: "Trường đại học", icon: School },
	{ value: "50+", label: "Quốc gia", icon: MapPin },
];

const features = [
	{
		icon: Globe,
		title: "Khám phá trường học",
		description:
			"Tìm kiếm hàng ngàn trường đại học trên toàn thế giới với thông tin chi tiết về chương trình, xếp hạng và yêu cầu.",
		href: "/features",
	},
	{
		icon: Brain,
		title: "AI Matching thông minh",
		description:
			"Nhận gợi ý trường phù hợp dựa trên profile học thuật, sở thích và mục tiêu nghề nghiệp của bạn.",
		href: "/features",
	},
	{
		icon: Target,
		title: "Quản lý hồ sơ",
		description:
			"Theo dõi deadline, quản lý tài liệu và giữ mọi thứ ngăn nắp trong suốt hành trình apply.",
		href: "/features",
	},
	{
		icon: Sparkles,
		title: "Persona Lab",
		description:
			"Khám phá điểm mạnh, viết essay ấn tượng với sự hỗ trợ của mentor AI 24/7.",
		href: "/features",
	},
];

const featuredUniversities = [
	{
		name: "Harvard University",
		location: "USA",
		logo: "/universities/havard.png",
	},
	{
		name: "Massachusetts Institute of Technology",
		location: "USA",
		logo: "/universities/mit.png",
	},
	{
		name: "Stanford University",
		location: "USA",
		logo: "/universities/stanford.png",
	},
	{ name: "Yale University", location: "USA", logo: "/universities/yale.png" },
	{
		name: "Princeton University",
		location: "USA",
		logo: "/universities/princeton.png",
	},
	{
		name: "University of Oxford",
		location: "UK",
		logo: "/universities/oxford.png",
	},
	{
		name: "University of Cambridge",
		location: "UK",
		logo: "/universities/cambridge.png",
	},
	{
		name: "Imperial College London",
		location: "UK",
		logo: "/universities/imperial_college_london.png",
	},
	{
		name: "University College London",
		location: "UK",
		logo: "/universities/ucl.png",
	},
	{
		name: "King's College London",
		location: "UK",
		logo: "/universities/london.png",
	},
	{
		name: "ETH Zurich",
		location: "Switzerland",
		logo: "/universities/eth_zurich.png",
	},
	{
		name: "Technical University of Munich",
		location: "Germany",
		logo: "/universities/tu_muenchen.png",
	},
	{
		name: "National University of Singapore",
		location: "Singapore",
		logo: "/universities/nus.png",
	},
	{
		name: "Peking University",
		location: "China",
		logo: "/universities/peking.png",
	},
	{
		name: "Tsinghua University",
		location: "China",
		logo: "/universities/tshinghua.png",
	},
	{
		name: "University of Tokyo",
		location: "Japan",
		logo: "/universities/tokyo.png",
	},
	{
		name: "Seoul National University",
		location: "South Korea",
		logo: "/universities/snu.png",
	},
	{
		name: "University of Toronto",
		location: "Canada",
		logo: "/universities/toronto.png",
	},
	{
		name: "University of British Columbia",
		location: "Canada",
		logo: "/universities/ubc.png",
	},
	{
		name: "McGill University",
		location: "Canada",
		logo: "/universities/mcgill.png",
	},
	{
		name: "University of Melbourne",
		location: "Australia",
		logo: "/universities/melbourne.png",
	},
	{
		name: "University of Sydney",
		location: "Australia",
		logo: "/universities/usyd.png",
	},
];

const howItWorksSteps = [
	{
		step: 1,
		icon: Users,
		title: "Tạo hồ sơ cá nhân",
		quote: "Mình nên bắt đầu hành trình du học từ đâu?",
		description:
			"Bắt đầu bằng việc chia sẻ về nền tảng học thuật, sở thích, mục tiêu nghề nghiệp và những điều bạn mong muốn. Form thông minh của chúng tôi sẽ hướng dẫn bạn qua từng bước.",
		illustration: Users,
	},
	{
		step: 2,
		icon: Brain,
		title: "Nhận gợi ý phù hợp",
		quote: "Trường nào thực sự phù hợp với mình?",
		description:
			"AI của chúng tôi phân tích hàng ngàn trường đại học và gợi ý những trường phù hợp nhất với profile, ngân sách và nguyện vọng của bạn. Nhận điểm match và insights chi tiết cho từng gợi ý.",
		illustration: Brain,
	},
	{
		step: 3,
		icon: FileCheck,
		title: "Apply tự tin",
		quote: "Làm sao quản lý nhiều deadline và yêu cầu khác nhau?",
		description:
			"Theo dõi tất cả hồ sơ ở một nơi. Chúng tôi giúp bạn tổ chức với nhắc nhở deadline, checklist tài liệu và hướng dẫn từng bước cho yêu cầu của mỗi trường.",
		illustration: FileCheck,
	},
	{
		step: 4,
		icon: Sparkles,
		title: "Tỏa sáng với AI",
		quote: "Essay của mình có vẻ nhàm chán... làm sao để nổi bật?",
		description:
			"Sử dụng AI mentor để viết personal statement và essay ấn tượng. Nhận feedback ngay lập tức, gợi ý cải thiện và hướng dẫn thể hiện câu chuyện độc đáo mà admission sẽ nhớ mãi.",
		illustration: Sparkles,
	},
];

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

		// Use IntersectionObserver for more reliable detection
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
						setActiveStep(parseInt(stepNumber, 10));
					}
				}
			});
		};

		const observer = new IntersectionObserver(
			observerCallback,
			observerOptions,
		);

		// Setup function to observe steps
		const setupObserver = () => {
			const steps = document.querySelectorAll<HTMLDivElement>("[data-step]");
			if (steps.length > 0) {
				steps.forEach((step) => {
					observer.observe(step);
				});
				return true;
			}
			return false;
		};

		// Try to setup immediately
		if (!setupObserver()) {
			// If no steps found, retry after a short delay
			const timeoutId = setTimeout(setupObserver, 200);
			return () => {
				clearTimeout(timeoutId);
				observer.disconnect();
			};
		}

		return () => {
			observer.disconnect();
		};
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
			{/* Background gradient */}
			<motion.div
				className="absolute inset-0 opacity-5"
				animate={{
					background: `radial-gradient(circle at 50% 50%, ${currentVisual.color} 0%, transparent 70%)`,
				}}
				transition={{ duration: 0.6, ease: "easeOut" }}
			/>

			{/* Header with icon */}
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

				{/* Step indicator dots */}
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

			{/* Image Visual */}
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
	const marqueeUniversities = [
		...featuredUniversities,
		...featuredUniversities,
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="relative bg-background py-20 md:py-32 overflow-hidden">
				{/* Animated Background Pattern */}
				<div className="absolute inset-0 z-0">
					<Image
						src="/hero.png"
						alt="Hero background"
						fill
						className="object-cover opacity-15"
						priority
						quality={90}
					/>
					{/* Gradient overlay */}
					<div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
				</div>

				{/* Floating decorative elements */}
				<div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
					<motion.div
						className="absolute top-20 left-[10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl"
						animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
						transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
					/>
					<motion.div
						className="absolute bottom-20 right-[10%] w-80 h-80 bg-chart-2/10 rounded-full blur-3xl"
						animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
						transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="flex flex-col items-center gap-8">
						<SlideUp>
							<div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-4">
								<Sparkles className="w-4 h-4" />
								Virtual Mentor cho hành trình du học của bạn
							</div>
						</SlideUp>
						<SlideUp delay={0.05}>
							<h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
								Hành trình du học của bạn,
								<br />
								<span className="text-primary">có Leaply đồng hành</span>
							</h1>
						</SlideUp>
						<SlideUp delay={0.1}>
							<p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl">
								Khám phá bản thân, tìm trường phù hợp, và chuẩn bị hồ sơ ấn tượng 
								- tất cả trong một nền tảng thông minh.
							</p>
						</SlideUp>
						<SlideUp delay={0.15}>
							<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mt-4">
								<Button
									size="lg"
									className="text-lg px-8 py-6 sm:min-w-[220px] shadow-lg shadow-primary/25"
									asChild
								>
									<Link href="/signup">
										Bắt đầu miễn phí
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
										Tìm hiểu thêm
										<ChevronDown className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
						</SlideUp>

						{/* Social Proof Stats */}
						<SlideUp delay={0.2}>
							<div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-12 pt-8 border-t border-border/50">
								{stats.map((stat) => {
									const Icon = stat.icon;
									return (
										<div key={stat.label} className="flex items-center gap-3">
											<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
												<Icon className="w-5 h-5 text-primary" />
											</div>
											<div className="text-left">
												<p className="text-2xl font-bold text-foreground">{stat.value}</p>
												<p className="text-sm text-muted-foreground">{stat.label}</p>
											</div>
										</div>
									);
								})}
							</div>
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
								Kết nối bạn với trường top thế giới
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Khám phá các trường đại học hàng đầu chào đón sinh viên Leaply
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
										<span className="relative">
											Mọi thứ bạn cần
										</span>
									</span>{" "}
									cho hành trình du học
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl">
									Công cụ mạnh mẽ và hướng dẫn cá nhân hóa giúp bạn chinh phục
									giáo dục quốc tế một cách tự tin.
								</p>
							</div>
						</SlideUp>
					</div>

					<StaggerContainer>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{features.map((feature) => {
								const Icon = feature.icon;
								return (
									<StaggerItem key={feature.title}>
										<Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all duration-200 group">
											<CardContent className="p-6 flex flex-col h-full gap-4">
												<div className="p-3 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary/20 transition-colors">
													<Icon className="w-6 h-6 text-primary" />
												</div>
												<div className="flex-1">
													<h3 className="text-lg font-semibold text-foreground mb-2">
														{feature.title}
													</h3>
													<p className="text-sm text-muted-foreground leading-relaxed">
														{feature.description}
													</p>
												</div>
												<div className="mt-auto pt-4">
													<Link
														href={feature.href}
														className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
													>
														Tìm hiểu thêm
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
								Leaply hoạt động như thế nào
							</h2>
							<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
								Bốn bước đơn giản để tìm và apply vào trường đại học mơ ước
							</p>
						</SlideUp>
					</div>

					{/* Desktop: Two-column layout with sticky right side */}
					<div className="lg:grid lg:grid-cols-2 lg:gap-12 lg:items-start hidden">
						{/* Left: Scrolling Steps */}
						<div className="space-y-32 py-12">
							{howItWorksSteps.map((item) => {
								return (
									<ScrollHighlightStep key={item.step}>
										<div className="relative" data-step={item.step}>
											{/* Step number badge */}
											<div className="flex items-start gap-6 mb-6">
												<div className="shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
													{item.step}
												</div>
												<div className="flex-1 pt-2">
													<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
														{item.title}
													</h3>
												</div>
											</div>

											{/* Chat conversation */}
											<div className="space-y-4 mb-6">
												{/* User chat bubble */}
												<div className="flex justify-end gap-3">
													<div className="max-w-[85%] rounded-lg px-4 py-3 bg-primary text-primary-foreground shadow-sm">
														<p className="text-base leading-relaxed">
															{item.quote}
														</p>
													</div>
													<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
														<User className="w-5 h-5 text-background" />
													</div>
												</div>

												{/* Leaply chat bubble */}
												<div className="flex justify-start gap-3">
													<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
														<Bot className="w-5 h-5 text-primary-foreground" />
													</div>
													<div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border shadow-sm">
														<p className="text-base text-foreground leading-relaxed">
															{item.description}
														</p>
													</div>
												</div>
											</div>
										</div>
									</ScrollHighlightStep>
								);
							})}
						</div>

						{/* Right: Sticky Visual Skeleton */}
						<div className="sticky top-24 h-[600px] flex items-center justify-center">
							<ParallaxVisual />
						</div>
					</div>

					{/* Mobile: Original stacked layout */}
					<div className="lg:hidden space-y-24">
						{howItWorksSteps.map((item) => {
							return (
								<ScrollHighlightStep key={item.step}>
									<div className="relative">
										{/* Step number badge */}
										<div className="flex items-start gap-6 mb-6">
											<div className="shrink-0 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
												{item.step}
											</div>
											<div className="flex-1 pt-2">
												<h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
													{item.title}
												</h3>
											</div>
										</div>

										{/* Chat conversation */}
										<div className="space-y-4 mb-6">
											{/* User chat bubble */}
											<div className="flex justify-end gap-3">
												<div className="max-w-[85%] rounded-lg px-4 py-3 bg-primary text-primary-foreground shadow-sm">
													<p className="text-base leading-relaxed">
														{item.quote}
													</p>
												</div>
												<div className="shrink-0 w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
													<User className="w-5 h-5 text-background" />
												</div>
											</div>

											{/* Leaply chat bubble */}
											<div className="flex justify-start gap-3">
												<div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
													<Bot className="w-5 h-5 text-primary-foreground" />
												</div>
												<div className="max-w-[85%] rounded-lg px-4 py-3 bg-card border border-border shadow-sm">
													<p className="text-base text-foreground leading-relaxed">
														{item.description}
													</p>
												</div>
											</div>
										</div>
									</div>
								</ScrollHighlightStep>
							);
						})}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24 cta-pattern text-primary-foreground relative overflow-hidden">
				{/* Dimming overlay for better text readability */}
				<div className="absolute inset-0 bg-background/40 z-0" />
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
					<SlideUp>
						<div className="inline-flex items-center gap-2 bg-primary-foreground/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
							<Sparkles className="w-4 h-4" />
							Hoàn toàn miễn phí
						</div>
						<h2 className="text-3xl md:text-5xl font-bold mb-6">
							Sẵn sàng bắt đầu hành trình?
						</h2>
						<p className="text-lg md:text-xl mb-10 text-primary-foreground/90 max-w-2xl mx-auto">
							Tham gia Leaply ngay hôm nay và thực hiện bước đầu tiên 
							hướng tới giáo dục toàn cầu
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								variant="secondary"
								className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-lg px-8 py-6"
								asChild
							>
								<Link href="/signup">
									Tạo tài khoản miễn phí
									<ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary text-lg px-8 py-6"
								asChild
							>
								<Link href="/login">Đăng nhập</Link>
							</Button>
						</div>
					</SlideUp>
				</div>
			</section>
			<style jsx global>{`
        @keyframes leaply-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .marquee-track {
          width: max-content;
          animation: leaply-marquee 30s linear infinite;
        }

        .cta-pattern {
          --s: 185px; /* control the size*/
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
