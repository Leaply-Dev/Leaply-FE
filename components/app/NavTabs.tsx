"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMounted } from "@/lib/hooks/useMounted";
import { cn } from "@/lib/utils";

export interface NavTab {
	href: string;
	labelKey: string;
}

interface NavTabsProps {
	tabs?: NavTab[];
	className?: string;
	mobile?: boolean;
	onClick?: () => void;
}

const DEFAULT_TABS: NavTab[] = [
	{ href: "/explore", labelKey: "explore" },
	{ href: "/persona-labs", labelKey: "personaLabs" },
	{ href: "/strategy", labelKey: "strategy" },
];

export function NavTabs({
	tabs = DEFAULT_TABS,
	className,
	mobile,
	onClick,
}: NavTabsProps) {
	const pathname = usePathname();
	const mounted = useMounted();
	const t = useTranslations("nav");

	return (
		<div
			className={cn(
				mobile ? "flex flex-col gap-2" : "hidden md:flex items-center gap-1",
				className,
			)}
		>
			{tabs.map((tab) => {
				const isActive =
					tab.href === "/"
						? pathname === tab.href
						: pathname === tab.href || pathname?.startsWith(`${tab.href}/`);
				return (
					<Link
						key={tab.href}
						href={tab.href}
						onClick={onClick}
						className={cn(
							"relative px-3 py-2 text-sm font-medium transition-colors rounded-md",
							mobile
								? isActive
									? "text-primary bg-primary/10"
									: "text-foreground hover:bg-muted"
								: "text-foreground hover:text-primary",
						)}
					>
						{t(tab.labelKey)}
						{!mobile && mounted && isActive && (
							<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
						)}
					</Link>
				);
			})}
		</div>
	);
}
