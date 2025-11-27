"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store/userStore";
import { cn } from "@/lib/utils";

// Before Login (Public)
const publicNavLinks = [
	{ href: "/", label: "Home" },
	{ href: "/features", label: "Features" },
	{ href: "/about", label: "About" },
];

// After Login (Authenticated)
const authNavLinks = [
	{ href: "/home", label: "Home" },
	{ href: "/universities", label: "Explore" },
	{ href: "/dashboard/applications", label: "Applications" },
	{ href: "/persona-lab", label: "Persona Lab" },
];

export function Navbar() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { isAuthenticated, profile, logout } = useUserStore();

	// Get nav links based on auth state
	const navLinks = isAuthenticated ? authNavLinks : publicNavLinks;

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

	return (
		<nav className="bg-card border-b border-border sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<Link href={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2">
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
							const isActive = link.href === "/" 
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
									{link.label}
								</Link>
							);
						})}
					</div>

					{/* Auth Buttons / Avatar */}
					<div className="hidden md:flex items-center gap-3">
						{isAuthenticated ? (
							<div className="relative" ref={dropdownRef}>
								<button
									type="button"
									onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
									className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors"
								>
									<Avatar className="w-8 h-8 border-2 border-primary/20">
										<AvatarImage src={profile?.profilePicture} alt={profile?.fullName} />
										<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
											{getInitials(profile?.fullName)}
										</AvatarFallback>
									</Avatar>
									<ChevronDown className={cn(
										"w-4 h-4 text-muted-foreground transition-transform",
										avatarDropdownOpen && "rotate-180"
									)} />
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
												Profile
											</Link>
											<button
												type="button"
												onClick={() => {
													logout();
													setAvatarDropdownOpen(false);
												}}
												className="flex items-center gap-2 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
											>
												<LogOut className="w-4 h-4" />
												Logout
											</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<>
								<Button variant="ghost" size="sm" asChild>
									<Link href="/login">Login</Link>
								</Button>
								<Button size="sm" asChild>
									<Link href="/signup">Get Started</Link>
								</Button>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						type="button"
						className="md:hidden p-2 text-foreground"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<X className="w-6 h-6" />
						) : (
							<Menu className="w-6 h-6" />
						)}
					</button>
				</div>

				{/* Mobile Menu */}
				{mobileMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<div className="flex flex-col gap-4">
							{navLinks.map((link) => {
								const isActive = link.href === "/" 
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
										{link.label}
									</Link>
								);
							})}
							<div className="pt-4 border-t border-border flex flex-col gap-2">
								{isAuthenticated ? (
									<>
										<div className="flex items-center gap-3 px-1 py-2">
											<Avatar className="w-8 h-8 border-2 border-primary/20">
												<AvatarImage src={profile?.profilePicture} alt={profile?.fullName} />
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
											<Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)}>
												<User className="w-4 h-4 mr-2" />
												Profile
											</Link>
										</Button>
										<Button variant="ghost" size="sm" onClick={() => {
											logout();
											setMobileMenuOpen(false);
										}}>
											<LogOut className="w-4 h-4 mr-2" />
											Logout
										</Button>
									</>
								) : (
									<>
										<Button variant="outline" size="sm" asChild>
											<Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
										</Button>
										<Button size="sm" asChild>
											<Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
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
