"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
	BookOpen,
	Calendar,
	Check,
	DollarSign,
	Edit2,
	Globe,
	Loader2,
	MapPin,
	Sparkles,
	X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
	BUDGET_OPTIONS,
	FIELD_OPTIONS,
	mapBudgetKeyToLabel,
	mapFieldKeyToLabel,
	mapFieldsToKeys,
	mapRegionKeyToLabel,
	mapRegionsToKeys,
	REGION_OPTIONS,
} from "@/lib/constants/onboardingMappings";
import {
	getGetMeQueryKey,
	useGetMe,
	useUpdatePreferences,
} from "@/lib/generated/api/endpoints/user/user";
import {
	type PreferencesFormData,
	preferencesSchema,
} from "@/lib/validations/profile";

const TERM_OPTIONS = [
	{ value: "Kỳ thu", labelKey: "fallTerm" },
	{ value: "Kỳ xuân", labelKey: "springTerm" },
];

const CAMPUS_SETTINGS = [
	{ value: "urban", labelKey: "urban" },
	{ value: "suburban", labelKey: "suburban" },
	{ value: "rural", labelKey: "rural" },
];

// Parse intendedStartTerm into year and term
function parseStartTerm(term: string | null | undefined): {
	year: string;
	term: string;
} {
	if (!term) return { year: "", term: "" };
	const match = term.match(/^(\d{4})\s+(.+)$/);
	if (match) {
		return { year: match[1], term: match[2] };
	}
	return { year: "", term: "" };
}

// Generate year options (current year to +5 years)
function getYearOptions(): string[] {
	const currentYear = new Date().getFullYear();
	return Array.from({ length: 6 }, (_, i) => String(currentYear + i));
}

interface StudyGoalsTabProps {
	initialEditMode?: boolean;
}

export function StudyGoalsTab({ initialEditMode = false }: StudyGoalsTabProps) {
	const t = useTranslations("profile");
	const queryClient = useQueryClient();

	// React Query
	const { data: response, isLoading } = useGetMe();
	const userData = response?.data?.data;

	const updatePreferencesMutation = useUpdatePreferences({
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
		Partial<Record<keyof PreferencesFormData, string>>
	>({});

	const budgetId = useId();
	const yearId = useId();
	const termId = useId();

	// Form state
	const [formData, setFormData] = useState({
		budgetLabel: "",
		fieldOfInterest: [] as string[],
		preferredRegions: [] as string[],
		intendedStartYear: "",
		intendedStartTerm: "",
	});

	// Track if we've done initial sync
	const hasSyncedRef = useRef(false);

	// Sync form data when userData loads (only once)
	useEffect(() => {
		if (userData && !hasSyncedRef.current && !isEditing) {
			hasSyncedRef.current = true;
			const parsed = parseStartTerm(userData.intendedStartTerm);
			// Convert labels to keys (API may return labels like "Khoa học máy tính / IT" instead of keys like "cs_it")
			const fieldKeys = mapFieldsToKeys(userData.fieldOfInterest || []);
			const regionKeys = mapRegionsToKeys(userData.preferredRegions || []);
			setFormData({
				budgetLabel: userData.budgetLabel || "",
				fieldOfInterest: fieldKeys,
				preferredRegions: regionKeys,
				intendedStartYear: parsed.year,
				intendedStartTerm: parsed.term,
			});
		}
	}, [userData, isEditing]);

	// Sync form data with userData (for manual triggers)
	const syncFormData = () => {
		if (userData) {
			const parsed = parseStartTerm(userData.intendedStartTerm);
			// Convert labels to keys (API may return labels like "Khoa học máy tính / IT" instead of keys like "cs_it")
			const fieldKeys = mapFieldsToKeys(userData.fieldOfInterest || []);
			const regionKeys = mapRegionsToKeys(userData.preferredRegions || []);
			setFormData({
				budgetLabel: userData.budgetLabel || "",
				fieldOfInterest: fieldKeys,
				preferredRegions: regionKeys,
				intendedStartYear: parsed.year,
				intendedStartTerm: parsed.term,
			});
		}
	};

	const getCampusLabel = (value?: string) => {
		const setting = CAMPUS_SETTINGS.find((s) => s.value === value);
		return setting ? t(setting.labelKey) : t("noData");
	};

	const getJourneyLabel = (value?: string) => {
		if (value === "exploring") return t("exploring");
		if (value === "targeted") return t("targeted");
		return t("noData");
	};

	const toggleField = (field: string) => {
		setFormData((prev) => {
			const isSelected = prev.fieldOfInterest.includes(field);
			if (isSelected) {
				return {
					...prev,
					fieldOfInterest: prev.fieldOfInterest.filter((f) => f !== field),
				};
			}
			if (prev.fieldOfInterest.length >= 3) {
				return prev;
			}
			return {
				...prev,
				fieldOfInterest: [...prev.fieldOfInterest, field],
			};
		});
	};

	const toggleRegion = (region: string) => {
		setFormData((prev) => {
			const isSelected = prev.preferredRegions.includes(region);
			if (isSelected) {
				return {
					...prev,
					preferredRegions: prev.preferredRegions.filter((r) => r !== region),
				};
			}
			return {
				...prev,
				preferredRegions: [...prev.preferredRegions, region],
			};
		});
	};

	const handleSave = async () => {
		setFieldErrors({});

		try {
			const validatedPreferences = preferencesSchema.parse({
				...formData,
				fieldOfInterest: formData.fieldOfInterest || [],
				preferredRegions: formData.preferredRegions || [],
			});

			const intendedStartTerm =
				validatedPreferences.intendedStartYear &&
				validatedPreferences.intendedStartTerm
					? `${validatedPreferences.intendedStartYear} ${validatedPreferences.intendedStartTerm}`
					: undefined;

			const updateData = {
				budgetLabel: validatedPreferences.budgetLabel || undefined,
				fieldOfInterest:
					validatedPreferences.fieldOfInterest &&
					validatedPreferences.fieldOfInterest.length > 0
						? validatedPreferences.fieldOfInterest
						: undefined,
				preferredRegions:
					validatedPreferences.preferredRegions &&
					validatedPreferences.preferredRegions.length > 0
						? validatedPreferences.preferredRegions
						: undefined,
				intendedStartTerm,
			};

			await updatePreferencesMutation.mutateAsync({ data: updateData });
		} catch (error) {
			if (error && typeof error === "object" && "errors" in error) {
				const zodError = error as {
					errors: Array<{ path: string[]; message: string }>;
				};
				const errors: Partial<Record<keyof PreferencesFormData, string>> = {};
				zodError.errors.forEach((err) => {
					const field = err.path[
						err.path.length - 1
					] as keyof PreferencesFormData;
					if (field) {
						errors[field] = err.message;
					}
				});
				setFieldErrors(errors);
			}
		}
	};

	const handleCancel = () => {
		syncFormData();
		setIsEditing(false);
		setFieldErrors({});
	};

	const handleEdit = () => {
		syncFormData();
		setIsEditing(true);
	};

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-3">
							<Skeleton className="h-4 w-32" />
							<div className="flex flex-wrap gap-2">
								{["field-1", "field-2", "field-3", "field-4"].map((id) => (
									<Skeleton key={id} className="h-8 w-24 rounded-full" />
								))}
							</div>
						</div>
						<Separator />
						<div className="space-y-3">
							<Skeleton className="h-4 w-32" />
							<div className="flex flex-wrap gap-2">
								{["region-1", "region-2", "region-3"].map((id) => (
									<Skeleton key={id} className="h-8 w-20 rounded-full" />
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Sparkles className="h-5 w-5 text-muted-foreground" />
							{t("preferences")}
						</CardTitle>
						<CardDescription>
							{isEditing
								? "Update your study abroad goals and preferences"
								: "Your study abroad goals and preferences"}
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
								disabled={updatePreferencesMutation.isPending}
							>
								{updatePreferencesMutation.isPending ? (
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
						<div className="space-y-6">
							{/* Fields of Interest */}
							<div className="space-y-3">
								<Label className="text-base">
									<div className="flex items-center gap-2">
										<BookOpen className="h-4 w-4 text-muted-foreground" />
										{t("fieldsOfInterest")} ({formData.fieldOfInterest.length}
										/3)
									</div>
								</Label>
								<p className="text-sm text-muted-foreground">
									Select up to 3 fields you're interested in studying
								</p>
								<div className="grid gap-3 sm:grid-cols-2">
									{FIELD_OPTIONS.map((option) => {
										const isSelected = formData.fieldOfInterest.includes(
											option.value,
										);
										const isDisabled =
											!isSelected && formData.fieldOfInterest.length >= 3;
										const fieldId = `field-${option.value}`;
										return (
											<div
												key={option.value}
												className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
													isSelected
														? "bg-primary/5 border-primary"
														: "hover:bg-muted"
												} ${isDisabled ? "opacity-50" : ""}`}
											>
												<Checkbox
													id={fieldId}
													checked={isSelected}
													disabled={isDisabled}
													onCheckedChange={() => toggleField(option.value)}
												/>
												<label
													htmlFor={fieldId}
													className={`text-sm flex-1 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
												>
													{option.label}
												</label>
											</div>
										);
									})}
								</div>
								{fieldErrors.fieldOfInterest && (
									<p className="text-sm text-destructive">
										{fieldErrors.fieldOfInterest}
									</p>
								)}
							</div>

							<Separator />

							{/* Preferred Regions */}
							<div className="space-y-3">
								<Label className="text-base">
									<div className="flex items-center gap-2">
										<Globe className="h-4 w-4 text-muted-foreground" />
										{t("preferredRegions")}
									</div>
								</Label>
								<p className="text-sm text-muted-foreground">
									Select regions where you'd like to study
								</p>
								<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
									{REGION_OPTIONS.map((option) => {
										const isSelected = formData.preferredRegions.includes(
											option.value,
										);
										const regionId = `region-${option.value}`;
										return (
											<div
												key={option.value}
												className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
													isSelected
														? "bg-primary/5 border-primary"
														: "hover:bg-muted"
												}`}
											>
												<Checkbox
													id={regionId}
													checked={isSelected}
													onCheckedChange={() => toggleRegion(option.value)}
												/>
												<label
													htmlFor={regionId}
													className="text-sm flex-1 cursor-pointer"
												>
													{option.label}
												</label>
											</div>
										);
									})}
								</div>
								{fieldErrors.preferredRegions && (
									<p className="text-sm text-destructive">
										{fieldErrors.preferredRegions}
									</p>
								)}
							</div>

							<Separator />

							{/* Budget & Timeline */}
							<div className="grid gap-6 sm:grid-cols-2">
								<div className="space-y-2">
									<Label htmlFor={budgetId}>
										<div className="flex items-center gap-2">
											<DollarSign className="h-4 w-4 text-muted-foreground" />
											{t("budgetRange")}
										</div>
									</Label>
									<Select
										value={formData.budgetLabel}
										onValueChange={(value) =>
											setFormData((prev) => ({
												...prev,
												budgetLabel: value,
											}))
										}
									>
										<SelectTrigger
											id={budgetId}
											className={
												fieldErrors.budgetLabel ? "border-destructive" : ""
											}
										>
											<SelectValue placeholder={t("selectBudget")} />
										</SelectTrigger>
										<SelectContent>
											{BUDGET_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4 text-muted-foreground" />
											{t("intendedStartTerm")}
										</div>
									</Label>
									<div className="flex gap-2">
										<Select
											value={formData.intendedStartYear}
											onValueChange={(value) =>
												setFormData((prev) => ({
													...prev,
													intendedStartYear: value,
												}))
											}
										>
											<SelectTrigger id={yearId} className="w-28">
												<SelectValue placeholder={t("year")} />
											</SelectTrigger>
											<SelectContent>
												{getYearOptions().map((year) => (
													<SelectItem key={year} value={year}>
														{year}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<Select
											value={formData.intendedStartTerm}
											onValueChange={(value) =>
												setFormData((prev) => ({
													...prev,
													intendedStartTerm: value,
												}))
											}
										>
											<SelectTrigger id={termId} className="flex-1">
												<SelectValue placeholder={t("term")} />
											</SelectTrigger>
											<SelectContent>
												{TERM_OPTIONS.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{t(option.labelKey)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								</div>
							</div>
						</div>
					) : (
						<>
							{/* View Mode - Fields of Interest */}
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
										<BookOpen className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-2">
											{t("fieldsOfInterest")}
										</p>
										<div className="flex flex-wrap gap-1.5">
											{userData?.fieldOfInterest &&
											userData.fieldOfInterest.length > 0 ? (
												userData.fieldOfInterest.map((field: string) => (
													<Badge
														key={field}
														variant="secondary"
														className="text-sm"
													>
														{mapFieldKeyToLabel(field)}
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

								<Separator />

								{/* View Mode - Preferred Regions */}
								<div className="flex items-start gap-3">
									<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
										<Globe className="h-4 w-4 text-muted-foreground" />
									</div>
									<div className="flex-1">
										<p className="text-sm text-muted-foreground mb-2">
											{t("preferredRegions")}
										</p>
										<div className="flex flex-wrap gap-1.5">
											{userData?.preferredRegions &&
											userData.preferredRegions.length > 0 ? (
												userData.preferredRegions.map((region: string) => (
													<Badge
														key={region}
														variant="secondary"
														className="text-sm"
													>
														{mapRegionKeyToLabel(region)}
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

								<Separator />

								{/* View Mode - Budget & Timeline */}
								<div className="grid gap-4 sm:grid-cols-2">
									<div className="flex items-start gap-3">
										<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
											<DollarSign className="h-4 w-4 text-muted-foreground" />
										</div>
										<div>
											<p className="text-sm text-muted-foreground">
												{t("budgetRange")}
											</p>
											<p className="font-medium">
												{userData?.budgetLabel
													? mapBudgetKeyToLabel(userData.budgetLabel)
													: t("noData")}
											</p>
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
								</div>

								{/* Additional Preferences */}
								{(userData?.journeyType || userData?.campusSetting) && (
									<>
										<Separator />
										<div className="grid gap-4 sm:grid-cols-2">
											{userData?.journeyType && (
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<Sparkles className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("journeyType")}
														</p>
														<p className="font-medium">
															{getJourneyLabel(userData.journeyType)}
														</p>
													</div>
												</div>
											)}
											{userData?.campusSetting && (
												<div className="flex items-start gap-3">
													<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
														<MapPin className="h-4 w-4 text-muted-foreground" />
													</div>
													<div>
														<p className="text-sm text-muted-foreground">
															{t("campusSetting")}
														</p>
														<p className="font-medium">
															{getCampusLabel(userData.campusSetting)}
														</p>
													</div>
												</div>
											)}
										</div>
									</>
								)}

								{/* Interests */}
								{userData?.interests && userData.interests.length > 0 && (
									<>
										<Separator />
										<div className="flex items-start gap-3">
											<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
												<Sparkles className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="flex-1">
												<p className="text-sm text-muted-foreground mb-2">
													{t("interests")}
												</p>
												<div className="flex flex-wrap gap-1.5">
													{userData.interests.map((interest: string) => (
														<Badge
															key={interest}
															variant="outline"
															className="text-sm"
														>
															{interest}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
