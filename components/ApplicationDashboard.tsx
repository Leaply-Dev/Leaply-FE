"use client";

import {
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	Target,
	TrendingUp,
	AlertCircle,
	Globe,
	DollarSign,
	Award,
	BookOpen,
	MessageSquare,
	ExternalLink,
	ChevronRight,
	Info,
	Sparkles,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { EnhancedApplication } from "@/lib/data/enhancedApplications";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ApplicationDashboardProps {
	application: EnhancedApplication | null;
}

const statusConfig = {
	draft: { label: "Draft", variant: "secondary" as const, icon: FileText },
	submitted: {
		label: "Submitted",
		variant: "info" as const,
		icon: CheckCircle2,
	},
	under_review: {
		label: "Under Review",
		variant: "warning" as const,
		icon: Clock,
	},
	accepted: {
		label: "Accepted",
		variant: "success" as const,
		icon: CheckCircle2,
	},
	waitlisted: { label: "Waitlisted", variant: "warning" as const, icon: Clock },
	rejected: {
		label: "Rejected",
		variant: "destructive" as const,
		icon: AlertCircle,
	},
};

export function ApplicationDashboard({
	application,
}: ApplicationDashboardProps) {
	const { t } = useTranslation();
	const router = useRouter();

	if (!application) {
		return (
			<div className="flex items-center justify-center h-full bg-muted/30">
				<div className="text-center">
					<FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold text-foreground mb-2">
						{t("applications", "noApplicationSelected")}
					</h3>
					<p className="text-muted-foreground">
						{t("applications", "selectApplication")}
					</p>
				</div>
			</div>
		);
	}

	const statusLabel = t("applications", `status.${application.status}`);
	const config = { ...statusConfig[application.status], label: statusLabel };
	const StatusIcon = config.icon;

	// Calculate days until next deadline
	const getNextDeadline = () => {
		if (application.upcomingDeadlines.length === 0) return null;
		const nextDeadline = application.upcomingDeadlines[0];
		const daysUntil = Math.ceil(
			(new Date(nextDeadline.date).getTime() - Date.now()) /
				(1000 * 60 * 60 * 24),
		);
		return { ...nextDeadline, daysUntil };
	};

	const nextDeadline = getNextDeadline();

	return (
		<div className="flex-1 overflow-y-auto bg-muted/30">
			<div className="max-w-6xl mx-auto p-6 space-y-6">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							{application.universityName}
						</h1>
						<p className="text-lg text-muted-foreground">
							{application.program}
						</p>
					</div>
					<Badge variant={config.variant} className="text-sm">
						<StatusIcon className="w-4 h-4 mr-1" />
						{config.label}
					</Badge>
				</div>

				{/* Dashboard Grid - 2 columns on desktop */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Application Status Card - Top Priority */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Target className="w-5 h-5 text-primary" />
								{t("applications", "applicationStatus")}
							</CardTitle>
							<CardDescription>
								{t("applications", "trackProgress")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{/* Key Metrics Row */}
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
								<div className="bg-linear-to-br from-leaf-green/10 to-light-green/10 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-1">
										<Target className="w-4 h-4 text-primary" />
										<span className="text-xs font-medium text-muted-foreground">
											{t("applications", "completion")}
										</span>
									</div>
									<p className="text-2xl font-bold text-primary">
										{application.completionPercentage}%
									</p>
								</div>

								<div className="bg-chart-2/10 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-1">
										<FileText className="w-4 h-4 text-chart-2" />
										<span className="text-xs font-medium text-muted-foreground">
											{t("applications", "documents")}
										</span>
									</div>
									<p className="text-2xl font-bold text-chart-2">
										{application.documents.length}
									</p>
									<p className="text-xs text-muted-foreground">{t("applications", "uploaded")}</p>
								</div>

								<div className="bg-chart-4/10 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-1">
										<CheckCircle2 className="w-4 h-4 text-chart-4" />
										<span className="text-xs font-medium text-muted-foreground">
											{t("applications", "tasks")}
										</span>
									</div>
									<p className="text-2xl font-bold text-chart-4">
										{application.tasks.filter((t) => t.completed).length}/
										{application.tasks.length}
									</p>
									<p className="text-xs text-muted-foreground">{t("applications", "completed")}</p>
								</div>

								<div className="bg-purple-100 rounded-lg p-4">
									<div className="flex items-center gap-2 mb-1">
										<Calendar className="w-4 h-4 text-purple-600" />
										<span className="text-xs font-medium text-muted-foreground">
											{t("applications", "deadlines")}
										</span>
									</div>
									<p className="text-2xl font-bold text-purple-600">
										{application.upcomingDeadlines.length}
									</p>
									<p className="text-xs text-muted-foreground">{t("applications", "upcoming")}</p>
								</div>
							</div>

							{/* Status Details Row */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{/* Completion Progress */}
								<div className="space-y-3">
									<span className="text-sm font-semibold text-foreground">
										{t("applications", "progress")}
									</span>
									<Progress
										value={application.completionPercentage}
										className="h-3"
									/>
									<p className="text-xs text-muted-foreground">
										{application.completionPercentage === 100
											? t("applications", "applicationComplete")
											: `${100 - application.completionPercentage}% ${t("applications", "remainingToComplete")}`}
									</p>
								</div>

								{/* Status */}
								<div className="space-y-3">
									<span className="text-sm font-semibold text-foreground">
										{t("applications", "currentStatus")}
									</span>
									<div className="flex items-center gap-3">
										<StatusIcon
											className={cn(
												"w-10 h-10 p-2 rounded-lg",
												config.variant === "success" &&
													"text-green-600 bg-green-50",
												config.variant === "warning" &&
													"text-chart-4 bg-orange-50",
												config.variant === "info" && "text-chart-2 bg-sky-50",
												config.variant === "destructive" &&
													"text-red-600 bg-red-50",
												config.variant === "secondary" &&
													"text-muted-foreground bg-muted",
											)}
										/>
										<div>
											<p className="font-semibold text-foreground">
												{config.label}
											</p>
											<p className="text-xs text-muted-foreground">
												{application.submissionDate
													? `${new Date(application.submissionDate).toLocaleDateString()}`
													: t("applications", "notYetSubmitted")}
											</p>
										</div>
									</div>
								</div>

								{/* Next Deadline */}
								<div className="space-y-3">
									<span className="text-sm font-semibold text-foreground">
										{t("applications", "nextDeadline")}
									</span>
									{nextDeadline ? (
										<div
											className={cn(
												"p-3 rounded-lg border-l-4",
												nextDeadline.daysUntil <= 7
													? "bg-red-50 border-red-500"
													: "bg-muted border-primary",
											)}
										>
											<p className="font-semibold text-foreground text-sm mb-1">
												{nextDeadline.title}
											</p>
											<div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
												<Calendar className="w-3 h-3" />
												{new Date(nextDeadline.date).toLocaleDateString()}
											</div>
											<p
												className={cn(
													"text-xs font-bold",
													nextDeadline.daysUntil <= 7
														? "text-red-600"
														: "text-primary",
												)}
											>
												{nextDeadline.daysUntil} {t("applications", "daysRemaining")}
											</p>
										</div>
									) : (
										<div className="p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
											<p className="text-sm text-green-700 font-medium">
												{t("applications", "noPendingDeadlines")}
											</p>
										</div>
									)}
								</div>
							</div>

							{application.decisionDeadline && (
								<div className="mt-6 pt-4 border-t border-border">
									<div className="flex items-center gap-2 text-sm bg-chart-2/10 p-3 rounded-lg">
										<Info className="w-4 h-4 text-chart-2 shrink-0" />
										<span className="text-muted-foreground">
											{t("applications", "decisionExpectedBy")}{" "}
											<span className="font-semibold text-foreground">
												{new Date(
													application.decisionDeadline,
												).toLocaleDateString()}
											</span>
										</span>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Profile Evaluation Card */}
					<Card className="h-full flex flex-col">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrendingUp className="w-5 h-5 text-primary" />
								{t("applications", "profileEvaluation")}
							</CardTitle>
							<CardDescription>{t("applications", "yourFitForProgram")}</CardDescription>
						</CardHeader>
						<CardContent className="flex-1 flex flex-col">
							{/* Fit Score */}
							<div className="text-center mb-4 p-4 bg-linear-to-br from-leaf-green/10 to-light-green/10 rounded-lg">
								<div className="text-4xl font-bold text-primary mb-1">
									{application.fitScore}%
								</div>
								<p className="text-sm text-muted-foreground">
									{t("applications", "overallFitScore")}
								</p>
							</div>

							{/* Strengths */}
							<div className="mb-4">
								<h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
									<CheckCircle2 className="w-4 h-4 text-green-600" />
									{t("applications", "strengths")}
								</h4>
								<ul className="space-y-2">
									{application.strengths.slice(0, 2).map((strength, idx) => (
										<li
											key={idx}
											className="text-sm text-muted-foreground flex gap-2"
										>
											<span className="text-green-600 font-bold">•</span>
											<span>{strength}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Weaknesses */}
							<div className="mb-4 flex-1">
								<h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1">
									<AlertCircle className="w-4 h-4 text-chart-4" />
									{t("applications", "areasToConsider")}
								</h4>
								<ul className="space-y-2">
									{application.weaknesses.slice(0, 2).map((weakness, idx) => (
										<li
											key={idx}
											className="text-sm text-muted-foreground flex gap-2"
										>
											<span className="text-chart-4 font-bold">•</span>
											<span>{weakness}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Expand Dialog */}
							<Dialog>
								<DialogTrigger asChild>
									<Button variant="outline" className="w-full h-10">
										{t("applications", "viewDetailedAnalysis")}
										<ChevronRight className="w-4 h-4 ml-1" />
									</Button>
								</DialogTrigger>
								<DialogContent className="max-w-2xl">
									<DialogHeader>
										<DialogTitle>{t("applications", "profileEvaluationDetails")}</DialogTitle>
										<DialogDescription>
											{t("applications", "comprehensiveAnalysis")} {application.universityName}
										</DialogDescription>
									</DialogHeader>
									<div className="space-y-4">
										<div className="text-center p-6 bg-linear-to-br from-leaf-green/10 to-light-green/10 rounded-lg">
											<div className="text-5xl font-bold text-primary mb-2">
												{application.fitScore}%
											</div>
											<p className="text-muted-foreground">{t("applications", "overallFitScore")}</p>
										</div>

										<div>
											<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
												<CheckCircle2 className="w-5 h-5 text-green-600" />
												{t("applications", "yourStrengths")}
											</h4>
											<ul className="space-y-2">
												{application.strengths.map((strength, idx) => (
													<li
														key={idx}
														className="text-sm text-muted-foreground flex gap-2"
													>
														<span className="text-green-600 font-bold">
															{idx + 1}.
														</span>
														<span>{strength}</span>
													</li>
												))}
											</ul>
										</div>

										<div>
											<h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
												<AlertCircle className="w-5 h-5 text-chart-4" />
												{t("applications", "areasToConsider")}
											</h4>
											<ul className="space-y-2">
												{application.weaknesses.map((weakness, idx) => (
													<li
														key={idx}
														className="text-sm text-muted-foreground flex gap-2"
													>
														<span className="text-chart-4 font-bold">
															{idx + 1}.
														</span>
														<span>{weakness}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								</DialogContent>
							</Dialog>
						</CardContent>
					</Card>

					{/* School Info Card */}
					<Card className="h-full flex flex-col">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Globe className="w-5 h-5 text-primary" />
								{t("applications", "schoolInformation")}
							</CardTitle>
							<CardDescription>
								{t("applications", "keyDetails")}
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-3 flex-1 flex flex-col">
							<div className="grid grid-cols-2 gap-4 flex-1">
								<div>
									<p className="text-xs text-muted-foreground mb-1">{t("applications", "location")}</p>
									<p className="text-sm font-semibold text-foreground">
										{application.universityCountry}
									</p>
									<p className="text-xs text-muted-foreground">
										{application.universityRegion}
									</p>
								</div>

								{application.universityRanking && (
									<div>
										<p className="text-xs text-muted-foreground mb-1">
											{t("applications", "worldRanking")}
										</p>
										<div className="flex items-center gap-1">
											<Award className="w-4 h-4 text-chart-4" />
											<p className="text-sm font-semibold text-foreground">
												#{application.universityRanking}
											</p>
										</div>
									</div>
								)}

								{application.tuitionRange && (
									<div className="col-span-2">
										<p className="text-xs text-muted-foreground mb-1">
											{t("applications", "tuitionRange")}
										</p>
										<div className="flex items-center gap-1">
											<DollarSign className="w-4 h-4 text-primary" />
											<p className="text-sm font-semibold text-foreground">
												{application.tuitionRange}
											</p>
										</div>
									</div>
								)}

								<div className="col-span-2">
									<p className="text-xs text-muted-foreground mb-1">{t("applications", "program")}</p>
									<div className="flex items-center gap-1">
										<BookOpen className="w-4 h-4 text-chart-2" />
										<p className="text-sm font-semibold text-foreground">
											{application.program}
										</p>
									</div>
								</div>
							</div>

							<div className="pt-3 border-t border-border mt-auto">
								<Button
									variant="outline"
									className="w-full h-10"
									onClick={() =>
										router.push(`/universities/${application.universityId}`)
									}
								>
									{t("applications", "viewUniversityDetails")}
									<ExternalLink className="w-4 h-4 ml-2" />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Next Actions Card */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-primary" />
								{t("applications", "nextActions")}
							</CardTitle>
							<CardDescription>
								{t("applications", "tasksToComplete")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							{application.tasks.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									{t("applications", "noTasksToComplete")}
								</p>
							) : (
								<div className="space-y-3">
									{application.tasks
										.filter((task) => !task.completed)
										.slice(0, 4)
										.map((task) => {
											const daysUntil = Math.ceil(
												(new Date(task.dueDate).getTime() - Date.now()) /
													(1000 * 60 * 60 * 24),
											);
											const isUrgent = daysUntil <= 7;

											return (
												<div
													key={task.id}
													className={cn(
														"flex items-start gap-3 p-3 rounded-lg border",
														isUrgent
															? "border-red-200 bg-red-50"
															: "border-border bg-card",
													)}
												>
													<Checkbox id={task.id} className="mt-1" />
													<div className="flex-1 min-w-0">
														<label
															htmlFor={task.id}
															className="font-medium text-sm text-foreground cursor-pointer"
														>
															{task.title}
														</label>
														<p className="text-xs text-muted-foreground mt-1">
															{task.description}
														</p>
														<div className="flex items-center gap-2 mt-2">
															<Calendar className="w-3 h-3 text-muted-foreground" />
															<span className="text-xs text-muted-foreground">
																{t("applications", "due")}:{" "}
																{new Date(task.dueDate).toLocaleDateString()}
															</span>
															{isUrgent && (
																<Badge
																	variant="destructive"
																	className="text-xs"
																>
																	{t("applications", "urgent")}
																</Badge>
															)}
															{task.priority && (
																<Badge
																	variant={
																		task.priority === "high"
																			? "warning"
																			: "secondary"
																	}
																	className="text-xs"
																>
																	{t("applications", task.priority)}
																</Badge>
															)}
														</div>
													</div>
												</div>
											);
										})}

									{application.tasks.filter((task) => task.completed).length >
										0 && (
										<div className="pt-3 border-t border-border">
											<p className="text-xs text-muted-foreground mb-2">
												✓{" "}
												{
													application.tasks.filter((task) => task.completed)
														.length
												}{" "}
												{t("applications", "taskCompleted")}
											</p>
										</div>
									)}
								</div>
							)}
						</CardContent>
					</Card>

					{/* Resources Card */}
					<Card className="lg:col-span-2">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<BookOpen className="w-5 h-5 text-primary" />
								{t("applications", "helpfulResources")}
							</CardTitle>
							<CardDescription>
								{t("applications", "guidesAndTools")}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												className="justify-start h-18"
												onClick={() => router.push("/dashboard/resources")}
											>
												<FileText className="w-5 h-5 mr-3 text-chart-2 shrink-0" />
												<div className="text-left">
													<p className="font-medium text-sm">
														{t("applications", "essayWritingGuide")}
													</p>
													<p className="text-xs text-muted-foreground">
														{t("applications", "tipsForStatements")}
													</p>
												</div>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{t("applications", "learnEffectiveStatements")}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												className="justify-start h-18"
												onClick={() => router.push("/dashboard/resources")}
											>
												<MessageSquare className="w-5 h-5 mr-3 text-chart-4 shrink-0" />
												<div className="text-left">
													<p className="font-medium text-sm">
														{t("applications", "interviewPreparation")}
													</p>
													<p className="text-xs text-muted-foreground">
														{t("applications", "commonQuestions")}
													</p>
												</div>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{t("applications", "prepareForInterviews")}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												className="justify-start h-18"
												onClick={() => router.push("/dashboard/resources")}
											>
												<DollarSign className="w-5 h-5 mr-3 text-green-600 shrink-0" />
												<div className="text-left">
													<p className="font-medium text-sm">
														{t("applications", "scholarshipFinder")}
													</p>
													<p className="text-xs text-muted-foreground">
														{t("applications", "findFunding")}
													</p>
												</div>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{t("applications", "discoverScholarships")}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												className="justify-start h-18"
												onClick={() =>
													router.push(
														`/chatbot?question=${encodeURIComponent(`Help me with my ${application.universityName} application`)}`,
													)
												}
											>
												<Sparkles className="w-5 h-5 mr-3 text-primary shrink-0" />
												<div className="text-left">
													<p className="font-medium text-sm">
														{t("applications", "askAIAssistant")}
													</p>
													<p className="text-xs text-muted-foreground">
														{t("applications", "getPersonalizedAdvice")}
													</p>
												</div>
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											<p>{t("applications", "chatWithAI")}</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
