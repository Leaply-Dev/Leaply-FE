/**
 * Parts Configuration for Guided Persona Lab Flow
 *
 * Defines the 4 parts of the guided conversation:
 * - Part 1: Characteristics (who you are)
 * - Part 2: Past (where you came from)
 * - Part 3: Present (what you're doing now)
 * - Part 4: Future (where you're going)
 */

export type PartStatus = "not_started" | "in_progress" | "done";

export interface PartConfig {
	name: string;
	nameVi: string;
	description: string;
	descriptionVi: string;
	color: string;
	icon: string; // Lucide icon name
}

export interface PartsProgress {
	part1: PartStatus;
	part2: PartStatus;
	part3: PartStatus;
	part4: PartStatus;
}

export type PartKey = keyof PartsProgress;

export const PARTS_CONFIG: Record<PartKey, PartConfig> = {
	part1: {
		name: "Characteristics",
		nameVi: "Đặc điểm",
		description: "Who you are at your core",
		descriptionVi: "Bạn là ai ở bản chất",
		color: "#8B5CF6", // violet-500
		icon: "Fingerprint",
	},
	part2: {
		name: "Past",
		nameVi: "Quá khứ",
		description: "Key experiences that shaped you",
		descriptionVi: "Những trải nghiệm quan trọng đã định hình bạn",
		color: "#3B82F6", // blue-500
		icon: "History",
	},
	part3: {
		name: "Present",
		nameVi: "Hiện tại",
		description: "What drives you today",
		descriptionVi: "Điều gì thúc đẩy bạn hôm nay",
		color: "#10B981", // emerald-500
		icon: "Focus",
	},
	part4: {
		name: "Future",
		nameVi: "Tương lai",
		description: "Where you're headed",
		descriptionVi: "Bạn đang hướng đến đâu",
		color: "#F59E0B", // amber-500
		icon: "Rocket",
	},
} as const;

/**
 * Part keys in order
 */
export const PART_KEYS: PartKey[] = ["part1", "part2", "part3", "part4"];

/**
 * Get the number of completed parts
 */
export function getCompletedPartsCount(progress: PartsProgress): number {
	return PART_KEYS.filter((key) => progress[key] === "done").length;
}

/**
 * Get the current part being worked on
 */
export function getCurrentPart(progress: PartsProgress): PartKey | null {
	return PART_KEYS.find((key) => progress[key] === "in_progress") ?? null;
}

/**
 * Check if all parts are complete
 */
export function areAllPartsComplete(progress: PartsProgress): boolean {
	return PART_KEYS.every((key) => progress[key] === "done");
}

/**
 * Get next incomplete part
 */
export function getNextIncompletePart(progress: PartsProgress): PartKey | null {
	return (
		PART_KEYS.find(
			(key) =>
				progress[key] === "not_started" || progress[key] === "in_progress",
		) ?? null
	);
}

/**
 * Default empty parts progress
 */
export const DEFAULT_PARTS_PROGRESS: PartsProgress = {
	part1: "not_started",
	part2: "not_started",
	part3: "not_started",
	part4: "not_started",
};
