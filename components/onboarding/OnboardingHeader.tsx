"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface OnboardingHeaderProps {
	lang: string;
}

export function OnboardingHeader({ lang }: OnboardingHeaderProps) {
	return (
		<div className="w-full border-b border-border">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
				<div className="flex items-center justify-between">
					<Link href={`/${lang}`} className="flex items-center">
						<Image
							src="/Logo.png"
							alt="Leaply"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>
					<LanguageSwitcher currentLocale={lang as "en" | "vi"} />
				</div>
			</div>
		</div>
	);
}
