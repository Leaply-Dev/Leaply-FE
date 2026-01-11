/**
 * Persona Canvas Types - 5-Node Architecture
 * Based on conversational LLM identity graph extraction
 */

// ============================================================================
// 1. STORY_FRAGMENT - Atomic data units
// ============================================================================

export type StoryType =
	| "achievement"
	| "challenge"
	| "turning_point"
	| "insight"
	| "relationship"
	| "failure"
	| "growth";

export type IdentityFacet =
	| "technical"
	| "leadership"
	| "creative"
	| "analytical"
	| "collaborative"
	| "entrepreneurial"
	| "resilient"
	| "curious";

export type ValueSignal =
	| "efficiency"
	| "impact"
	| "autonomy"
	| "innovation"
	| "pragmatism"
	| "quality"
	| "sustainability"
	| "accessibility";

export type SkillCategory =
	| "technical_depth"
	| "system_design"
	| "problem_solving"
	| "communication"
	| "strategic_thinking"
	| "execution"
	| "learning_agility";

export type NarrativeType =
	| "hero_journey"
	| "overcoming_obstacle"
	| "discovery"
	| "transformation"
	| "collaboration"
	| "innovation";

export type EmotionalWeight = "low" | "medium" | "high" | "critical";

export type EssayPotential =
	| "personal_statement"
	| "diversity_statement"
	| "purpose_statement"
	| "research_statement";

export interface StructuredExtract {
	context: string; // Background/situation
	conflict: string; // Challenge/tension
	action: string; // What they did
	outcome: string; // Result/impact
	learning: string; // Reflection/growth
	emotion: string; // Emotional tone
}

export interface StoryTags {
	identity_facets: IdentityFacet[];
	value_signals: ValueSignal[];
	skill_evidence: SkillCategory[];
	narrative_type: NarrativeType;
	emotional_weight: EmotionalWeight;
	temporal: string; // e.g., "present", "2-3 years ago"
	essay_potential: EssayPotential[];
}

export interface StoryFragment {
	id: string;
	title: string;
	description: string; // Expanded description/explanation of the title
	track:
		| "future_vision"
		| "academic_journey"
		| "activities_impact"
		| "values_turning_points";
	story_type: StoryType;
	raw_text: string; // Original user response
	structured_extract: StructuredExtract;
	tags: StoryTags;
	connections: {
		patterns: string[]; // Pattern IDs this story belongs to
		archetype: string; // Archetype ID
		values: string[]; // Value system IDs
		skills: string[]; // Skill evidence IDs
	};
	created_at: string;
}

// ============================================================================
// 2. PATTERN_CLUSTER - Emergent themes
// ============================================================================

export type PatternStatus = "emerging" | "validated" | "strong" | "unique";

export interface EssayAngle {
	name: string;
	frame: string; // How to tell this story
	narrative_arc: string[]; // Story IDs in sequence
	fit: EssayPotential[]; // Which essay types
	strength: number; // 0-100
	uniqueness: number; // 0-100 (wow factor)
}

export interface PatternCluster {
	id: string;
	cluster_name: string;
	member_stories: string[]; // Story IDs
	shared_tags: {
		identity_facets: IdentityFacet[];
		value_signals: ValueSignal[];
		skill_evidence: SkillCategory[];
	};
	pattern_description: string;
	behavioral_signature: string[]; // Consistent behaviors across stories
	essay_angles: EssayAngle[];
	status: PatternStatus;
}

// ============================================================================
// 3. ARCHETYPE - Root identity
// ============================================================================

export type ArchetypeType =
	| "architect"
	| "explorer"
	| "builder"
	| "connector"
	| "rebel"
	| "sage"
	| "guardian"
	| "maverick";

export interface TraitVector {
	[key: string]: number; // Trait name -> strength (0-100)
}

export interface Archetype {
	id: string;
	primary_type: ArchetypeType;
	secondary_traits: ArchetypeType[];
	trait_vector: TraitVector;
	evolution_direction: string; // How archetype is shifting
	evidence_from: string[]; // Story IDs that define this
}

// ============================================================================
// 4. VALUE_SYSTEM - Principles and tensions
// ============================================================================

export interface ValueTension {
	id: string;
	pole_a: ValueSignal;
	pole_b: ValueSignal;
	evidence: {
		story_a: string; // Story ID supporting pole A
		story_b: string; // Story ID supporting pole B
	};
	resolution: string | null; // How they balance it (if discovered)
}

export interface ValueSystem {
	id: string;
	stated_values: ValueSignal[]; // What they claim
	revealed_values: ValueSignal[]; // What their actions show
	value_hierarchy: ValueSignal[]; // Ordered by importance
	tensions: ValueTension[];
	evidence: {
		[key in ValueSignal]?: string[]; // Value -> Story IDs
	};
}

// ============================================================================
// 5. SKILL_EVIDENCE - Competencies
// ============================================================================

export type ProficiencyLevel =
	| "beginner"
	| "intermediate"
	| "advanced"
	| "expert";

export type GrowthTrajectory =
	| "plateauing"
	| "steady"
	| "accelerating"
	| "breakthrough";

export type PassionLevel =
	| "instrumental"
	| "interested"
	| "passionate"
	| "obsessed";

export interface SkillEvidence {
	id: string;
	skill_name: string;
	category: SkillCategory;
	proficiency: ProficiencyLevel;
	evidence: string[]; // Story IDs
	growth_trajectory: GrowthTrajectory;
	passion_level: PassionLevel;
	essay_value: number; // 0-100 (how compelling for essays)
}

// ============================================================================
// Graph Structure
// ============================================================================

// Legacy node types (for backward compatibility with mock data)
export type LegacyNodeType =
	| "story"
	| "pattern"
	| "archetype"
	| "value"
	| "skill";

// New API graph node types
export type ApiNodeType =
	| "profile_summary"
	| "essay_angle"
	| "key_story"
	| "detail";

// Combined node type for ForceGraph
export type NodeType = LegacyNodeType | ApiNodeType;

export interface GraphEdge {
	from: string;
	to: string;
	type: "member_of" | "evidences" | "supports" | "conflicts" | "demonstrates";
	strength?: number; // 0-100 for weighted edges
}

export interface GraphMetadata {
	tracks_completed: {
		future_vision: number; // 0-1 (percentage)
		academic_journey: number;
		activities_impact: number;
		values_turning_points: number;
	};
	completeness_score: number; // 0-1
	essay_readiness: {
		personal_statement: "not_ready" | "partial" | "ready";
		diversity_statement: "not_ready" | "partial" | "ready";
		purpose_statement: "not_ready" | "partial" | "ready";
	};
	missing_critical: string[]; // What gaps exist
}

export interface PersonaGraph {
	archetype: Archetype;
	stories: StoryFragment[];
	patterns: PatternCluster[];
	values: ValueSystem;
	skills: SkillEvidence[];
	edges: GraphEdge[];
	metadata: GraphMetadata;
}

// ============================================================================
// Force Graph Display Types
// ============================================================================

// Legacy graph data types (for backward compatibility with mock data)
export type LegacyGraphData =
	| StoryFragment
	| PatternCluster
	| Archetype
	| ValueSystem
	| SkillEvidence;

// Generic graph node data type (allows any structured data)
// biome-ignore lint/suspicious/noExplicitAny: Allows flexibility for API graph data
export type GraphNodeData = LegacyGraphData | Record<string, any>;

export interface ForceGraphNode {
	id: string;
	type: NodeType;
	label: string;
	size: number;
	color: string;
	data: GraphNodeData;
}

export interface ForceGraphLink {
	source: string;
	target: string;
	type: string;
	strength: number;
	color: string;
}
