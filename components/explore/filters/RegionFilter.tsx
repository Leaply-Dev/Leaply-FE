"use client";

import { useMemo } from "react";

export interface RegionOption {
	label: string;
	value: string;
}

/**
 * Hook to get standard region options with translations
 */
export function useRegionOptions(t: (key: string) => string): RegionOption[] {
	return useMemo(
		() => [
			{ label: t("northAmerica"), value: "north_america" },
			{ label: t("westernEurope"), value: "western_europe" },
			{ label: t("centralEurope"), value: "central_europe" },
			{ label: t("northernEurope"), value: "northern_europe" },
			{ label: t("eastAsia"), value: "east_asia" },
			{ label: t("southeastAsia"), value: "southeast_asia" },
			{ label: t("oceania"), value: "oceania" },
		],
		[t],
	);
}
