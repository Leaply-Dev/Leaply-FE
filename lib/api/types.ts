export interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
	error?: ErrorDetails;
	timestamp: string;
}

export interface ErrorDetails {
	code: string;
	field: string;
	details: Record<string, any>;
}

// Authentication
export interface RegisterRequest {
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	userId: string;
	email: string;
	token: string;
	onboardingCompleted: boolean;
}

// Onboarding
export interface Step1Request {
	fullName: string;
	currentLevel: "high_school" | "undergrad" | "graduate" | "working";
	targetDegree: "bachelors" | "masters" | "mba" | "phd";
}

export interface Step2Request {
	targetRegions: string[];
	budgetRange: string;
	targetFields: string[];
	targetIntake: string;
}

export interface Step3Request {
	direction: "exploring" | "has_target";
}

export interface OnboardingResponse {
	currentStep: number;
	nextStep: number;
	completed: boolean;
	redirectTo: string;
	message: string;
}

export interface OnboardingStatusResponse {
	currentStep: number;
	completed: boolean;
	data: Record<string, any>;
}

// Persona Lab
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
