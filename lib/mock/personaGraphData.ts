/**
 * Mock Persona Graph Data
 * Extracted from sample conversation - Track 1: Future Vision
 */

import type {
	Archetype,
	PatternCluster,
	PersonaGraph,
	SkillEvidence,
	StoryFragment,
	ValueSystem,
} from "@/lib/types/persona-canvas";

// ============================================================================
// STORY FRAGMENTS (6 stories extracted from conversation)
// ============================================================================

const story1: StoryFragment = {
	id: "story_1",
	title: "10-Year Architect Path",
	description: "Strategic career planning from senior engineer to software architect, recognizing the reality of aging in tech and proactively pivoting from hands-on coding to architectural decision-making before technical skills become outdated.",
	track: "future_vision",
	story_type: "insight",
	raw_text:
		"Tao nghĩ là 5 năm lên Senior, 10 năm lên kiến trúc sư. Sang phần ra quyết định. 5 năm senior code đủ nhiều rồi, 10 năm tao e là không theo kịp công nghệ mới, rút về làm kiến trúc là ổn",
	structured_extract: {
		context: "Lên kế hoạch sự nghiệp dài hạn trong tech",
		conflict: "Lo sợ không theo kịp công nghệ sau 10 năm code",
		action: "Chuyển từ IC (individual contributor) sang architect role",
		outcome: "Định hướng rõ: 5 năm Senior → 10 năm Architect",
		learning: "Nhận thức được giới hạn của deep technical path",
		emotion: "Thực dụng, có chút e ngại về aging trong tech",
	},
	tags: {
		identity_facets: ["strategic_thinking", "technical", "pragmatic"],
		value_signals: ["pragmatism", "autonomy", "sustainability"],
		skill_evidence: ["technical_depth", "strategic_thinking", "system_design"],
		narrative_type: "transformation",
		emotional_weight: "high",
		temporal: "5-10 years future",
		essay_potential: ["purpose_statement", "personal_statement"],
	},
	connections: {
		patterns: ["pattern_1", "pattern_2"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_1", "skill_2"],
	},
	created_at: "2024-01-08T10:00:00Z",
};

const story2: StoryFragment = {
	id: "story_2",
	title: "Paper Document Pain",
	description: "Discovering a massive market opportunity through personal frustration with university's paper-based document management system. Converting daily annoyance with inefficient bureaucracy into a vision for enterprise knowledge management solutions with OCR capabilities.",
	track: "future_vision",
	story_type: "turning_point",
	raw_text:
		"Knowledge management thì nó bao gồm cả OCR nữa mà. Tao muốn tăng tốc các doanh nghiệp bị níu chân bởi đống văn bản. Tao đang phải soạn văn bản ở trường đại học đây, mà nó toàn lưu bằng giấy làm tao phát ngán.",
	structured_extract: {
		context: "Đang làm việc tại đại học, phải xử lý văn bản giấy tờ",
		conflict: "Frustration với inefficiency của legacy document systems",
		action: "Nhận diện market problem từ personal annoyance",
		outcome: "Vision rõ ràng: Build knowledge management tools cho enterprises",
		learning: "Personal pain point → Market opportunity",
		emotion: "Bực bội nhưng có động lực giải quyết",
	},
	tags: {
		identity_facets: ["entrepreneurial", "analytical", "resilient"],
		value_signals: ["efficiency", "impact", "innovation"],
		skill_evidence: ["problem_solving", "system_design"],
		narrative_type: "discovery",
		emotional_weight: "critical",
		temporal: "present",
		essay_potential: [
			"purpose_statement",
			"personal_statement",
			"diversity_statement",
		],
	},
	connections: {
		patterns: ["pattern_1", "pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_3", "skill_4"],
	},
	created_at: "2024-01-08T10:15:00Z",
};

const story3: StoryFragment = {
	id: "story_3",
	title: "Weekly Burnout Cycle",
	description: "Working at a 5-person startup with extreme intensity, experiencing burnout once per week. Recognizing the need for a strategic pause through a master's program to prevent complete exhaustion while expanding international network and maintaining career sustainability.",
	track: "future_vision",
	story_type: "challenge",
	raw_text:
		"Tao đang ở team startup 5 người. Làm startup thần tối 7 ngày burnout 1 lần. Tao muốn mở rộng quan hệ với những người học ở nước ngoài, tao cũng muốn đi học, kiểu small gap trong lúc làm nghề kẻo bị burn out.",
	structured_extract: {
		context: "Đang làm việc tại startup 5 người, intensity cao",
		conflict: "Burnout frequency: 1 lần/tuần do work intensity",
		action: "Nhận diện nhu cầu strategic pause qua master's program",
		outcome: "Plan: Work → Master → Work (gối lên để tránh burnout)",
		learning: "Sustainable career cần rhythm giữa work và learning",
		emotion: "Exhausted but self-aware",
	},
	tags: {
		identity_facets: ["resilient", "strategic_thinking", "entrepreneurial"],
		value_signals: ["sustainability", "autonomy", "quality"],
		skill_evidence: ["execution", "learning_agility"],
		narrative_type: "overcoming_obstacle",
		emotional_weight: "high",
		temporal: "present",
		essay_potential: ["personal_statement", "diversity_statement"],
	},
	connections: {
		patterns: ["pattern_2"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_5"],
	},
	created_at: "2024-01-08T10:30:00Z",
};

const story4: StoryFragment = {
	id: "story_4",
	title: "Global Network Strategy",
	description: "Viewing master's education as a strategic investment to access global tech ecosystem, connect with industry leaders and VCs through alumni networks, and learn international work culture. Understanding that network advantage is critical for startup scaling beyond local market limitations.",
	track: "future_vision",
	story_type: "achievement",
	raw_text:
		"Chắc chắn là build startup network hoặc network với các cao thủ đầu ngành, sau đó cũng tiện tham khảo văn hoá làm việc. Các trường cũng có mạng lưới Alumni rất đáng mong chờ để tao có thể kết nối với các VC nếu cần. Industry connection và Global Tech Ecosystem",
	structured_extract: {
		context: "Nhận thức value của global network trong startup journey",
		conflict: "Local ecosystem limitations for scaling",
		action:
			"Strategic investment in international network through master's program",
		outcome: "Access to VCs, industry leaders, alumni network",
		learning: "Network = competitive advantage trong entrepreneurship",
		emotion: "Ambitious, calculated",
	},
	tags: {
		identity_facets: ["entrepreneurial", "strategic_thinking", "collaborative"],
		value_signals: ["impact", "autonomy", "innovation"],
		skill_evidence: ["strategic_thinking", "communication"],
		narrative_type: "hero_journey",
		emotional_weight: "medium",
		temporal: "2-3 years future",
		essay_potential: ["purpose_statement", "diversity_statement"],
	},
	connections: {
		patterns: ["pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_2", "skill_4"],
	},
	created_at: "2024-01-08T10:45:00Z",
};

const story5: StoryFragment = {
	id: "story_5",
	title: "Lean Team Philosophy",
	description: "Strong conviction that optimal team size is around 20 people for maximum impact. Believing that small, efficient teams can drive significant change while maintaining cost-effectiveness and operational excellence, rejecting the notion that big impact requires big teams.",
	track: "future_vision",
	story_type: "insight",
	raw_text:
		"Startup, onsite. Team size tầm 20 là đẹp, lean team big change, vận hành hiệu quả tiết kiệm chi phí.",
	structured_extract: {
		context: "Vision về ideal work environment",
		conflict: "Trade-off giữa team size và impact",
		action: "Optimize for lean operations (20 people)",
		outcome: "Maximize efficiency/cost ratio while maintaining impact",
		learning: "Small teams can drive big change with right structure",
		emotion: "Confident, opinionated",
	},
	tags: {
		identity_facets: ["entrepreneurial", "analytical", "leadership"],
		value_signals: ["efficiency", "impact", "pragmatism"],
		skill_evidence: ["strategic_thinking", "execution"],
		narrative_type: "innovation",
		emotional_weight: "medium",
		temporal: "5-10 years future",
		essay_potential: ["purpose_statement"],
	},
	connections: {
		patterns: ["pattern_1", "pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_4"],
	},
	created_at: "2024-01-08T11:00:00Z",
};

const story6: StoryFragment = {
	id: "story_6",
	title: "Selfish Altruism Vision",
	description: "Honest admission that the drive to digitize legacy enterprises stems from personal frustration with signing endless paper forms. Transforming personal annoyance into market opportunity by aligning enterprise digitization with government initiatives, proving that selfish motivations can create altruistic outcomes at scale.",
	track: "future_vision",
	story_type: "turning_point",
	raw_text:
		"Tao muốn là toàn bộ doanh nghiệp legacy nhờ có công cụ của bọn tao có thể chuyển dịch hiệu quả hơn, tiết kiệm chi phí hơn, và đấu nối tốt với mục tiêu chuyển đổi số của Chính phủ Việt Nam. Như vậy tao dùng dịch vụ nói chung sẽ đỡ phải ký tá viết tay nhiều",
	structured_extract: {
		context: "Frustration với bureaucracy trong services",
		conflict: "Personal annoyance vs systemic impact",
		action: "Frame personal pain as market opportunity",
		outcome:
			"Vision: Enterprise digitization aligned với government initiatives",
		learning: "Authentic motivation (selfish) → Scalable impact (altruistic)",
		emotion: "Brutally honest, grounded",
	},
	tags: {
		identity_facets: ["entrepreneurial", "pragmatic", "analytical"],
		value_signals: ["efficiency", "impact", "accessibility"],
		skill_evidence: ["problem_solving", "strategic_thinking"],
		narrative_type: "discovery",
		emotional_weight: "critical",
		temporal: "present + 10 years vision",
		essay_potential: [
			"personal_statement",
			"purpose_statement",
			"diversity_statement",
		],
	},
	connections: {
		patterns: ["pattern_1", "pattern_3"],
		archetype: "archetype_1",
		values: ["value_system_1"],
		skills: ["skill_3", "skill_4"],
	},
	created_at: "2024-01-08T11:15:00Z",
};

// ============================================================================
// PATTERN CLUSTERS (3 patterns from 6 stories)
// ============================================================================

const pattern1: PatternCluster = {
	id: "pattern_1",
	cluster_name: "Pragmatic Architect",
	member_stories: ["story_1", "story_2", "story_5", "story_6"],
	shared_tags: {
		identity_facets: ["pragmatic", "analytical", "strategic_thinking"],
		value_signals: ["efficiency", "pragmatism", "impact"],
		skill_evidence: ["system_design", "strategic_thinking"],
	},
	pattern_description:
		"Consistently demonstrates practical, efficiency-driven approach to solving real problems. Rejects idealism in favor of what works.",
	behavioral_signature: [
		"Starts from personal pain point",
		"Quantifies constraints (team size, timeline)",
		"Optimizes for sustainability over heroics",
		"Transparent about selfish motivations",
	],
	essay_angles: [
		{
			name: "The Reluctant Optimizer",
			frame:
				"Engineer who solves problems not out of altruism, but because inefficiency personally offends them",
			narrative_arc: ["story_6", "story_2", "story_5"],
			fit: ["personal_statement", "purpose_statement"],
			strength: 85,
			uniqueness: 92,
		},
		{
			name: "10-Year Realist",
			frame:
				"Career planning that acknowledges aging in tech and plans strategic pivots",
			narrative_arc: ["story_1", "story_5"],
			fit: ["purpose_statement"],
			strength: 75,
			uniqueness: 70,
		},
	],
	status: "strong",
};

const pattern2: PatternCluster = {
	id: "pattern_2",
	cluster_name: "Burnout-Aware Builder",
	member_stories: ["story_1", "story_3"],
	shared_tags: {
		identity_facets: ["resilient", "strategic_thinking"],
		value_signals: ["sustainability", "autonomy"],
		skill_evidence: ["execution", "learning_agility"],
	},
	pattern_description:
		"Recognizes limits and plans for sustainable career rhythm. Not afraid to admit exhaustion.",
	behavioral_signature: [
		"Acknowledges burnout openly (1x/week)",
		"Plans strategic pauses (work → study → work)",
		"Prioritizes long-term sustainability over short-term grind",
	],
	essay_angles: [
		{
			name: "The Marathon Sprinter",
			frame:
				"Startup operator who learned to pace themselves through strategic breaks",
			narrative_arc: ["story_3", "story_1"],
			fit: ["personal_statement", "diversity_statement"],
			strength: 80,
			uniqueness: 75,
		},
	],
	status: "validated",
};

const pattern3: PatternCluster = {
	id: "pattern_3",
	cluster_name: "Ecosystem Entrepreneur",
	member_stories: ["story_2", "story_4", "story_5", "story_6"],
	shared_tags: {
		identity_facets: ["entrepreneurial", "collaborative"],
		value_signals: ["impact", "innovation", "accessibility"],
		skill_evidence: ["strategic_thinking", "communication"],
	},
	pattern_description:
		"Thinks in systems and networks. Sees value in alumni connections, government alignment, and ecosystem plays.",
	behavioral_signature: [
		"Maps stakeholders (VCs, government, enterprises)",
		"Values network effects",
		"Aligns personal goals with broader ecosystem trends",
	],
	essay_angles: [
		{
			name: "The Ecosystem Insider",
			frame:
				"Builder who leverages government digitization initiatives as market tailwind",
			narrative_arc: ["story_6", "story_4", "story_2"],
			fit: ["purpose_statement", "diversity_statement"],
			strength: 88,
			uniqueness: 85,
		},
	],
	status: "strong",
};

// ============================================================================
// ARCHETYPE
// ============================================================================

const archetype1: Archetype = {
	id: "archetype_1",
	primary_type: "builder",
	secondary_traits: ["architect", "maverick"],
	trait_vector: {
		pragmatism: 95,
		technical_depth: 85,
		strategic_thinking: 80,
		self_awareness: 90,
		brutal_honesty: 92,
		efficiency_obsession: 88,
		sustainability_mindset: 75,
		network_thinking: 70,
	},
	evolution_direction:
		"Moving from pure IC (individual contributor) → Architect/Entrepreneur hybrid. Becoming more systems-aware while retaining hands-on pragmatism.",
	evidence_from: [
		"story_1",
		"story_2",
		"story_3",
		"story_4",
		"story_5",
		"story_6",
	],
};

// ============================================================================
// VALUE SYSTEM
// ============================================================================

const valueSystem1: ValueSystem = {
	id: "value_system_1",
	stated_values: ["efficiency", "impact", "innovation"],
	revealed_values: [
		"pragmatism",
		"efficiency",
		"sustainability",
		"autonomy",
		"accessibility",
	],
	value_hierarchy: [
		"pragmatism", // #1 - drives everything
		"efficiency", // #2 - core motivation
		"sustainability", // #3 - learned from burnout
		"impact", // #4 - scales with maturity
		"autonomy", // #5 - enables above
	],
	tensions: [
		{
			id: "tension_1",
			pole_a: "efficiency",
			pole_b: "sustainability",
			evidence: {
				story_a: "story_2", // "tăng tốc doanh nghiệp" - push for efficiency
				story_b: "story_3", // "burnout 1 lần/tuần" - need for sustainability
			},
			resolution:
				"Strategic pauses (master's) to prevent burnout while maintaining high performance during work phases",
		},
		{
			id: "tension_2",
			pole_a: "autonomy",
			pole_b: "impact",
			evidence: {
				story_a: "story_5", // "lean team 20 người" - control/autonomy
				story_b: "story_6", // "toàn bộ doanh nghiệp legacy" - massive scale
			},
			resolution:
				"Lean operations enabling large market impact (quality over quantity)",
		},
	],
	evidence: {
		pragmatism: ["story_1", "story_2", "story_6"],
		efficiency: ["story_2", "story_5", "story_6"],
		sustainability: ["story_1", "story_3"],
		impact: ["story_2", "story_4", "story_6"],
		autonomy: ["story_1", "story_3", "story_5"],
		innovation: ["story_2", "story_4"],
		accessibility: ["story_6"],
	},
};

// ============================================================================
// SKILL EVIDENCE
// ============================================================================

const skill1: SkillEvidence = {
	id: "skill_1",
	skill_name: "System Architecture",
	category: "system_design",
	proficiency: "advanced",
	evidence: ["story_1", "story_2"],
	growth_trajectory: "steady",
	passion_level: "passionate",
	essay_value: 75,
};

const skill2: SkillEvidence = {
	id: "skill_2",
	skill_name: "Strategic Career Planning",
	category: "strategic_thinking",
	proficiency: "advanced",
	evidence: ["story_1", "story_4"],
	growth_trajectory: "accelerating",
	passion_level: "interested",
	essay_value: 70,
};

const skill3: SkillEvidence = {
	id: "skill_3",
	skill_name: "Problem Discovery (Market Sensing)",
	category: "problem_solving",
	proficiency: "expert",
	evidence: ["story_2", "story_6"],
	growth_trajectory: "breakthrough",
	passion_level: "obsessed",
	essay_value: 95,
};

const skill4: SkillEvidence = {
	id: "skill_4",
	skill_name: "Ecosystem Thinking",
	category: "strategic_thinking",
	proficiency: "intermediate",
	evidence: ["story_2", "story_4", "story_5", "story_6"],
	growth_trajectory: "accelerating",
	passion_level: "passionate",
	essay_value: 85,
};

const skill5: SkillEvidence = {
	id: "skill_5",
	skill_name: "Burnout Management",
	category: "execution",
	proficiency: "intermediate",
	evidence: ["story_3"],
	growth_trajectory: "steady",
	passion_level: "instrumental",
	essay_value: 60,
};

// ============================================================================
// COMPLETE GRAPH
// ============================================================================

export const mockPersonaGraph: PersonaGraph = {
	archetype: archetype1,
	stories: [story1, story2, story3, story4, story5, story6],
	patterns: [pattern1, pattern2, pattern3],
	values: valueSystem1,
	skills: [skill1, skill2, skill3, skill4, skill5],
	edges: [
		// Stories → Patterns
		{ from: "story_1", to: "pattern_1", type: "member_of", strength: 80 },
		{ from: "story_1", to: "pattern_2", type: "member_of", strength: 70 },
		{ from: "story_2", to: "pattern_1", type: "member_of", strength: 90 },
		{ from: "story_2", to: "pattern_3", type: "member_of", strength: 85 },
		{ from: "story_3", to: "pattern_2", type: "member_of", strength: 95 },
		{ from: "story_4", to: "pattern_3", type: "member_of", strength: 90 },
		{ from: "story_5", to: "pattern_1", type: "member_of", strength: 75 },
		{ from: "story_5", to: "pattern_3", type: "member_of", strength: 70 },
		{ from: "story_6", to: "pattern_1", type: "member_of", strength: 100 },
		{ from: "story_6", to: "pattern_3", type: "member_of", strength: 95 },

		// Patterns → Archetype
		{
			from: "pattern_1",
			to: "archetype_1",
			type: "evidences",
			strength: 95,
		},
		{
			from: "pattern_2",
			to: "archetype_1",
			type: "evidences",
			strength: 80,
		},
		{
			from: "pattern_3",
			to: "archetype_1",
			type: "evidences",
			strength: 85,
		},

		// Stories → Value System
		{
			from: "story_1",
			to: "value_system_1",
			type: "supports",
			strength: 75,
		},
		{
			from: "story_2",
			to: "value_system_1",
			type: "supports",
			strength: 90,
		},
		{
			from: "story_3",
			to: "value_system_1",
			type: "supports",
			strength: 85,
		},
		{
			from: "story_4",
			to: "value_system_1",
			type: "supports",
			strength: 70,
		},
		{
			from: "story_5",
			to: "value_system_1",
			type: "supports",
			strength: 80,
		},
		{
			from: "story_6",
			to: "value_system_1",
			type: "supports",
			strength: 95,
		},

		// Value Tensions (internal conflicts)
		{
			from: "story_2",
			to: "story_3",
			type: "conflicts",
			strength: 65,
		}, // efficiency vs sustainability
		{
			from: "story_5",
			to: "story_6",
			type: "conflicts",
			strength: 50,
		}, // autonomy vs impact

		// Stories → Skills
		{
			from: "story_1",
			to: "skill_1",
			type: "demonstrates",
			strength: 80,
		},
		{
			from: "story_1",
			to: "skill_2",
			type: "demonstrates",
			strength: 90,
		},
		{
			from: "story_2",
			to: "skill_1",
			type: "demonstrates",
			strength: 75,
		},
		{
			from: "story_2",
			to: "skill_3",
			type: "demonstrates",
			strength: 95,
		},
		{
			from: "story_2",
			to: "skill_4",
			type: "demonstrates",
			strength: 70,
		},
		{
			from: "story_3",
			to: "skill_5",
			type: "demonstrates",
			strength: 85,
		},
		{
			from: "story_4",
			to: "skill_2",
			type: "demonstrates",
			strength: 75,
		},
		{
			from: "story_4",
			to: "skill_4",
			type: "demonstrates",
			strength: 90,
		},
		{
			from: "story_5",
			to: "skill_4",
			type: "demonstrates",
			strength: 80,
		},
		{
			from: "story_6",
			to: "skill_3",
			type: "demonstrates",
			strength: 100,
		},
		{
			from: "story_6",
			to: "skill_4",
			type: "demonstrates",
			strength: 85,
		},

		// Skills → Archetype
		{
			from: "skill_1",
			to: "archetype_1",
			type: "evidences",
			strength: 85,
		},
		{
			from: "skill_2",
			to: "archetype_1",
			type: "evidences",
			strength: 70,
		},
		{
			from: "skill_3",
			to: "archetype_1",
			type: "evidences",
			strength: 95,
		},
		{
			from: "skill_4",
			to: "archetype_1",
			type: "evidences",
			strength: 80,
		},
		{
			from: "skill_5",
			to: "archetype_1",
			type: "evidences",
			strength: 60,
		},
	],
	metadata: {
		tracks_completed: {
			future_vision: 0.85, // Track 1 mostly done
			academic_journey: 0,
			activities_impact: 0,
			values_turning_points: 0.2, // Partial from burnout discussion
		},
		completeness_score: 0.25, // 1 out of 4 tracks
		essay_readiness: {
			personal_statement: "partial", // Has strong angles
			diversity_statement: "partial",
			purpose_statement: "ready", // "Selfish Altruism" angle is gold
		},
		missing_critical: [
			"Academic mentors/influences (Track 2)",
			"Leadership evidence (Track 3)",
			"Turning point moments (Track 4)",
			"Failure/vulnerability stories",
			"Collaboration examples",
		],
	},
};
