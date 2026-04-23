"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TourSpotlightProps {
	targetRect: DOMRect | null;
}

const PADDING = 8;
const ROUNDED = 16;

export function TourSpotlight({ targetRect }: TourSpotlightProps) {
	const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const update = () =>
			setWindowSize({ width: window.innerWidth, height: window.innerHeight });
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	if (!targetRect || windowSize.width === 0) return null;

	const top = Math.max(0, targetRect.top - PADDING);
	const left = Math.max(0, targetRect.left - PADDING);
	const width = targetRect.width + PADDING * 2;
	const height = targetRect.height + PADDING * 2;
	const right = left + width;
	const bottom = top + height;

	return (
		<div className="fixed inset-0 z-[60] pointer-events-auto">
			{/* Top strip */}
			<motion.div
				className="absolute left-0 right-0 bg-black/50"
				initial={false}
				animate={{ height: top }}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
				style={{ top: 0 }}
			/>

			{/* Bottom strip */}
			<motion.div
				className="absolute left-0 right-0 bg-black/50"
				initial={false}
				animate={{ height: Math.max(0, windowSize.height - bottom) }}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
				style={{ bottom: 0 }}
			/>

			{/* Left strip */}
			<motion.div
				className="absolute bg-black/50"
				initial={false}
				animate={{
					top,
					left: 0,
					width: left,
					height: bottom - top,
				}}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
			/>

			{/* Right strip */}
			<motion.div
				className="absolute bg-black/50"
				initial={false}
				animate={{
					top,
					right: 0,
					width: Math.max(0, windowSize.width - right),
					height: bottom - top,
				}}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
			/>

			{/* Highlight border around target */}
			<motion.div
				className="absolute pointer-events-none"
				initial={false}
				animate={{
					top,
					left,
					width,
					height,
				}}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
				style={{
					borderRadius: ROUNDED,
					boxShadow: "0 0 0 2px hsl(87.1795 52.4664% 56.2745% / 0.6), 0 0 24px 4px hsl(87.1795 52.4664% 56.2745% / 0.15)",
				}}
			/>
		</div>
	);
}
