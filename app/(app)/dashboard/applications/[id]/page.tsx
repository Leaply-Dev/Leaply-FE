"use client";

import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	FileText,
	Target,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageContainer } from "@/components/Layout";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useApplicationsStore } from "@/lib/store/applicationsStore";
import { cn } from "@/lib/utils";

const statusConfig: Record<
	string,
	{
		label: string;
		variant: "default" | "secondary" | "outline" | "destructive";
	}
> = {
	planning: { label: "Planning", variant: "secondary" },
	writing: { label: "Writing", variant: "outline" },
	submitted: { label: "Submitted", variant: "default" },
	accepted: { label: "Accepted", variant: "default" },
	rejected: { label: "Rejected", variant: "destructive" },
};

const gapSeverityConfig: Record<string, { color: string }> = {
	critical: { color: "text-red-600 bg-red-50 border-red-200" },
	warning: { color: "text-amber-600 bg-amber-50 border-amber-200" },
	info: { color: "text-blue-600 bg-blue-50 border-blue-200" },
};

export default function ApplicationDetailPage() {
	const params = useParams();
	const router = useRouter();
	const { applications, fetchApplications, isLoading } = useApplicationsStore();

	useEffect(() => {
		if (applications.length === 0) {
			fetchApplications();
		}
	}, [applications.length, fetchApplications]);

	const application = applications.find((app) => app.id === params.id);

	if (isLoading) {
		return (
			<PageContainer>
				<div className="text-center py-16">
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</PageContainer>
		);
	}

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

	const config = statusConfig[application.status] || statusConfig.planning;

	// Calculate days until deadline
	const getDaysUntilDeadline = () => {
		if (!application.program.nextDeadline) return null;
		const deadline = new Date(application.program.nextDeadline);
		const now = new Date();
		const diff = deadline.getTime() - now.getTime();
		return Math.ceil(diff / (1000 * 60 * 60 * 24));
	};

	const daysUntilDeadline = getDaysUntilDeadline();

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
										{application.program.universityName}
									</CardTitle>
									<p className="text-lg text-muted-foreground">
										{application.program.programName}
									</p>
									{application.program.degreeName && (
										<p className="text-sm text-muted-foreground">
											{application.program.degreeName}
										</p>
									)}
								</div>
								<Badge variant={config.variant} className="text-sm">
									{config.label}
								</Badge>
							</div>
						</CardHeader>
						<CardContent>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
								{/* Fit Score */}
								<div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<Target className="w-4 h-4 text-primary" />
										<span className="text-xs font-medium text-muted-foreground">
											Fit Score
										</span>
									</div>
									<p className="text-2xl font-bold text-primary">
										{application.fitScore || "—"}%
									</p>
									{application.fitCategory && (
										<Badge
											variant="outline"
											className={cn(
												"mt-1 text-xs capitalize",
												application.fitCategory === "safety" &&
													"border-green-500",
												application.fitCategory === "target" &&
													"border-blue-500",
												application.fitCategory === "reach" &&
													"border-amber-500",
											)}
										>
											{application.fitCategory}
										</Badge>
									)}
								</div>

								{/* SOP Status */}
								<div className="p-4 bg-muted/50 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<FileText className="w-4 h-4 text-muted-foreground" />
										<span className="text-xs font-medium text-muted-foreground">
											SOP Status
										</span>
									</div>
									<p className="text-lg font-semibold text-foreground capitalize">
										{application.sopStatus?.replace("_", " ") || "Not Started"}
									</p>
								</div>

								{/* Next Deadline */}
								<div
									className={cn(
										"p-4 rounded-lg",
										daysUntilDeadline !== null && daysUntilDeadline <= 7
											? "bg-red-50 border border-red-200"
											: "bg-muted/50",
									)}
								>
									<div className="flex items-center gap-2 mb-1">
										<Calendar className="w-4 h-4 text-muted-foreground" />
										<span className="text-xs font-medium text-muted-foreground">
											Next Deadline
										</span>
									</div>
									{application.program.nextDeadline ? (
										<>
											<p className="text-sm font-semibold text-foreground">
												{new Date(
													application.program.nextDeadline,
												).toLocaleDateString()}
											</p>
											{daysUntilDeadline !== null && (
												<p
													className={cn(
														"text-xs font-medium",
														daysUntilDeadline <= 7
															? "text-red-600"
															: daysUntilDeadline <= 30
																? "text-amber-600"
																: "text-muted-foreground",
													)}
												>
													{daysUntilDeadline} days remaining
												</p>
											)}
										</>
									) : (
										<p className="text-sm text-muted-foreground">No deadline</p>
									)}
								</div>

								{/* Next Intake */}
								<div className="p-4 bg-muted/50 rounded-lg">
									<div className="flex items-center gap-2 mb-1">
										<Calendar className="w-4 h-4 text-muted-foreground" />
										<span className="text-xs font-medium text-muted-foreground">
											Next Intake
										</span>
									</div>
									<p className="text-lg font-semibold text-foreground">
										{application.program.nextIntake || "—"}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</SlideUp>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-6">
						{/* Gaps Analysis */}
						{application.gaps && application.gaps.length > 0 && (
							<SlideUp delay={0.1}>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<AlertCircle className="w-5 h-5 text-amber-500" />
											Gaps to Address
										</CardTitle>
										<CardDescription>
											Areas to improve for this application
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-3">
											{application.gaps.map((gap, index) => {
												const severityConfig =
													gapSeverityConfig[gap.severity] ||
													gapSeverityConfig.info;
												return (
													<div
														key={index}
														className={cn(
															"flex items-start gap-3 p-3 rounded-lg border",
															severityConfig.color,
														)}
													>
														<AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
														<div>
															<p className="font-medium text-sm capitalize">
																{gap.field.replace("_", " ")}
															</p>
															<p className="text-sm opacity-80">
																{gap.message}
															</p>
														</div>
													</div>
												);
											})}
										</div>
									</CardContent>
								</Card>
							</SlideUp>
						)}

						{/* Actions */}
						<SlideUp delay={0.2}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Actions</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="flex flex-wrap gap-3">
										<Button asChild>
											<Link
												href={`/dashboard/applications/${application.id}/sop`}
											>
												<FileText className="w-4 h-4 mr-2" />
												{application.sopStatus === "not_started" ||
												!application.sopStatus
													? "Start SOP"
													: "Continue SOP"}
											</Link>
										</Button>

										<Button variant="outline" asChild>
											<Link href={`/explore/${application.program.id}`}>
												View Program Details
											</Link>
										</Button>
									</div>
								</CardContent>
							</Card>
						</SlideUp>
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<SlideUp delay={0.3}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Program Info</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">University</p>
										<p className="font-medium">
											{application.program.universityName}
										</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Program</p>
										<p className="font-medium">
											{application.program.programName}
										</p>
									</div>
									{application.program.degreeName && (
										<div>
											<p className="text-sm text-muted-foreground">Degree</p>
											<p className="font-medium">
												{application.program.degreeName}
											</p>
										</div>
									)}
								</CardContent>
							</Card>
						</SlideUp>

						<SlideUp delay={0.4}>
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">Timeline</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="space-y-3 text-sm">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Added</span>
											<span>
												{new Date(application.createdAt).toLocaleDateString()}
											</span>
										</div>
										{application.updatedAt !== application.createdAt && (
											<div className="flex justify-between">
												<span className="text-muted-foreground">
													Last Updated
												</span>
												<span>
													{new Date(application.updatedAt).toLocaleDateString()}
												</span>
											</div>
										)}
									</div>
								</CardContent>
							</Card>
						</SlideUp>
					</div>
				</div>
			</PageContainer>
		</PageTransition>
	);
}
