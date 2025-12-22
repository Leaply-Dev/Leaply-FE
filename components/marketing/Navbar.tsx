"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/app/[lang]/dictionaries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Dictionary = Record<string, any>;

interface NavbarProps {
	locale: Locale;
	translations: Dictionary;
}

export function Navbar({ locale, translations }: NavbarProps) {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Helper to get translation
	const t = (section: string, key: string) => {
		return translations[section]?.[key] || key;
	};

	// Nav links with translations
	const navLinks = [
		{ href: "/", labelKey: "home" },
		{ href: "/features", labelKey: "features" },
		{ href: "/about", labelKey: "about" },
	];

	return (
		<nav className="bg-card border-b border-border sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center gap-6">
						{navLinks.map((link) => {
							const isActive =
								link.href === "/"
									? pathname === "/"
									: pathname === link.href || pathname?.startsWith(link.href);
							return (
								<Link
									key={link.href}
									href={link.href}
									className={cn(
										"text-sm font-medium transition-colors hover:text-primary",
										isActive ? "text-primary" : "text-foreground",
									)}
								>
									{t("nav", link.labelKey)}
								</Link>
							);
						})}
					</div>

					{/* Language Switcher + CTA Button */}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher currentLocale={locale} />
						<Button size="sm" asChild>
							<Link href="/register">{t("landing", "ctaStart")}</Link>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher currentLocale={locale} />
						<button
							type="button"
							className="p-2 text-foreground"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => {
								const isActive =
									link.href === "/"
										? pathname === "/"
										: pathname === link.href || pathname?.startsWith(link.href);
								return (
									<Link
										key={link.href}
										href={link.href}
										className={cn(
											"text-sm font-medium",
											isActive ? "text-primary" : "text-foreground",
										)}
										onClick={() => setMobileMenuOpen(false)}
									>
										{t("nav", link.labelKey)}
									</Link>
								);
							})}
							<div className="pt-4 border-t border-border">
								<Button size="sm" className="w-full" asChild>
									<Link
										href="/register"
										onClick={() => setMobileMenuOpen(false)}
									>
										{t("landing", "ctaStart")}
									</Link>
								</Button>
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
