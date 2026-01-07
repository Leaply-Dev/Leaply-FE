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

export interface UserMeResponse {
	// Account info
	userId: string;
	email: string;
	emailVerified?: boolean;
	createdAt?: string;
	// Profile info
	fullName?: string;
	currentEducationLevel?: string;
	targetDegree?: string;
	gpa?: number;
	gpaScale?: number;
	testScores?: Record<string, string>;
	workExperienceYears?: number;
	profileCompletion?: number;
	// Preferences
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

export interface OnboardingStatusResponse {
	currentStep: number;
	completed: boolean;
	data?: Record<string, any>;
}

export interface OnboardingResponse {
	currentStep: number;
	nextStep: number;
	completed: boolean;
	redirectTo?: string;
	message?: string;
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
	sort?:
		| "fit_score"
		| "ranking_qs"
		| "tuition_asc"
		| "tuition_desc"
		| "deadline";
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
	universityCity?: string;
	universityLogoUrl?: string;
	rankingQs?: number;
	programName: string;
	degreeType: string;
	degreeName?: string; // Can be null from backend
	majorCategories: string[];
	durationMonths?: number;
	deliveryMode?: string;
	tuitionAnnualUsd?: number;
	scholarshipAvailable?: boolean;
	ieltsMinimum?: number;
	toeflMinimum?: number;
	nextDeadline?: string; // ISO date string: "2025-01-15"
	nextIntake?: string; // e.g., "Fall 2025"
	fitScore?: number; // 0-100, null if not authenticated
	fitCategory?: "reach" | "target" | "safety";
	fitReasons?: string[];
	fitGaps?: string[];
	isSaved?: boolean; // null if not authenticated
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
// Applications API
// ============================================

export interface CreateApplicationRequest {
	programId: string;
	intakeId?: string;
}

export interface CreateApplicationResponse {
	id: string;
	message: string;
}

export interface UpdateApplicationRequest {
	status?: "planning" | "writing" | "submitted";
}

export interface UpdateApplicationResponse {
	id: string;
	status: string;
	updatedAt: string;
}

export interface DeleteApplicationResponse {
	success: boolean;
	message: string;
}

export interface ProgramSummaryDto {
	id: string;
	universityName: string;
	programName: string;
	degreeName: string;
	nextDeadline?: string;
	nextIntake?: string;
}

export interface GapDto {
	field: string;
	message: string;
	severity: string;
}

export interface ApplicationResponse {
	id: string;
	program: ProgramSummaryDto;
	status: string;
	fitScore?: number;
	fitCategory?: string;
	gaps?: GapDto[];
	sopStatus?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ApplicationSummaryDto {
	total: number;
	byStatus: Record<string, number>;
	byCategory: Record<string, number>;
}

export interface UpcomingDeadlineDto {
	applicationId: string;
	programName: string;
	deadline: string;
	daysRemaining: number;
}

export interface ApplicationListResponse {
	applications: ApplicationResponse[];
	summary: ApplicationSummaryDto;
	upcomingDeadlines: UpcomingDeadlineDto[];
}

// SOP Types
export interface SaveSopRequest {
	content: string;
	wordLimit?: number;
	prompt?: string;
}

export interface SaveSopResponse {
	id: string;
	wordCount: number;
	updatedAt: string;
}

export interface ImprovementDto {
	point: string;
	suggestion: string;
}

export interface SopFeedbackDto {
	round: number;
	strengths: string[];
	improvements: ImprovementDto[];
	personaSuggestion?: string;
	structureNote?: string;
	generatedAt: string;
}

export interface ApplicationSopResponse {
	id: string;
	applicationId: string;
	wordLimit?: number;
	prompt?: string;
	content?: string;
	wordCount?: number;
	feedbackRound?: number;
	lastFeedback?: SopFeedbackDto;
	updatedAt: string;
}

// Evaluation Types
export interface SchoolGapDto {
	applicationId: string;
	programName: string;
	gaps: GapDto[];
}

export interface CommonGapDto {
	field: string;
	count: number;
	message: string;
}

export interface EvaluationResponse {
	schoolGaps: SchoolGapDto[];
	commonGaps: CommonGapDto[];
	suggestions?: string;
	profileCompleteness?: number;
	missingFields?: string[];
}

// ============================================
// Persona Lab
// ============================================

export type TrackType =
	| "FUTURE_VISION"
	| "ACADEMIC_JOURNEY"
	| "ACTIVITIES_IMPACT"
	| "VALUES_TURNING_POINTS";

// Legacy Track Types
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

// New Persona State Types
export interface TrackDto {
	id: string;
	displayName: string;
	description: string;
	icon: string;
	status: string;
	completedAt?: string;
}

export interface ArchetypeDto {
	type: string;
	personalizedSummary: string;
	revealedAt?: string;
}

export interface ArchetypeReveal {
	type: string;
	personalizedSummary: string;
}

export interface CanvasNodeDto {
	id: string;
	type: string;
	title: string;
	content: string;
	sourceTrackId?: string;
	createdAt?: string;
	archetypeType?: string;
	personalizedSummary?: string;
}

export interface TrackActionDto {
	trackId: string;
	displayName: string;
	icon: string;
	status: string;
}

export interface CanvasActionDto {
	action: string;
	node?: CanvasNodeDto;
	nodeId?: string;
	archetype?: ArchetypeReveal;
}

export interface ChatMessageDto {
	id: string;
	role: string;
	content: string;
	type?: string;
	timestamp?: string;
	actions?: TrackActionDto[];
	canvasActions?: CanvasActionDto[];
	trackId?: string;
}

export interface PersonaStateResponse {
	userId: string;
	tracks: Record<string, TrackDto>;
	nodes: CanvasNodeDto[];
	archetype?: ArchetypeDto;
	conversationHistory: ChatMessageDto[];
	currentTrackId?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Track Selection & Navigation
export interface TrackSelectRequest {
	trackId: string;
}

export interface TrackSelectResponse {
	message: ChatMessageDto;
	trackStatus: string;
	currentTrackId?: string;
}

export interface BackToTrackResponse {
	message: ChatMessageDto;
	currentTrackId?: string;
}

export interface RedoTrackResponse {
	message: ChatMessageDto;
	trackStatus: string;
	currentTrackId?: string;
	removedNodeIds?: string[];
}

// Messaging
export interface MessageRequest {
	content: string;
}

export interface ConversationState {
	coreQuestionIndex: number;
	followUpIndex: number;
	totalCoreQuestions: number;
}

export interface MessageResponse {
	message: ChatMessageDto;
	conversationState?: ConversationState;
	trackStatus: string;
	currentTrackId?: string;
	allTracksComplete?: boolean;
}

// Synthesis & Archetype
export interface SynthesisResponse {
	track: string;
	layers: Record<string, any>;
	success: boolean;
	message: string;
	nodeCount?: number;
}

export interface ArchetypeResponse {
	archetype: Record<string, any>;
	success: boolean;
	message: string;
	completedTracks: number;
	isComplete?: boolean;
}

// ============================================
// Home API
// ============================================

export interface DiscoveryProgressDto {
	completedTracks: number;
	totalTracks: number;
	archetypeRevealed: boolean;
}

export interface SuggestedActionDto {
	type: string; // "persona" | "explore" | "profile" | "deadline" | "writing"
	title: string;
	description: string;
	link: string;
}

export interface RecentApplicationDto {
	id: string;
	universityName: string;
	programName: string;
	status: string;
	fitScore?: number;
}

export interface HomeResponse {
	firstName: string;
	profileCompletion: number;
	journeyType?: string;
	discovery: DiscoveryProgressDto;
	applications: ApplicationSummaryDto;
	recentApplications: RecentApplicationDto[];
	upcomingDeadlines: UpcomingDeadlineDto[];
	suggestedAction: SuggestedActionDto;
}
