/**
 * @fileoverview Static configuration data for marketing pages.
 * Moved from page components to prevent recreation on every render.
 */

import type { LucideIcon } from "lucide-react";
import {
	Brain,
	FileCheck,
	Globe,
	MapPin,
	School,
	Sparkles,
	Target,
	Users,
} from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface FeaturedUniversity {
	name: string;
	location: string;
	logo: string;
}

export interface Stat {
	value: string;
	labelKey: string;
	icon: LucideIcon;
}

export interface Feature {
	icon: LucideIcon;
	titleKey: string;
	descKey: string;
	href: string;
}

export interface HowItWorksStep {
	step: number;
	icon: LucideIcon;
	titleKey: string;
	quoteKey: string;
	descKey: string;
}

// ============================================================================
// Static Data
// ============================================================================

/**
 * Featured universities displayed on the landing page.
 * 22 top universities from around the world.
 */
export const FEATURED_UNIVERSITIES: readonly FeaturedUniversity[] = [
	{
		name: "Harvard University",
		location: "USA",
		logo: "/universities/havard.png",
	},
	{
		name: "Massachusetts Institute of Technology",
		location: "USA",
		logo: "/universities/mit.png",
	},
	{
		name: "Stanford University",
		location: "USA",
		logo: "/universities/stanford.png",
	},
	{ name: "Yale University", location: "USA", logo: "/universities/yale.png" },
	{
		name: "Princeton University",
		location: "USA",
		logo: "/universities/princeton.png",
	},
	{
		name: "University of Oxford",
		location: "UK",
		logo: "/universities/oxford.png",
	},
	{
		name: "University of Cambridge",
		location: "UK",
		logo: "/universities/cambridge.png",
	},
	{
		name: "Imperial College London",
		location: "UK",
		logo: "/universities/imperial_college_london.png",
	},
	{
		name: "University College London",
		location: "UK",
		logo: "/universities/ucl.png",
	},
	{
		name: "King's College London",
		location: "UK",
		logo: "/universities/london.png",
	},
	{
		name: "ETH Zurich",
		location: "Switzerland",
		logo: "/universities/eth_zurich.png",
	},
	{
		name: "Technical University of Munich",
		location: "Germany",
		logo: "/universities/tu_muenchen.png",
	},
	{
		name: "National University of Singapore",
		location: "Singapore",
		logo: "/universities/nus.png",
	},
	{
		name: "Peking University",
		location: "China",
		logo: "/universities/peking.png",
	},
	{
		name: "Tsinghua University",
		location: "China",
		logo: "/universities/tshinghua.png",
	},
	{
		name: "University of Tokyo",
		location: "Japan",
		logo: "/universities/tokyo.png",
	},
	{
		name: "Seoul National University",
		location: "South Korea",
		logo: "/universities/snu.png",
	},
	{
		name: "University of Toronto",
		location: "Canada",
		logo: "/universities/toronto.png",
	},
	{
		name: "University of British Columbia",
		location: "Canada",
		logo: "/universities/ubc.png",
	},
	{
		name: "McGill University",
		location: "Canada",
		logo: "/universities/mcgill.png",
	},
	{
		name: "University of Melbourne",
		location: "Australia",
		logo: "/universities/melbourne.png",
	},
	{
		name: "University of Sydney",
		location: "Australia",
		logo: "/universities/usyd.png",
	},
] as const;

/**
 * Platform statistics displayed on the landing page.
 */
export const STATS: readonly Stat[] = [
	{ value: "2,000+", labelKey: "statsStudents", icon: Users },
	{ value: "1,500+", labelKey: "statsUniversities", icon: School },
	{ value: "50+", labelKey: "statsCountries", icon: MapPin },
] as const;

/**
 * Key features of the platform displayed on the landing page.
 */
export const FEATURES: readonly Feature[] = [
	{
		icon: Globe,
		titleKey: "feature1Title",
		descKey: "feature1Desc",
		href: "/features",
	},
	{
		icon: Brain,
		titleKey: "feature2Title",
		descKey: "feature2Desc",
		href: "/features",
	},
	{
		icon: Target,
		titleKey: "feature3Title",
		descKey: "feature3Desc",
		href: "/features",
	},
	{
		icon: Sparkles,
		titleKey: "feature4Title",
		descKey: "feature4Desc",
		href: "/features",
	},
] as const;

/**
 * How it works steps displayed on the landing page.
 * 4-step journey explaining the platform workflow.
 */
export const HOW_IT_WORKS_STEPS: readonly HowItWorksStep[] = [
	{
		step: 1,
		icon: Users,
		titleKey: "step1Title",
		quoteKey: "step1Quote",
		descKey: "step1Desc",
	},
	{
		step: 2,
		icon: Brain,
		titleKey: "step2Title",
		quoteKey: "step2Quote",
		descKey: "step2Desc",
	},
	{
		step: 3,
		icon: FileCheck,
		titleKey: "step3Title",
		quoteKey: "step3Quote",
		descKey: "step3Desc",
	},
	{
		step: 4,
		icon: Sparkles,
		titleKey: "step4Title",
		quoteKey: "step4Quote",
		descKey: "step4Desc",
	},
] as const;
