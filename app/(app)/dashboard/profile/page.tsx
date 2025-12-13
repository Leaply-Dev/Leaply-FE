"use client";

import { Calendar, Globe, GraduationCap, Mail, User } from "lucide-react";
import { useState } from "react";
import { PageContainer } from "@/components/Layout";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useUserStore } from "@/lib/store/userStore";

export default function ProfilePage() {
	const { t } = useTranslation();
	const { profile, updateProfile } = useUserStore();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		fullName: profile?.fullName || "",
		email: profile?.email || "",
		dateOfBirth: profile?.dateOfBirth || "",
		nationality: profile?.nationality || "",
		currentEducationLevel: profile?.currentEducationLevel || "",
		gpa: profile?.gpa?.toString() || "",
	});

	const handleSave = () => {
		updateProfile({
			fullName: formData.fullName,
			dateOfBirth: formData.dateOfBirth,
			nationality: formData.nationality,
			currentEducationLevel: formData.currentEducationLevel,
			gpa: parseFloat(formData.gpa) || 0,
		});
		setIsEditing(false);
	};

	const handleCancel = () => {
		setFormData({
			fullName: profile?.fullName || "",
			email: profile?.email || "",
			dateOfBirth: profile?.dateOfBirth || "",
			nationality: profile?.nationality || "",
			currentEducationLevel: profile?.currentEducationLevel || "",
			gpa: profile?.gpa?.toString() || "",
		});
		setIsEditing(false);
	};

	return (
		<PageTransition>
			<PageContainer>
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						{t("profile", "title")}
					</h1>
					<p className="text-lg text-muted-foreground">
						{t("profile", "subtitle")}
					</p>
				</div>

				<div className="max-w-3xl">
					{/* Personal Information */}
					<SlideUp>
						<Card className="mb-6">
							<CardHeader>
								<div className="flex items-center justify-between">
									<CardTitle>{t("profile", "personalInformation")}</CardTitle>
									{!isEditing ? (
										<Button onClick={() => setIsEditing(true)}>
											{t("profile", "editProfile")}
										</Button>
									) : (
										<div className="flex gap-2">
											<Button variant="outline" onClick={handleCancel}>
												{t("profile", "cancel")}
											</Button>
											<Button onClick={handleSave}>
												{t("profile", "saveChanges")}
											</Button>
										</div>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="space-y-2">
											<Label htmlFor="fullName">
												{t("profile", "fullName")}
											</Label>
											{isEditing ? (
												<Input
													id="fullName"
													value={formData.fullName}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															fullName: e.target.value,
														}))
													}
												/>
											) : (
												<div className="flex items-center gap-2 p-3 bg-muted rounded-md">
													<User className="w-4 h-4 text-muted-foreground" />
													<span>
														{profile?.fullName || t("profile", "notSet")}
													</span>
												</div>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="email">{t("profile", "email")}</Label>
											<div className="flex items-center gap-2 p-3 bg-muted rounded-md">
												<Mail className="w-4 h-4 text-muted-foreground" />
												<span>{profile?.email || t("profile", "notSet")}</span>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="dateOfBirth">
												{t("profile", "dateOfBirth")}
											</Label>
											{isEditing ? (
												<Input
													id="dateOfBirth"
													type="date"
													value={formData.dateOfBirth}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															dateOfBirth: e.target.value,
														}))
													}
												/>
											) : (
												<div className="flex items-center gap-2 p-3 bg-muted rounded-md">
													<Calendar className="w-4 h-4 text-muted-foreground" />
													<span>
														{profile?.dateOfBirth
															? new Date(
																	profile.dateOfBirth,
																).toLocaleDateString()
															: t("profile", "notSet")}
													</span>
												</div>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="nationality">
												{t("profile", "nationality")}
											</Label>
											{isEditing ? (
												<Select
													id="nationality"
													value={formData.nationality}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															nationality: e.target.value,
														}))
													}
												>
													<option value="">
														{t("profile", "selectNationality")}
													</option>
													<option value="United States">
														{t("profile", "unitedStates")}
													</option>
													<option value="United Kingdom">
														{t("profile", "unitedKingdom")}
													</option>
													<option value="Canada">
														{t("profile", "canada")}
													</option>
													<option value="Australia">
														{t("profile", "australia")}
													</option>
													<option value="India">{t("profile", "india")}</option>
													<option value="China">{t("profile", "china")}</option>
													<option value="Other">{t("profile", "other")}</option>
												</Select>
											) : (
												<div className="flex items-center gap-2 p-3 bg-muted rounded-md">
													<Globe className="w-4 h-4 text-muted-foreground" />
													<span>
														{profile?.nationality || t("profile", "notSet")}
													</span>
												</div>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="educationLevel">
												{t("profile", "educationLevel")}
											</Label>
											{isEditing ? (
												<Select
													id="educationLevel"
													value={formData.currentEducationLevel}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															currentEducationLevel: e.target.value,
														}))
													}
												>
													<option value="">
														{t("profile", "selectLevel")}
													</option>
													<option value="High School">
														{t("profile", "highSchool")}
													</option>
													<option value="Undergraduate">
														{t("profile", "undergraduate")}
													</option>
													<option value="Graduate">
														{t("profile", "graduate")}
													</option>
												</Select>
											) : (
												<div className="flex items-center gap-2 p-3 bg-muted rounded-md">
													<GraduationCap className="w-4 h-4 text-muted-foreground" />
													<span>
														{profile?.currentEducationLevel ||
															t("profile", "notSet")}
													</span>
												</div>
											)}
										</div>

										<div className="space-y-2">
											<Label htmlFor="gpa">{t("profile", "gpa")}</Label>
											{isEditing ? (
												<Input
													id="gpa"
													type="number"
													step="0.01"
													min="0"
													max="4"
													value={formData.gpa}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															gpa: e.target.value,
														}))
													}
												/>
											) : (
												<div className="p-3 bg-muted rounded-md">
													<span>{profile?.gpa || t("profile", "notSet")}</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</SlideUp>

					{/* Test Scores */}
					<SlideUp delay={0.1}>
						<Card>
							<CardHeader>
								<CardTitle>{t("profile", "testScores")}</CardTitle>
							</CardHeader>
							<CardContent>
								{profile?.testScores && profile.testScores.length > 0 ? (
									<div className="space-y-3">
										{profile.testScores.map((score, index) => (
											<div
												key={index}
												className="flex items-center justify-between p-3 bg-muted rounded-md"
											>
												<span className="font-medium">{score.type}</span>
												<span className="text-primary font-semibold">
													{score.score}
												</span>
											</div>
										))}
									</div>
								) : (
									<p className="text-muted-foreground text-center py-4">
										{t("profile", "noTestScores")}
									</p>
								)}
								<Button variant="outline" className="w-full mt-4">
									{t("profile", "addTestScore")}
								</Button>
							</CardContent>
						</Card>
					</SlideUp>
				</div>
			</PageContainer>
		</PageTransition>
	);
}
