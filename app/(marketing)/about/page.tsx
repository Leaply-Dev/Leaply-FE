"use client";

import {
	ArrowRight,
	Facebook,
	GraduationCap,
	Heart,
	Instagram,
	Linkedin,
	Mail,
	MapPin,
	Rocket,
	Send,
	Sparkles,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";
import { ThreadsIcon } from "@/components/icons/ThreadsIcon";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TeamMember {
	name: string;
	role: string;
	department: string;
	school: string;
	isLeader?: boolean;
}

const teamMembers: TeamMember[] = [
	// Leaders (highlighted)
	{
		name: "Phạm Phan Anh",
		role: "R&D Lead",
		department: "R&D",
		school: "HUST",
		isLeader: true,
	},
	{
		name: "Hoàng Hà Hải Anh",
		role: "Sales Lead",
		department: "Sales & Marketing",
		school: "FTU",
		isLeader: true,
	},
	{
		name: "Chu Nguyễn Xuân Mai",
		role: "Finance Lead",
		department: "Finance",
		school: "AOF",
		isLeader: true,
	},
	// Other members
	{
		name: "Nguyễn Trường Sơn",
		role: "Developer",
		department: "R&D",
		school: "HUST",
	},
	{
		name: "Nguyễn Đăng Khánh",
		role: "Developer",
		department: "R&D",
		school: "HUST",
	},
	{
		name: "Nguyễn Thị Thu Duyên",
		role: "Sales Researcher",
		department: "Sales & Marketing",
		school: "FTU",
	},
	{
		name: "Phạm Thị Phương Anh",
		role: "Legal Researcher",
		department: "Legal",
		school: "FTU",
	},
	{
		name: "Đoàn Vũ Minh Nguyệt",
		role: "Marketing Researcher",
		department: "Sales & Marketing",
		school: "FTU",
	},
];

const valueConfigs = [
	{ icon: Heart, titleKey: "value1Title", descKey: "value1Desc" },
	{ icon: Rocket, titleKey: "value2Title", descKey: "value2Desc" },
	{ icon: Users, titleKey: "value3Title", descKey: "value3Desc" },
];

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function getDepartmentColor(department: string): string {
	switch (department) {
		case "R&D":
			return "bg-blue-500";
		case "Sales & Marketing":
			return "bg-amber-500";
		case "Finance":
			return "bg-emerald-500";
		case "Legal":
			return "bg-purple-500";
		default:
			return "bg-primary";
	}
}

export default function AboutPage() {
	const t = useTranslations("about");
	const tCommon = useTranslations("common");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		setIsSubmitting(false);
		setSubmitted(true);
		setFormData({ name: "", email: "", message: "" });
	};

	return (
		<PageTransition>
			<div className="min-h-screen">
				{/* Hero Section */}
				<section className="relative bg-background py-20 md:py-28 overflow-hidden">
					<div className="absolute inset-0 pointer-events-none">
						<div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
						<div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
					</div>

					<div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<SlideUp>
							<div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
								<Sparkles className="w-4 h-4" />
								{t("badge")}
							</div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								{t("heroTitle")}
								<br />
								<span className="text-primary">{t("heroTitleHighlight")}</span>
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
								{t("heroSubtitle")}
							</p>
						</SlideUp>
					</div>
				</section>

				{/* Mission & Vision */}
				<section className="py-20 bg-muted/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="max-w-3xl mx-auto text-center mb-16">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
									{t("missionTitle")}
								</h2>
								<p className="text-lg text-muted-foreground leading-relaxed">
									{t("missionText")}
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{valueConfigs.map((value) => {
									const Icon = value.icon;
									return (
										<StaggerItem key={value.titleKey}>
											<Card className="h-full hover:shadow-lg transition-shadow border-none bg-background">
												<CardContent className="p-8 text-center">
													<div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
														<Icon className="w-8 h-8 text-primary" />
													</div>
													<h3 className="text-xl font-semibold text-foreground mb-3">
														{t(value.titleKey)}
													</h3>
													<p className="text-muted-foreground">
														{t(value.descKey)}
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

				{/* Team Section */}
				<section className="py-20 bg-background">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SlideUp>
							<div className="text-center mb-16">
								<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
									{t("teamTitle")}
								</h2>
								<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
									{t("teamSubtitle")}
								</p>
							</div>
						</SlideUp>

						<StaggerContainer>
							{/* Leaders Row */}
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
								{teamMembers
									.filter((member) => member.isLeader)
									.map((member) => (
										<StaggerItem key={member.name}>
											<Card className="h-full hover:shadow-xl transition-all hover:-translate-y-2 group border-primary/30 hover:border-primary/50">
												<CardContent className="p-8 text-center">
													<div className="relative mb-4">
														<div className="w-24 h-24 rounded-full bg-linear-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto border-3 border-primary/40 group-hover:border-primary/60 transition-colors">
															<span className="text-2xl font-bold text-primary">
																{getInitials(member.name)}
															</span>
														</div>
														<div
															className={cn(
																"absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium text-white",
																getDepartmentColor(member.department),
															)}
														>
															{member.department}
														</div>
													</div>
													<h3 className="text-lg font-semibold text-foreground mb-1">
														{member.name}
													</h3>
													<p className="text-sm text-primary font-medium mb-2">
														{member.role}
													</p>
													{member.school && (
														<div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
															<GraduationCap className="w-3 h-3" />
															{member.school}
														</div>
													)}
												</CardContent>
											</Card>
										</StaggerItem>
									))}
							</div>
							{/* Other Members Row */}
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
								{teamMembers
									.filter((member) => !member.isLeader)
									.map((member) => (
										<StaggerItem key={member.name}>
											<Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 group">
												<CardContent className="p-6 text-center">
													<div className="relative mb-4">
														<div className="w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
															<span className="text-xl font-bold text-primary">
																{getInitials(member.name)}
															</span>
														</div>
														<div
															className={cn(
																"absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-medium text-white",
																getDepartmentColor(member.department),
															)}
														>
															{member.department}
														</div>
													</div>
													<h3 className="font-semibold text-foreground mb-1">
														{member.name}
													</h3>
													<p className="text-sm text-primary font-medium mb-2">
														{member.role}
													</p>
													{member.school && (
														<div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
															<GraduationCap className="w-3 h-3" />
															{member.school}
														</div>
													)}
												</CardContent>
											</Card>
										</StaggerItem>
									))}
							</div>
						</StaggerContainer>
					</div>
				</section>

				{/* Contact Section */}
				<section className="py-20 bg-muted/50">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
							{/* Contact Info */}
							<SlideUp>
								<div>
									<h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
										{t("contactTitle")}
									</h2>
									<p className="text-lg text-muted-foreground mb-8">
										{t("contactSubtitle")}
									</p>

									<div className="space-y-6">
										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
												<Mail className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{t("email")}
												</h3>
												<a
													href="mailto:contact@leaply.ai.vn"
													className="text-muted-foreground hover:text-primary transition-colors"
												>
													contact@leaply.ai.vn
												</a>
											</div>
										</div>

										<div className="flex items-start gap-4">
											<div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
												<MapPin className="w-6 h-6 text-primary" />
											</div>
											<div>
												<h3 className="font-semibold text-foreground mb-1">
													{t("address")}
												</h3>
												<p className="text-muted-foreground">
													{tCommon("hanoi")}
												</p>
											</div>
										</div>
									</div>

									<div className="mt-10">
										<p className="text-sm font-medium text-foreground mb-4">
											{t("followUs")}
										</p>
										<div className="flex gap-3">
											<a
												href="https://www.linkedin.com/company/leaply-ai/"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
											>
												<Linkedin className="w-5 h-5" />
											</a>
											<a
												href="https://www.facebook.com/profile.php?id=61587005050437&locale=vi_VN"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
											>
												<Facebook className="w-5 h-5" />
											</a>
											<a
												href="https://www.instagram.com/leaply.ai/"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
											>
												<Instagram className="w-5 h-5" />
											</a>
											<a
												href="https://threads.net"
												target="_blank"
												rel="noopener noreferrer"
												className="w-10 h-10 bg-card border border-border rounded-lg flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
											>
												<ThreadsIcon className="w-5 h-5" />
											</a>
										</div>
									</div>
								</div>
							</SlideUp>

							{/* Contact Form */}
							<SlideUp delay={0.1}>
								<Card className="border-none shadow-lg">
									<CardContent className="p-8">
										{submitted ? (
											<div className="text-center py-12">
												<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
													<Send className="w-8 h-8 text-primary" />
												</div>
												<h3 className="text-xl font-semibold text-foreground mb-2">
													{t("formThankYou")}
												</h3>
												<p className="text-muted-foreground mb-6">
													{t("formSuccess")}
												</p>
												<Button
													variant="outline"
													onClick={() => setSubmitted(false)}
												>
													{t("formSendAnother")}
												</Button>
											</div>
										) : (
											<form onSubmit={handleSubmit} className="space-y-6">
												<div className="space-y-2">
													<Label htmlFor="name">{t("formName")}</Label>
													<Input
														id="name"
														placeholder={t("formNamePlaceholder")}
														value={formData.name}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																name: e.target.value,
															}))
														}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="email">{t("formEmail")}</Label>
													<Input
														id="email"
														type="email"
														placeholder={t("formEmailPlaceholder")}
														value={formData.email}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																email: e.target.value,
															}))
														}
														required
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="message">{t("formMessage")}</Label>
													<Textarea
														id="message"
														placeholder={t("formMessagePlaceholder")}
														rows={5}
														value={formData.message}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																message: e.target.value,
															}))
														}
														required
													/>
												</div>
												<Button
													type="submit"
													className="w-full"
													disabled={isSubmitting}
												>
													{isSubmitting ? (
														t("formSubmitting")
													) : (
														<>
															{t("formSubmit")}
															<Send className="ml-2 w-4 h-4" />
														</>
													)}
												</Button>
											</form>
										)}
									</CardContent>
								</Card>
							</SlideUp>
						</div>
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
							<Button
								size="lg"
								variant="secondary"
								className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold"
								asChild
							>
								<Link href="/register">
									{t("ctaButton")}
									<ArrowRight className="ml-2 w-5 h-5" />
								</Link>
							</Button>
						</SlideUp>
					</div>
				</section>
			</div>
		</PageTransition>
	);
}
