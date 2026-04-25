/**
 * Type-safe PostHog event definitions.
 * All events fired through analytics.track() must appear here.
 * Unknown event names are compile errors.
 */

// ─── Existing events (Phase 01 migration) ────────────────────────────────────

export interface UserLoggedInProps {
	email?: string;
	onboarding_completed: boolean;
}

export interface UserSignedUpProps {
	email?: string;
	name?: string;
}

export interface GoogleOauthInitiatedProps {
	variant?: string;
}

export interface GoogleOauthCompletedProps {
	user_id?: string;
	onboarding_completed?: boolean;
}

export interface OnboardingStepCompletedProps {
	step: number;
	step_name: string;
}

export interface OnboardingCompletedProps {
	journey_type: string | null;
}

export interface PersonaLabIntakeStepCompletedProps {
	step: number;
	step_name?: string;
}

export interface PersonaLabIntakeCompletedProps {
	total_steps?: number;
}

export interface PersonaLabMessageSentProps {
	message_length: number;
	story_node_count?: number;
}

export interface ArchetypeRevealedProps {
	archetype_type: string;
	rarity?: string | number;
}

export interface SopCompletedProps {
	application_id: string;
}

export interface ProgramApplyClickedProps {
	program_id: string;
}

export interface ProgramCompareOpenedProps {
	program_count: number;
}

// ─── New events (Phase 02) ────────────────────────────────────────────────────

export interface OnboardingStartedProps {
	journey_type?: string | null;
}

export interface ProgramSearchPerformedProps {
	query: string;
	filter_count: number;
	results_count: number;
}

export interface ProgramSavedProps {
	program_id: string;
	source?: "search" | "compare" | "detail";
}

export interface ProgramUnsavedProps {
	program_id: string;
}

export interface ProgramViewedProps {
	program_id: string;
	source?: string;
}

export interface ScholarshipViewedProps {
	scholarship_id: string;
}

export interface ScholarshipBookmarkedProps {
	scholarship_id: string;
}

export interface ScholarshipUnbookmarkedProps {
	scholarship_id: string;
}

// ─── Event registry ───────────────────────────────────────────────────────────

export interface EventRegistry {
	user_logged_in: UserLoggedInProps;
	user_signed_up: UserSignedUpProps;
	google_oauth_initiated: GoogleOauthInitiatedProps;
	google_oauth_completed: GoogleOauthCompletedProps;
	onboarding_started: OnboardingStartedProps;
	onboarding_step_completed: OnboardingStepCompletedProps;
	onboarding_completed: OnboardingCompletedProps;
	persona_lab_intake_step_completed: PersonaLabIntakeStepCompletedProps;
	persona_lab_intake_completed: PersonaLabIntakeCompletedProps;
	persona_lab_message_sent: PersonaLabMessageSentProps;
	archetype_revealed: ArchetypeRevealedProps;
	sop_completed: SopCompletedProps;
	program_apply_clicked: ProgramApplyClickedProps;
	program_compare_opened: ProgramCompareOpenedProps;
	program_search_performed: ProgramSearchPerformedProps;
	program_saved: ProgramSavedProps;
	program_unsaved: ProgramUnsavedProps;
	program_viewed: ProgramViewedProps;
	scholarship_viewed: ScholarshipViewedProps;
	scholarship_bookmarked: ScholarshipBookmarkedProps;
	scholarship_unbookmarked: ScholarshipUnbookmarkedProps;
}

export type EventName = keyof EventRegistry;
export type EventProps<E extends EventName> = EventRegistry[E];
