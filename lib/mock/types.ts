// Type definitions for mock data fixtures

export interface EssayAngleFixture {
	title: string;
	primaryArchetype: string;
	secondaryArchetype?: string;
	archetypeSummary: string;
	bestFor: string[];
	wordCountPotential: string;
	tags: string[];
	essayAngle: string;
}

export interface KeyStoryFixture {
	title: string;
	situation: string;
	task: string;
	action: string;
	result?: string;
	emotion?: string;
	insight?: string;
	tags: string[];
	relatedArchetypes: string[];
	starGaps: string[];
}

export interface DetailFixture {
	title: string;
	type: "skill" | "value" | "goal" | "evidence";
	content: string;
	tags: string[];
	relatedStories: string[];
}

export type ConversationScenario =
	| "fresh-start"
	| "building-momentum"
	| "tension-discovery"
	| "completion-ready";
