"use client";

import { FileText, User } from "lucide-react";
import React, { useCallback, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { DiscoveryTab } from "@/components/persona-lab/DiscoveryTab";
import { EssaysTab } from "@/components/persona-lab/EssaysTab";
import { MyPersonaTab } from "@/components/persona-lab/MyPersonaTab";
import { ProfileContextSidebar } from "@/components/persona-lab/ProfileContextSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { usePersonaStore } from "@/lib/store/personaStore";

interface EssayFromAngleData {
	title?: string;
	description?: string;
	suggestedTypes?: string[];
}

export default function PersonaLabPage() {
	const { t } = useTranslation();
	const { tracks, resetPersona } = usePersonaStore();
	const [activeTab, setActiveTab] = useState("persona");
	const [essayFromAngleData, setEssayFromAngleData] = useState<
		EssayFromAngleData | undefined
	>();
	const [isRetakingQuiz, setIsRetakingQuiz] = useState(false);

	// Check if user has completed at least one track
	const hasCompletedTracks = tracks.some(
		(track) => track.status === "completed",
	);

	const handleCreateEssayFromAngle = useCallback(
		(title: string, description: string, suggestedTypes?: string[]) => {
			setEssayFromAngleData({ title, description, suggestedTypes });
			setActiveTab("essays");
		},
		[],
	);

	const handleRetakeQuiz = useCallback(() => {
		resetPersona(); // Reset to demo data with all placeholder stories
		// Don't set isRetakingQuiz - we want to stay on MyPersona tab to show the demo data
	}, [resetPersona]);

	const handleRetakeComplete = useCallback(() => {
		setIsRetakingQuiz(false);
	}, []);

	// Determine what to show in persona tab
	const showDiscovery = !hasCompletedTracks || isRetakingQuiz;

	return (
		<PageTransition>
			<div className="flex flex-1 min-h-0 w-full bg-background overflow-hidden">
				{/* Left Sidebar - Profile Context */}
				<aside className="w-80 min-w-[280px] border-r border-border bg-card/50 backdrop-blur-sm hidden lg:flex flex-col overflow-hidden">
					<ProfileContextSidebar />
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 min-w-0 flex flex-col min-h-0 overflow-hidden">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col min-h-0 overflow-hidden"
					>
						{/* Tab Navigation Header */}
						<div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-3 shrink-0">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-xl font-bold text-foreground">
										{t("personaLab", "title")}
									</h1>
									<p className="text-sm text-muted-foreground">
										{t("personaLab", "subtitle")}
									</p>
								</div>
								<TabsList className="grid grid-cols-2 w-auto">
									<TabsTrigger
										value="persona"
										className="flex items-center gap-2 px-4"
									>
										<User className="w-4 h-4" />
										<span className="hidden sm:inline">
											{t("personaLab", "myPersona")}
										</span>
									</TabsTrigger>
									<TabsTrigger
										value="essays"
										className="flex items-center gap-2 px-4"
									>
										<FileText className="w-4 h-4" />
										<span className="hidden sm:inline">
											{t("personaLab", "essays")}
										</span>
									</TabsTrigger>
								</TabsList>
							</div>
						</div>

						{/* Tab Content */}
						<div className="flex-1 min-h-0 overflow-hidden">
							<TabsContent
								value="persona"
								className="h-full m-0 overflow-auto data-[state=active]:flex data-[state=active]:flex-col"
							>
								{showDiscovery ? (
									<DiscoveryTab onComplete={handleRetakeComplete} />
								) : (
									<MyPersonaTab
										onCreateEssayFromAngle={handleCreateEssayFromAngle}
										onRetakeQuiz={handleRetakeQuiz}
									/>
								)}
							</TabsContent>
							<TabsContent
								value="essays"
								className="h-full m-0 overflow-hidden data-[state=active]:flex data-[state=active]:flex-col"
							>
								<EssaysTab initialEssayData={essayFromAngleData} />
							</TabsContent>
						</div>
					</Tabs>
				</main>
			</div>
		</PageTransition>
	);
}
