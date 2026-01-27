"use client";

import { SopWorkspace } from "@/components/applications/sop/SopWorkspace";

interface SopTabProps {
	applicationId: string;
	programName?: string;
	universityName?: string;
}

export function SopTab({ applicationId }: SopTabProps) {
	return <SopWorkspace applicationId={applicationId} />;
}
