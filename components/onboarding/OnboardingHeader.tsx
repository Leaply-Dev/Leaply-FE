"use client";

import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/app/LanguageSwitcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { performLogout } from "@/lib/auth/logout";
import { useUserStore } from "@/lib/store/userStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export function OnboardingHeader() {
	const t = useTranslations("nav");
	const { profile } = useUserStore();
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

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

	const getInitials = (name?: string) => {
		if (!name) return "U";
		const parts = name.trim().split(" ");
		if (parts.length >= 2) {
			return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
		}
		return name.slice(0, 2).toUpperCase();
	};

	// Get avatar source
	const getAvatarSrc = (avatarNum: number | null | undefined) => {
		if (!avatarNum || avatarNum < 1 || avatarNum > 9) return null;
		return `/avatar/${avatarNum}.png`;
	};

	return (
		<div className="w-full border-b border-border">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
				<div className="flex items-center justify-between">
					<Link href="/" className="flex items-center">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>
					<div className="flex items-center gap-3">
						<LanguageSwitcher />
						{/* Avatar dropdown with logout */}
						<div className="relative" ref={dropdownRef}>
							<button
								type="button"
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="flex items-center focus:outline-none"
								aria-label="User menu"
							>
								<Avatar className="h-9 w-9 cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all">
									<AvatarImage
										src={
											getAvatarSrc(profile?.avatarNum) ||
											profile?.profilePicture
										}
										alt={profile?.fullName || "User"}
									/>
									<AvatarFallback className="bg-primary/10 text-primary font-medium">
										{getInitials(profile?.fullName)}
									</AvatarFallback>
								</Avatar>
							</button>
							{dropdownOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
									<button
										type="button"
										onClick={handleLogout}
										className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-muted transition-colors"
									>
										<LogOut className="w-4 h-4" />
										{t("logout")}
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
