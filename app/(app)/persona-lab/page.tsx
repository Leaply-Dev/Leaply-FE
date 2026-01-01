"use client";

import { motion } from "framer-motion";
import { ChevronLeft, LayoutGrid, List, MessageSquare } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/PageTransition";
import { ChatSidebar } from "@/components/persona-lab/ChatSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePersonaStore } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

// Dynamic import for ConcentricGraphCanvas
const ConcentricGraphCanvas = dynamic(
	() =>
		import("@/components/persona-lab/canvas/ConcentricGraphCanvas").then(
			(mod) => mod.ConcentricGraphCanvas,
		),
	{
		ssr: false,
		loading: () => (
			<div className="flex-1 flex items-center justify-center bg-muted/20">
				<div className="text-center space-y-4">
					<Skeleton className="w-32 h-32 rounded-full mx-auto" />
					<Skeleton className="w-24 h-3 mx-auto" />
				</div>
			</div>
		),
	},
);

// Dynamic import for GraphListView (mobile/list mode)
const GraphListView = dynamic(
	() =>
		import("@/components/persona-lab/canvas/GraphListView").then(
			(mod) => mod.GraphListView,
		),
	{
		ssr: false,
		loading: () => (
			<div className="p-6 space-y-4">
				<Skeleton className="h-16 w-full rounded-xl" />
				<Skeleton className="h-20 w-full rounded-xl" />
				<Skeleton className="h-20 w-full rounded-xl" />
			</div>
		),
	},
);

// Hook for responsive mobile detection
function useIsMobile(breakpoint = 768) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < breakpoint);
		};

		// Initial check
		checkMobile();

		// Add listener
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, [breakpoint]);

	return isMobile;
}

export default function PersonaLabPage() {
	const t = useTranslations("personaLab");
	const { viewMode, setViewMode } = usePersonaStore();
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const isMobile = useIsMobile(768);

	// Render the appropriate canvas/list component based on viewport and view mode
	const renderContent = () => {
		// Mobile: always show list view
		if (isMobile) {
			return <GraphListView className="w-full h-full" />;
		}

		// Desktop: respect view mode toggle
		if (viewMode === "list") {
			return <GraphListView className="w-full h-full" />;
		}

		return <ConcentricGraphCanvas className="w-full h-full" />;
	};

	return (
		<PageTransition className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
			<div className="flex flex-1 min-h-0 h-full w-full bg-background overflow-hidden relative">
				{/* Left Sidebar - Chat Interface */}
				<motion.aside
					initial={false}
					animate={{
						width: isSidebarCollapsed ? 0 : 320,
						opacity: isSidebarCollapsed ? 0 : 1,
					}}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className={cn(
						"relative border-r border-border bg-card/50 backdrop-blur-sm hidden lg:flex flex-col overflow-hidden z-20",
						isSidebarCollapsed ? "border-r-0" : "border-r",
					)}
				>
					<div className="w-[320px] h-full flex flex-col">
						<ChatSidebar />
					</div>
				</motion.aside>

				{/* Sidebar Toggle Button */}
				<motion.div
					initial={false}
					animate={{
						left: isSidebarCollapsed ? 16 : 304,
						top: isSidebarCollapsed ? "50%" : 16,
						y: isSidebarCollapsed ? "-50%" : 0,
					}}
					transition={{ type: "spring", stiffness: 300, damping: 30 }}
					className="absolute z-30"
				>
					<Button
						variant="secondary"
						size="icon"
						onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
						className={cn(
							"rounded-full shadow-md border border-border transition-all duration-300 hover:bg-primary/10 group",
							isSidebarCollapsed
								? "h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
								: "h-8 w-8",
						)}
					>
						{isSidebarCollapsed ? (
							<MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
						) : (
							<ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
						)}
					</Button>
				</motion.div>

				{/* Main Content Area */}
				<main className="flex-1 min-w-0 flex flex-col min-h-0">
					{/* Header with View Toggle */}
					<div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-3 shrink-0">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-xl font-bold text-foreground">
									{t("canvasTitle")}
								</h1>
								<p className="text-sm text-muted-foreground">
									{t("canvasSubtitle")}
								</p>
							</div>

							{/* View Mode Toggle */}
							<div className="flex items-center bg-muted rounded-lg p-1">
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setViewMode("canvas")}
									className={cn(
										"h-8 px-3 rounded-md gap-1.5",
										viewMode === "canvas"
											? "bg-background shadow-sm"
											: "hover:bg-transparent",
									)}
								>
									<LayoutGrid className="w-4 h-4" />
									<span className="hidden sm:inline text-sm">
										{t("viewCanvas")}
									</span>
								</Button>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setViewMode("list")}
									className={cn(
										"h-8 px-3 rounded-md gap-1.5",
										viewMode === "list"
											? "bg-background shadow-sm"
											: "hover:bg-transparent",
									)}
								>
									<List className="w-4 h-4" />
									<span className="hidden sm:inline text-sm">
										{t("viewList")}
									</span>
								</Button>
							</div>
						</div>
					</div>

					{/* Content */}
					<div className="flex-1 min-h-0">
						{renderContent()}
					</div>
				</main>
			</div>
		</PageTransition>
	);
}
