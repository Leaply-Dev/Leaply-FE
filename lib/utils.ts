import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** API tags often use snake_case; show Title Case words for UI labels. */
export function formatTagLabel(tag: string): string {
	if (!tag) return tag;
	return tag
		.split("_")
		.filter((part) => part.length > 0)
		.map((part) => {
			const lower = part.toLowerCase();
			return lower.charAt(0).toUpperCase() + lower.slice(1);
		})
		.join(" ");
}
