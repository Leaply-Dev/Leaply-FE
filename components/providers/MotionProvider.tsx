"use client";

import { domAnimation, LazyMotion } from "framer-motion";

interface MotionProviderProps {
	children: React.ReactNode;
}

export function MotionProvider({ children }: MotionProviderProps) {
	return (
		<LazyMotion features={domAnimation} strict>
			{children}
		</LazyMotion>
	);
}
