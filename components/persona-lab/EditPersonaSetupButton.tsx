"use client";

import { Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function EditPersonaSetupButton() {
	const router = useRouter();
	const t = useTranslations("personaLab.intake");
	return (
		<Button
			variant="outline"
			size="sm"
			onClick={() => router.push("/persona-lab/intake?edit=1")}
			className="gap-2"
		>
			<Settings2 className="w-4 h-4" />
			{t("editSetup")}
		</Button>
	);
}
