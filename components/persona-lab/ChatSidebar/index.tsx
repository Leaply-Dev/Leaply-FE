"use client";

import { useIsMutating, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	getPillarCoverageQueryKey,
	getTierProgressQueryKey,
	useGetPillarCoverage,
	useGetTierProgress,
} from "@/lib/api/personaLab/hooks";
import type {
	GraphMessageResponse,
	PersonaNodeDto,
	PillarCoverageDto,
	TierProgressDto,
} from "@/lib/api/personaLab/types";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import type { ArchetypeKey } from "@/lib/config/archetypeConfig";
import {
	type CanvasActionDto,
	PersonaNodeDtoType,
} from "@/lib/generated/api/models";
import {
	getGetCoverageQueryKey,
	getGetGraphQueryKey,
	getGetPersonaStateQueryKey,
	useGenerateArchetype,
	useSendGraphMessage,
	useStartConversation,
} from "@/lib/hooks/persona";
import { useIsHydrated } from "@/lib/hooks/useStoresHydrated";
import type { StarStructureKey } from "@/lib/store/personaStore";
import {
	type ConversationMessage,
	selectApiGraphNodes,
	selectCurrentTier,
	selectPillarCoverage,
	selectUnlockedMilestones,
	usePersonaStore,
} from "@/lib/store/personaStore";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage, TypingIndicator } from "./ChatMessage";
import { GreetingReplyOption } from "./GreetingReplyOption";
import { MessageInput } from "./MessageInput";

export function ChatSidebar() {
	const t = useTranslations("personaLab");
	const queryClient = useQueryClient();
	const scrollRef = useRef<HTMLDivElement>(null);
	const [thinkingStartTime, setThinkingStartTime] = useState<number | null>(
		null,
	);
	const [_latestStory, setLatestStory] = useState<{
		node: PersonaNodeDto;
		gaps: StarStructureKey[];
	} | null>(null);

	const messages = usePersonaStore((state) => state.graphMessages);
	const addGraphMessage = usePersonaStore((state) => state.addGraphMessage);
	const updateMessageStatus = usePersonaStore(
		(state) => state.updateMessageStatus,
	);

	const processGraphUpdate = usePersonaStore(
		(state) => state.processGraphUpdate,
	);

	const pillarCoverage = usePersonaStore(selectPillarCoverage);
	const setTierProgress = usePersonaStore((state) => state.setTierProgress);
	const setPillarCoverage = usePersonaStore((state) => state.setPillarCoverage);

	const archetypeRevealed = usePersonaStore((state) => state.archetypeRevealed);
	const completionReady = usePersonaStore((state) => state.completionReady);

	const currentTier = usePersonaStore(selectCurrentTier);
	const unlockedMilestones = usePersonaStore(selectUnlockedMilestones);

	const isHydrated = useIsHydrated();

	const setArchetype = usePersonaStore((state) => state.setArchetype);

	const { data: tierProgressResponse } = useGetTierProgress({
		query: { enabled: isHydrated },
	});
	const { data: pillarCoverageResponse } = useGetPillarCoverage({
		query: { enabled: isHydrated },
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: sync on response change
	useEffect(() => {
		const data = unwrapResponse<TierProgressDto>(tierProgressResponse);
		if (data) setTierProgress(data);
	}, [tierProgressResponse]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: sync on response change
	useEffect(() => {
		const data = unwrapResponse<PillarCoverageDto>(pillarCoverageResponse);
		if (data) setPillarCoverage(data);
	}, [pillarCoverageResponse]);

	const greetingMessage: ConversationMessage = {
		id: "assistant-greeting-static",
		role: "assistant",
		type: "text",
		content: t("greetingMessage"),
		timestamp: new Date(0).toISOString(),
	};
	// Conversation has started if any message exists (user bubble OR assistant opener)
	const hasSentFirstReply = messages.length > 0;
	const showGreeting = isHydrated && messages.length === 0;

	const sendMessageMutation = useSendGraphMessage();
	const generateArchetypeMutation = useGenerateArchetype();
	const { refetch: triggerStartConversation, isFetching: isStarting } =
		useStartConversation({
			query: { enabled: false, staleTime: Number.POSITIVE_INFINITY },
		});
	const resetInFlight =
		useIsMutating({ mutationKey: ["resetConversation"] }) > 0;

	const apiGraphNodes = usePersonaStore(selectApiGraphNodes);
	const storyNodeCount = apiGraphNodes.filter(
		(n) => n.type === PersonaNodeDtoType.key_story,
	).length;

	const messageCount = messages.length;
	// biome-ignore lint/correctness/useExhaustiveDependencies: messageCount is intentionally used as a trigger
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messageCount, sendMessageMutation.isPending]);

	const handleSendMessage = useCallback(
		async (content: string) => {
			posthog.capture("persona_lab_message_sent", {
				message_length: content.length,
				story_node_count: storyNodeCount,
			});

			const startTime = Date.now();
			setThinkingStartTime(startTime);

			const userMessage: ConversationMessage = {
				id: `user-${Date.now()}`,
				role: "user",
				type: "text",
				content,
				timestamp: new Date().toISOString(),
				status: "sending",
			};
			addGraphMessage(userMessage);

			sendMessageMutation.mutate(
				{ data: { content } },
				{
					onSuccess: (response) => {
						const thinkingDuration = Date.now() - startTime;
						setThinkingStartTime(null);

						updateMessageStatus(userMessage.id, "sent");

						const graphData = unwrapResponse<GraphMessageResponse>(response);

						if (graphData?.message) {
							// Prepend transition message if present
							const messageContent = graphData.transitionMessage
								? `${graphData.transitionMessage}\n\n${graphData.message.content || ""}`
								: graphData.message.content || "";

							const assistantMessage: ConversationMessage = {
								id: graphData.message.id || `assistant-${Date.now()}`,
								role:
									(graphData.message.role as "user" | "assistant") ||
									"assistant",
								type:
									(graphData.message.type as ConversationMessage["type"]) ||
									"text",
								content: messageContent,
								timestamp:
									graphData.message.timestamp || new Date().toISOString(),
								thinkingDuration,
								status: "sent",
							};
							addGraphMessage(assistantMessage);
						}

						// Always process graph update to store v2 fields (tier, milestones, etc.)
						// even when nodesCreated is empty (async extraction)
						if (graphData) {
							processGraphUpdate(graphData);

							const nodesCreated = graphData.nodesCreated ?? [];
							const storyNode = nodesCreated.find(
								(n: PersonaNodeDto) => n.type === "key_story",
							);
							if (storyNode) {
								setLatestStory({ node: storyNode, gaps: [] });
							} else {
								setLatestStory(null);
							}

							const storyCount = nodesCreated.filter(
								(n: PersonaNodeDto) => n.type === "key_story",
							).length;
							const detailCount = nodesCreated.filter(
								(n: PersonaNodeDto) => n.type === "detail",
							).length;

							if (storyCount > 0) {
								toast.success("Story captured!", {
									description: `Added ${storyCount} story${storyCount > 1 ? "s" : ""} to your profile`,
								});
							} else if (detailCount > 0) {
								toast.info("Details added", {
									description: `${detailCount} insight${detailCount > 1 ? "s" : ""} added to your graph`,
								});
							}
						}

						// Immediate graph refetch to catch any sync-extracted nodes
						queryClient.refetchQueries({
							queryKey: getGetGraphQueryKey(),
						});

						// Delayed graph refetch to catch async-extracted nodes (Call B)
						setTimeout(() => {
							queryClient.refetchQueries({
								queryKey: getGetGraphQueryKey(),
							});
							queryClient.refetchQueries({
								queryKey: getTierProgressQueryKey(),
							});
							queryClient.refetchQueries({
								queryKey: getPillarCoverageQueryKey(),
							});
						}, 2500);

						if (graphData?.completionReady) {
							const completionMessage: ConversationMessage = {
								id: `completion-${Date.now()}`,
								role: "assistant",
								type: "completion",
								content: t("conversationComplete"),
								timestamp: new Date().toISOString(),
							};
							addGraphMessage(completionMessage);

							generateArchetypeMutation.mutate(undefined, {
								onSuccess: (archetypeResponse) => {
									const archetypeData =
										unwrapResponse<CanvasActionDto>(archetypeResponse);
									if (archetypeData?.archetype?.type) {
										setArchetype(
											archetypeData.archetype.type as ArchetypeKey,
											archetypeData.archetype.personalizedSummary,
											archetypeData.archetype.rarity,
										);
										posthog.capture("archetype_revealed", {
											archetype_type: archetypeData.archetype.type,
											rarity: archetypeData.archetype.rarity,
										});
										toast.success(t("archetypeRevealed"), {
											description: t("archetypeRevealedDesc"),
										});

										// Ensure center profile node and archetype-derived graph/state
										// are refreshed after backend synthesis completes.
										queryClient.invalidateQueries({
											queryKey: getGetPersonaStateQueryKey(),
										});
										queryClient.refetchQueries({
											queryKey: getGetGraphQueryKey(),
										});
									}
								},
							});
						}

						queryClient.invalidateQueries({
							queryKey: getGetCoverageQueryKey(),
						});
						queryClient.invalidateQueries({
							queryKey: getGetPersonaStateQueryKey(),
						});
						queryClient.invalidateQueries({
							queryKey: getTierProgressQueryKey(),
						});
						queryClient.invalidateQueries({
							queryKey: getPillarCoverageQueryKey(),
						});
						queryClient.refetchQueries({
							queryKey: getGetGraphQueryKey(),
						});
					},
				},
			);
		},
		[
			sendMessageMutation,
			t,
			processGraphUpdate,
			addGraphMessage,
			updateMessageStatus,
			queryClient,
			generateArchetypeMutation,
			setArchetype,
			storyNodeCount,
		],
	);

	const handleStartConversation = useCallback(
		async (starterMessage: string) => {
			// Show user bubble immediately (cosmetic only — never POSTed to the backend)
			addGraphMessage({
				id: `user-start-${Date.now()}`,
				role: "user",
				type: "text",
				content: starterMessage,
				timestamp: new Date().toISOString(),
				status: "sent",
			});

			const startTime = Date.now();
			setThinkingStartTime(startTime);

			const { data } = await triggerStartConversation();
			setThinkingStartTime(null);

			const graphData = unwrapResponse<GraphMessageResponse>(data);
			if (graphData?.message) {
				addGraphMessage({
					id: graphData.message.id || `assistant-${Date.now()}`,
					role: "assistant",
					type:
						(graphData.message.type as ConversationMessage["type"]) || "text",
					content: graphData.message.content || "",
					timestamp: graphData.message.timestamp || new Date().toISOString(),
					status: "sent",
				});
			}

			queryClient.invalidateQueries({ queryKey: getGetPersonaStateQueryKey() });
		},
		[triggerStartConversation, addGraphMessage, queryClient],
	);

	const isSending =
		sendMessageMutation.isPending || resetInFlight || isStarting;
	const error = sendMessageMutation.error?.message;

	if (!isHydrated) {
		return (
			<div className="flex flex-col h-full">
				<ChatHeader
					pillarCoverage={pillarCoverage}
					completionReady={false}
					currentTier={currentTier}
					unlockedMilestones={unlockedMilestones}
				/>
				<div className="flex-1 min-h-0 p-4 space-y-4">
					<div className="h-16 bg-muted/50 rounded-lg animate-pulse" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
					<div className="h-12 bg-muted/30 rounded-lg animate-pulse ml-8" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full min-h-0 overflow-hidden">
			<ChatHeader
				pillarCoverage={pillarCoverage}
				completionReady={completionReady}
				currentTier={currentTier}
				unlockedMilestones={unlockedMilestones}
			/>

			<ScrollArea className="flex-1 p-3" type="always">
				<div className="space-y-3">
					{showGreeting && <ChatMessage message={greetingMessage} />}

					{messages.map((message, index) => (
						<ChatMessage key={`${message.id}-${index}`} message={message} />
					))}

					{isSending && <TypingIndicator startTime={thinkingStartTime} />}

					{error && (
						<div className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
							{error}
						</div>
					)}

					<div ref={scrollRef} />
				</div>
			</ScrollArea>

			<div className="shrink-0">
				{completionReady && archetypeRevealed ? (
					<MessageInput
						onSend={handleSendMessage}
						disabled={true}
						completionMessage={t("conversationCompleteNote")}
						completionCtaLabel={t("goToEssayAssistant")}
						completionCtaHref="/dashboard/applications"
					/>
				) : !hasSentFirstReply ? (
					<GreetingReplyOption
						options={[
							t("greetingReplyOption"),
							t("greetingReplyOptionAcademic"),
							t("greetingReplyOptionImpact"),
						]}
						onSelect={handleStartConversation}
						disabled={isSending}
					/>
				) : (
					<MessageInput
						onSend={handleSendMessage}
						disabled={isSending}
						placeholder={t("shareYourStory")}
					/>
				)}
			</div>
		</div>
	);
}
