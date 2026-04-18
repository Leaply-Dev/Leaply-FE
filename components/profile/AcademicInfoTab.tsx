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
import { type FormEvent, type ReactNode, useId, useState } from "react";
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
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import {
	getGetMeQueryKey,
	useGetMe,
	useUpdateProfile,
} from "@/lib/generated/api/endpoints/user/user";
import type { UserMeResponse } from "@/lib/generated/api/models";
import { useUserStore } from "@/lib/store/userStore";
import { type ProfileFormData, profileSchema } from "@/lib/validations/profile";

const EDUCATION_LEVELS = [
	{ value: "HIGH_SCHOOL", labelKey: "highSchool" },
	{ value: "UNDERGRADUATE", labelKey: "undergraduate" },
	{ value: "GRADUATE", labelKey: "graduate" },
	{ value: "WORKING", labelKey: "working" },
];

const TARGET_DEGREES = [
	{ value: "BACHELOR", labelKey: "bachelors" },
	{ value: "MASTERS", labelKey: "masters" },
	{ value: "PHD", labelKey: "phd" },
];

const CURRENT_MAJORS = [
	{ value: "computer_science", labelKey: "computerScience" },
	{ value: "engineering", labelKey: "engineering" },
	{ value: "mathematics", labelKey: "mathematics" },
	{ value: "business", labelKey: "business" },
	{ value: "economics", labelKey: "economics" },
	{ value: "statistics", labelKey: "statistics" },
	{ value: "physics", labelKey: "physics" },
	{ value: "finance", labelKey: "finance" },
	{ value: "design", labelKey: "design" },
	{ value: "natural_sciences", labelKey: "naturalSciences" },
	{ value: "social_sciences", labelKey: "socialSciences" },
];

const TEST_TYPES = ["IELTS", "TOEFL", "GRE", "GMAT"] as const;
type TestType = (typeof TEST_TYPES)[number];

const TEST_SCORE_CONFIG: Record<
	TestType,
	{ step: string; min: string; max: string; placeholder: string }
> = {
	IELTS: { step: "0.5", min: "0", max: "9", placeholder: "7.0" },
	TOEFL: { step: "1", min: "0", max: "120", placeholder: "100" },
	GRE: { step: "1", min: "0", max: "340", placeholder: "320" },
	GMAT: { step: "10", min: "200", max: "800", placeholder: "700" },
};

const stringFromForm = (form: FormData, key: string): string =>
	(form.get(key) as string | null)?.trim() ?? "";

const numberFromForm = (form: FormData, key: string): number | undefined => {
	const raw = stringFromForm(form, key);
	if (raw === "") return undefined;
	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : undefined;
};

interface AcademicInfoTabProps {
	initialEditMode?: boolean;
}

export function AcademicInfoTab({
	initialEditMode = false,
}: AcademicInfoTabProps) {
	const t = useTranslations("profile");
	const queryClient = useQueryClient();
	const updateStoreProfile = useUserStore((state) => state.updateProfile);

	const { data: response, isLoading } = useGetMe();
	const userData = unwrapResponse<UserMeResponse>(response);

	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [fieldErrors, setFieldErrors] = useState<
		Partial<Record<keyof ProfileFormData, string>>
	>({});

	const fullNameId = useId();
	const educationLevelId = useId();
	const currentMajorId = useId();
	const targetDegreeId = useId();
	const gpaId = useId();
	const gpaScaleId = useId();
	const workExpId = useId();

	const updateProfileMutation = useUpdateProfile({
		mutation: {
			onSuccess: () => {
				void queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
				toast.success(t("updateSuccess"));
				setIsEditing(false);
			},
			onError: () => {
				toast.error(t("updateError"));
			},
		},
	});

	const getEducationLabel = (value?: string) => {
		const level = EDUCATION_LEVELS.find((l) => l.value === value);
		return level ? t(level.labelKey) : t("noData");
	};

	const getDegreeLabel = (value?: string) => {
		const degree = TARGET_DEGREES.find((d) => d.value === value);
		return degree ? t(degree.labelKey) : t("noData");
	};

	const getCurrentMajorLabel = (value?: string) => {
		const major = CURRENT_MAJORS.find((m) => m.value === value);
		return major ? t(`currentMajors.${major.labelKey}`) : t("noData");
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setFieldErrors({});

		const form = new FormData(event.currentTarget);

		const testScores: Record<string, string> = {};
		for (const type of TEST_TYPES) {
			const score = stringFromForm(form, `testScore_${type}`);
			if (score !== "") testScores[type] = score;
		}

		try {
			const validatedData = profileSchema.parse({
				fullName: stringFromForm(form, "fullName"),
				currentEducationLevel:
					stringFromForm(form, "currentEducationLevel") || undefined,
				currentMajor: stringFromForm(form, "currentMajor") || undefined,
				targetDegree: stringFromForm(form, "targetDegree") || undefined,
				gpa: numberFromForm(form, "gpa"),
				gpaScale: numberFromForm(form, "gpaScale") ?? 4.0,
				workExperienceYears: numberFromForm(form, "workExperienceYears"),
				testScores: Object.keys(testScores).length > 0 ? testScores : undefined,
			});

			await updateProfileMutation.mutateAsync({
				data: {
					fullName: validatedData.fullName,
					currentEducationLevel: validatedData.currentEducationLevel,
					currentMajor: validatedData.currentMajor,
					targetDegree: validatedData.targetDegree,
					gpa:
						typeof validatedData.gpa === "number"
							? validatedData.gpa
							: undefined,
					gpaScale: validatedData.gpaScale as 4 | 10,
					workExperienceYears:
						typeof validatedData.workExperienceYears === "number"
							? validatedData.workExperienceYears
							: undefined,
					testScores: validatedData.testScores,
				},
			});

			if (validatedData.fullName) {
				updateStoreProfile({ fullName: validatedData.fullName });
			}
		} catch (error) {
			if (error && typeof error === "object" && "issues" in error) {
				const zodError = error as {
					issues: Array<{ path: PropertyKey[]; message: string }>;
				};
				const errors: Partial<Record<keyof ProfileFormData, string>> = {};
				zodError.issues.forEach((err) => {
					const field = err.path[err.path.length - 1] as keyof ProfileFormData;
					if (field) errors[field] = err.message;
				});
				setFieldErrors(errors);
				toast.error(t("updateError"));
			} else {
				console.error("Profile save failed:", error);
				toast.error(t("updateError"));
			}
		}
	};

	const handleCancel = () => {
		setIsEditing(false);
		setFieldErrors({});
	};

	const handleEdit = () => {
		setFieldErrors({});
		setIsEditing(true);
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
								<div
									key={`personal-skeleton-${i}`}
									className="flex items-start gap-3"
								>
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
								<Skeleton
									key={`test-skeleton-${i}`}
									className="h-24 rounded-lg"
								/>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	const personalHeader = (
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
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={handleCancel}
					>
						<X className="h-4 w-4 mr-2" />
						{t("cancel")}
					</Button>
					<Button
						type="submit"
						form="academic-info-form"
						size="sm"
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
	);

	if (!isEditing) {
		return (
			<div className="space-y-6">
				<Card>
					{personalHeader}
					<CardContent>
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
								icon={<BookOpen className="h-4 w-4" />}
								label={t("currentMajor")}
								value={getCurrentMajorLabel(userData?.currentMajor)}
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
					</CardContent>
				</Card>

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
						{userData?.testScores &&
							Object.keys(userData.testScores).length > 0 && (
								<Button variant="outline" size="sm" onClick={handleEdit}>
									<Edit2 className="h-4 w-4 mr-2" />
									{t("editTestScores")}
								</Button>
							)}
					</CardHeader>
					<CardContent>
						{userData?.testScores &&
						Object.keys(userData.testScores).length > 0 ? (
							<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{Object.entries(userData.testScores).map(
									([type, score]: [string, unknown]) => (
										<div
											key={type}
											className="p-4 rounded-lg bg-muted/50 text-center"
										>
											<p className="text-sm text-muted-foreground mb-1">
												{type}
											</p>
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

	return (
		<form
			id="academic-info-form"
			key={userData?.userId ?? "no-user"}
			onSubmit={handleSubmit}
			className="space-y-6"
		>
			<Card>
				{personalHeader}
				<CardContent>
					<div className="grid gap-6 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor={fullNameId}>{t("fullName")}</Label>
							<Input
								id={fullNameId}
								name="fullName"
								defaultValue={userData?.fullName ?? ""}
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
								name="currentEducationLevel"
								defaultValue={userData?.currentEducationLevel ?? ""}
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
							<Label htmlFor={currentMajorId}>{t("currentMajor")}</Label>
							<Select
								name="currentMajor"
								defaultValue={userData?.currentMajor ?? ""}
							>
								<SelectTrigger id={currentMajorId}>
									<SelectValue placeholder={t("selectMajor")} />
								</SelectTrigger>
								<SelectContent>
									{CURRENT_MAJORS.map((major) => (
										<SelectItem key={major.value} value={major.value}>
											{t(`currentMajors.${major.labelKey}`)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor={targetDegreeId}>{t("targetDegree")}</Label>
							<Select
								name="targetDegree"
								defaultValue={userData?.targetDegree ?? ""}
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
									name="gpa"
									type="number"
									step="0.01"
									min="0"
									max="10"
									defaultValue={userData?.gpa?.toString() ?? ""}
									placeholder="3.5"
									className={`flex-1 ${fieldErrors.gpa ? "border-destructive" : ""}`}
								/>
								<span className="flex items-center text-muted-foreground">
									/
								</span>
								<Input
									id={gpaScaleId}
									name="gpaScale"
									type="number"
									step="0.1"
									min="1"
									max="10"
									defaultValue={userData?.gpaScale?.toString() ?? "4.0"}
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
									name="workExperienceYears"
									type="number"
									min="0"
									max="50"
									defaultValue={userData?.workExperienceYears?.toString() ?? ""}
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
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BookOpen className="h-5 w-5 text-muted-foreground" />
						{t("testScores")}
					</CardTitle>
					<CardDescription>
						Your standardized test scores (IELTS, TOEFL, GRE, GMAT)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{TEST_TYPES.map((testType) => {
							const config = TEST_SCORE_CONFIG[testType];
							const existing = (
								userData?.testScores as Record<string, string> | undefined
							)?.[testType];
							return (
								<div key={testType} className="space-y-2">
									<Label>{testType}</Label>
									<Input
										name={`testScore_${testType}`}
										type="number"
										step={config.step}
										min={config.min}
										max={config.max}
										defaultValue={existing ?? ""}
										placeholder={config.placeholder}
									/>
								</div>
							);
						})}
					</div>
				</CardContent>
			</Card>
		</form>
	);
}

function InfoItem({
	icon,
	label,
	value,
}: {
	icon: ReactNode;
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
