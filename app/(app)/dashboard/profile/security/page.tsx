"use client";

import { useTranslations } from "next-intl";
import { PageTransition, SlideUp } from "@/components/PageTransition";
import {
	AccountSecurityTab,
	ProfileHeader,
	SettingsLayout,
} from "@/components/profile";
import { unwrapResponse } from "@/lib/api/unwrapResponse";
import { useGetMe } from "@/lib/generated/api/endpoints/user/user";
import type { UserMeResponse } from "@/lib/generated/api/models";

export default function AccountSecurityPage() {
	const t = useTranslations("profile");

	const { data: response, isLoading } = useGetMe();
	const userData = unwrapResponse<UserMeResponse>(response);

	return (
		<PageTransition>
			<div className="min-h-screen bg-background">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Header */}
					<SlideUp>
						<div className="mb-8">
							<h1 className="text-3xl font-bold text-foreground mb-2">
								{t("title")}
							</h1>
							<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
						</div>
					</SlideUp>

					{/* Profile Header Card */}
					<ProfileHeader userData={userData} isLoading={isLoading} />

					{/* Settings Layout with Sidebar */}
					<SettingsLayout>
						<AccountSecurityTab />
					</SettingsLayout>
				</div>
			</div>
		</PageTransition>
	);
}
