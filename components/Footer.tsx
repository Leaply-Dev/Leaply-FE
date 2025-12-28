"use client";

import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const socialLinks = [
	{ icon: Facebook, href: "#", label: "Facebook" },
	{ icon: Twitter, href: "#", label: "Twitter" },
	{ icon: Instagram, href: "#", label: "Instagram" },
	{ icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
	const t = useTranslations("footer");

	const footerLinks = {
		[t("categories.product")]: [
			{ label: t("links.exploreUniversities"), href: "/explore" },
			{ label: t("links.personaLab"), href: "/persona-lab" },
			{ label: t("links.aiAssistant"), href: "/chatbot" },
			{ label: t("links.dashboard"), href: "/dashboard" },
		],
		[t("categories.resources")]: [
			{ label: t("links.applicationGuide"), href: "/dashboard/resources" },
			{ label: t("links.scholarships"), href: "/dashboard/resources" },
			{ label: t("links.faqs"), href: "#" },
		],
		[t("categories.company")]: [
			{ label: t("links.aboutUs"), href: "/about" },
			{ label: t("links.contact"), href: "/about#contact" },
			{ label: t("links.privacyPolicy"), href: "/privacy" },
			{ label: t("links.termsOfService"), href: "/tos" },
		],
	};

	return (
		<footer className="bg-foreground text-background mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
					{/* Logo and Description */}
					<div className="lg:col-span-2">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto mb-4 brightness-0 invert"
						/>
						<p className="text-sm text-gray-300 mb-4">{t("description")}</p>
						<div className="flex items-center gap-4">
							{socialLinks.map((social) => {
								const Icon = social.icon;
								return (
									<a
										key={social.label}
										href={social.href}
										aria-label={social.label}
										className="text-gray-400 hover:text-primary transition-colors"
									>
										<Icon className="w-5 h-5" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Footer Links */}
					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<h3 className="font-semibold text-background mb-4">{category}</h3>
							<ul className="space-y-2">
								{links.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="text-sm text-gray-300 hover:text-primary transition-colors"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-gray-700">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-sm text-gray-400">
							{t("copyright", { year: new Date().getFullYear() })}
						</p>
						<div className="flex items-center gap-2 text-sm text-gray-400">
							<Mail className="w-4 h-4" />
							<a
								href="mailto:support@leaply.ai.vn"
								className="hover:text-primary transition-colors"
							>
								support@leaply.ai.vn
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
