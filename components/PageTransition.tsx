"use client";

import { type HTMLMotionProps, m } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps extends Omit<HTMLMotionProps<"div">, "children"> {
	children: ReactNode;
}

export function PageTransition({ children, ...props }: PageTransitionProps) {
	return (
		<m.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.3, ease: "easeOut" }}
			{...props}
		>
			{children}
		</m.div>
	);
}

export function FadeIn({ children, ...props }: PageTransitionProps) {
	return (
		<m.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			{...props}
		>
			{children}
		</m.div>
	);
}

export function SlideUp({
	children,
	delay = 0,
	...props
}: PageTransitionProps & { delay?: number }) {
	return (
		<m.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut", delay }}
			{...props}
		>
			{children}
		</m.div>
	);
}

export function StaggerContainer({ children, ...props }: PageTransitionProps) {
	return (
		<m.div
			initial="hidden"
			animate="visible"
			variants={{
				hidden: { opacity: 0 },
				visible: {
					opacity: 1,
					transition: {
						staggerChildren: 0.1,
					},
				},
			}}
			{...props}
		>
			{children}
		</m.div>
	);
}

export function StaggerItem({ children, ...props }: PageTransitionProps) {
	return (
		<m.div
			variants={{
				hidden: { opacity: 0, y: 20 },
				visible: { opacity: 1, y: 0 },
			}}
			{...props}
		>
			{children}
		</m.div>
	);
}
