/**
 * Scholarship essay prompt API hook.
 * Manual implementation while backend endpoint ships — mirrors `useSavePrompt`
 * from `lib/api/sop-workspace.ts` for the program-side SOP prompt.
 *
 * Backend contract: PATCH /v1/scholarship-applications/{applicationId}/essay-prompt
 * Body: { prompt?: string; wordLimit?: number }
 * See Leaply-BE/docs/PLAN_essay_prompt_for_scholarship.md.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	getGetApplicationQueryKey,
	getGetApplicationsQueryKey,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import customFetch from "./mutator";

export interface SaveScholarshipEssayPromptRequest {
	prompt?: string;
	wordLimit?: number;
}

export function useSaveScholarshipEssayPrompt() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			applicationId,
			data,
		}: {
			applicationId: string;
			data: SaveScholarshipEssayPromptRequest;
		}) => {
			await customFetch(
				`/v1/scholarship-applications/${applicationId}/essay-prompt`,
				{
					method: "PATCH",
					body: JSON.stringify(data),
					headers: { "Content-Type": "application/json" },
				},
			);
		},
		onSuccess: (_, { applicationId }) => {
			queryClient.invalidateQueries({
				queryKey: getGetApplicationQueryKey(applicationId),
			});
			queryClient.invalidateQueries({
				queryKey: getGetApplicationsQueryKey(),
			});
		},
	});
}
