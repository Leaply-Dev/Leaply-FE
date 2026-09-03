"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { analytics } from "@/lib/analytics/analytics";
import { useUpdateUserProfile, useUserProfile } from "@/lib/api/mappers";
import { getAppsAccountsApiUserGetProfileQueryKey } from "@/lib/generated/api/endpoints/user/user";
import { useUserStore } from "@/lib/store/userStore";

interface FormState {
	fullName: string;
	currentEducationLevel: string;
	targetDegree: string;
	currentMajor: string;
	gpa: string;
	gpaScale: string;
	workExperienceYears: string;
}

const EMPTY_FORM: FormState = {
	fullName: "",
	currentEducationLevel: "",
	targetDegree: "",
	currentMajor: "",
	gpa: "",
	gpaScale: "4.0",
	workExperienceYears: "",
};

export function ProfileClient() {
	const t = useTranslations("profile");
	const queryClient = useQueryClient();
	const updateStoreProfile = useUserStore((state) => state.updateProfile);

	const { data: profileData, isLoading, isError } = useUserProfile();
	const updateProfile = useUpdateUserProfile();

	const [form, setForm] = useState<FormState>(EMPTY_FORM);
	const [saveState, setSaveState] = useState<"idle" | "success" | "error">(
		"idle",
	);
	// Gates the first render of the form fields until the profile query has
	// settled — mounting the Radix Selects with their real value from the
	// start avoids a transition-from-empty-to-populated-value glitch where
	// the trigger keeps showing the placeholder. Must wait on `isLoading`
	// itself, not just `!profileData` — that's briefly true before the first
	// fetch even resolves, which let the form mount empty prematurely.
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		if (isLoading) return;
		if (!profileData) {
			setIsInitialized(true);
			return;
		}
		setForm({
			fullName: profileData.fullName ?? "",
			currentEducationLevel: profileData.currentEducationLevel ?? "",
			targetDegree: profileData.targetDegree ?? "",
			currentMajor: profileData.currentMajor ?? "",
			gpa: profileData.gpa != null ? String(profileData.gpa) : "",
			gpaScale:
				profileData.gpaScale != null ? String(profileData.gpaScale) : "4.0",
			workExperienceYears:
				profileData.workExperienceYears != null
					? String(profileData.workExperienceYears)
					: "",
		});
		setIsInitialized(true);
	}, [profileData, isLoading]);

	const educationLevels = [
		{ value: "high_school", label: t("highSchool") },
		{ value: "undergrad", label: t("undergraduate") },
		{ value: "graduate", label: t("graduate") },
		{ value: "working", label: t("working") },
	];

	const targetDegrees = [
		{ value: "bachelors", label: t("bachelors") },
		{ value: "masters", label: t("masters") },
		{ value: "phd", label: t("phd") },
	];

	const majors = [
		"computerScience",
		"engineering",
		"mathematics",
		"business",
		"economics",
		"statistics",
		"physics",
		"finance",
		"design",
		"naturalSciences",
		"socialSciences",
	] as const;

	const handleChange = (field: keyof FormState, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
		setSaveState("idle");
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSaveState("idle");

		const gpa = form.gpa.trim() === "" ? null : Number(form.gpa);
		const gpaScale = form.gpaScale.trim() === "" ? null : Number(form.gpaScale);
		const workExperienceYears =
			form.workExperienceYears.trim() === ""
				? null
				: Number(form.workExperienceYears);

		updateProfile.mutate(
			{
				data: {
					fullName: form.fullName,
					currentEducationLevel: form.currentEducationLevel || null,
					targetDegree: form.targetDegree || null,
					currentMajor: form.currentMajor || null,
					gpa,
					gpaScale,
					workExperienceYears,
				},
			},
			{
				onSuccess: () => {
					setSaveState("success");
					analytics.track("profile_updated", {});
					updateStoreProfile({
						fullName: form.fullName,
						currentEducationLevel: form.currentEducationLevel,
						targetDegree: form.targetDegree,
						currentMajor: form.currentMajor,
						gpa: gpa ?? undefined,
						gpaScale: gpaScale != null ? String(gpaScale) : undefined,
					});
					queryClient.invalidateQueries({
						queryKey: getAppsAccountsApiUserGetProfileQueryKey(),
					});
				},
				onError: () => setSaveState("error"),
			},
		);
	};

	if (isLoading || !isInitialized) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-full" />
				<Skeleton className="h-10 w-32" />
			</div>
		);
	}

	if (isError) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertDescription>{t("updateError")}</AlertDescription>
			</Alert>
		);
	}

	return (
		<Card>
			<CardContent className="pt-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="fullName">{t("fullName")}</Label>
						<Input
							id="fullName"
							placeholder={t("fullNamePlaceholder")}
							value={form.fullName}
							onChange={(e) => handleChange("fullName", e.target.value)}
							required
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="currentEducationLevel">
								{t("educationLevel")}
							</Label>
							<Select
								value={form.currentEducationLevel}
								onValueChange={(v) => handleChange("currentEducationLevel", v)}
							>
								<SelectTrigger id="currentEducationLevel">
									<SelectValue placeholder={t("selectLevel")} />
								</SelectTrigger>
								<SelectContent>
									{educationLevels.map((level) => (
										<SelectItem key={level.value} value={level.value}>
											{level.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-2">
							<Label htmlFor="targetDegree">{t("targetDegree")}</Label>
							<Select
								value={form.targetDegree}
								onValueChange={(v) => handleChange("targetDegree", v)}
							>
								<SelectTrigger id="targetDegree">
									<SelectValue placeholder={t("selectLevel")} />
								</SelectTrigger>
								<SelectContent>
									{targetDegrees.map((degree) => (
										<SelectItem key={degree.value} value={degree.value}>
											{degree.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="currentMajor">{t("currentMajor")}</Label>
						<Select
							value={form.currentMajor}
							onValueChange={(v) => handleChange("currentMajor", v)}
						>
							<SelectTrigger id="currentMajor">
								<SelectValue placeholder={t("selectMajor")} />
							</SelectTrigger>
							<SelectContent>
								{majors.map((major) => (
									<SelectItem key={major} value={major}>
										{t(`currentMajors.${major}`)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="gpa">{t("gpa")}</Label>
							<Input
								id="gpa"
								type="number"
								step="0.01"
								min="0"
								value={form.gpa}
								onChange={(e) => handleChange("gpa", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="gpaScale">Scale</Label>
							<Input
								id="gpaScale"
								type="number"
								step="0.1"
								min="1"
								value={form.gpaScale}
								onChange={(e) => handleChange("gpaScale", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="workExperienceYears">
								{t("workExperience")} ({t("years")})
							</Label>
							<Input
								id="workExperienceYears"
								type="number"
								step="1"
								min="0"
								value={form.workExperienceYears}
								onChange={(e) =>
									handleChange("workExperienceYears", e.target.value)
								}
							/>
						</div>
					</div>

					{saveState === "error" && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{t("updateError")}</AlertDescription>
						</Alert>
					)}

					<div className="flex items-center gap-3">
						<Button type="submit" disabled={updateProfile.isPending}>
							{updateProfile.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{t("saving")}
								</>
							) : (
								t("saveChanges")
							)}
						</Button>
						{saveState === "success" && (
							<span className="text-sm text-emerald-600">
								{t("updateSuccess")}
							</span>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
