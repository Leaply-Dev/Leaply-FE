"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
	GraduationCap,
	FileText,
	CheckSquare,
	BookOpen,
	ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { ApplicationCard } from "@/components/ApplicationCard";
import { TaskItem } from "@/components/TaskItem";
import { PageContainer } from "@/components/Layout";
import { useUniversitiesStore } from "@/lib/store/universitiesStore";
import { useApplicationsStore } from "@/lib/store/applicationsStore";
import { mockApplications, mockTasks } from "@/lib/data/applications";
import { mockUniversities } from "@/lib/data/universities";
import { PageTransition, SlideUp } from "@/components/PageTransition";

export default function DashboardPage() {
	const { universities, setUniversities, savedUniversities } =
		useUniversitiesStore();
	const { applications, tasks, setApplications, setTasks, toggleTaskComplete } =
		useApplicationsStore();

	useEffect(() => {
		// Initialize data on mount
		if (universities.length === 0) {
			setUniversities(mockUniversities);
		}
		if (applications.length === 0) {
			setApplications(mockApplications);
		}
		if (tasks.length === 0) {
			setTasks(mockTasks);
		}
	}, [
		universities.length,
		applications.length,
		tasks.length,
		setUniversities,
		setApplications,
		setTasks,
	]);

	const activeApplications = applications.filter(
		(app) => app.status !== "rejected",
	);
	const upcomingTasks = tasks
		.filter((task) => !task.completed)
		.sort(
			(a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
		)
		.slice(0, 3);

	return (
		<PageTransition>
			<PageContainer>
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
					<p className="text-lg text-muted-foreground">
						Welcome back! Here's your application progress at a glance.
					</p>
				</div>

				{/* Stats Grid */}
				<SlideUp>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
						<StatCard
							title="Saved Universities"
							value={savedUniversities.length}
							icon={GraduationCap}
							description="Universities in your shortlist"
						/>
						<StatCard
							title="Active Applications"
							value={activeApplications.length}
							icon={FileText}
							description="In progress or submitted"
						/>
						<StatCard
							title="Pending Tasks"
							value={tasks.filter((t) => !t.completed).length}
							icon={CheckSquare}
							description="Tasks to complete"
						/>
						<StatCard
							title="Resources"
							value={10}
							icon={BookOpen}
							description="Guides and articles"
						/>
					</div>
				</SlideUp>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Recent Applications */}
					<div className="lg:col-span-2">
						<SlideUp delay={0.1}>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Recent Applications</CardTitle>
										<Button variant="ghost" size="sm" asChild>
											<Link href="/dashboard/applications">
												View All
												<ArrowRight className="w-4 h-4 ml-2" />
											</Link>
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{applications.length > 0 ? (
										<div className="space-y-4">
											{applications.slice(0, 3).map((app) => (
												<ApplicationCard
													key={app.id}
													id={app.id}
													universityName={app.universityName}
													program={app.program}
													status={app.status}
													submissionDate={app.submissionDate}
													decisionDeadline={app.decisionDeadline}
												/>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
											<p className="text-muted-foreground mb-4">
												No applications yet
											</p>
											<Button asChild>
												<Link href="/universities">Browse Universities</Link>
											</Button>
										</div>
									)}
								</CardContent>
							</Card>
						</SlideUp>
					</div>

					{/* Upcoming Tasks */}
					<div>
						<SlideUp delay={0.2}>
							<Card>
								<CardHeader>
									<div className="flex items-center justify-between">
										<CardTitle>Upcoming Tasks</CardTitle>
										<Button variant="ghost" size="sm" asChild>
											<Link href="/dashboard/tasks">
												View All
												<ArrowRight className="w-4 h-4 ml-2" />
											</Link>
										</Button>
									</div>
								</CardHeader>
								<CardContent>
									{upcomingTasks.length > 0 ? (
										<div className="space-y-3">
											{upcomingTasks.map((task) => (
												<TaskItem
													key={task.id}
													id={task.id}
													title={task.title}
													description={task.description}
													dueDate={task.dueDate}
													completed={task.completed}
													priority={task.priority}
													onToggle={toggleTaskComplete}
												/>
											))}
										</div>
									) : (
										<div className="text-center py-8">
											<CheckSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
											<p className="text-muted-foreground">All caught up!</p>
										</div>
									)}
								</CardContent>
							</Card>
						</SlideUp>
					</div>
				</div>

				{/* Quick Actions */}
				<SlideUp delay={0.3}>
					<Card className="mt-8">
						<CardHeader>
							<CardTitle>Quick Actions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Button
									variant="outline"
									className="h-auto py-4 flex-col gap-2"
									asChild
								>
									<Link href="/universities">
										<GraduationCap className="w-8 h-8" />
										<span>Explore Universities</span>
									</Link>
								</Button>
								<Button
									variant="outline"
									className="h-auto py-4 flex-col gap-2"
									asChild
								>
									<Link href="/chatbot">
										<BookOpen className="w-8 h-8" />
										<span>Ask AI Assistant</span>
									</Link>
								</Button>
								<Button
									variant="outline"
									className="h-auto py-4 flex-col gap-2"
									asChild
								>
									<Link href="/dashboard/resources">
										<FileText className="w-8 h-8" />
										<span>Browse Resources</span>
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</SlideUp>
			</PageContainer>
		</PageTransition>
	);
}
