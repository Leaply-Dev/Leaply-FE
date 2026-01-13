import type {
	CoverageMetrics,
	PersonaEdgeDto,
	PersonaNodeDto,
} from "@/lib/generated/api/models";

/**
 * Calculates coverage metrics based on nodes and edges
 */
export function calculateCoverage(
	nodes: PersonaNodeDto[],
	edges: PersonaEdgeDto[],
): CoverageMetrics {
	// Count nodes by type
	const angles = nodes.filter((n) => n.type === "essay_angle");
	const stories = nodes.filter((n) => n.type === "key_story");
	const details = nodes.filter((n) => n.type === "detail");

	// Count different detail types
	const skills = details.filter(
		(n) => n.tags?.includes("skill") || n.title?.includes("skill"),
	);
	const values = details.filter(
		(n) => n.tags?.includes("value") || n.title?.includes("value"),
	);
	const goals = details.filter(
		(n) => n.tags?.includes("goal") || n.title?.includes("goal"),
	);

	// Count tension edges
	const tensions = edges.filter((e) => e.tension === true);

	// Calculate coverage percentages (0-100)
	const goalsCoverage = Math.min(100, (goals.length / 5) * 100); // Target: 5 goals
	const evidenceCoverage = Math.min(100, (stories.length / 12) * 100); // Target: 12 stories
	const skillsCoverage = Math.min(100, (skills.length / 8) * 100); // Target: 8 skills
	const valuesCoverage = Math.min(100, (values.length / 6) * 100); // Target: 6 values
	const tensionsCoverage = Math.min(100, (tensions.length / 3) * 100); // Target: 3 tensions

	// Overall progress is weighted average
	const overallProgress =
		(goalsCoverage * 0.2 +
			evidenceCoverage * 0.3 +
			skillsCoverage * 0.2 +
			valuesCoverage * 0.15 +
			tensionsCoverage * 0.15) /
		1;

	// Find lowest category
	const categories = [
		{ name: "goals", value: goalsCoverage },
		{ name: "evidence", value: evidenceCoverage },
		{ name: "skills", value: skillsCoverage },
		{ name: "values", value: valuesCoverage },
		{ name: "tensions", value: tensionsCoverage },
	];

	const lowestCategory = categories.reduce((lowest, current) =>
		current.value < lowest.value ? current : lowest,
	).name;

	return {
		goals: Math.round(goalsCoverage),
		evidence: Math.round(evidenceCoverage),
		skills: Math.round(skillsCoverage),
		values: Math.round(valuesCoverage),
		tensions: Math.round(tensionsCoverage),
		lowestCategory,
		overallProgress: Math.round(overallProgress),
	};
}
