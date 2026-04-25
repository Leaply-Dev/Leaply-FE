"use client";

import { useEffect, useRef } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { analytics } from "./analytics";

/** Fires posthog.identify() once per session when the user is authenticated. */
export function useIdentifyOnMount(): void {
	const profile = useUserStore((s) => s.profile);
	const isAuthenticated = useUserStore((s) => s.isAuthenticated);
	const identified = useRef(false);

	useEffect(() => {
		if (!isAuthenticated || !profile || identified.current) return;
		identified.current = true;
		analytics.identify(profile.id, {
			email: profile.email,
			name: profile.fullName,
			last_active_at: new Date().toISOString(),
		});
	}, [isAuthenticated, profile]);
}
