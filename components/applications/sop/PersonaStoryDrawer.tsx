"use client";

import { BookOpen, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
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
import type { PersonaNodeDto } from "@/lib/store/personaStore";
import { usePersonaStore } from "@/lib/store/personaStore";
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
	for (const key of [
		"Situation",
		"Task",
		"Action",
		"Result",
		"Emotion",
		"Insight",
	]) {
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

	const handleInsertAndClose = useCallback(
		(text: string) => {
			onInsertContent(text);
			onOpenChange(false);
		},
		[onInsertContent, onOpenChange],
	);

	return (
		<Drawer open={open} onOpenChange={onOpenChange} direction="right">
			<DrawerContent className="flex h-full w-full min-w-0 flex-col sm:max-w-md">
				<DrawerHeader className="shrink-0 pb-2">
					<div className="flex items-center justify-between">
						<DrawerTitle className="flex items-center gap-2 text-base">
							<BookOpen className="h-4 w-4 text-primary" />
							{t("personaMaterialDrawerTitle")}
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

				<Tabs
					defaultValue="stories"
					className="flex min-h-0 min-w-0 w-full flex-1 flex-col"
				>
					{/* Same horizontal padding as DrawerHeader (p-4) and ScrollArea (px-4); full-width segmented control, not two floating pills */}
					<div className="shrink-0 px-4 pb-2">
						<TabsList className="grid h-auto min-h-10 w-full grid-cols-2 gap-1 rounded-lg bg-muted p-1 text-muted-foreground">
							<TabsTrigger
								value="stories"
								className="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium leading-tight whitespace-normal"
							>
								<BookOpen className="h-3.5 w-3.5 shrink-0" />
								<span className="wrap-break-word">
									{t("personaStoriesTab")}
								</span>
							</TabsTrigger>
							<TabsTrigger
								value="evidence"
								className="flex min-h-9 min-w-0 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-xs font-medium leading-tight whitespace-normal"
							>
								<FileText className="h-3.5 w-3.5 shrink-0" />
								<span className="wrap-break-word">{t("evidenceTab")}</span>
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent
						value="stories"
						className="m-0 mt-0 flex min-h-0 min-w-0 flex-1 flex-col"
					>
						<ScrollArea className="h-full min-w-0 px-4 pb-4">
							<div className="w-full min-w-0 max-w-full space-y-3 pt-2">
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
											onCopy={handleInsertAndClose}
										/>
									))
								)}
							</div>
						</ScrollArea>
					</TabsContent>

					<TabsContent
						value="evidence"
						className="m-0 mt-0 flex min-h-0 min-w-0 flex-1 flex-col"
					>
						<ScrollArea className="h-full min-w-0 px-4 pb-4">
							<div className="w-full min-w-0 max-w-full pt-2">
								<EvidencePanel
									evidenceCards={evidenceCards}
									isLoading={evidenceLoading}
									onCopy={handleInsertAndClose}
								/>
							</div>
						</ScrollArea>
					</TabsContent>
				</Tabs>
			</DrawerContent>
		</Drawer>
	);
}
