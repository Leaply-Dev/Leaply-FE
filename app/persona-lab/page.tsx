"use client";

import React, { useState, useCallback } from "react";
import { Compass, User, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageTransition } from "@/components/PageTransition";
import { ProfileContextSidebar } from "@/components/persona-lab/ProfileContextSidebar";
import { DiscoveryTab } from "@/components/persona-lab/DiscoveryTab";
import { MyPersonaTab } from "@/components/persona-lab/MyPersonaTab";
import { EssaysTab } from "@/components/persona-lab/EssaysTab";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface EssayFromAngleData {
	title?: string;
	description?: string;
	suggestedTypes?: string[];
}

export default function PersonaLabPage() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState("discovery");
	const [essayFromAngleData, setEssayFromAngleData] = useState<EssayFromAngleData | undefined>();

	const handleCreateEssayFromAngle = useCallback((title: string, description: string, suggestedTypes?: string[]) => {
		setEssayFromAngleData({ title, description, suggestedTypes });
		setActiveTab("essays");
	}, []);

	// Clear the essay data after it's used
	const handleEssayDataUsed = useCallback(() => {
		setEssayFromAngleData(undefined);
	}, []);

	return (
		<PageTransition>
			<div className="flex flex-1 min-h-0 w-full bg-background overflow-hidden">
				{/* Left Sidebar - Profile Context */}
				<aside className="w-80 min-w-[280px] border-r border-border bg-card/50 backdrop-blur-sm hidden lg:block overflow-y-auto">
					<ProfileContextSidebar />
				</aside>

				{/* Main Content Area */}
				<main className="flex-1 min-w-0 flex flex-col">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="flex-1 flex flex-col"
					>
						{/* Tab Navigation Header */}
						<div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4">
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold text-foreground">{t("personaLab", "title")}</h1>
									<p className="text-sm text-muted-foreground">
										{t("personaLab", "subtitle")}
									</p>
								</div>
								<TabsList className="grid grid-cols-3 w-auto">
									<TabsTrigger
										value="discovery"
										className="flex items-center gap-2 px-4"
									>
										<Compass className="w-4 h-4" />
										<span className="hidden sm:inline">{t("personaLab", "discovery")}</span>
									</TabsTrigger>
									<TabsTrigger
										value="persona"
										className="flex items-center gap-2 px-4"
									>
										<User className="w-4 h-4" />
										<span className="hidden sm:inline">{t("personaLab", "myPersona")}</span>
									</TabsTrigger>
									<TabsTrigger
										value="essays"
										className="flex items-center gap-2 px-4"
									>
										<FileText className="w-4 h-4" />
										<span className="hidden sm:inline">{t("personaLab", "essays")}</span>
									</TabsTrigger>
								</TabsList>
							</div>
						</div>

						{/* Tab Content */}
						<div className="flex-1 overflow-hidden">
							<TabsContent value="discovery" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
								<DiscoveryTab />
							</TabsContent>
							<TabsContent value="persona" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
								<MyPersonaTab onCreateEssayFromAngle={handleCreateEssayFromAngle} />
							</TabsContent>
							<TabsContent value="essays" className="h-full m-0 data-[state=active]:flex data-[state=active]:flex-col">
								<EssaysTab initialEssayData={essayFromAngleData} />
							</TabsContent>
						</div>
					</Tabs>
				</main>
			</div>
		</PageTransition>
	);
}
