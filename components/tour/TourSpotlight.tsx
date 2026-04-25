"use client";

import { m } from "framer-motion";
import { useEffect, useState } from "react";

interface TourSpotlightProps {
	targetRect: DOMRect | null;
}

const PADDING = 8;
const ROUNDED = 16;

function getWindowSize() {
	if (typeof window === "undefined") return { width: 0, height: 0 };
	return { width: window.innerWidth, height: window.innerHeight };
}

export function TourSpotlight({ targetRect }: TourSpotlightProps) {
	const [windowSize, setWindowSize] = useState(getWindowSize);

	useEffect(() => {
		const update = () => setWindowSize(getWindowSize());
		update();
		window.addEventListener("resize", update);
		return () => window.removeEventListener("resize", update);
	}, []);

	// Always render the overlay, even if target isn't found yet
	// This ensures the dark backdrop is visible immediately
	const top = targetRect
		? Math.max(0, targetRect.top - PADDING)
		: windowSize.height / 2;
	const left = targetRect
		? Math.max(0, targetRect.left - PADDING)
		: windowSize.width / 2;
	const width = targetRect ? targetRect.width + PADDING * 2 : 0;
	const height = targetRect ? targetRect.height + PADDING * 2 : 0;
	const right = left + width;
	const bottom = top + height;

	return (
		<div className="fixed inset-0 z-[60] pointer-events-auto">
			{/* Top strip */}
			<m.div
				className="absolute left-0 right-0 bg-black/50"
				initial={false}
				animate={{ height: top }}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
				style={{ top: 0 }}
			/>

			{/* Bottom strip */}
			<m.div
				className="absolute left-0 right-0 bg-black/50"
				initial={false}
				animate={{ height: Math.max(0, windowSize.height - bottom) }}
				transition={{ type: "spring", stiffness: 250, damping: 30 }}
				style={{ bottom: 0 }}
			/>

			{/* Left strip */}
			<m.div
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
			<m.div
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
			{targetRect && (
				<m.div
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
						boxShadow:
							"0 0 0 2px hsl(87.1795 52.4664% 56.2745% / 0.6), 0 0 24px 4px hsl(87.1795 52.4664% 56.2745% / 0.15)",
					}}
				/>
			)}
		</div>
	);
}
