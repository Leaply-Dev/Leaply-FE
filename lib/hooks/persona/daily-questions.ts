/**
 * Persona Lab - Daily Questions Hooks
 * Daily question prompts and answers
 */

export {
	getGetQuestionQueryKey,
	// Query keys for cache management
	getGetTodaysQuestionsQueryKey,
	getGetUnansweredQuestionsQueryKey,
	useAnswerDailyQuestion,
	// Mutations
	useGetDailyQuestions,
	useGetQuestion,
	// Queries
	useGetTodaysQuestions,
	useGetUnansweredQuestions,
} from "@/lib/generated/api/endpoints/persona-lab/persona-lab";
