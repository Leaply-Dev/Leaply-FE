import { GalleryVerticalEnd } from "lucide-react";

import { SignupForm } from "@/components/signup-form";
import Link from "next/link";
import Image from "next/image";
export default function SignupPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Link
					href="/"
					className="flex items-center gap-2 self-center font-medium"
				>
					<Image
						src="/Logo.png"
						alt="Logo"
						width={120}
						height={40}
						className="h-10 w-auto"
					/>
				</Link>
				<SignupForm />
			</div>
		</div>
	);
}
