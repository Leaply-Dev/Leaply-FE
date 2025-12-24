export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	error?: ErrorDetails;
	timestamp: string;
}

export interface ErrorDetails {
	code?: string;
	field?: string;
	details?: Record<string, any>;
}

// ============================================
// Authentication
// ============================================

export interface RegisterRequest {
	fullName: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface GoogleAuthRequest {
	idToken: string;
}

export interface AuthResponse {
	userId: string;
	email: string;
	token: string;
	onboardingCompleted: boolean;
}

// ============================================
// User Context & Profile
// ============================================

export interface UserInfo {
	id: string;
	email: string;
	isEmailVerified: boolean;
	isOnboardingComplete: boolean;
	createdAt: string;
}

export interface ProfileInfo {
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: string;
	gpaScale?: string;
	testScores?: Record<string, string>;
}

export interface PreferencesInfo {
	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}

export interface UserContextResponse {
	user: UserInfo;
	profile: ProfileInfo;
	preferences: PreferencesInfo;
}

export interface ProfileResponse {
	userId: string;
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: number;
	testScores?: Record<string, string>;
	workExperienceYears?: number;
	profileCompletion?: number;
}

export interface UpdateProfileRequest {
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: number;
	currentMajor?: string;
	testScores?: Record<string, string>;
	intendedStartYear?: number;
	workExperienceYears?: number;
}

export interface PreferencesResponse {
	userId: string;
	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}

export interface UpdatePreferencesRequest {
	fieldOfInterest?: string[];
	preferredRegions?: string[];
	intendedStartTerm?: string;
	budgetLabel?: string;
	journeyType?: string;
	programType?: string;
	campusSetting?: string;
	interests?: string[];
}

// ============================================
// Onboarding
// ============================================

export interface UpdateOnboardingRequest {
	fullName?: string;
	currentLevel?: "high_school" | "undergrad" | "graduate" | "working";
	targetDegree?: "bachelors" | "masters" | "mba" | "phd";
	targetRegions?: string[];
	budgetRange?: string;
	targetFields?: string[];
	targetIntake?: string;
	direction?: "exploring" | "has_target";
}

export interface OnboardingDataResponse {
	completedSteps: number;
	isComplete: boolean;
}

// ============================================
// Explore API
// ============================================

export interface ProgramListParams {
	search?: string;
	majors?: string;
	countries?: string;
	regions?: string;
	degree_types?: string;
	tuition_max?: number;
	ielts_max?: number;
	scholarship_only?: boolean;
	deadline_within?: number;
	sort?: "fit_score" | "ranking_qs" | "tuition_asc" | "tuition_desc" | "deadline";
	sort_dir?: "asc" | "desc";
	page?: number;
	size?: number;
}

export interface PaginationResponse {
	page: number;
	size: number;
	total: number;
	totalPages: number;
}

export interface ProgramListItemResponse {
	id: string;
	universityId: string;
	universityName: string;
	universityCountry: string;
	universityCity: string;
	universityLogoUrl?: string;
	rankingQs?: number;
	programName: string;
	degreeType: string;
	degreeName: string;
	majorCategories: string[];
	durationMonths?: number;
	deliveryMode?: string;
	tuitionAnnualUsd?: number;
	scholarshipAvailable?: boolean;
	ieltsMinimum?: number;
	toeflMinimum?: number;
	nextDeadline?: string;
	nextIntake?: string;
	fitScore?: number;
	fitCategory?: "reach" | "target" | "safety";
	fitReasons?: string[];
	fitGaps?: string[];
	isSaved?: boolean;
}

export interface ProgramListResponse {
	data: ProgramListItemResponse[];
	pagination: PaginationResponse;
	appliedFilters?: Record<string, any>;
}

export interface TuitionResponse {
	annualUsd?: number;
	totalUsd?: number;
	notes?: string;
}

export interface RequirementsResponse {
	gpaMinimum?: number;
	gpaScale?: number;
	ieltsMinimum?: number;
	toeflMinimum?: number;
	greRequired?: boolean;
	gmatRequired?: boolean;
	workExperienceYears?: number;
	documents?: string[];
	notes?: string;
}

export interface ProgramIntakeResponse {
	id: string;
	season: string;
	seasonDisplay: string;
	applicationStartDate?: string;
	applicationDeadline?: string;
	earlyDeadline?: string;
	startDate?: string;
	isActive: boolean;
}

export interface ProgramDetailResponse extends ProgramListItemResponse {
	universityWebsiteUrl?: string;
	universityDescription?: string;
	rankingTimes?: number;
	rankingNational?: number;
	language?: string;
	programDescription?: string;
	programUrl?: string;
	admissionsUrl?: string;
	tuition?: TuitionResponse;
	applicationFeeUsd?: number;
	requirements?: RequirementsResponse;
	intakes?: ProgramIntakeResponse[];
}

export interface FilterOption {
	value: string;
	label: string;
	count: number;
}

export interface RangeOption {
	min: number;
	max: number;
	currency?: string;
}

export interface FilterOptionsResponse {
	majors: FilterOption[];
	countries: FilterOption[];
	regions: FilterOption[];
	degreeTypes: FilterOption[];
	tuitionRange?: RangeOption;
	ieltsRange?: RangeOption;
}

export interface AiMatchResponse {
	reach: ProgramListItemResponse[];
	target: ProgramListItemResponse[];
	safety: ProgramListItemResponse[];
	recommendation?: string;
	profileCompleteness?: number;
	missingFields?: string[];
	totalMatched: number;
}

export interface SaveProgramResponse {
	success: boolean;
	message: string;
	savedCount: number;
}

// ============================================
// Persona Lab
// ============================================

export type TrackType =
	| "FUTURE_VISION"
	| "ACADEMIC_JOURNEY"
	| "ACTIVITIES_IMPACT"
	| "VALUES_TURNING_POINTS";

export interface TrackStartResponse {
	track: string;
	displayName: string;
	description: string;
	status: string;
	progress: number;
	openingMessage: string;
	coreQuestions: string[];
	resuming: boolean;
}

export interface ConversationRequest {
	message: string;
}

export interface ConversationResponse {
	userMessage: string;
	assistantMessage: string;
	responseType: string;
	currentProgress: number;
	trackComplete: boolean;
}

export interface SynthesisResponse {
	track: string;
	layers: Record<string, any>;
	success: boolean;
	message: string;
}

export interface ArchetypeResponse {
	archetype: Record<string, any>;
	success: boolean;
	message: string;
	completedTracks: number;
}

export interface TrackSummary {
	status: string;
	progress: number;
	displayName: string;
	description: string;
}

export interface PersonaResponse {
	archetype: Record<string, any>;
	tracks: Record<string, TrackSummary>;
	lastActiveTrack: string;
}

export interface TrackDetailResponse {
	track: string;
	displayName: string;
	description: string;
	status: string;
	progress: number;
	layers: Record<string, any>;
	coreQuestions: string[];
	recentMessages: Record<string, any>[];
}
