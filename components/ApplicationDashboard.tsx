"use client";

import { useTranslations } from "next-intl";
import { SopTab } from "@/components/applications/tabs/SopTab";
import { ProgramDetailDrawer } from "@/components/explore/ProgramDetailDrawer";
import { useWorkspaceStatus } from "@/lib/api/sop-workspace";
import type { ApplicationResponse } from "@/lib/generated/api/models";

interface ApplicationDashboardProps {
	application: ApplicationResponse | null;
	programDrawerOpen?: boolean;
	onProgramDrawerOpenChange?: (open: boolean) => void;
}

export function ApplicationDashboard({
	application,
	programDrawerOpen = false,
	onProgramDrawerOpenChange,
}: ApplicationDashboardProps) {
	const tSetup = useTranslations("sop.setup");

	const { data: status } = useWorkspaceStatus(application?.id ?? "");

	if (!application) {
		return null;
	}

	return (
		<>
			<div className="h-full overflow-y-auto bg-muted/30">
				<div className="h-full flex flex-col p-6">
					{/* Header */}
					<div className="mb-6 shrink-0 min-w-0">
						<h1 className="text-2xl font-bold text-foreground mb-1 truncate">
							{status?.essayType
								? tSetup(
										`essayType.${status.essayType.toLowerCase()}` as Parameters<
											typeof tSetup
										>[0],
									)
								: application.program?.degreeName ||
									application.program?.programName}
						</h1>
						<p className="text-lg text-muted-foreground truncate">
							{application.program?.degreeName
								? `${application.program.degreeName}, `
								: ""}
							{application.program?.universityName}
						</p>
					</div>

					{/* Essay editor */}
					<div className="flex-1 min-h-0">
						<SopTab
							applicationId={application.id ?? ""}
							programName={application.program?.programName}
							universityName={application.program?.universityName}
						/>
					</div>
				</div>
			</div>

			{/* Program Detail Drawer */}
			<ProgramDetailDrawer
				programId={application.program?.id ?? null}
				open={programDrawerOpen}
				onOpenChange={onProgramDrawerOpenChange ?? (() => {})}
			/>
		</>
	);
}
