"use client";

import { motion } from "framer-motion";
import {
	AlertCircle,
	BookOpen,
	Briefcase,
	Calendar,
	Check,
	CheckCircle,
	ChevronRight,
	Edit2,
	GraduationCap,
	KeyRound,
	Loader2,
	Mail,
	MapPin,
	Shield,
	Sparkles,
	Target,
	User,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import {
	PageTransition,
	SlideUp,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserMeResponse } from "@/lib/api/types";
import { authService } from "@/lib/services/auth";
import { userService } from "@/lib/services/user";
import { useUserStore } from "@/lib/store/userStore";

const EDUCATION_LEVELS = [
	{ value: "high_school", labelKey: "highSchool" },
	{ value: "undergrad", labelKey: "undergraduate" },
	{ value: "graduate", labelKey: "graduate" },
	{ value: "working", labelKey: "working" },
];

const TARGET_DEGREES = [
	{ value: "bachelors", labelKey: "bachelors" },
	{ value: "masters", labelKey: "masters" },
	{ value: "mba", labelKey: "mba" },
	{ value: "phd", labelKey: "phd" },
];

const CAMPUS_SETTINGS = [
	{ value: "urban", labelKey: "urban" },
	{ value: "suburban", labelKey: "suburban" },
	{ value: "rural", labelKey: "rural" },
];

export default function ProfilePage() {
	const t = useTranslations("profile");
	const { profile: storeProfile, updateProfile: updateStoreProfile } =
		useUserStore();

	const [userData, setUserData] = useState<UserMeResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [isSendingVerification, setIsSendingVerification] = useState(false);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		fullName: "",
		currentEducationLevel: "",
		targetDegree: "",
		gpa: "",
		gpaScale: "",
		workExperienceYears: "",
		testScores: {} as Record<string, string>,
	});

	// Fetch user data
	useEffect(() => {
		async function fetchData() {
			try {
				const data = await userService.getMe();
				setUserData(data);
				setFormData({
					fullName: data.fullName || "",
					currentEducationLevel: data.currentEducationLevel || "",
					targetDegree: data.targetDegree || "",
					gpa: data.gpa?.toString() || "",
					gpaScale: data.gpaScale?.toString() || "4.0",
					workExperienceYears: data.workExperienceYears?.toString() || "",
					testScores: data.testScores || {},
				});
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			} finally {
				setIsLoading(false);
			}
		}
		fetchData();
	}, []);

	// Get user initials for avatar
	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	// Format date
	const formatDate = (dateStr?: string) => {
		if (!dateStr) return t("noData");
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	// Get education level label
	const getEducationLabel = (value?: string) => {
		const level = EDUCATION_LEVELS.find((l) => l.value === value);
		return level ? t(level.labelKey) : t("noData");
	};

	// Get target degree label
	const getDegreeLabel = (value?: string) => {
		const degree = TARGET_DEGREES.find((d) => d.value === value);
		return degree ? t(degree.labelKey) : t("noData");
	};

	// Get campus setting label
	const getCampusLabel = (value?: string) => {
		const setting = CAMPUS_SETTINGS.find((s) => s.value === value);
		return setting ? t(setting.labelKey) : t("noData");
	};

	// Get journey type label
	const getJourneyLabel = (value?: string) => {
		if (value === "exploring") return t("exploring");
		if (value === "targeted") return t("targeted");
		return t("noData");
	};

	// Handle save profile
	const handleSave = async () => {
		setIsSaving(true);
		setMessage(null);

		try {
			const updateData = {
				fullName: formData.fullName || undefined,
				currentEducationLevel: formData.currentEducationLevel || undefined,
				targetDegree: formData.targetDegree || undefined,
				gpa: formData.gpa ? Number.parseFloat(formData.gpa) : undefined,
				gpaScale: formData.gpaScale
					? Number.parseFloat(formData.gpaScale)
					: undefined,
				workExperienceYears: formData.workExperienceYears
					? Number.parseInt(formData.workExperienceYears, 10)
					: undefined,
				testScores:
					Object.keys(formData.testScores).length > 0
						? formData.testScores
						: undefined,
			};

			await userService.updateProfile(updateData);

			// Refresh user data
			const data = await userService.getMe();
			setUserData(data);

			// Update store
			if (data.fullName) {
				updateStoreProfile({ fullName: data.fullName });
			}

			setIsEditing(false);
			setMessage({ type: "success", text: t("updateSuccess") });

			// Clear message after 3 seconds
			setTimeout(() => setMessage(null), 3000);
		} catch (error) {
			console.error("Failed to update profile:", error);
			setMessage({ type: "error", text: t("updateError") });
		} finally {
			setIsSaving(false);
		}
	};

	// Handle password reset
	const handleResetPassword = async () => {
		if (!userData?.email) return;

		setIsResettingPassword(true);
		setMessage(null);

		try {
			await userService.requestPasswordReset({ email: userData.email });
			setMessage({ type: "success", text: t("resetPasswordSent") });
		} catch (error) {
			console.error("Failed to request password reset:", error);
			setMessage({ type: "error", text: t("resetPasswordError") });
		} finally {
			setIsResettingPassword(false);
		}
	};

	// Handle send verification email
	const handleSendVerification = async () => {
		if (!userData?.email) return;

		setIsSendingVerification(true);
		setMessage(null);

		try {
			await authService.resendVerification(userData.email);
			setMessage({ type: "success", text: t("verificationSent") });
		} catch (error) {
			console.error("Failed to send verification email:", error);
			setMessage({ type: "error", text: t("verificationError") });
		} finally {
			setIsSendingVerification(false);
		}
	};

	// Handle test score change
	const handleTestScoreChange = (type: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			testScores: {
				...prev.testScores,
				[type]: value,
			},
		}));
	};

	// Calculate profile completion color
	const getCompletionColor = (completion: number) => {
		if (completion >= 80) return "text-green-500";
		if (completion >= 50) return "text-yellow-500";
		return "text-orange-500";
	};

	if (isLoading) {
		return (
			<PageTransition>
				<div className="min-h-screen bg-background">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<div className="space-y-6">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-72" />
							<Skeleton className="h-48 w-full rounded-lg" />
							<Skeleton className="h-64 w-full rounded-lg" />
							<Skeleton className="h-48 w-full rounded-lg" />
						</div>
					</div>
				</div>
			</PageTransition>
		);
	}

	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<SlideUp>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-2">
								{t("title")}
							</h1>
							<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
						</div>
					</SlideUp>

					{/* Message Alert */}
					{message && (
						<SlideUp>
							<Alert
								className={`mb-6 ${message.type === "success" ? "border-green-500" : "border-destructive"}`}
							>
								{message.type === "success" ? (
									<CheckCircle className="h-4 w-4 text-green-500" />
								) : (
									<AlertCircle className="h-4 w-4" />
								)}
								<AlertDescription
									className={message.type === "success" ? "text-green-600" : ""}
								>
									{message.text}
								</AlertDescription>
							</Alert>
						</SlideUp>
					)}

					<StaggerContainer>
						<div className="space-y-6">
							{/* Profile Completion Card */}
							<StaggerItem>
								<Card className="overflow-hidden">
									<div className="bg-gradient-to-r from-primary/10 via-chart-2/10 to-transparent p-6">
										<div className="flex items-center gap-6">
											<Avatar className="h-20 w-20 border-4 border-background shadow-lg">
												<AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
													{getInitials(userData?.fullName)}
												</AvatarFallback>
											</Avatar>
											<div className="flex-1">
												<h2 className="text-2xl font-bold text-foreground mb-1">
													{userData?.fullName || t("noData")}
												</h2>
												<div className="flex items-center gap-2 text-muted-foreground mb-3 flex-wrap">
													<Mail className="h-4 w-4" />
													<span>{userData?.email}</span>
													{userData?.emailVerified ? (
														<Badge
															variant="secondary"
															className="text-xs bg-green-100 text-green-700"
														>
															<Check className="h-3 w-3 mr-1" />
															{t("emailVerified")}
														</Badge>
													) : (
														<>
															<Badge
																variant="secondary"
																className="text-xs bg-yellow-100 text-yellow-700"
															>
																{t("emailNotVerified")}
															</Badge>
															<Button
																variant="link"
																size="sm"
																className="h-auto p-0 text-xs text-primary"
																onClick={handleSendVerification}
																disabled={isSendingVerification}
															>
																{isSendingVerification ? (
																	<Loader2 className="h-3 w-3 animate-spin mr-1" />
																) : null}
																{t("verifyNow")}
															</Button>
														</>
													)}
												</div>
												<div className="space-y-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-muted-foreground">
															{t("profileCompletion")}
														</span>
														<span
															className={`font-semibold ${getCompletionColor(userData?.profileCompletion || 0)}`}
														>
															{userData?.profileCompletion || 0}%
														</span>
													</div>
													<Progress
														value={userData?.profileCompletion || 0}
														className="h-2"
													/>
													{(userData?.profileCompletion || 0) < 100 && (
														<p className="text-xs text-muted-foreground">
															{t("completeProfile")}
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</Card>
							</StaggerItem>

							{/* Personal Information */}
							<StaggerItem>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<div>
											<CardTitle className="flex items-center gap-2">
												<User className="h-5 w-5 text-muted-foreground" />
												{t("personalInformation")}
											</CardTitle>
											<CardDescription>
												{isEditing
													? "Edit your personal details"
													: "Your personal details"}
											</CardDescription>
										</div>
										{!isEditing ? (
											<Button
												variant="outline"
												size="sm"
												onClick={() => setIsEditing(true)}
											>
												<Edit2 className="h-4 w-4 mr-2" />
												{t("editProfile")}
											</Button>
										) : (
											<div className="flex gap-2">
												<Button
													variant="ghost"
													size="sm"
													onClick={() => {
														setIsEditing(false);
														// Reset form data
														setFormData({
															fullName: userData?.fullName || "",
															currentEducationLevel:
																userData?.currentEducationLevel || "",
															targetDegree: userData?.targetDegree || "",
															gpa: userData?.gpa?.toString() || "",
															gpaScale: userData?.gpaScale?.toString() || "4.0",
															workExperienceYears:
																userData?.workExperienceYears?.toString() || "",
															testScores: userData?.testScores || {},
														});
													}}
												>
													<X className="h-4 w-4 mr-2" />
													{t("cancel")}
												</Button>
												<Button
													size="sm"
													onClick={handleSave}
													disabled={isSaving}
												>
													{isSaving ? (
														<>
															<Loader2 className="h-4 w-4 mr-2 animate-spin" />
															{t("saving")}
														</>
													) : (
														<>
															<Check className="h-4 w-4 mr-2" />
															{t("saveChanges")}
														</>
													)}
												</Button>
											</div>
										)}
									</CardHeader>
									<CardContent>
										{isEditing ? (
											<div className="grid gap-6 sm:grid-cols-2">
												<div className="space-y-2">
													<Label htmlFor="fullName">{t("fullName")}</Label>
													<Input
														id="fullName"
														value={formData.fullName}
														onChange={(e) =>
															setFormData((prev) => ({
																...prev,
																fullName: e.target.value,
															}))
														}
														placeholder={t("fullNamePlaceholder")}
													/>
												</div>
												<div className="space-y-2">
													<Label htmlFor="educationLevel">
														{t("educationLevel")}
													</Label>
													<Select
														value={formData.currentEducationLevel}
														onValueChange={(value) =>
															setFormData((prev) => ({
																...prev,
																currentEducationLevel: value,
															}))
														}
													>
														<SelectTrigger>
															<SelectValue placeholder={t("selectLevel")} />
														</SelectTrigger>
														<SelectContent>
															{EDUCATION_LEVELS.map((level) => (
																<SelectItem
																	key={level.value}
																	value={level.value}
																>
																	{t(level.labelKey)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="targetDegree">
														{t("targetDegree")}
													</Label>
													<Select
														value={formData.targetDegree}
														onValueChange={(value) =>
															setFormData((prev) => ({
																...prev,
																targetDegree: value,
															}))
														}
													>
														<SelectTrigger>
															<SelectValue placeholder={t("selectLevel")} />
														</SelectTrigger>
														<SelectContent>
															{TARGET_DEGREES.map((degree) => (
																<SelectItem
																	key={degree.value}
																	value={degree.value}
																>
																	{t(degree.labelKey)}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</div>
												<div className="space-y-2">
													<Label htmlFor="gpa">{t("gpa")}</Label>
													<div className="flex gap-2">
														<Input
															id="gpa"
															type="number"
															step="0.01"
															min="0"
															max="10"
															value={formData.gpa}
															onChange={(e) =>
																setFormData((prev) => ({
																	...prev,
																	gpa: e.target.value,
																}))
															}
															placeholder="3.5"
															className="flex-1"
														/>
														<span className="flex items-center text-muted-foreground">
															/
														</span>
														<Input
															type="number"
															step="0.1"
															min="1"
															max="10"
															value={formData.gpaScale}
															onChange={(e) =>
																setFormData((prev) => ({
																	...prev,
																	gpaScale: e.target.value,
																}))
															}
															placeholder="4.0"
															className="w-20"
														/>
													</div>
												</div>
												<div className="space-y-2">
													<Label htmlFor="workExp">{t("workExperience")}</Label>
													<div className="flex gap-2 items-center">
														<Input
															id="workExp"
															type="number"
															min="0"
															max="50"
															value={formData.workExperienceYears}
															onChange={(e) =>
																setFormData((prev) => ({
																	...prev,
																	workExperienceYears: e.target.value,
																}))
															}
															placeholder="0"
															className="w-24"
														/>
														<span className="text-muted-foreground">
															{t("years")}
														</span>
													</div>
												</div>
											</div>
										) : (
											<div className="grid gap-4 sm:grid-cols-2">
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<User className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("fullName")}
														</p>
														<p className="font-medium">
															{userData?.fullName || t("noData")}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<GraduationCap className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("educationLevel")}
														</p>
														<p className="font-medium">
															{getEducationLabel(
																userData?.currentEducationLevel,
															)}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Target className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("targetDegree")}
														</p>
														<p className="font-medium">
															{getDegreeLabel(userData?.targetDegree)}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<BookOpen className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("gpa")}
														</p>
														<p className="font-medium">
															{userData?.gpa
																? `${userData.gpa}/${userData?.gpaScale || 4.0}`
																: t("noData")}
														</p>
													</div>
												</div>
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Briefcase className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("workExperience")}
														</p>
														<p className="font-medium">
															{userData?.workExperienceYears
																? `${userData.workExperienceYears} ${t("years")}`
																: t("noData")}
														</p>
													</div>
												</div>
											</div>
										)}
									</CardContent>
								</Card>
							</StaggerItem>

							{/* Test Scores */}
							<StaggerItem>
								<Card>
									<CardHeader className="flex flex-row items-center justify-between">
										<div>
											<CardTitle className="flex items-center gap-2">
												<BookOpen className="h-5 w-5 text-muted-foreground" />
												{t("testScores")}
											</CardTitle>
											<CardDescription>
												Your standardized test scores
											</CardDescription>
										</div>
									</CardHeader>
									<CardContent>
										{isEditing ? (
											<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												{["IELTS", "TOEFL", "GRE", "GMAT"].map((testType) => (
													<div key={testType} className="space-y-2">
														<Label htmlFor={testType}>{testType}</Label>
														<Input
															id={testType}
															type="number"
															step={testType === "IELTS" ? "0.5" : "1"}
															min="0"
															max={
																testType === "IELTS"
																	? "9"
																	: testType === "TOEFL"
																		? "120"
																		: "800"
															}
															value={formData.testScores[testType] || ""}
															onChange={(e) =>
																handleTestScoreChange(testType, e.target.value)
															}
															placeholder={
																testType === "IELTS"
																	? "7.0"
																	: testType === "TOEFL"
																		? "100"
																		: testType === "GRE"
																			? "320"
																			: "700"
															}
														/>
													</div>
												))}
											</div>
										) : userData?.testScores &&
											Object.keys(userData.testScores).length > 0 ? (
											<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
												{Object.entries(userData.testScores).map(
													([type, score]) => (
														<div
															key={type}
															className="p-4 rounded-lg bg-muted/50 text-center"
														>
															<p className="text-sm text-muted-foreground mb-1">
																{type}
															</p>
															<p className="text-2xl font-bold text-foreground">
																{score}
															</p>
														</div>
													),
												)}
											</div>
										) : (
											<div className="text-center py-8 text-muted-foreground">
												<BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
												<p>{t("noTestScores")}</p>
												<Button
													variant="outline"
													size="sm"
													className="mt-4"
													onClick={() => setIsEditing(true)}
												>
													{t("addTestScore")}
												</Button>
											</div>
										)}
									</CardContent>
								</Card>
							</StaggerItem>

							{/* Preferences */}
							<StaggerItem>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Sparkles className="h-5 w-5 text-muted-foreground" />
											{t("preferences")}
										</CardTitle>
										<CardDescription>
											Your study abroad preferences
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-4 sm:grid-cols-2">
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<BookOpen className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("fieldsOfInterest")}
													</p>
													<div className="flex flex-wrap gap-1 mt-1">
														{userData?.fieldOfInterest &&
														userData.fieldOfInterest.length > 0 ? (
															userData.fieldOfInterest.map((field) => (
																<Badge
																	key={field}
																	variant="secondary"
																	className="text-xs"
																>
																	{field}
																</Badge>
															))
														) : (
															<span className="text-muted-foreground">
																{t("noData")}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<MapPin className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("preferredRegions")}
													</p>
													<div className="flex flex-wrap gap-1 mt-1">
														{userData?.preferredRegions &&
														userData.preferredRegions.length > 0 ? (
															userData.preferredRegions.map((region) => (
																<Badge
																	key={region}
																	variant="secondary"
																	className="text-xs"
																>
																	{region}
																</Badge>
															))
														) : (
															<span className="text-muted-foreground">
																{t("noData")}
															</span>
														)}
													</div>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<Calendar className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("intendedStartTerm")}
													</p>
													<p className="font-medium">
														{userData?.intendedStartTerm || t("noData")}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<Target className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("budgetRange")}
													</p>
													<p className="font-medium">
														{userData?.budgetLabel || t("noData")}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<Sparkles className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("journeyType")}
													</p>
													<p className="font-medium">
														{getJourneyLabel(userData?.journeyType)}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-3">
												<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
													<MapPin className="h-4 w-4 text-muted-foreground" />
												</div>
												<div>
													<p className="text-sm text-muted-foreground">
														{t("campusSetting")}
													</p>
													<p className="font-medium">
														{getCampusLabel(userData?.campusSetting)}
													</p>
												</div>
											</div>
										</div>
										{userData?.interests && userData.interests.length > 0 && (
											<>
												<Separator className="my-4" />
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Sparkles className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground mb-2">
															{t("interests")}
														</p>
														<div className="flex flex-wrap gap-1">
															{userData.interests.map((interest) => (
																<Badge
																	key={interest}
																	variant="outline"
																	className="text-xs"
																>
																	{interest}
																</Badge>
															))}
														</div>
													</div>
												</div>
											</>
										)}
									</CardContent>
								</Card>
							</StaggerItem>

							{/* Account & Security */}
							<StaggerItem>
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Shield className="h-5 w-5 text-muted-foreground" />
											{t("accountSecurity")}
										</CardTitle>
										<CardDescription>
											Manage your account security settings
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
													<Calendar className="h-5 w-5 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">{t("memberSince")}</p>
													<p className="text-sm text-muted-foreground">
														{formatDate(userData?.createdAt)}
													</p>
												</div>
											</div>
										</div>
										<Separator />
										<div className="flex items-center justify-between p-4 rounded-lg border">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
													<KeyRound className="h-5 w-5 text-muted-foreground" />
												</div>
												<div>
													<p className="font-medium">{t("resetPassword")}</p>
													<p className="text-sm text-muted-foreground">
														{t("resetPasswordDesc")}
													</p>
												</div>
											</div>
											<Button
												variant="outline"
												size="sm"
												onClick={handleResetPassword}
												disabled={isResettingPassword}
											>
												{isResettingPassword ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<>
														{t("resetPassword")}
														<ChevronRight className="h-4 w-4 ml-1" />
													</>
												)}
											</Button>
										</div>
									</CardContent>
								</Card>
							</StaggerItem>
						</div>
					</StaggerContainer>
				</div>
			</div>
		</PageTransition>
	);
}
