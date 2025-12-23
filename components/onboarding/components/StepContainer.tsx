"use client";

import { motion } from "framer-motion";
import { FieldGroup } from "@/components/ui/field";

interface StepContainerProps {
	stepKey: string;
	title: string;
	subtitle: string;
	children: React.ReactNode;
	variant?: "card" | "plain";
}

export function StepContainer({
	stepKey,
	title,
	subtitle,
	children,
	variant = "card",
}: StepContainerProps) {
	return (
		<motion.div
			key={stepKey}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: -20 }}
			className="w-full space-y-8"
		>
			<div className="text-center space-y-2">
				<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
				<p className="text-muted-foreground text-lg">{subtitle}</p>
			</div>

			{variant === "card" ? (
				<FieldGroup className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
					{children}
				</FieldGroup>
			) : (
				children
			)}
		</motion.div>
	);
}
