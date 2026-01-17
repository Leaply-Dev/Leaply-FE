"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Check, Mail, Pencil } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
	getGetMeQueryKey,
	useUpdateProfile,
} from "@/lib/generated/api/endpoints/user/user";
import type { UserMeResponse } from "@/lib/generated/api/models";

const AVATAR_COUNT = 9;

interface ProfileHeaderProps {
	userData: UserMeResponse | undefined;
	isLoading: boolean;
}

export function ProfileHeader({ userData, isLoading }: ProfileHeaderProps) {
	const t = useTranslations("profile");
	const queryClient = useQueryClient();
	const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
	const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

	const updateProfileMutation = useUpdateProfile({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
				toast.success(t("avatarUpdated"));
				setIsAvatarDialogOpen(false);
			},
			onError: () => {
				toast.error(t("updateError"));
			},
		},
	});

	const getInitials = (name?: string) => {
		if (!name) return "U";
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const getCompletionColor = (completion: number) => {
		if (completion >= 80) return "text-green-500";
		if (completion >= 50) return "text-yellow-500";
		return "text-orange-500";
	};

	const getAvatarSrc = (avatarNum: number | null | undefined) => {
		if (!avatarNum || avatarNum < 1 || avatarNum > AVATAR_COUNT) return null;
		return `/avatar/${avatarNum}.png`;
	};

	const handleAvatarSelect = (avatarNum: number) => {
		setSelectedAvatar(avatarNum);
	};

	const handleSaveAvatar = () => {
		if (selectedAvatar) {
			updateProfileMutation.mutate({
				// @ts-expect-error: avatarNum is not yet in the generated UpdateProfileRequest model
				data: { avatarNum: selectedAvatar },
			});
		}
	};

	const openAvatarDialog = () => {
		// Set current avatar as selected when opening dialog
		setSelectedAvatar(
			(userData as UserMeResponse & { avatarNum?: number })?.avatarNum || null,
		);
		setIsAvatarDialogOpen(true);
	};

	// Type assertion for avatarNum since it's not in the generated types yet
	const avatarNum = (userData as UserMeResponse & { avatarNum?: number })
		?.avatarNum;
	const avatarSrc = getAvatarSrc(avatarNum);

	if (isLoading) {
		return (
			<Card className="overflow-hidden mb-8">
				<div className="bg-linear-to-r from-primary/10 via-chart-2/10 to-transparent p-6">
					<div className="flex items-center gap-6">
						<Skeleton className="h-20 w-20 rounded-full" />
						<div className="flex-1 space-y-3">
							<Skeleton className="h-7 w-48" />
							<Skeleton className="h-4 w-64" />
							<Skeleton className="h-2 w-full max-w-xs" />
						</div>
					</div>
				</div>
			</Card>
		);
	}

	return (
		<>
			<Card className="overflow-hidden mb-8">
				<div className="bg-linear-to-r from-primary/10 via-chart-2/10 to-transparent p-6">
					<div className="flex items-center gap-6">
						<div className="relative group">
							<Avatar className="h-20 w-20 border-4 border-background shadow-lg">
								{avatarSrc ? (
									<AvatarImage src={avatarSrc} alt="Avatar" />
								) : null}
								<AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
									{getInitials(userData?.fullName)}
								</AvatarFallback>
							</Avatar>
							<Button
								size="icon"
								variant="secondary"
								className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
								onClick={openAvatarDialog}
							>
								<Pencil className="h-3.5 w-3.5" />
							</Button>
						</div>
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
										className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
									>
										<Check className="h-3 w-3 mr-1" />
										{t("emailVerified")}
									</Badge>
								) : (
									<Badge
										variant="secondary"
										className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
									>
										{t("emailNotVerified")}
									</Badge>
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

			{/* Avatar Selection Dialog */}
			<Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>{t("selectAvatar")}</DialogTitle>
						<DialogDescription>
							{t("selectAvatarDescription")}
						</DialogDescription>
					</DialogHeader>
					<div className="grid grid-cols-3 gap-4 py-4">
						{Array.from({ length: AVATAR_COUNT }, (_, i) => i + 1).map(
							(num) => (
								<button
									key={num}
									type="button"
									onClick={() => handleAvatarSelect(num)}
									className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
										selectedAvatar === num
											? "border-primary ring-2 ring-primary/20"
											: "border-transparent hover:border-muted-foreground/20"
									}`}
								>
									<Image
										src={`/avatar/${num}.png`}
										alt={`Avatar ${num}`}
										fill
										className="object-cover"
									/>
									{selectedAvatar === num && (
										<div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
											<Check className="h-8 w-8 text-primary" />
										</div>
									)}
								</button>
							),
						)}
					</div>
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => setIsAvatarDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleSaveAvatar}
							disabled={!selectedAvatar || updateProfileMutation.isPending}
						>
							{updateProfileMutation.isPending ? t("saving") : t("saveChanges")}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
}
