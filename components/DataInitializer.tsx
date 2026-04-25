"use client";

import { useEffect } from "react";
import { useIdentifyOnMount } from "@/lib/analytics/use-identify-on-mount";
import { initializeAppData } from "@/lib/initializeData";

export function DataInitializer() {
	useIdentifyOnMount();

	useEffect(() => {
		initializeAppData();
	}, []);

	return null;
}
