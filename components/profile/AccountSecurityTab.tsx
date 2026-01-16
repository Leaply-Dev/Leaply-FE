"use client";

import {
	AlertTriangle,
	Calendar,
	Check,
	ChevronRight,
	KeyRound,
	Loader2,
	LogOut,
	Mail,
	Monitor,
	Shield,
	Smartphone,
	Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/lib/generated/api/endpoints/user/user";
import { authService } from "@/lib/services/auth";

export function AccountSecurityTab() {
	const t = useTranslations("profile");

	// React Query
	const { data: response, isLoading } = useGetMe();
	const userData = response?.data?.data;

	const [isResettingPassword, setIsResettingPassword] = useState(false);
	const [isSendingVerification, setIsSendingVerification] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [deleteConfirmation, setDeleteConfirmation] = useState("");

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return t("noData");
		return new Date(dateStr).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	const handleResetPassword = async () => {
		if (!userData?.email) return;

		setIsResettingPassword(true);

		try {
			await authService.forgotPassword(userData.email);
			toast.success(t("resetPasswordSent"));
		} catch {
			toast.error(t("resetPasswordError"));
		} finally {
			setIsResettingPassword(false);
		}
	};

	const handleSendVerification = async () => {
		if (!userData?.email) return;

		setIsSendingVerification(true);

		try {
			await authService.resendVerification(userData.email);
			toast.success(t("verificationSent"));
		} catch {
			toast.error(t("verificationError"));
		} finally {
			setIsSendingVerification(false);
		}
	};

	// Mock active sessions - in production this would come from the API
	const activeSessions = [
		{
			id: "current",
			device: "This device",
			browser: "Chrome on macOS",
			location: "Ho Chi Minh City, Vietnam",
			lastActive: "Now",
			isCurrent: true,
		},
	];

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-32" />
						<Skeleton className="h-4 w-48" />
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-20 w-full rounded-lg" />
						<Skeleton className="h-20 w-full rounded-lg" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-4 w-56" />
					</CardHeader>
					<CardContent className="space-y-4">
						<Skeleton className="h-20 w-full rounded-lg" />
						<Skeleton className="h-20 w-full rounded-lg" />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Login Method Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Mail className="h-5 w-5 text-muted-foreground" />
						Login Method
					</CardTitle>
					<CardDescription>
						How you sign in to your Leaply account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
								<Mail className="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p className="font-medium">{t("email")}</p>
								<p className="text-sm text-muted-foreground">
									{userData?.email}
								</p>
							</div>
						</div>
						{userData?.emailVerified ? (
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
							>
								<Check className="h-3 w-3 mr-1" />
								{t("emailVerified")}
							</Badge>
						) : (
							<div className="flex items-center gap-2">
								<Badge
									variant="secondary"
									className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
								>
									{t("emailNotVerified")}
								</Badge>
								<Button
									variant="link"
									size="sm"
									className="h-auto p-0 text-primary"
									onClick={handleSendVerification}
									disabled={isSendingVerification}
								>
									{isSendingVerification ? (
										<Loader2 className="h-3 w-3 animate-spin mr-1" />
									) : null}
									{t("verifyNow")}
								</Button>
							</div>
						)}
					</div>

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
				</CardContent>
			</Card>

			{/* Password & Security Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5 text-muted-foreground" />
						Password & Security
					</CardTitle>
					<CardDescription>
						Manage your password and security settings
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
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

					{/* Two-Factor Authentication - Coming Soon */}
					<div className="flex items-center justify-between p-4 rounded-lg border opacity-60">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
								<Smartphone className="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<div className="flex items-center gap-2">
									<p className="font-medium">Two-Factor Authentication</p>
									<Badge variant="secondary" className="text-xs">
										Coming Soon
									</Badge>
								</div>
								<p className="text-sm text-muted-foreground">
									Add an extra layer of security to your account
								</p>
							</div>
						</div>
						<Button variant="outline" size="sm" disabled>
							Enable
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Active Sessions Card */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Monitor className="h-5 w-5 text-muted-foreground" />
						Active Sessions
					</CardTitle>
					<CardDescription>
						Devices where you're currently logged in
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{activeSessions.map((session) => (
							<div
								key={session.id}
								className="flex items-center justify-between p-4 rounded-lg border"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
										<Monitor className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<div className="flex items-center gap-2">
											<p className="font-medium">{session.browser}</p>
											{session.isCurrent && (
												<Badge
													variant="secondary"
													className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs"
												>
													Current
												</Badge>
											)}
										</div>
										<p className="text-sm text-muted-foreground">
											{session.location} • {session.lastActive}
										</p>
									</div>
								</div>
								{!session.isCurrent && (
									<Button
										variant="ghost"
										size="sm"
										className="text-destructive"
									>
										<LogOut className="h-4 w-4 mr-1" />
										Sign out
									</Button>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone Card */}
			<Card className="border-destructive/50">
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-destructive">
						<AlertTriangle className="h-5 w-5" />
						Danger Zone
					</CardTitle>
					<CardDescription>
						Irreversible and destructive actions
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between p-4 rounded-lg border border-destructive/30 bg-destructive/5">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
								<Trash2 className="h-5 w-5 text-destructive" />
							</div>
							<div>
								<p className="font-medium">Delete Account</p>
								<p className="text-sm text-muted-foreground">
									Permanently delete your account and all associated data
								</p>
							</div>
						</div>
						<Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
							<DialogTrigger asChild>
								<Button variant="destructive" size="sm">
									Delete Account
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Are you absolutely sure?</DialogTitle>
									<DialogDescription>
										This action cannot be undone. This will permanently delete
										your account and remove all your data from our servers.
									</DialogDescription>
								</DialogHeader>
								<Alert variant="destructive">
									<AlertTriangle className="h-4 w-4" />
									<AlertTitle>Warning</AlertTitle>
									<AlertDescription>
										All your profile information, preferences, and saved data
										will be permanently deleted.
									</AlertDescription>
								</Alert>
								<div className="space-y-2">
									<Label htmlFor="delete-confirm">
										Type <span className="font-mono font-bold">DELETE</span> to
										confirm
									</Label>
									<Input
										id="delete-confirm"
										value={deleteConfirmation}
										onChange={(e) => setDeleteConfirmation(e.target.value)}
										placeholder="DELETE"
									/>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => {
											setShowDeleteDialog(false);
											setDeleteConfirmation("");
										}}
									>
										Cancel
									</Button>
									<Button
										variant="destructive"
										disabled={deleteConfirmation !== "DELETE"}
										onClick={() => {
											// TODO: Implement account deletion when API is available
											toast.error(
												"Account deletion is not yet available. Please contact support.",
											);
											setShowDeleteDialog(false);
											setDeleteConfirmation("");
										}}
									>
										Delete Account
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
