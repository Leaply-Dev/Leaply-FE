import { faker } from "@faker-js/faker";
import type {
	AiMatchResponse,
	ApplicationListResponse,
	// Applications
	ApplicationResponse,
	ApplicationSopResponse,
	ApplicationSummaryDto,
	ArchetypeDto,
	AuthResponse,
	CanvasNodeDto,
	ChatMessageDto,
	DiscoveryProgressDto,
	EvaluationResponse,
	FilterOptionsResponse,
	GapDto,
	// Home
	HomeResponse,
	LoginRequest,
	MessageResponse,
	// Onboarding
	OnboardingDataResponse,
	OnboardingResponse,
	OnboardingStatusResponse,
	PaginationResponse,
	// Persona
	PersonaStateResponse,
	PreferencesInfo,
	ProfileInfo,
	ProfileResponse,
	ProgramDetailResponse,
	ProgramIntakeResponse,
	// Explore
	ProgramListItemResponse,
	ProgramListResponse,
	ProgramSummaryDto,
	RecentApplicationDto,
	// Auth
	RegisterRequest,
	RequirementsResponse,
	SopFeedbackDto,
	SuggestedActionDto,
	TrackDto,
	TrackSelectResponse,
	TuitionResponse,
	UpcomingDeadlineDto,
	UserContextResponse,
	// User
	UserInfo,
	UserMeResponse,
} from "@/lib/api/types";

// ============================================
// Helper Functions
// ============================================

/**
 * Generate a random image URL using picsum.photos
 * @param width - Image width (default: 200)
 * @param height - Image height (default: 200, or same as width if not provided)
 * @returns Picsum photos URL
 */
function getImageUrl(width: number = 200, height?: number): string {
	if (height === undefined) {
		return `https://picsum.photos/${width}`;
	}
	return `https://picsum.photos/${width}/${height}`;
}

const degreeTypes = ["bachelor", "masters", "mba", "phd", "diploma"];
const educationLevels = ["high_school", "undergrad", "graduate", "working"];
const targetDegrees = ["bachelors", "masters", "mba", "phd"];
const regions = ["North America", "Europe", "Asia", "Australia", "UK"];
const fieldsOfInterest = [
	"Computer Science",
	"Business",
	"Engineering",
	"Data Science",
	"Design",
	"Medicine",
	"Law",
	"Arts",
];
const programTypes = ["full-time", "part-time", "online", "hybrid"];
const campusSettings = ["urban", "suburban", "rural"];
const journeyTypes = ["exploring", "has_target"];
const intakeTerms = ["Fall", "Spring", "Summer", "Winter"];
const budgetLabels = ["low", "medium", "high", "very_high"];
const deliveryModes = ["on-campus", "online", "hybrid"];
const languages = ["English", "Spanish", "French", "German", "Mandarin"];
const seasons = ["Fall", "Spring", "Summer", "Winter"];
const trackTypes = [
	"FUTURE_VISION",
	"ACADEMIC_JOURNEY",
	"ACTIVITIES_IMPACT",
	"VALUES_TURNING_POINTS",
];
const archetypeTypes = [
	"The Innovator",
	"The Scholar",
	"The Leader",
	"The Explorer",
	"The Creator",
];
const applicationStatuses = ["planning", "writing", "submitted"];
const fitCategories = ["reach", "target", "safety"] as const;
const gapSeverities = ["low", "medium", "high"] as const;
const suggestedActionTypes = [
	"persona",
	"explore",
	"profile",
	"deadline",
	"writing",
] as const;

// ============================================
// Authentication Mock Generators
// ============================================

export function generateRegisterRequest(): RegisterRequest {
	return {
		fullName: faker.person.fullName(),
		email: faker.internet.email().toLowerCase(),
		password: faker.internet.password({ length: 12 }),
	};
}

export function generateLoginRequest(): LoginRequest {
	return {
		email: faker.internet.email().toLowerCase(),
		password: faker.internet.password({ length: 12 }),
	};
}

export function generateAuthResponse(): AuthResponse {
	return {
		userId: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		accessToken: faker.string.alphanumeric(64),
		refreshToken: faker.string.alphanumeric(64),
		expiresIn: 3600, // 1 hour
		role: faker.helpers.arrayElement(["user", "admin"]),
		onboardingCompleted: faker.datatype.boolean(),
	};
}

// ============================================
// User Mock Generators
// ============================================

export function generateUserInfo(): UserInfo {
	return {
		id: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		isEmailVerified: faker.datatype.boolean(),
		isOnboardingComplete: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
	};
}

export function generateProfileInfo(): ProfileInfo {
	return {
		fullName: faker.person.fullName(),
		currentEducationLevel: faker.helpers.arrayElement(educationLevels),
		targetDegree: faker.helpers.arrayElement(targetDegrees),
		gpa: faker.number
			.float({ min: 2.0, max: 4.0, fractionDigits: 2 })
			.toString(),
		gpaScale: faker.helpers.arrayElement(["4.0", "5.0", "10.0"]),
		testScores: {
			IELTS: faker.number
				.float({ min: 5.0, max: 9.0, fractionDigits: 1 })
				.toString(),
			TOEFL: faker.number.int({ min: 60, max: 120 }).toString(),
			GRE: faker.number.int({ min: 260, max: 340 }).toString(),
			GMAT: faker.number.int({ min: 400, max: 800 }).toString(),
		},
	};
}

export function generatePreferencesInfo(): PreferencesInfo {
	return {
		fieldOfInterest: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 1,
			max: 3,
		}),
		preferredRegions: faker.helpers.arrayElements(regions, { min: 1, max: 3 }),
		intendedStartTerm: faker.helpers.arrayElement(intakeTerms),
		budgetLabel: faker.helpers.arrayElement(budgetLabels),
		journeyType: faker.helpers.arrayElement(journeyTypes),
		programType: faker.helpers.arrayElement(programTypes),
		campusSetting: faker.helpers.arrayElement(campusSettings),
		interests: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 2,
			max: 5,
		}),
	};
}

export function generateUserContextResponse(): UserContextResponse {
	return {
		user: generateUserInfo(),
		profile: generateProfileInfo(),
		preferences: generatePreferencesInfo(),
	};
}

export function generateProfileResponse(): ProfileResponse {
	return {
		userId: faker.string.uuid(),
		fullName: faker.person.fullName(),
		currentEducationLevel: faker.helpers.arrayElement(educationLevels),
		targetDegree: faker.helpers.arrayElement(targetDegrees),
		gpa: faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 2 }),
		gpaScale: faker.number.float({ min: 4.0, max: 10.0, fractionDigits: 1 }),
		testScores: {
			IELTS: faker.number
				.float({ min: 5.0, max: 9.0, fractionDigits: 1 })
				.toString(),
			TOEFL: faker.number.int({ min: 60, max: 120 }).toString(),
		},
		workExperienceYears: faker.number.int({ min: 0, max: 10 }),
		profileCompletion: faker.number.int({ min: 0, max: 100 }),
	};
}

export function generateUserMeResponse(): UserMeResponse {
	return {
		userId: faker.string.uuid(),
		email: faker.internet.email().toLowerCase(),
		emailVerified: faker.datatype.boolean(),
		createdAt: faker.date.past().toISOString(),
		fullName: faker.person.fullName(),
		currentEducationLevel: faker.helpers.arrayElement(educationLevels),
		targetDegree: faker.helpers.arrayElement(targetDegrees),
		gpa: faker.number.float({ min: 2.0, max: 4.0, fractionDigits: 2 }),
		gpaScale: faker.number.float({ min: 4.0, max: 10.0, fractionDigits: 1 }),
		testScores: {
			IELTS: faker.number
				.float({ min: 5.0, max: 9.0, fractionDigits: 1 })
				.toString(),
			TOEFL: faker.number.int({ min: 60, max: 120 }).toString(),
		},
		workExperienceYears: faker.number.int({ min: 0, max: 10 }),
		profileCompletion: faker.number.int({ min: 0, max: 100 }),
		fieldOfInterest: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 1,
			max: 3,
		}),
		preferredRegions: faker.helpers.arrayElements(regions, { min: 1, max: 3 }),
		intendedStartTerm: faker.helpers.arrayElement(intakeTerms),
		budgetLabel: faker.helpers.arrayElement(budgetLabels),
		journeyType: faker.helpers.arrayElement(journeyTypes),
		programType: faker.helpers.arrayElement(programTypes),
		campusSetting: faker.helpers.arrayElement(campusSettings),
		interests: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 2,
			max: 5,
		}),
	};
}

// ============================================
// Onboarding Mock Generators
// ============================================

export function generateOnboardingDataResponse(): OnboardingDataResponse {
	return {
		completedSteps: faker.number.int({ min: 0, max: 6 }),
		isComplete: faker.datatype.boolean(),
	};
}

export function generateOnboardingStatusResponse(): OnboardingStatusResponse {
	return {
		currentStep: faker.number.int({ min: 1, max: 6 }),
		completed: faker.datatype.boolean(),
		data: {
			fullName: faker.person.fullName(),
			currentLevel: faker.helpers.arrayElement(educationLevels),
			targetDegree: faker.helpers.arrayElement(targetDegrees),
		},
	};
}

export function generateOnboardingResponse(): OnboardingResponse {
	return {
		currentStep: faker.number.int({ min: 1, max: 6 }),
		nextStep: faker.number.int({ min: 2, max: 7 }),
		completed: faker.datatype.boolean(),
		redirectTo: faker.helpers.maybe(() => "/dashboard", { probability: 0.3 }),
		message: faker.lorem.sentence(),
	};
}

// ============================================
// Explore Mock Generators
// ============================================

export function generateProgramListItemResponse(): ProgramListItemResponse {
	const fitCategory = faker.helpers.arrayElement(fitCategories);
	const fitScore =
		fitCategory === "reach"
			? faker.number.int({ min: 50, max: 70 })
			: fitCategory === "target"
				? faker.number.int({ min: 71, max: 85 })
				: faker.number.int({ min: 86, max: 100 });

	return {
		id: faker.string.uuid(),
		universityId: faker.string.uuid(),
		universityName: faker.company.name() + " University",
		universityCountry: faker.location.country(),
		universityCity: faker.location.city(),
		universityLogoUrl: getImageUrl(200, 200),
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`MBA in ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`PhD in ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		displayName: `${faker.company.name()} University - ${faker.helpers.arrayElement(degreeTypes)}`,
		degreeType: faker.helpers.arrayElement(degreeTypes),
		degreeName: faker.helpers.arrayElement([
			"Bachelor of Science",
			"Master of Science",
			"Master of Arts",
			"MBA",
			"PhD",
		]),
		majorCategories: faker.helpers.arrayElements(fieldsOfInterest, {
			min: 1,
			max: 3,
		}),
		durationMonths: faker.helpers.arrayElement([12, 24, 36, 48]),
		deliveryMode: faker.helpers.arrayElement(deliveryModes),
		tuitionAnnualUsd: faker.number.int({ min: 10000, max: 80000 }),
		scholarshipAvailable: faker.datatype.boolean(),
		ieltsMinimum: faker.number.float({ min: 5.5, max: 8.0, fractionDigits: 1 }),
		toeflMinimum: faker.number.int({ min: 60, max: 120 }),
		nextDeadline: faker.date.future().toISOString().split("T")[0],
		nextIntake: `${faker.helpers.arrayElement(intakeTerms)} ${faker.date.future().getFullYear()}`,
		fitScore,
		fitCategory,
		fitReasons: faker.helpers.arrayElements(
			[
				"Strong program alignment",
				"Good scholarship opportunities",
				"Ranking matches your profile",
				"Location preference",
			],
			{ min: 1, max: 3 },
		),
		fitGaps: faker.helpers.arrayElements(
			[
				"Need higher IELTS score",
				"Portfolio recommended",
				"Work experience preferred",
				"Research experience needed",
			],
			{ min: 0, max: 2 },
		),
		isSaved: faker.helpers.maybe(() => faker.datatype.boolean(), {
			probability: 0.5,
		}),
		rankingQsDisplay: faker.helpers.arrayElement([
			`#${faker.number.int({ min: 1, max: 50 })}`,
			`${faker.number.int({ min: 51, max: 100 })}-${faker.number.int({ min: 101, max: 200 })}`,
		]),
	};
}

export function generateProgramDetailResponse(): ProgramDetailResponse {
	const base = generateProgramListItemResponse();
	const intakes = Array.from(
		{ length: faker.number.int({ min: 1, max: 4 }) },
		() => generateProgramIntakeResponse(),
	);

	return {
		...base,
		universityWebsiteUrl: faker.internet.url(),
		universityDescription: faker.lorem.paragraphs(3),
		rankingTimesDisplay: faker.helpers.arrayElement([
			`#${faker.number.int({ min: 1, max: 100 })}`,
			`${faker.number.int({ min: 101, max: 200 })}-${faker.number.int({ min: 201, max: 300 })}`,
		]),
		rankingNational: faker.number.int({ min: 1, max: 50 }),
		language: faker.helpers.arrayElement(languages),
		programDescription: faker.lorem.paragraphs(5),
		programUrl: faker.internet.url(),
		admissionsUrl: faker.internet.url(),
		tuition: generateTuitionResponse(),
		applicationFeeUsd: faker.number.int({ min: 50, max: 200 }),
		requirements: generateRequirementsResponse(),
		intakes,
	};
}

export function generateProgramIntakeResponse(): ProgramIntakeResponse {
	const season = faker.helpers.arrayElement(seasons);
	const year = faker.date.future().getFullYear();

	return {
		id: faker.string.uuid(),
		season,
		seasonDisplay: `${season} ${year}`,
		applicationStartDate: faker.date.past().toISOString(),
		applicationDeadline: faker.date.future().toISOString(),
		earlyDeadline: faker.helpers.maybe(
			() => faker.date.future().toISOString(),
			{
				probability: 0.5,
			},
		),
		startDate: faker.date.future().toISOString(),
		isActive: faker.datatype.boolean(),
	};
}

export function generateTuitionResponse(): TuitionResponse {
	return {
		annualUsd: faker.number.int({ min: 10000, max: 80000 }),
		totalUsd: faker.helpers.maybe(
			() => faker.number.int({ min: 20000, max: 200000 }),
			{ probability: 0.7 },
		),
		notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
			probability: 0.3,
		}),
	};
}

export function generateRequirementsResponse(): RequirementsResponse {
	return {
		gpaMinimum: faker.number.float({ min: 2.5, max: 3.8, fractionDigits: 2 }),
		gpaScale: faker.number.float({ min: 4.0, max: 10.0, fractionDigits: 1 }),
		ieltsMinimum: faker.number.float({ min: 5.5, max: 8.0, fractionDigits: 1 }),
		toeflMinimum: faker.number.int({ min: 60, max: 120 }),
		greRequired: faker.datatype.boolean(),
		gmatRequired: faker.datatype.boolean(),
		workExperienceYears: faker.helpers.maybe(
			() => faker.number.int({ min: 0, max: 5 }),
			{ probability: 0.4 },
		),
		documents: faker.helpers.arrayElements(
			[
				"Transcript",
				"Recommendation Letters",
				"Statement of Purpose",
				"CV/Resume",
				"Portfolio",
			],
			{ min: 2, max: 5 },
		),
		notes: faker.helpers.maybe(() => faker.lorem.sentence(), {
			probability: 0.3,
		}),
	};
}

export function generatePaginationResponse(
	page: number = 1,
	size: number = 20,
	total: number = 100,
): PaginationResponse {
	return {
		page,
		size,
		total,
		totalPages: Math.ceil(total / size),
	};
}

export function generateProgramListResponse(
	count: number = 20,
	page: number = 1,
	size: number = 20,
): ProgramListResponse {
	const programs = Array.from({ length: count }, () =>
		generateProgramListItemResponse(),
	);
	const total = faker.number.int({ min: count, max: count + 50 });

	return {
		data: programs,
		pagination: generatePaginationResponse(page, size, total),
		appliedFilters: {
			regions: faker.helpers.arrayElements(regions, { min: 0, max: 2 }),
			degreeTypes: faker.helpers.arrayElements(degreeTypes, { min: 0, max: 2 }),
		},
	};
}

export function generateFilterOptionsResponse(): FilterOptionsResponse {
	return {
		majors: Array.from({ length: 20 }, () => ({
			value: faker.helpers.slugify(
				faker.helpers.arrayElement(fieldsOfInterest),
			),
			label: faker.helpers.arrayElement(fieldsOfInterest),
			count: faker.number.int({ min: 10, max: 500 }),
		})),
		countries: Array.from({ length: 15 }, () => ({
			value: faker.location.countryCode().toLowerCase(),
			label: faker.location.country(),
			count: faker.number.int({ min: 5, max: 200 }),
		})),
		regions: Array.from({ length: 5 }, () => ({
			value: faker.helpers.slugify(faker.helpers.arrayElement(regions)),
			label: faker.helpers.arrayElement(regions),
			count: faker.number.int({ min: 20, max: 300 }),
		})),
		degreeTypes: Array.from({ length: 5 }, () => ({
			value: faker.helpers.arrayElement(degreeTypes),
			label: faker.helpers.arrayElement(degreeTypes).toUpperCase(),
			count: faker.number.int({ min: 15, max: 250 }),
		})),
		tuitionRange: {
			min: 5000,
			max: 100000,
			currency: "USD",
		},
		ieltsRange: {
			min: 5.0,
			max: 9.0,
		},
	};
}

export function generateAiMatchResponse(): AiMatchResponse {
	const reachCount = faker.number.int({ min: 3, max: 8 });
	const targetCount = faker.number.int({ min: 5, max: 12 });
	const safetyCount = faker.number.int({ min: 3, max: 8 });

	return {
		reach: Array.from({ length: reachCount }, () => {
			const program = generateProgramListItemResponse();
			return { ...program, fitCategory: "reach" as const };
		}),
		target: Array.from({ length: targetCount }, () => {
			const program = generateProgramListItemResponse();
			return { ...program, fitCategory: "target" as const };
		}),
		safety: Array.from({ length: safetyCount }, () => {
			const program = generateProgramListItemResponse();
			return { ...program, fitCategory: "safety" as const };
		}),
		recommendation: faker.lorem.paragraph(),
		profileCompleteness: faker.number.int({ min: 60, max: 100 }),
		missingFields: faker.helpers.arrayElements(
			["testScores", "workExperience", "portfolio"],
			{ min: 0, max: 2 },
		),
		totalMatched: reachCount + targetCount + safetyCount,
	};
}

// ============================================
// Applications Mock Generators
// ============================================

export function generateProgramSummaryDto(): ProgramSummaryDto {
	return {
		id: faker.string.uuid(),
		universityName: faker.company.name() + " University",
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		degreeName: faker.helpers.arrayElement([
			"Bachelor of Science",
			"Master of Science",
			"MBA",
		]),
		nextDeadline: faker.date.future().toISOString().split("T")[0],
		nextIntake: `${faker.helpers.arrayElement(intakeTerms)} ${faker.date.future().getFullYear()}`,
	};
}

export function generateGapDto(): GapDto {
	return {
		field: faker.helpers.arrayElement([
			"gpa",
			"testScores",
			"workExperience",
			"portfolio",
		]),
		message: faker.lorem.sentence(),
		severity: faker.helpers.arrayElement(gapSeverities),
	};
}

export function generateApplicationResponse(): ApplicationResponse {
	const status = faker.helpers.arrayElement(applicationStatuses);
	const fitCategory = faker.helpers.arrayElement(fitCategories);
	const fitScore =
		fitCategory === "reach"
			? faker.number.int({ min: 50, max: 70 })
			: fitCategory === "target"
				? faker.number.int({ min: 71, max: 85 })
				: faker.number.int({ min: 86, max: 100 });

	return {
		id: faker.string.uuid(),
		program: generateProgramSummaryDto(),
		status,
		fitScore,
		fitCategory,
		gaps: faker.helpers.arrayElements(
			Array.from({ length: 3 }, () => generateGapDto()),
			{ min: 0, max: 3 },
		),
		sopStatus: faker.helpers.maybe(
			() => faker.helpers.arrayElement(["draft", "reviewing", "completed"]),
			{ probability: 0.6 },
		),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.recent().toISOString(),
	};
}

export function generateApplicationSummaryDto(): ApplicationSummaryDto {
	return {
		total: faker.number.int({ min: 0, max: 20 }),
		byStatus: {
			planning: faker.number.int({ min: 0, max: 10 }),
			writing: faker.number.int({ min: 0, max: 8 }),
			submitted: faker.number.int({ min: 0, max: 5 }),
		},
		byCategory: {
			reach: faker.number.int({ min: 0, max: 5 }),
			target: faker.number.int({ min: 0, max: 8 }),
			safety: faker.number.int({ min: 0, max: 5 }),
		},
	};
}

export function generateUpcomingDeadlineDto(): UpcomingDeadlineDto {
	const deadline = faker.date.future();
	const daysRemaining = Math.ceil(
		(deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
	);

	return {
		applicationId: faker.string.uuid(),
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		deadline: deadline.toISOString().split("T")[0],
		daysRemaining: Math.max(0, daysRemaining),
	};
}

export function generateApplicationListResponse(): ApplicationListResponse {
	const applicationCount = faker.number.int({ min: 3, max: 15 });
	const applications = Array.from({ length: applicationCount }, () =>
		generateApplicationResponse(),
	);
	const deadlineCount = faker.number.int({ min: 0, max: 5 });

	return {
		applications,
		summary: generateApplicationSummaryDto(),
		upcomingDeadlines: Array.from({ length: deadlineCount }, () =>
			generateUpcomingDeadlineDto(),
		),
	};
}

export function generateSopFeedbackDto(): SopFeedbackDto {
	return {
		round: faker.number.int({ min: 1, max: 3 }),
		strengths: faker.helpers.arrayElements(
			[
				"Clear narrative structure",
				"Strong personal motivation",
				"Relevant experience highlighted",
				"Good connection to program goals",
			],
			{ min: 2, max: 4 },
		),
		improvements: Array.from(
			{ length: faker.number.int({ min: 2, max: 5 }) },
			() => ({
				point: faker.lorem.sentence(),
				suggestion: faker.lorem.paragraph(),
			}),
		),
		personaSuggestion: faker.helpers.maybe(() => faker.lorem.paragraph(), {
			probability: 0.5,
		}),
		structureNote: faker.helpers.maybe(() => faker.lorem.sentence(), {
			probability: 0.4,
		}),
		generatedAt: faker.date.recent().toISOString(),
	};
}

export function generateApplicationSopResponse(): ApplicationSopResponse {
	return {
		id: faker.string.uuid(),
		applicationId: faker.string.uuid(),
		wordLimit: faker.helpers.maybe(
			() => faker.number.int({ min: 500, max: 2000 }),
			{
				probability: 0.7,
			},
		),
		prompt: faker.helpers.maybe(() => faker.lorem.paragraph(), {
			probability: 0.5,
		}),
		content: faker.helpers.maybe(() => faker.lorem.paragraphs(5), {
			probability: 0.6,
		}),
		wordCount: faker.helpers.maybe(
			() => faker.number.int({ min: 300, max: 2000 }),
			{
				probability: 0.6,
			},
		),
		feedbackRound: faker.helpers.maybe(
			() => faker.number.int({ min: 0, max: 3 }),
			{
				probability: 0.5,
			},
		),
		lastFeedback: faker.helpers.maybe(() => generateSopFeedbackDto(), {
			probability: 0.4,
		}),
		updatedAt: faker.date.recent().toISOString(),
	};
}

export function generateEvaluationResponse(): EvaluationResponse {
	const schoolCount = faker.number.int({ min: 2, max: 8 });

	return {
		schoolGaps: Array.from({ length: schoolCount }, () => ({
			applicationId: faker.string.uuid(),
			programName: faker.helpers.arrayElement([
				`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
				`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			]),
			gaps: faker.helpers.arrayElements(
				Array.from({ length: 5 }, () => generateGapDto()),
				{ min: 1, max: 4 },
			),
		})),
		commonGaps: Array.from(
			{ length: faker.number.int({ min: 2, max: 5 }) },
			() => ({
				field: faker.helpers.arrayElement([
					"gpa",
					"testScores",
					"workExperience",
					"portfolio",
				]),
				count: faker.number.int({ min: 2, max: schoolCount }),
				message: faker.lorem.sentence(),
			}),
		),
		suggestions: faker.helpers.maybe(() => faker.lorem.paragraphs(2), {
			probability: 0.7,
		}),
		profileCompleteness: faker.number.int({ min: 50, max: 100 }),
		missingFields: faker.helpers.arrayElements(
			["testScores", "workExperience", "portfolio", "recommendations"],
			{ min: 0, max: 3 },
		),
	};
}

// ============================================
// Persona Lab Mock Generators
// ============================================

export function generateTrackDto(): TrackDto {
	const status = faker.helpers.arrayElement([
		"not_started",
		"in_progress",
		"completed",
	]);
	return {
		id: faker.helpers.arrayElement(trackTypes),
		displayName: faker.helpers.arrayElement([
			"Future Vision",
			"Academic Journey",
			"Activities & Impact",
			"Values & Turning Points",
		]),
		description: faker.lorem.paragraph(),
		icon: faker.helpers.arrayElement(["🎯", "📚", "🌟", "💡"]),
		status,
		completedAt:
			status === "completed" ? faker.date.past().toISOString() : undefined,
	};
}

export function generateArchetypeDto(): ArchetypeDto {
	return {
		type: faker.helpers.arrayElement(archetypeTypes),
		personalizedSummary: faker.lorem.paragraphs(3),
		revealedAt: faker.date.past().toISOString(),
	};
}

export function generateCanvasNodeDto(): CanvasNodeDto {
	return {
		id: faker.string.uuid(),
		type: faker.helpers.arrayElement([
			"insight",
			"experience",
			"value",
			"goal",
		]),
		title: faker.lorem.sentence(),
		content: faker.lorem.paragraph(),
		sourceTrackId: faker.helpers.arrayElement(trackTypes),
		createdAt: faker.date.past().toISOString(),
		archetypeType: faker.helpers.maybe(
			() => faker.helpers.arrayElement(archetypeTypes),
			{ probability: 0.3 },
		),
		personalizedSummary: faker.helpers.maybe(() => faker.lorem.paragraph(), {
			probability: 0.3,
		}),
	};
}

export function generateChatMessageDto(): ChatMessageDto {
	return {
		id: faker.string.uuid(),
		role: faker.helpers.arrayElement(["user", "assistant"]),
		content: faker.lorem.paragraph(),
		type: faker.helpers.arrayElement(["text", "question", "insight"]),
		timestamp: faker.date.recent().toISOString(),
		actions: faker.helpers.maybe(
			() =>
				Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
					trackId: faker.helpers.arrayElement(trackTypes),
					displayName: faker.helpers.arrayElement([
						"Future Vision",
						"Academic Journey",
						"Activities & Impact",
						"Values & Turning Points",
					]),
					icon: faker.helpers.arrayElement(["🎯", "📚", "🌟", "💡"]),
					status: faker.helpers.arrayElement([
						"not_started",
						"in_progress",
						"completed",
					]),
				})),
			{ probability: 0.3 },
		),
		canvasActions: faker.helpers.maybe(
			() =>
				Array.from({ length: faker.number.int({ min: 1, max: 2 }) }, () => ({
					action: faker.helpers.arrayElement(["add_node", "reveal_archetype"]),
					node: faker.helpers.maybe(() => generateCanvasNodeDto(), {
						probability: 0.5,
					}),
					nodeId: faker.helpers.maybe(() => faker.string.uuid(), {
						probability: 0.5,
					}),
					archetype: faker.helpers.maybe(
						() => ({
							type: faker.helpers.arrayElement(archetypeTypes),
							personalizedSummary: faker.lorem.paragraph(),
						}),
						{ probability: 0.3 },
					),
				})),
			{ probability: 0.2 },
		),
		trackId: faker.helpers.maybe(() => faker.helpers.arrayElement(trackTypes), {
			probability: 0.5,
		}),
	};
}

export function generatePersonaStateResponse(): PersonaStateResponse {
	const nodeCount = faker.number.int({ min: 5, max: 20 });
	const messageCount = faker.number.int({ min: 10, max: 50 });

	return {
		userId: faker.string.uuid(),
		tracks: Object.fromEntries(
			trackTypes.map((trackId) => [trackId, generateTrackDto()]),
		),
		nodes: Array.from({ length: nodeCount }, () => generateCanvasNodeDto()),
		archetype: faker.helpers.maybe(() => generateArchetypeDto(), {
			probability: 0.4,
		}),
		conversationHistory: Array.from({ length: messageCount }, () =>
			generateChatMessageDto(),
		),
		currentTrackId: faker.helpers.maybe(
			() => faker.helpers.arrayElement(trackTypes),
			{
				probability: 0.6,
			},
		),
		createdAt: faker.date.past().toISOString(),
		updatedAt: faker.date.recent().toISOString(),
	};
}

export function generateTrackSelectResponse(): TrackSelectResponse {
	return {
		message: generateChatMessageDto(),
		trackStatus: faker.helpers.arrayElement([
			"not_started",
			"in_progress",
			"completed",
		]),
		currentTrackId: faker.helpers.arrayElement(trackTypes),
	};
}

export function generateMessageResponse(): MessageResponse {
	return {
		message: generateChatMessageDto(),
		conversationState: {
			coreQuestionIndex: faker.number.int({ min: 0, max: 5 }),
			followUpIndex: faker.number.int({ min: 0, max: 3 }),
			totalCoreQuestions: faker.number.int({ min: 3, max: 6 }),
		},
		trackStatus: faker.helpers.arrayElement([
			"not_started",
			"in_progress",
			"completed",
		]),
		currentTrackId: faker.helpers.arrayElement(trackTypes),
		allTracksComplete: faker.datatype.boolean(),
	};
}

// ============================================
// Home Mock Generators
// ============================================

export function generateDiscoveryProgressDto(): DiscoveryProgressDto {
	const totalTracks = trackTypes.length;
	const completedTracks = faker.number.int({ min: 0, max: totalTracks });

	return {
		completedTracks,
		totalTracks,
		archetypeRevealed:
			completedTracks === totalTracks ? faker.datatype.boolean() : false,
	};
}

export function generateSuggestedActionDto(): SuggestedActionDto {
	const type = faker.helpers.arrayElement(suggestedActionTypes);
	const actions = {
		persona: {
			title: "Continue Your Persona Discovery",
			description: "Complete your tracks to reveal your archetype",
			link: "/persona-lab",
		},
		explore: {
			title: "Explore Programs",
			description: "Discover programs that match your profile",
			link: "/explore",
		},
		profile: {
			title: "Complete Your Profile",
			description: "Add more details to get better recommendations",
			link: "/dashboard/profile",
		},
		deadline: {
			title: "Upcoming Deadlines",
			description: "You have applications with deadlines approaching",
			link: "/dashboard/applications",
		},
		writing: {
			title: "Continue Writing Your SOP",
			description: "Finish your statement of purpose",
			link: "/dashboard/applications",
		},
	};

	return {
		type,
		...actions[type],
	};
}

export function generateRecentApplicationDto(): RecentApplicationDto {
	const fitCategory = faker.helpers.arrayElement(fitCategories);
	const fitScore =
		fitCategory === "reach"
			? faker.number.int({ min: 50, max: 70 })
			: fitCategory === "target"
				? faker.number.int({ min: 71, max: 85 })
				: faker.number.int({ min: 86, max: 100 });

	return {
		id: faker.string.uuid(),
		universityName: faker.company.name() + " University",
		programName: faker.helpers.arrayElement([
			`Bachelor of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
			`Master of ${faker.helpers.arrayElement(fieldsOfInterest)}`,
		]),
		status: faker.helpers.arrayElement(applicationStatuses),
		fitScore,
	};
}

export function generateHomeResponse(): HomeResponse {
	const firstName = faker.person.firstName();
	const applicationCount = faker.number.int({ min: 0, max: 10 });
	const deadlineCount = faker.number.int({ min: 0, max: 5 });

	return {
		firstName,
		profileCompletion: faker.number.int({ min: 40, max: 100 }),
		journeyType: faker.helpers.arrayElement(journeyTypes),
		discovery: generateDiscoveryProgressDto(),
		applications: generateApplicationSummaryDto(),
		recentApplications: Array.from({ length: applicationCount }, () =>
			generateRecentApplicationDto(),
		),
		upcomingDeadlines: Array.from({ length: deadlineCount }, () =>
			generateUpcomingDeadlineDto(),
		),
		suggestedAction: generateSuggestedActionDto(),
	};
}

// ============================================
// Batch Generators
// ============================================

/**
 * Generate multiple instances of a type
 */
export function generateMany<T>(generator: () => T, count: number = 10): T[] {
	return Array.from({ length: count }, generator);
}

/**
 * Generate a random number of instances
 */
export function generateRandom<T>(
	generator: () => T,
	min: number = 1,
	max: number = 10,
): T[] {
	return generateMany(generator, faker.number.int({ min, max }));
}
