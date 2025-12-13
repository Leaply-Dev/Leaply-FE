"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SignupForm } from "@/components/signup-form";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignupPage() {
	const params = useParams();
	const locale = params.lang as "en" | "vi";

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-between items-center">
					<Link href={`/${locale}`} className="flex items-center gap-2">
						<Image
							src="/Logo.png"
							alt="Logo"
							width={120}
							height={40}
							className="h-8 w-auto"
						/>
					</Link>
					<LanguageSwitcher currentLocale={locale} />
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<SignupForm />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:flex flex-col gap-4 p-10 justify-center">
				<div className="space-y-6">
					<Skeleton className="h-12 w-3/4" />
					<Skeleton className="h-8 w-full" />
					<Skeleton className="h-8 w-5/6" />
					<div className="space-y-3 pt-6">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-4/5" />
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-3/4" />
					</div>
					<div className="space-y-3 pt-6">
						<Skeleton className="h-6 w-full" />
						<Skeleton className="h-6 w-5/6" />
						<Skeleton className="h-6 w-4/5" />
					</div>
					<div className="pt-8 flex gap-3">
						<Skeleton className="h-32 w-32 rounded-lg" />
						<Skeleton className="h-32 w-32 rounded-lg" />
						<Skeleton className="h-32 w-32 rounded-lg" />
					</div>
				</div>
			</div>
		</div>
	);
}
