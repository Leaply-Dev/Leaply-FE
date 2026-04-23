"use client";

import { BookOpen, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEvidence } from "@/lib/api/sop-workspace";
import type { EvidenceCardDto } from "@/lib/generated/api/models";
import { usePersonaStore } from "@/lib/store/personaStore";
import type { PersonaNodeDto } from "@/lib/store/personaStore";
import { EvidencePanel } from "./EvidencePanel";
import { StoryCard } from "./StoryCard";

interface PersonaStoryDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	applicationId: string;
	sectionIndex: number;
	linkedNodeIds?: string[];
	onInsertContent: (text: string) => void;
}

function resolveStories(
	linkedNodeIds: string[] | undefined,
	allNodes: PersonaNodeDto[],
): PersonaNodeDto[] {
	if (linkedNodeIds && linkedNodeIds.length > 0) {
		const nodeMap = new Map(allNodes.map((n) => [n.id, n]));
		const resolved = linkedNodeIds
			.map((id) => nodeMap.get(id))
			.filter(Boolean) as PersonaNodeDto[];
		if (resolved.length > 0) return resolved;
	}

	// Fallback: top 3 key_story nodes sorted by completeness
	const keyStories = allNodes.filter((n) => n.type === "key_story");
	return keyStories
		.sort((a, b) => {
			const aScore = countStarElements(a);
			const bScore = countStarElements(b);
			return bScore - aScore;
		})
		.slice(0, 3);
}

function countStarElements(node: PersonaNodeDto): number {
	const sc = node.structuredContent ?? {};
	let count = 0;
	for (const key of ["Situation", "Task", "Action", "Result", "Emotion", "Insight"]) {
		if (sc[key]) count++;
	}
	return count;
}

export function PersonaStoryDrawer({
	open,
	onOpenChange,
	applicationId,
	sectionIndex,
	linkedNodeIds,
	onInsertContent,
}: PersonaStoryDrawerProps) {
	const t = useTranslations("sop");
	const allNodes = usePersonaStore((state) => state.apiGraphNodes);

	const stories = useMemo(
		() => resolveStories(linkedNodeIds, allNodes),
		[linkedNodeIds, allNodes],
	);

	const { data: evidenceData, isLoading: evidenceLoading } = useEvidence(
		applicationId,
		sectionIndex,
	);
	const evidenceCards = evidenceData?.evidenceCards;

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent className="sm:max-w-md w-full h-full flex flex-col">
				<DrawerHeader className="shrink-0 pb-2">
					<div className="flex items-center justify-between">
						<DrawerTitle className="text-base flex items-center gap-2">
							<BookOpen className="w-4 h-4 text-primary" />
							{t("storiesFromPersonaLab")}
						</DrawerTitle>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={() => onOpenChange(false)}
						>
							<X className="w-4 h-4" />
						</Button>
					</div>
				</DrawerHeader>

				<Tabs defaultValue="stories" className="flex-1 flex flex-col min-h-0">
					<TabsList className="mx-4 shrink-0">
						<TabsTrigger value="stories" className="text-xs gap-1.5">
							<BookOpen className="w-3 h-3" />
							{t("storiesFromPersonaLab")}
						</TabsTrigger>
						<TabsTrigger value="evidence" className="text-xs gap-1.5">
							<FileText className="w-3 h-3" />
							{t("evidenceTab")}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="stories" className="flex-1 min-h-0 m-0 mt-0">
						<ScrollArea className="h-full px-4 pb-4">
							<div className="space-y-3 pt-2">
								{stories.length === 0 ? (
									<div className="text-center py-8 text-muted-foreground">
										<BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
										<p className="text-sm">{t("noStoriesAvailable")}</p>
									</div>
								) : (
									stories.map((node) => (
										<StoryCard
											key={node.id}
											node={node}
											onCopy={onInsertContent}
										/>
									))
								)}
							</div>
						</ScrollArea>
					</TabsContent>

					<TabsContent value="evidence" className="flex-1 min-h-0 m-0 mt-0">
						<ScrollArea className="h-full px-4 pb-4">
							<div className="pt-2">
								<EvidencePanel
									evidenceCards={evidenceCards}
									isLoading={evidenceLoading}
									onCopy={onInsertContent}
								/>
							</div>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DrawerContent>
		</Drawer>
	);
}
