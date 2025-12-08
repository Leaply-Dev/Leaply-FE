import { AnimatePresence, motion } from "framer-motion";
import {
	BookOpen,
	Compass,
	Lightbulb,
	Plus,
	Save,
	Sparkles,
	Tag,
} from "lucide-react";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InsightBoardProps {
	showNewInsight?: boolean;
}

export function InsightBoard({ showNewInsight = false }: InsightBoardProps) {
	return (
		<div className="h-full flex flex-col">
			<div className="p-6 pb-2 sticky top-0 bg-card/95 backdrop-blur z-10 border-b border-border/50">
				<h2 className="font-bold text-lg flex items-center gap-2">
					<Compass className="w-5 h-5 text-primary" />
					Discovery Canvas
				</h2>
				<p className="text-xs text-muted-foreground">
					Your extracted insights & essay angles
				</p>
			</div>

			<ScrollArea className="flex-1 p-6 pt-4">
				<div className="space-y-8">
					{/* Core Values Section */}
					<section className="space-y-3">
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<Tag className="w-4 h-4" /> Core Values
						</h3>
						<div className="flex flex-wrap gap-2">
							{["Resilience", "Innovation", "Community"].map((value) => (
								<Badge
									key={value}
									variant="outline"
									className="bg-background hover:bg-primary/5 transition-colors cursor-default"
								>
									{value}
								</Badge>
							))}
							<Button
								variant="ghost"
								size="sm"
								className="h-6 px-2 text-xs text-muted-foreground border border-dashed border-border rounded-full hover:border-primary hover:text-primary"
							>
								<Plus className="w-3 h-3 mr-1" /> Add
							</Button>
						</div>
					</section>

					{/* Essay Angles Section */}
					<section className="space-y-3">
						<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
							<BookOpen className="w-4 h-4" /> Essay Angles
						</h3>

						<div className="space-y-3">
							{/* Existing Card */}
							<Card className="bg-linear-to-br from-background to-muted/50 border-border/60 shadow-sm hover:shadow-md transition-all group">
								<CardHeader className="p-4 pb-2">
									<CardTitle className="text-sm font-medium flex items-start justify-between gap-2">
										<span>The "Builder" Mindset</span>
										<Button
											variant="ghost"
											size="icon"
											className="h-6 w-6 -mt-1 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<Save className="w-3 h-3" />
										</Button>
									</CardTitle>
								</CardHeader>
								<CardContent className="p-4 pt-0">
									<p className="text-xs text-muted-foreground leading-relaxed">
										Connecting your robotics club leadership to your desire to
										build scalable AI systems.
									</p>
								</CardContent>
							</Card>

							{/* New Insight Card (Decisive Point) */}
							<AnimatePresence>
								{showNewInsight && (
									<motion.div
										initial={{ opacity: 0, y: 20, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.4, ease: "easeOut" }}
									>
										<Card className="border-primary/30 bg-linear-to-br from-primary/5 to-purple-500/5 shadow-lg shadow-primary/10 overflow-hidden relative">
											<div className="absolute top-0 right-0 p-2">
												<span className="relative flex h-2 w-2">
													<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
													<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
												</span>
											</div>
											<CardHeader className="p-4 pb-2">
												<CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
													<Sparkles className="w-4 h-4" />
													New Insight
												</CardTitle>
											</CardHeader>
											<CardContent className="p-4 pt-0">
												<h4 className="text-sm font-medium mb-1">
													Intellectual Vitality
												</h4>
												<p className="text-xs text-muted-foreground leading-relaxed mb-3">
													Your project challenged technical norms. This
													demonstrates the courage to innovate—a key trait for
													Stanford.
												</p>
												<Button
													size="sm"
													className="w-full h-7 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none"
												>
													Add to Essay Plan
												</Button>
											</CardContent>
										</Card>
									</motion.div>
								)}
							</AnimatePresence>

							{!showNewInsight && (
								<div className="border-2 border-dashed border-border/50 rounded-xl p-6 flex flex-col items-center justify-center text-center text-muted-foreground/50 gap-2">
									<Lightbulb className="w-6 h-6" />
									<p className="text-xs">
										Chat with Leaply to unlock more hidden potential...
									</p>
								</div>
							)}
						</div>
					</section>
				</div>
			</ScrollArea>
		</div>
	);
}
