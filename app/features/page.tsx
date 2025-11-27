"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowRight,
	Globe,
	Search,
	Filter,
	Star,
	FileText,
	Calendar,
	Bell,
	CheckSquare,
	Sparkles,
	MessageSquare,
	Lightbulb,
	PenTool,
	Target,
	Users,
	TrendingUp,
	Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { cn } from "@/lib/utils";

interface Feature {
	id: string;
	title: string;
	tagline: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	color: string;
	benefits: {
		icon: React.ComponentType<{ className?: string }>;
		title: string;
		description: string;
	}[];
	imagePath: string;
}

const features: Feature[] = [
	{
		id: "explore",
		title: "Explore",
		tagline: "Tìm trường phù hợp với bạn",
		description:
			"Khám phá hơn 1,500 trường đại học trên toàn thế giới với công cụ tìm kiếm thông minh. AI của chúng tôi phân tích profile của bạn và gợi ý những trường phù hợp nhất.",
		icon: Globe,
		color: "bg-blue-500",
		benefits: [
			{
				icon: Search,
				title: "Tìm kiếm thông minh",
				description:
					"Lọc theo quốc gia, ngành học, học phí, xếp hạng và nhiều tiêu chí khác",
			},
			{
				icon: Target,
				title: "AI Matching",
				description:
					"Nhận điểm match cá nhân hóa dựa trên profile học thuật và sở thích của bạn",
			},
			{
				icon: Star,
				title: "So sánh trường",
				description:
					"Đặt các trường cạnh nhau để so sánh chi tiết về chương trình và yêu cầu",
			},
		],
		imagePath: "/features/explore-preview.png",
	},
	{
		id: "applications",
		title: "Applications",
		tagline: "Quản lý hồ sơ, không lo deadline",
		description:
			"Theo dõi tất cả hồ sơ apply ở một nơi. Nhận nhắc nhở deadline, quản lý tài liệu và giữ mọi thứ ngăn nắp trong suốt hành trình.",
		icon: FileText,
		color: "bg-amber-500",
		benefits: [
			{
				icon: Calendar,
				title: "Timeline trực quan",
				description:
					"Xem toàn bộ lịch trình apply với các mốc quan trọng rõ ràng",
			},
			{
				icon: Bell,
				title: "Nhắc nhở thông minh",
				description:
					"Không bao giờ bỏ lỡ deadline với thông báo tự động trước các mốc quan trọng",
			},
			{
				icon: CheckSquare,
				title: "Checklist tài liệu",
				description:
					"Danh sách đầy đủ các tài liệu cần thiết cho từng trường, theo dõi tiến độ hoàn thành",
			},
		],
		imagePath: "/features/applications-preview.png",
	},
	{
		id: "persona-lab",
		title: "Persona Lab",
		tagline: "Khám phá bản thân, viết essay ấn tượng",
		description:
			"Workspace đặc biệt giúp bạn khám phá điểm mạnh, xây dựng câu chuyện cá nhân và viết essay nổi bật với sự hỗ trợ của AI mentor.",
		icon: Sparkles,
		color: "bg-primary",
		benefits: [
			{
				icon: Lightbulb,
				title: "Discovery Tracks",
				description:
					"4 chủ đề khám phá bản thân giúp bạn hiểu rõ điểm mạnh và câu chuyện độc đáo",
			},
			{
				icon: PenTool,
				title: "Essay Workspace",
				description:
					"Viết và chỉnh sửa essay với gợi ý thông minh từ AI, phù hợp với từng trường",
			},
			{
				icon: MessageSquare,
				title: "Mentor Feedback",
				description:
					"Nhận phản hồi chi tiết về essay với quan sát và gợi ý cải thiện cụ thể",
			},
		],
		imagePath: "/features/persona-lab-preview.png",
	},
];

const additionalBenefits = [
	{
		icon: Shield,
		title: "Bảo mật dữ liệu",
		description: "Thông tin của bạn được mã hóa và bảo vệ an toàn",
	},
	{
		icon: Users,
		title: "Cộng đồng hỗ trợ",
		description: "Kết nối với alumni và học sinh đang du học",
	},
	{
		icon: TrendingUp,
		title: "Cập nhật liên tục",
		description: "Dữ liệu trường và yêu cầu luôn được cập nhật mới nhất",
	},
];

function FeatureSection({
	feature,
	index,
}: {
	feature: Feature;
	index: number;
}) {
	const isEven = index % 2 === 0;
	const Icon = feature.icon;

	return (
		<section
			id={feature.id}
			className={cn(
				"py-20 scroll-mt-20",
				isEven ? "bg-background" : "bg-muted/50"
			)}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div
					className={cn(
						"grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center",
						!isEven && "lg:grid-flow-dense"
					)}
				>
					{/* Content */}
					<div className={cn(!isEven && "lg:col-start-2")}>
						<SlideUp>
							<div
								className={cn(
									"inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6",
									feature.color,
									"text-white"
								)}
							>
								<Icon className="w-4 h-4" />
								{feature.title}
							</div>
							<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
								{feature.tagline}
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								{feature.description}
							</p>

							<div className="space-y-6">
								{feature.benefits.map((benefit) => {
									const BenefitIcon = benefit.icon;
									return (
										<div key={benefit.title} className="flex gap-4">
											<div
												className={cn(
													"w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
													feature.color + "/10"
												)}
											>
												<BenefitIcon
													className={cn(
														"w-6 h-6",
														feature.id === "explore" && "text-blue-500",
														feature.id === "applications" && "text-amber-500",
														feature.id === "persona-lab" && "text-primary"
													)}
												/>
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{benefit.title}
												</h3>
												<p className="text-muted-foreground text-sm">
													{benefit.description}
												</p>
											</div>
										</div>
									);
								})}
							</div>

							<div className="mt-10">
								<Button size="lg" asChild>
									<Link href="/signup">
										Bắt đầu sử dụng
										<ArrowRight className="ml-2 w-5 h-5" />
									</Link>
								</Button>
							</div>
						</SlideUp>
					</div>

					{/* Visual */}
					<div className={cn(!isEven && "lg:col-start-1")}>
						<SlideUp delay={0.1}>
							<div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 border border-border shadow-xl">
								{/* Placeholder for feature preview image */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center p-8">
										<div
											className={cn(
												"w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4",
												feature.color + "/20"
											)}
										>
											<Icon
												className={cn(
													"w-10 h-10",
													feature.id === "explore" && "text-blue-500",
													feature.id === "applications" && "text-amber-500",
													feature.id === "persona-lab" && "text-primary"
												)}
											/>
										</div>
										<p className="text-muted-foreground text-sm">
											{feature.title} Preview
										</p>
									</div>
								</div>
								{/* Uncomment when images are available */}
								{/* <Image
									src={feature.imagePath}
									alt={`${feature.title} preview`}
									fill
									className="object-cover"
								/> */}
							</div>
						</SlideUp>
					</div>
				</div>
			</div>
		</section>
	);
}

export default function FeaturesPage() {
	return (
		<PageTransition>
			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="relative bg-background py-20 md:py-28 overflow-hidden">
					{/* Background decoration */}
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
						<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
					</div>

					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								Tính năng mạnh mẽ cho
								<br />
								<span className="text-primary">hành trình du học</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
								Leaply cung cấp đầy đủ công cụ bạn cần - từ tìm trường, quản lý
								hồ sơ đến viết essay ấn tượng.
							</p>
							<div className="flex flex-wrap justify-center gap-4">
								{features.map((feature) => {
									const Icon = feature.icon;
									return (
										<Link
											key={feature.id}
											href={`#${feature.id}`}
											className={cn(
												"inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border",
												"hover:border-primary hover:bg-primary/5 transition-colors"
											)}
										>
											<Icon className="w-4 h-4 text-primary" />
											<span className="text-sm font-medium">
												{feature.title}
											</span>
										</Link>
									);
								})}
							</div>
						</SlideUp>
					</div>
				</section>

				{/* Feature Sections */}
				{features.map((feature, index) => (
					<FeatureSection key={feature.id} feature={feature} index={index} />
				))}

				{/* Additional Benefits */}
				<section className="py-20 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="text-center mb-12">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
									Và nhiều hơn nữa
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
									Leaply được xây dựng để hỗ trợ bạn toàn diện
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{additionalBenefits.map((benefit) => {
									const Icon = benefit.icon;
									return (
										<StaggerItem key={benefit.title}>
											<Card className="h-full text-center hover:shadow-lg transition-shadow">
												<CardContent className="p-8">
													<div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
														<Icon className="w-7 h-7 text-primary" />
													</div>
													<h3 className="text-lg font-semibold text-foreground mb-2">
														{benefit.title}
													</h3>
													<p className="text-muted-foreground text-sm">
														{benefit.description}
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
								Sẵn sàng trải nghiệm?
							</h2>
							<p className="text-lg text-primary-foreground/90 mb-8 max-w-xl mx-auto">
								Tạo tài khoản miễn phí và bắt đầu khám phá ngay hôm nay
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button
									size="lg"
									variant="secondary"
									className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
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
									className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
									asChild
								>
									<Link href="/about">Về chúng tôi</Link>
								</Button>
							</div>
						</SlideUp>
					</div>
				</section>
			</div>
		</PageTransition>
	);
}

