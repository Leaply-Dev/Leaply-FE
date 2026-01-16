"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	BookOpen,
	Briefcase,
	Check,
	Edit2,
	GraduationCap,
	Loader2,
	Target,
	User,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useId, useState } from "react";
import { toast } from "sonner";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	getGetMeQueryKey,
	useGetMe,
	useUpdateProfile,
} from "@/lib/generated/api/endpoints/user/user";
import { useUserStore } from "@/lib/store/userStore";
import { type ProfileFormData, profileSchema } from "@/lib/validations/profile";

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

const TEST_TYPES = ["IELTS", "TOEFL", "GRE", "GMAT"] as const;

interface AcademicInfoTabProps {
	initialEditMode?: boolean;
}

export function AcademicInfoTab({
	initialEditMode = false,
}: AcademicInfoTabProps) {
	const t = useTranslations("profile");
	const queryClient = useQueryClient();
	const { updateProfile: updateStoreProfile } = useUserStore();

	// React Query
	const { data: response, isLoading } = useGetMe();
	const userData = response?.data?.data;

	const updateProfileMutation = useUpdateProfile({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
				toast.success(t("updateSuccess"));
				setIsEditing(false);
			},
			onError: () => {
				toast.error(t("updateError"));
			},
		},
	});

	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof ProfileFormData, string>>
	>({});

	// Generate unique IDs for form fields
	const fullNameId = useId();
	const educationLevelId = useId();
	const targetDegreeId = useId();
	const gpaId = useId();
	const gpaScaleId = useId();
	const workExpId = useId();

	// Form state - initialize from userData when available
	const [formData, setFormData] = useState({
		fullName: "",
		currentEducationLevel: "",
		targetDegree: "",
		gpa: "",
		gpaScale: "4.0",
		workExperienceYears: "",
		testScores: {} as Record<string, string>,
	});

	// Sync form data with userData when it loads
	const syncFormData = () => {
		if (userData) {
			setFormData({
				fullName: userData.fullName || "",
				currentEducationLevel: userData.currentEducationLevel || "",
				targetDegree: userData.targetDegree || "",
				gpa: userData.gpa?.toString() || "",
				gpaScale: userData.gpaScale?.toString() || "4.0",
				workExperienceYears: userData.workExperienceYears?.toString() || "",
				testScores: (userData.testScores as Record<string, string>) || {},
			});
		}
	};

	const getEducationLabel = (value?: string) => {
		const level = EDUCATION_LEVELS.find((l) => l.value === value);
		return level ? t(level.labelKey) : t("noData");
	};

	const getDegreeLabel = (value?: string) => {
		const degree = TARGET_DEGREES.find((d) => d.value === value);
		return degree ? t(degree.labelKey) : t("noData");
	};

	const handleTestScoreChange = (type: string, value: string) => {
		setFormData((prev) => ({
			...prev,
			testScores: {
				...prev.testScores,
				[type]: value,
			},
		}));
	};

	const handleSave = async () => {
		setFieldErrors({});

		try {
			const validatedData = profileSchema.parse({
				...formData,
				gpa: formData.gpa === "" ? undefined : Number(formData.gpa),
				gpaScale: formData.gpaScale === "" ? 4.0 : Number(formData.gpaScale),
				workExperienceYears:
					formData.workExperienceYears === ""
						? undefined
						: Number(formData.workExperienceYears),
			});

			const updateData = {
				fullName: validatedData.fullName,
				currentEducationLevel: validatedData.currentEducationLevel,
				targetDegree: validatedData.targetDegree,
				gpa:
					typeof validatedData.gpa === "number" ? validatedData.gpa : undefined,
				gpaScale: validatedData.gpaScale,
				workExperienceYears:
					typeof validatedData.workExperienceYears === "number"
						? validatedData.workExperienceYears
						: undefined,
				testScores:
					Object.keys(formData.testScores).length > 0
						? formData.testScores
						: undefined,
			};

			await updateProfileMutation.mutateAsync({ data: updateData });

			if (validatedData.fullName) {
				updateStoreProfile({ fullName: validatedData.fullName });
			}
		} catch (error) {
			if (error && typeof error === "object" && "errors" in error) {
				const zodError = error as {
					errors: Array<{ path: string[]; message: string }>;
				};
				const errors: Partial<Record<keyof ProfileFormData, string>> = {};
				zodError.errors.forEach((err) => {
					const field = err.path[err.path.length - 1] as keyof ProfileFormData;
					if (field) {
						errors[field] = err.message;
					}
				});
				setFieldErrors(errors);
			}
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setFieldErrors({});
		syncFormData();
	};

	const handleEdit = () => {
		syncFormData();
		setIsEditing(true);
	};

	const getTestScoreConfig = (type: string) => {
		switch (type) {
			case "IELTS":
				return { step: "0.5", min: "0", max: "9", placeholder: "7.0" };
			case "TOEFL":
				return { step: "1", min: "0", max: "120", placeholder: "100" };
			case "GRE":
				return { step: "1", min: "0", max: "340", placeholder: "320" };
			case "GMAT":
				return { step: "10", min: "200", max: "800", placeholder: "700" };
			default:
				return { step: "1", min: "0", max: "999", placeholder: "" };
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-64" />
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-2">
							{[...Array(5)].map((_, i) => (
								<div key={i} className="flex items-start gap-3">
									<Skeleton className="h-8 w-8 rounded-lg" />
									<div className="space-y-2">
										<Skeleton className="h-3 w-20" />
										<Skeleton className="h-4 w-32" />
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{[...Array(4)].map((_, i) => (
								<Skeleton key={i} className="h-24 rounded-lg" />
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Personal Information Card */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<User className="h-5 w-5 text-muted-foreground" />
							{t("personalInformation")}
						</CardTitle>
						<CardDescription>
							{isEditing
								? "Edit your academic credentials"
								: "Your academic credentials and background"}
						</CardDescription>
					</div>
					{!isEditing ? (
						<Button variant="outline" size="sm" onClick={handleEdit}>
							<Edit2 className="h-4 w-4 mr-2" />
							{t("editProfile")}
						</Button>
					) : (
						<div className="flex gap-2">
							<Button variant="ghost" size="sm" onClick={handleCancel}>
								<X className="h-4 w-4 mr-2" />
								{t("cancel")}
							</Button>
							<Button
								size="sm"
								onClick={handleSave}
								disabled={updateProfileMutation.isPending}
							>
								{updateProfileMutation.isPending ? (
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
								<Label htmlFor={fullNameId}>{t("fullName")}</Label>
								<Input
									id={fullNameId}
									value={formData.fullName}
									onChange={(e) =>
										setFormData((prev) => ({
											...prev,
											fullName: e.target.value,
										}))
									}
									placeholder={t("fullNamePlaceholder")}
									className={fieldErrors.fullName ? "border-destructive" : ""}
								/>
								{fieldErrors.fullName && (
									<p className="text-sm text-destructive">
										{fieldErrors.fullName}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor={educationLevelId}>{t("educationLevel")}</Label>
								<Select
									value={formData.currentEducationLevel}
									onValueChange={(value) =>
										setFormData((prev) => ({
											...prev,
											currentEducationLevel: value,
										}))
									}
								>
									<SelectTrigger id={educationLevelId}>
										<SelectValue placeholder={t("selectLevel")} />
									</SelectTrigger>
									<SelectContent>
										{EDUCATION_LEVELS.map((level) => (
											<SelectItem key={level.value} value={level.value}>
												{t(level.labelKey)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor={targetDegreeId}>{t("targetDegree")}</Label>
								<Select
									value={formData.targetDegree}
									onValueChange={(value) =>
										setFormData((prev) => ({
											...prev,
											targetDegree: value,
										}))
									}
								>
									<SelectTrigger id={targetDegreeId}>
										<SelectValue placeholder={t("selectLevel")} />
									</SelectTrigger>
									<SelectContent>
										{TARGET_DEGREES.map((degree) => (
											<SelectItem key={degree.value} value={degree.value}>
												{t(degree.labelKey)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor={gpaId}>{t("gpa")}</Label>
								<div className="flex gap-2">
									<Input
										id={gpaId}
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
										className={`flex-1 ${fieldErrors.gpa ? "border-destructive" : ""}`}
									/>
									<span className="flex items-center text-muted-foreground">
										/
									</span>
									<Input
										id={gpaScaleId}
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
										className={`w-20 ${fieldErrors.gpaScale ? "border-destructive" : ""}`}
									/>
								</div>
								{fieldErrors.gpa && (
									<p className="text-sm text-destructive">{fieldErrors.gpa}</p>
								)}
							</div>

							<div className="space-y-2">
								<Label htmlFor={workExpId}>{t("workExperience")}</Label>
								<div className="flex gap-2 items-center">
									<Input
										id={workExpId}
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
										className={`w-24 ${fieldErrors.workExperienceYears ? "border-destructive" : ""}`}
									/>
									<span className="text-muted-foreground">{t("years")}</span>
								</div>
								{fieldErrors.workExperienceYears && (
									<p className="text-sm text-destructive">
										{fieldErrors.workExperienceYears}
									</p>
								)}
							</div>
						</div>
					) : (
						<div className="grid gap-4 sm:grid-cols-2">
							<InfoItem
								icon={<User className="h-4 w-4" />}
								label={t("fullName")}
								value={userData?.fullName || t("noData")}
							/>
							<InfoItem
								icon={<GraduationCap className="h-4 w-4" />}
								label={t("educationLevel")}
								value={getEducationLabel(userData?.currentEducationLevel)}
							/>
							<InfoItem
								icon={<Target className="h-4 w-4" />}
								label={t("targetDegree")}
								value={getDegreeLabel(userData?.targetDegree)}
							/>
							<InfoItem
								icon={<BookOpen className="h-4 w-4" />}
								label={t("gpa")}
								value={
									userData?.gpa
										? `${userData.gpa}/${userData.gpaScale || 4.0}`
										: t("noData")
								}
							/>
							<InfoItem
								icon={<Briefcase className="h-4 w-4" />}
								label={t("workExperience")}
								value={
									userData?.workExperienceYears
										? `${userData.workExperienceYears} ${t("years")}`
										: t("noData")
								}
							/>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Test Scores Card */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<BookOpen className="h-5 w-5 text-muted-foreground" />
							{t("testScores")}
						</CardTitle>
						<CardDescription>
							Your standardized test scores (IELTS, TOEFL, GRE, GMAT)
						</CardDescription>
					</div>
					{!isEditing &&
						userData?.testScores &&
						Object.keys(userData.testScores).length > 0 && (
							<Button variant="outline" size="sm" onClick={handleEdit}>
								<Edit2 className="h-4 w-4 mr-2" />
								{t("editTestScores")}
							</Button>
						)}
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{TEST_TYPES.map((testType) => {
								const config = getTestScoreConfig(testType);
								return (
									<div key={testType} className="space-y-2">
										<Label>{testType}</Label>
										<Input
											type="number"
											step={config.step}
											min={config.min}
											max={config.max}
											value={formData.testScores[testType] || ""}
											onChange={(e) =>
												handleTestScoreChange(testType, e.target.value)
											}
											placeholder={config.placeholder}
										/>
									</div>
								);
							})}
						</div>
					) : userData?.testScores &&
						Object.keys(userData.testScores).length > 0 ? (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{Object.entries(userData.testScores).map(
								([type, score]: [string, unknown]) => (
									<div
										key={type}
										className="p-4 rounded-lg bg-muted/50 text-center"
									>
										<p className="text-sm text-muted-foreground mb-1">{type}</p>
										<p className="text-2xl font-bold text-foreground">
											{String(score)}
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
								onClick={handleEdit}
							>
								{t("addTestScore")}
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

function InfoItem({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 text-muted-foreground">
				{icon}
			</div>
			<div>
				<p className="text-sm text-muted-foreground">{label}</p>
				<p className="font-medium">{value}</p>
			</div>
		</div>
	);
}
