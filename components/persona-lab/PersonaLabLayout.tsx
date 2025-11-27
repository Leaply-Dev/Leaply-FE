import React from "react";

interface PersonaLabLayoutProps {
	sidebar: React.ReactNode;
	chat: React.ReactNode;
	insightBoard: React.ReactNode;
}

export function PersonaLabLayout({
	sidebar,
	chat,
	insightBoard,
}: PersonaLabLayoutProps) {
	return (
		<div className="flex h-[calc(100vh-4rem)] w-full bg-background overflow-hidden">
			{/* Left Sidebar - Profile Context (25%) */}
			<aside className="w-1/4 min-w-[280px] border-r border-border bg-card/50 backdrop-blur-sm hidden lg:block overflow-y-auto">
				{sidebar}
			</aside>

			{/* Center - Chat Interface (50%) */}
			<main className="flex-1 min-w-0 flex flex-col relative z-10 bg-background">
				{chat}
			</main>

			{/* Right Panel - Insight Board (25%) */}
			<aside className="w-1/4 min-w-[300px] border-l border-border bg-card/30 hidden xl:block overflow-y-auto">
				{insightBoard}
			</aside>
		</div>
	);
}
