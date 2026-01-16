"use client";

import { GraduationCap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNavItems = [
	{
		title: "Academic Info",
		href: "/dashboard/profile",
		icon: GraduationCap,
		description: "Education, GPA, test scores",
	},
	{
		title: "Study Goals",
		href: "/dashboard/profile/goals",
		icon: Sparkles,
		description: "Fields, regions, budget",
	},
	{
		title: "Account & Security",
		href: "/dashboard/profile/security",
		icon: Shield,
		description: "Password, sessions, privacy",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
	const pathname = usePathname();

	return (
		<div className="flex flex-col lg:flex-row gap-8">
			{/* Sidebar Navigation */}
			<aside className="w-full lg:w-64 shrink-0">
				<nav className="space-y-1">
					{settingsNavItems.map((item) => {
						const isActive =
							pathname === item.href ||
							(item.href !== "/dashboard/profile" &&
								pathname.startsWith(item.href));
						const Icon = item.icon;

						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex items-start gap-3 rounded-lg px-3 py-3 text-sm transition-colors",
									isActive
										? "bg-primary/10 text-primary"
										: "text-muted-foreground hover:bg-muted hover:text-foreground",
								)}
							>
								<Icon
									className={cn(
										"h-5 w-5 shrink-0 mt-0.5",
										isActive ? "text-primary" : "text-muted-foreground",
									)}
								/>
								<div className="flex flex-col">
									<span
										className={cn("font-medium", isActive && "text-primary")}
									>
										{item.title}
									</span>
									<span className="text-xs text-muted-foreground">
										{item.description}
									</span>
								</div>
							</Link>
						);
					})}
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-1 min-w-0">{children}</main>
		</div>
	);
}
