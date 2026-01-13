import type {
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/generated/api/models";

/**
 * Generates edges connecting nodes based on relationships
 */
export function generateEdgesForNodes(
	nodes: PersonaNodeDto[],
): PersonaEdgeDto[] {
	const edges: PersonaEdgeDto[] = [];
	let edgeId = 1;

	const profile = nodes.find((n) => n.type === "profile_summary");
	const angles = nodes.filter((n) => n.type === "essay_angle");
	const stories = nodes.filter((n) => n.type === "key_story");
	const details = nodes.filter((n) => n.type === "detail");

	if (!profile) return edges;

	// Rule 1: Connect all essay_angles to profile_summary
	for (const angle of angles) {
		edges.push(
			createEdge(
				`mock-edge-${edgeId++}`,
				profile.id!,
				angle.id!,
				"supports",
				0.9,
			),
		);
	}

	// Rule 2: Connect key_stories to related essay_angles (match by tags)
	for (const story of stories) {
		const storyTags = new Set(story.tags || []);

		for (const angle of angles) {
			const angleTags = new Set(angle.tags || []);
			const sharedTags = [...storyTags].filter((tag) => angleTags.has(tag));

			if (sharedTags.length >= 2) {
				edges.push(
					createEdge(
						`mock-edge-${edgeId++}`,
						angle.id!,
						story.id!,
						"builds_on",
						0.7 + sharedTags.length * 0.05,
					),
				);
			}
		}
	}

	// Rule 3: Connect details to stories (match by keywords in title)
	for (const detail of details) {
		for (const story of stories) {
			const detailTitle = detail.title?.toLowerCase() || "";
			const storyTags = story.tags || [];

			// Check if detail tags match story tags
			const detailTags = new Set(detail.tags || []);
			const sharedTags = storyTags.filter((tag) => detailTags.has(tag));

			if (sharedTags.length >= 1) {
				edges.push(
					createEdge(
						`mock-edge-${edgeId++}`,
						story.id!,
						detail.id!,
						"enables",
						0.6 + sharedTags.length * 0.05,
					),
				);
			}
		}
	}

	// Rule 4: Add tension edges for conflicting themes
	const tensionPairs = findTensionPairs(nodes);
	for (const [source, target] of tensionPairs) {
		edges.push(
			createEdge(
				`mock-edge-${edgeId++}`,
				source.id!,
				target.id!,
				"contradicts",
				0.5,
				true,
			),
		);
	}

	return edges;
}

/**
 * Creates an edge with proper structure
 */
function createEdge(
	id: string,
	source: string,
	target: string,
	label: string,
	strength: number,
	tension = false,
): PersonaEdgeDto {
	return {
		id,
		source,
		target,
		label,
		strength,
		edgeType: tension ? "tension" : "connection",
		tension,
		createdAt: new Date().toISOString(),
	};
}

/**
 * Find pairs of nodes that have tension relationships
 */
function findTensionPairs(
	nodes: PersonaNodeDto[],
): Array<[PersonaNodeDto, PersonaNodeDto]> {
	const pairs: Array<[PersonaNodeDto, PersonaNodeDto]> = [];

	// Look for stories with "failure" tag and success-oriented angles
	const failureStories = nodes.filter(
		(n) => n.type === "key_story" && (n.tags?.includes("failure") || false),
	);

	const successAngles = nodes.filter(
		(n) =>
			n.type === "essay_angle" &&
			(n.primaryArchetype === "Innovator" || n.primaryArchetype === "Leader"),
	);

	// Create tension edges between failure stories and success angles
	if (failureStories.length > 0 && successAngles.length > 0) {
		pairs.push([failureStories[0], successAngles[0]]);
	}

	// Look for introverted vs leadership tension
	const leadershipAngles = nodes.filter(
		(n) => n.type === "essay_angle" && n.tags?.includes("leadership"),
	);

	const deepWorkStories = nodes.filter(
		(n) =>
			n.type === "key_story" &&
			(n.tags?.includes("research") || n.tags?.includes("systems")),
	);

	if (leadershipAngles.length > 0 && deepWorkStories.length > 0) {
		pairs.push([leadershipAngles[0], deepWorkStories[0]]);
	}

	return pairs;
}
