import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { Skeleton } from "@/components/ui/skeleton";

function LoginFormSkeleton() {
	return (
		<div className="space-y-4">
			<Skeleton className="h-20 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
			<Skeleton className="h-10 w-full" />
		</div>
	);
}

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image
						src="/Logo.png"
						alt="Leaply"
						width={120}
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
				<Suspense fallback={<LoginFormSkeleton />}>
					<LoginForm />
				</Suspense>
			</div>
		</div>
	);
}
