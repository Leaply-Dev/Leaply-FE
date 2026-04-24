"use client";

import {
	useIsFetching,
	useIsMutating,
	useQueryClient,
} from "@tanstack/react-query";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	getGetCoverageQueryKey,
	getGetPersonaStateQueryKey,
	getStartConversationQueryKey,
	useResetConversation,
} from "@/lib/hooks/persona";
import { usePersonaStore } from "@/lib/store/personaStore";

/**
 * Resets graph conversation; disabled while send/reset/start is in progress (matches chat sidebar).
 */
export function PersonaResetDataButton() {
	const t = useTranslations("personaLab");
	const queryClient = useQueryClient();
	const [open, setOpen] = useState(false);

	const clearGraphMessages = usePersonaStore(
		(state) => state.clearGraphMessages,
	);
	const clearApiGraph = usePersonaStore((state) => state.clearApiGraph);

	const resetMutation = useResetConversation();

	const sendInFlight = useIsMutating({ mutationKey: ["sendGraphMessage"] }) > 0;
	const resetInFlight =
		useIsMutating({ mutationKey: ["resetConversation"] }) > 0;
	const startInFlight =
		useIsFetching({ queryKey: getStartConversationQueryKey() }) > 0;
	const isBusy = sendInFlight || resetInFlight || startInFlight;

	const handleReset = useCallback(() => {
		setOpen(false);
		resetMutation.mutate(undefined, {
			onSuccess: () => {
				clearGraphMessages();
				clearApiGraph();
				queryClient.removeQueries({ queryKey: getGetPersonaStateQueryKey() });
				queryClient.invalidateQueries({ queryKey: getGetCoverageQueryKey() });
				queryClient.invalidateQueries({
					queryKey: getStartConversationQueryKey(),
				});
			},
		});
	}, [resetMutation, clearApiGraph, clearGraphMessages, queryClient]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="h-8 gap-1.5 text-sm text-muted-foreground hover:text-foreground"
					disabled={isBusy}
				>
					<RotateCcw className="h-3.5 w-3.5" />
					<span className="hidden sm:inline">{t("resetData")}</span>
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t("resetConfirmTitle")}</DialogTitle>
					<DialogDescription>{t("resetConfirmDescription")}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => setOpen(false)}>
						{t("cancel")}
					</Button>
					<Button variant="destructive" onClick={handleReset}>
						{t("confirmReset")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
