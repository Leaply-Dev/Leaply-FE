"use client";

import { AlertTriangle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { refreshAccessToken } from "@/lib/api/client";
import { performLogout } from "@/lib/auth/logout";

interface SessionTimeoutWarningProps {
	/** Whether the warning modal should be shown */
	isOpen: boolean;
	/** Time remaining in seconds until session expires */
	secondsRemaining: number;
	/** Callback when user dismisses warning (extends session) */
	onExtendSession: () => void;
}

/**
 * Session timeout warning modal
 * Shows a countdown when session is about to expire, allowing user to extend or logout
 */
export function SessionTimeoutWarning({
	isOpen,
	secondsRemaining,
	onExtendSession,
}: SessionTimeoutWarningProps) {
	const [isExtending, setIsExtending] = useState(false);
	const [displaySeconds, setDisplaySeconds] = useState(secondsRemaining);

	// Update display countdown
	useEffect(() => {
		setDisplaySeconds(secondsRemaining);
	}, [secondsRemaining]);

	// Countdown timer when modal is open
	useEffect(() => {
		if (!isOpen) return;

		const interval = setInterval(() => {
			setDisplaySeconds((prev) => {
				if (prev <= 1) {
					// Time's up - logout
					clearInterval(interval);
					performLogout({ redirect: "/login?expired=true" });
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isOpen]);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	const handleExtendSession = useCallback(async () => {
		setIsExtending(true);
		try {
			const result = await refreshAccessToken();
			if (result) {
				onExtendSession();
			} else {
				// Refresh failed, logout
				performLogout({ redirect: "/login?expired=true" });
			}
		} catch {
			performLogout({ redirect: "/login?expired=true" });
		} finally {
			setIsExtending(false);
		}
	}, [onExtendSession]);

	const handleLogout = useCallback(() => {
		performLogout({ redirect: "/login" });
	}, []);

	return (
		<Dialog open={isOpen} onOpenChange={() => {}}>
			<DialogContent showCloseButton={false} className="sm:max-w-md">
				<DialogHeader>
					<div className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-amber-500" />
						<DialogTitle>Phiên làm việc sắp hết hạn</DialogTitle>
					</div>
					<DialogDescription className="pt-2">
						Phiên làm việc của bạn sẽ hết hạn trong{" "}
						<span className="font-mono font-semibold text-foreground">
							{formatTime(displaySeconds)}
						</span>
						. Bạn có muốn gia hạn phiên làm việc không?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="flex-row gap-2 sm:justify-end">
					<Button variant="outline" onClick={handleLogout} disabled={isExtending}>
						Đăng xuất
					</Button>
					<Button onClick={handleExtendSession} disabled={isExtending}>
						{isExtending ? "Đang gia hạn..." : "Gia hạn phiên"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
