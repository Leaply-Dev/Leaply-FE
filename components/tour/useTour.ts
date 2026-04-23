"use client";

import { useTourStore } from "@/lib/store/tourStore";

export function useTour() {
	const isActive = useTourStore((s) => s.isActive);
	const start = useTourStore((s) => s.start);
	const skip = useTourStore((s) => s.skip);
	const restart = useTourStore((s) => s.restart);

	return {
		isActive,
		start,
		skip,
		restart,
	};
}
