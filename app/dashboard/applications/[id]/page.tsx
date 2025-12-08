"use client";

import { ArrowLeft, CheckCircle, FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageContainer } from "@/components/Layout";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { TaskItem } from "@/components/TaskItem";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockApplications } from "@/lib/data/applications";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

export default function ApplicationDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { applications, setApplications, toggleTaskComplete } =
		useApplicationsStore();

	useEffect(() => {
		if (applications.length === 0) {
			setApplications(mockApplications);
		}
	}, [applications.length, setApplications]);

	const application = applications.find((app) => app.id === params.id);

	if (!application) {
		return (
			<PageContainer>
				<div className="text-center py-16">
					<h1 className="text-2xl font-bold text-foreground mb-2">
						Application not found
					</h1>
					<Button onClick={() => router.push("/dashboard/applications")}>
						Back to Applications
					</Button>
				</div>
			</PageContainer>
		);
	}

	const statusConfig = {
		draft: { label: "Draft", variant: "secondary" as const },
		submitted: { label: "Submitted", variant: "info" as const },
		under_review: { label: "Under Review", variant: "warning" as const },
		accepted: { label: "Accepted", variant: "success" as const },
		waitlisted: { label: "Waitlisted", variant: "warning" as const },
		rejected: { label: "Rejected", variant: "destructive" as const },
	};

	const config = statusConfig[application.status];

	return (
		<PageTransition>
			<PageContainer>
				<Button variant="ghost" onClick={() => router.back()} className="mb-6">
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Applications
				</Button>

				{/* Application Header */}
				<SlideUp>
					<Card className="mb-8">
						<CardHeader>
							<div className="flex items-start justify-between">
								<div>
									<CardTitle className="text-2xl mb-2">
										{application.universityName}
									</CardTitle>
									<p className="text-lg text-muted-foreground">
										{application.program}
									</p>
								</div>
								<Badge variant={config.variant} className="text-sm">
									{config.label}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
								{application.submissionDate && (
									<div>
										<p className="text-sm text-muted-foreground mb-1">
											Submission Date
										</p>
										<p className="font-medium text-foreground">
											{new Date(
												application.submissionDate,
											).toLocaleDateString()}
										</p>
									</div>
								)}
								{application.decisionDeadline && (
									<div>
										<p className="text-sm text-muted-foreground mb-1">
											Decision Deadline
										</p>
										<p className="font-medium text-foreground">
											{new Date(
												application.decisionDeadline,
											).toLocaleDateString()}
										</p>
									</div>
								)}
								<div>
									<p className="text-sm text-muted-foreground mb-1">
										Documents Uploaded
									</p>
									<p className="font-medium text-foreground">
										{application.documents.length} file
										{application.documents.length !== 1 ? "s" : ""}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</SlideUp>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Tasks */}
					<div className="lg:col-span-2">
						<SlideUp delay={0.1}>
							<Card>
								<CardHeader>
									<CardTitle>Application Tasks</CardTitle>
								</CardHeader>
								<CardContent>
									{application.tasks && application.tasks.length > 0 ? (
										<div className="space-y-3">
											{application.tasks.map((task) => (
												<TaskItem
													key={task.id}
													id={task.id}
													title={task.title}
													description={task.description}
													dueDate={task.dueDate}
													completed={task.completed}
													onToggle={toggleTaskComplete}
												/>
											))}
										</div>
									) : (
										<p className="text-muted-foreground text-center py-8">
											No tasks for this application
										</p>
									)}
								</CardContent>
							</Card>
						</SlideUp>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						{/* Documents */}
						<SlideUp delay={0.2}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Documents</CardTitle>
								</CardHeader>
								<CardContent>
									{application.documents.length > 0 ? (
										<div className="space-y-3">
											{application.documents.map((doc) => (
												<div
													key={doc.id}
													className="flex items-center gap-3 p-3 bg-muted rounded-lg"
												>
													<FileText className="w-5 h-5 text-primary shrink-0" />
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-foreground truncate">
															{doc.name}
														</p>
														<p className="text-xs text-muted-foreground">
															{new Date(doc.uploadDate).toLocaleDateString()}
														</p>
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="text-sm text-muted-foreground text-center py-4">
											No documents uploaded
										</p>
									)}
									<Button variant="outline" size="sm" className="w-full mt-4">
										Upload Document
									</Button>
								</CardContent>
							</Card>
						</SlideUp>

						{/* Timeline */}
						<SlideUp delay={0.3}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Timeline</CardTitle>
								</CardHeader>
								<CardContent>
									{application.timeline && application.timeline.length > 0 ? (
										<div className="space-y-4">
											{application.timeline.map((event, index) => (
												<div key={event.id} className="flex gap-3">
													<div className="flex flex-col items-center">
														<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
															<CheckCircle className="w-4 h-4 text-white" />
														</div>
														{index < application.timeline.length - 1 && (
															<div className="w-0.5 h-full bg-muted my-1" />
														)}
													</div>
													<div className="flex-1 pb-4">
														<p className="text-sm font-medium text-foreground">
															{event.event}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{event.description}
														</p>
														<p className="text-xs text-muted-foreground mt-1">
															{new Date(event.date).toLocaleDateString()}
														</p>
													</div>
												</div>
											))}
										</div>
									) : (
										<p className="text-sm text-muted-foreground text-center py-4">
											No timeline events
										</p>
									)}
								</CardContent>
							</Card>
						</SlideUp>
					</div>
				</div>
			</PageContainer>
		</PageTransition>
	);
}
