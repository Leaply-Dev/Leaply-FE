// Archetype Definitions - Must match backend exactly
// 8 archetypes that LLM selects based on completed tracks

import type { ArchetypeDefinition, ArchetypeType } from "@/lib/types/persona";

export const ARCHETYPES: Record<ArchetypeType, ArchetypeDefinition> = {
	innovator: {
		type: "innovator",
		title: "The Innovator",
		tagline: "Creating novel solutions to complex problems",
		description:
			"You see possibilities where others see obstacles. Your mind naturally gravitates toward improvement and invention, whether in technology, processes, or ideas.",
		essayStrengths: [
			"Problem-solving narratives",
			"Technical creativity",
			"Future-oriented vision",
		],
		color: "#10B981",
		bgClass: "bg-emerald-500/10",
		textClass: "text-emerald-600",
		borderClass: "border-emerald-300",
	},
	bridge_builder: {
		type: "bridge_builder",
		title: "The Bridge Builder",
		tagline: "Connecting disparate worlds and people",
		description:
			"You thrive at intersections—between cultures, disciplines, or communities. Your strength lies in translation and synthesis, making connections others miss.",
		essayStrengths: [
			"Cross-cultural narratives",
			"Interdisciplinary thinking",
			"Collaboration stories",
		],
		color: "#3B82F6",
		bgClass: "bg-blue-500/10",
		textClass: "text-blue-600",
		borderClass: "border-blue-300",
	},
	scholar: {
		type: "scholar",
		title: "The Scholar",
		tagline: "Driven by intellectual curiosity and depth",
		description:
			"Knowledge isn't just useful to you—it's exciting. You pursue understanding for its own sake and find joy in mastering complex subjects.",
		essayStrengths: [
			"Research motivation",
			"Intellectual journey",
			"Deep expertise",
		],
		color: "#8B5CF6",
		bgClass: "bg-violet-500/10",
		textClass: "text-violet-600",
		borderClass: "border-violet-300",
	},
	advocate: {
		type: "advocate",
		title: "The Advocate",
		tagline: "Fighting for causes and communities",
		description:
			"You're driven by purpose beyond personal gain. Whether for social justice, environmental causes, or underserved communities, you channel your energy toward meaningful impact.",
		essayStrengths: [
			"Social impact narratives",
			"Community leadership",
			"Values-driven decisions",
		],
		color: "#EC4899",
		bgClass: "bg-pink-500/10",
		textClass: "text-pink-600",
		borderClass: "border-pink-300",
	},
	pioneer: {
		type: "pioneer",
		title: "The Pioneer",
		tagline: "Venturing into uncharted territory",
		description:
			"You're drawn to firsts—first in your family, first to try something new, first to take a risk. Uncertainty doesn't deter you; it motivates you.",
		essayStrengths: [
			"First-generation narratives",
			"Risk-taking stories",
			"Trailblazing moments",
		],
		color: "#F59E0B",
		bgClass: "bg-amber-500/10",
		textClass: "text-amber-600",
		borderClass: "border-amber-300",
	},
	craftsman: {
		type: "craftsman",
		title: "The Craftsman",
		tagline: "Mastering skills through deliberate practice",
		description:
			"You believe in excellence through dedication. Whether in art, engineering, or any discipline, you pursue mastery with patience and precision.",
		essayStrengths: [
			"Skill development journey",
			"Attention to detail",
			"Long-term commitment",
		],
		color: "#6366F1",
		bgClass: "bg-indigo-500/10",
		textClass: "text-indigo-600",
		borderClass: "border-indigo-300",
	},
	resilient: {
		type: "resilient",
		title: "The Resilient",
		tagline: "Transforming challenges into growth",
		description:
			"Your story is defined not by what happened to you, but by how you responded. Setbacks become setups for comebacks in your narrative.",
		essayStrengths: [
			"Overcoming adversity",
			"Growth from failure",
			"Perseverance stories",
		],
		color: "#EF4444",
		bgClass: "bg-red-500/10",
		textClass: "text-red-600",
		borderClass: "border-red-300",
	},
	catalyst: {
		type: "catalyst",
		title: "The Catalyst",
		tagline: "Sparking change in systems and people",
		description:
			"You don't just participate—you transform. Whether leading organizations, changing processes, or inspiring others, you leave things different than you found them.",
		essayStrengths: [
			"Leadership transformation",
			"Change management",
			"Influence stories",
		],
		color: "#14B8A6",
		bgClass: "bg-teal-500/10",
		textClass: "text-teal-600",
		borderClass: "border-teal-300",
	},
} as const;

// Helper to get archetype by type
export function getArchetype(type: ArchetypeType): ArchetypeDefinition {
	return ARCHETYPES[type];
}

// Get all archetype types as array
export const ARCHETYPE_TYPES = Object.keys(ARCHETYPES) as ArchetypeType[];
