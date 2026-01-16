"use client";

import { ChevronDown, LogOut, Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { performLogout } from "@/lib/auth/logout";
import { useMounted } from "@/lib/hooks/useMounted";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function Navbar() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const mounted = useMounted();

	// Read auth state directly from store
	// Use selector to subscribe to specific fields for optimal re-renders
	const isAuthenticated = useUserStore((state) => state.isAuthenticated);
	const profile = useUserStore((state) => state.profile);

	// Only use auth state after mount to avoid hydration mismatch
	// Before mount, default to unauthenticated state
	const showAuthUI = mounted && isAuthenticated;

	// Helper to get translation
	const t = useTranslations("nav");

	// Nav links with translations
	const publicNavLinks = [
		{ href: "/", labelKey: "home" },
		{ href: "/features", labelKey: "features" },
		{ href: "/about", labelKey: "about" },
	];

	const authNavLinks = [
		{ href: "/dashboard", labelKey: "home" },
		{ href: "/explore", labelKey: "explore" },
		{ href: "/dashboard/applications", labelKey: "applications" },
		{ href: "/persona-lab", labelKey: "personaLab" },
	];

	// Get nav links based on auth state
	const navLinks = showAuthUI ? authNavLinks : publicNavLinks;

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setAvatarDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Get user initials for avatar
	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Handle logout - call backend to clear httpOnly cookies, then use performLogout
	const handleLogout = async () => {
		try {
			// Clear httpOnly cookies via backend (for OAuth)
			await fetch(`${API_URL}/v1/oauth/logout`, {
				method: "POST",
				credentials: "include",
			});
		} catch (error) {
			console.error("Logout API error:", error);
		} finally {
			// Use synchronous logout utility to prevent race conditions
			performLogout({ redirect: "/" });
		}
	};

	return (
		<nav className="bg-card border-b border-border fixed top-0 left-0 right-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link
						href={showAuthUI ? "/dashboard" : "/"}
						className="flex items-center gap-2"
					>
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
								link.href === "/" || link.href === "/dashboard"
									? pathname === link.href
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
									{t(link.labelKey)}
								</Link>
							);
						})}
					</div>

					{/* Auth Buttons / Avatar + Language Switcher */}
					<div className="hidden md:flex items-center gap-3">
						<LanguageSwitcher />

						{showAuthUI ? (
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
									className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
								>
									<Avatar className="w-8 h-8 border-2 border-primary/20">
										<AvatarImage
											src={profile?.profilePicture}
											alt={profile?.fullName}
										/>
										<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
											{getInitials(profile?.fullName)}
										</AvatarFallback>
									</Avatar>
									<ChevronDown
										className={cn(
											"w-4 h-4 text-muted-foreground transition-transform",
											avatarDropdownOpen && "rotate-180",
										)}
									/>
								</button>

								{/* Avatar Dropdown */}
								{avatarDropdownOpen && (
									<div className="absolute right-0 mt-2 w-56 bg-card rounded-lg border border-border shadow-lg py-2 z-50">
										<div className="px-4 py-2 border-b border-border">
											<p className="text-sm font-medium text-foreground truncate">
												{profile?.fullName || "User"}
											</p>
											<p className="text-xs text-muted-foreground truncate">
												{profile?.email}
											</p>
										</div>
										<div className="py-1">
											<Link
												href="/dashboard/profile"
												className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
												onClick={() => setAvatarDropdownOpen(false)}
											>
												<User className="w-4 h-4" />
												{t("profile")}
											</Link>
											<button
												type="button"
												onClick={() => {
													setAvatarDropdownOpen(false);
													handleLogout();
												}}
												className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
											>
												<LogOut className="w-4 h-4" />
												{t("logout")}
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<Button variant="ghost" size="sm" asChild>
									<Link href="/login">{t("login")}</Link>
								</Button>
								<Button size="sm" asChild>
									<Link href="/register">{t("getStarted")}</Link>
								</Button>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="flex items-center gap-2 md:hidden">
						<LanguageSwitcher />
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
									link.href === "/" || link.href === "/dashboard"
										? pathname === link.href
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
										{t(link.labelKey)}
									</Link>
								);
							})}
							<div className="pt-4 border-t border-border flex flex-col gap-2">
								{showAuthUI ? (
									<>
										<div className="flex items-center gap-3 px-1 py-2">
											<Avatar className="w-8 h-8 border-2 border-primary/20">
												<AvatarImage
													src={profile?.profilePicture}
													alt={profile?.fullName}
												/>
												<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
													{getInitials(profile?.fullName)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1 min-w-0">
												<p className="text-sm font-medium text-foreground truncate">
													{profile?.fullName || "User"}
												</p>
												<p className="text-xs text-muted-foreground truncate">
													{profile?.email}
												</p>
											</div>
										</div>
										<Button variant="outline" type="button" size="sm" asChild>
											<Link
												href="/dashboard/profile"
												onClick={() => setMobileMenuOpen(false)}
											>
												<User className="w-4 h-4 mr-2" />
												{t("profile")}
											</Link>
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												setMobileMenuOpen(false);
												handleLogout();
											}}
										>
											<LogOut className="w-4 h-4 mr-2" />
											{t("logout")}
										</Button>
									</>
								) : (
									<>
										<Button variant="outline" size="sm" asChild>
											<Link
												href="/login"
												onClick={() => setMobileMenuOpen(false)}
											>
												{t("login")}
											</Link>
										</Button>
										<Button size="sm" asChild>
											<Link
												href="/register"
												onClick={() => setMobileMenuOpen(false)}
											>
												{t("getStarted")}
											</Link>
										</Button>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</nav>
	);
}
