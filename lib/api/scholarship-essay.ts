/**
 * Scholarship essay prompt API hook.
 * Thin wrapper around the generated `useUpdateEssayPrompt` mutation that
 * also invalidates the application + list query keys, matching the pattern
 * of `useSavePrompt` on the program side (`lib/api/sop-workspace.ts`).
 *
 * Backend contract: PATCH /v1/scholarship-applications/{applicationId}/essay-prompt
 */

import { useQueryClient } from "@tanstack/react-query";
import {
	getGetApplicationQueryKey,
	getGetApplicationsQueryKey,
	useUpdateEssayPrompt,
} from "@/lib/generated/api/endpoints/scholarship-applications/scholarship-applications";
import type { UpdateScholarshipEssayPromptRequest } from "@/lib/generated/api/models";

export type SaveScholarshipEssayPromptRequest =
	UpdateScholarshipEssayPromptRequest;

export function useSaveScholarshipEssayPrompt() {
	const queryClient = useQueryClient();
	return useUpdateEssayPrompt({
		mutation: {
			onSuccess: (_, { applicationId }) => {
				queryClient.invalidateQueries({
					queryKey: getGetApplicationQueryKey(applicationId),
				});
				queryClient.invalidateQueries({
					queryKey: getGetApplicationsQueryKey(),
				});
			},
		},
	});
}
