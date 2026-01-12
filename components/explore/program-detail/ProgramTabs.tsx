"use client";

import {
	BookOpen,
	Briefcase,
	Calendar,
	ClipboardList,
	GraduationCap,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
	ProgramDetailResponse,
	ProgramIntakeResponse,
} from "@/lib/generated/api/models";
import { formatCountryName } from "@/lib/utils/gapComputation";

interface ProgramTabsProps {
	program: ProgramDetailResponse;
}

/**
 * Tabbed Content Section for Program Details
 */
export function ProgramTabs({ program }: ProgramTabsProps) {
	return (
		<Tabs defaultValue="overview" className="w-full">
			<TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 gap-0">
				<TabsTrigger
					value="overview"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<BookOpen className="w-4 h-4" />
					Overview
				</TabsTrigger>
				<TabsTrigger
					value="requirements"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<ClipboardList className="w-4 h-4" />
					Requirements
				</TabsTrigger>
				<TabsTrigger
					value="deadlines"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<Calendar className="w-4 h-4" />
					Deadlines
				</TabsTrigger>
				<TabsTrigger
					value="curriculum"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<GraduationCap className="w-4 h-4" />
					Curriculum
				</TabsTrigger>
				<TabsTrigger
					value="careers"
					className="flex items-center gap-2 px-6 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
				>
					<Briefcase className="w-4 h-4" />
					Careers
				</TabsTrigger>
			</TabsList>

			{/* Overview Tab */}
			<TabsContent value="overview" className="pt-6">
				<div className="prose dark:prose-invert max-w-none">
					<h3>About this Program</h3>
					<p className="text-muted-foreground leading-relaxed">
						{program.programDescription ||
							`The ${program.programName} at ${program.universityName} is designed to provide students with advanced knowledge and skills in ${program.majorCategories?.join(", ") || "their field of study"}. This ${program.degreeType} program offers a comprehensive curriculum that prepares graduates for success in both academic and professional settings.`}
					</p>

					<h3>About {program.universityName}</h3>
					<p className="text-muted-foreground leading-relaxed">
						{program.universityDescription ||
							`Located in ${program.universityCity}, ${formatCountryName(program.universityCountry)}, ${program.universityName} is ranked ${
								program.rankingQsDisplay
									? `#${program.rankingQsDisplay} in QS`
									: ""
							}${
								program.rankingQsDisplay && program.rankingQsDisplay
									? " and "
									: ""
							}${
								program.rankingQsDisplay
									? `#${program.rankingQsDisplay} in Times`
									: ""
							} World Rankings. The university is known for its research excellence and diverse international community.`}
					</p>

					{program.language && (
						<>
							<h4>Language of Instruction</h4>
							<p className="text-muted-foreground">{program.language}</p>
						</>
					)}

					{program.deliveryMode && (
						<>
							<h4>Delivery Mode</h4>
							<p className="text-muted-foreground">{program.deliveryMode}</p>
						</>
					)}
				</div>
			</TabsContent>

			{/* Requirements Tab */}
			<TabsContent value="requirements" className="pt-6">
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Academic Requirements */}
						<div className="bg-muted/30 rounded-xl p-6">
							<h4 className="font-bold text-foreground mb-4">
								Academic Requirements
							</h4>
							<ul className="space-y-3 text-sm">
								{program.requirements?.gpaMinimum && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">Minimum GPA</span>
										<span className="font-medium text-foreground">
											{program.requirements.gpaMinimum}/
											{program.requirements.gpaScale || 4.0}
										</span>
									</li>
								)}
								{program.degreeType && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">Degree Type</span>
										<span className="font-medium text-foreground">
											{program.degreeType}
										</span>
									</li>
								)}
								{program.requirements?.workExperienceYears !== undefined &&
									program.requirements.workExperienceYears > 0 && (
										<li className="flex justify-between">
											<span className="text-muted-foreground">
												Work Experience
											</span>
											<span className="font-medium text-foreground">
												{program.requirements.workExperienceYears}+ years
											</span>
										</li>
									)}
							</ul>
						</div>

						{/* English Proficiency */}
						<div className="bg-muted/30 rounded-xl p-6">
							<h4 className="font-bold text-foreground mb-4">
								English Proficiency
							</h4>
							<ul className="space-y-3 text-sm">
								{program.requirements?.ieltsMinimum && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">IELTS Minimum</span>
										<span className="font-medium text-foreground">
											{program.requirements.ieltsMinimum}
										</span>
									</li>
								)}
								{program.requirements?.toeflMinimum && (
									<li className="flex justify-between">
										<span className="text-muted-foreground">TOEFL Minimum</span>
										<span className="font-medium text-foreground">
											{program.requirements.toeflMinimum}
										</span>
									</li>
								)}
							</ul>
						</div>

						{/* Standardized Tests */}
						{(program.requirements?.greRequired ||
							program.requirements?.gmatRequired) && (
							<div className="bg-muted/30 rounded-xl p-6">
								<h4 className="font-bold text-foreground mb-4">
									Standardized Tests
								</h4>
								<ul className="space-y-3 text-sm">
									{program.requirements?.greRequired && (
										<li className="flex justify-between">
											<span className="text-muted-foreground">GRE</span>
											<span className="font-medium text-foreground">
												Required
											</span>
										</li>
									)}
									{program.requirements?.gmatRequired && (
										<li className="flex justify-between">
											<span className="text-muted-foreground">GMAT</span>
											<span className="font-medium text-foreground">
												Required
											</span>
										</li>
									)}
								</ul>
							</div>
						)}

						{/* Required Documents */}
						{program.requirements?.documents &&
							program.requirements.documents.length > 0 && (
								<div className="bg-muted/30 rounded-xl p-6">
									<h4 className="font-bold text-foreground mb-4">
										Required Documents
									</h4>
									<ul className="space-y-2 text-sm">
										{program.requirements.documents.map((doc: string) => (
											<li
												key={doc}
												className="flex items-center gap-2 text-foreground"
											>
												<span className="w-1.5 h-1.5 rounded-full bg-primary" />
												{doc}
											</li>
										))}
									</ul>
								</div>
							)}
					</div>
				</div>
			</TabsContent>

			{/* Deadlines Tab */}
			<TabsContent value="deadlines" className="pt-6">
				<div className="space-y-6">
					{program.intakes && program.intakes.length > 0 ? (
						program.intakes.map((intake: ProgramIntakeResponse) => (
							<div
								key={intake.id}
								className="bg-card border border-border rounded-xl p-6"
							>
								<div className="flex items-center justify-between mb-4">
									<h4 className="font-bold text-foreground text-lg">
										{intake.seasonDisplay} Intake
									</h4>
									{intake.isActive && (
										<span className="px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
											Open
										</span>
									)}
								</div>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
									{intake.earlyDeadline && (
										<div>
											<p className="text-muted-foreground">Early Deadline</p>
											<p className="font-medium text-foreground">
												{new Date(intake.earlyDeadline).toLocaleDateString(
													"en-US",
													{ month: "short", day: "numeric", year: "numeric" },
												)}
											</p>
										</div>
									)}
									{intake.applicationDeadline && (
										<div>
											<p className="text-muted-foreground">Regular Deadline</p>
											<p className="font-medium text-foreground">
												{new Date(
													intake.applicationDeadline,
												).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}
											</p>
										</div>
									)}
									{intake.startDate && (
										<div>
											<p className="text-muted-foreground">Program Starts</p>
											<p className="font-medium text-foreground">
												{new Date(intake.startDate).toLocaleDateString(
													"en-US",
													{
														month: "short",
														day: "numeric",
														year: "numeric",
													},
												)}
											</p>
										</div>
									)}
								</div>
							</div>
						))
					) : (
						<div className="bg-muted/30 rounded-xl p-6 text-center">
							<p className="text-muted-foreground">
								Detailed intake information is not available for this program.
							</p>
							{program.nextDeadline && (
								<p className="mt-2 text-foreground">
									Next deadline:{" "}
									{new Date(program.nextDeadline).toLocaleDateString("en-US", {
										month: "long",
										day: "numeric",
										year: "numeric",
									})}
								</p>
							)}
						</div>
					)}
				</div>
			</TabsContent>

			{/* Curriculum Tab (Placeholder) */}
			<TabsContent value="curriculum" className="pt-6">
				<div className="bg-muted/30 rounded-xl p-8 text-center">
					<GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h4 className="text-lg font-bold text-foreground mb-2">
						Curriculum Details
					</h4>
					<p className="text-muted-foreground max-w-md mx-auto">
						Detailed curriculum information for this program will be available
						soon. Please visit the{" "}
						{program.programUrl ? (
							<a
								href={program.programUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline"
							>
								official program page
							</a>
						) : (
							"official university website"
						)}{" "}
						for more information.
					</p>
				</div>
			</TabsContent>

			{/* Careers Tab (Placeholder) */}
			<TabsContent value="careers" className="pt-6">
				<div className="bg-muted/30 rounded-xl p-8 text-center">
					<Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h4 className="text-lg font-bold text-foreground mb-2">
						Career Outcomes
					</h4>
					<p className="text-muted-foreground max-w-md mx-auto">
						Career outcome data for this program will be available soon.
						Graduates typically pursue roles in{" "}
						{program.majorCategories?.join(", ") || "their field of expertise"}.
					</p>
				</div>
			</TabsContent>
		</Tabs>
	);
}
