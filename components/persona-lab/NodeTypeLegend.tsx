"use client";

import { ChevronDown, ChevronUp, Eye, EyeOff, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { getNodeConfig } from "@/lib/config/graphConfig";
import type { ApiForceGraphNode } from "@/lib/utils/graphTransform";

type NodeType = ApiForceGraphNode["type"];

interface NodeTypeLegendProps {
	hiddenNodeTypes: Set<NodeType>;
	onToggleNodeType: (type: NodeType) => void;
}

const LAYER_ROWS: Array<{ type: NodeType; key: string }> = [
	{ type: "profile_summary", key: "legendProfileSummary" },
	{ type: "essay_angle", key: "legendEssayAngle" },
	{ type: "key_story", key: "legendKeyStory" },
	{ type: "detail", key: "legendDetail" },
];

export function NodeTypeLegend({
	hiddenNodeTypes,
	onToggleNodeType,
}: NodeTypeLegendProps) {
	const t = useTranslations("personaLab");
	const [collapsed, setCollapsed] = useState(true);

	return (
		<div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-xs">
			<div className="flex items-center justify-between gap-2">
				<h3 className="text-sm font-semibold flex items-center gap-2">
					<Info className="h-4 w-4" />
					{t("graphLegendTitle")}
				</h3>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={() => setCollapsed((v) => !v)}
					aria-label={collapsed ? t("expandLegend") : t("collapseLegend")}
				>
					{collapsed ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>
			</div>

			{!collapsed && (
				<div className="space-y-2 mt-2">
					{LAYER_ROWS.map(({ type, key }) => {
						const config = getNodeConfig(type);
						const isHidden = hiddenNodeTypes.has(type);
						return (
							<button
								key={type}
								type="button"
								className="flex items-center gap-2 w-full rounded px-1.5 py-1.5 hover:bg-muted/60 text-left"
								onClick={() => onToggleNodeType(type)}
								title={isHidden ? t("showNodeType") : t("hideNodeType")}
							>
								<div
									className="w-3 h-3 rounded-full shrink-0"
									style={{
										backgroundColor: config.color,
										opacity: isHidden ? 0.35 : 1,
									}}
								/>
								<div className="flex-1 min-w-0">
									<div
										className="text-xs font-medium truncate"
										style={{ opacity: isHidden ? 0.55 : 1 }}
									>
										{config.label}
									</div>
									<div
										className="text-[10px] text-muted-foreground truncate"
										style={{ opacity: isHidden ? 0.55 : 1 }}
									>
										{t(key)}
									</div>
								</div>
								{isHidden ? (
									<EyeOff className="h-3 w-3 text-muted-foreground shrink-0" />
								) : (
									<Eye className="h-3 w-3 text-muted-foreground shrink-0" />
								)}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
}
