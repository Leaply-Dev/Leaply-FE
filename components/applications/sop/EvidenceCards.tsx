"use client";

import { Loader2, Plus, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type EvidenceCardDto, useEvidence } from "@/lib/api/sop-workspace";

interface EvidenceCardsProps {
	applicationId: string;
	sectionIndex: number;
	onInsert: (fact: string) => void;
}

export function EvidenceCards({
	applicationId,
	sectionIndex,
	onInsert,
}: EvidenceCardsProps) {
	const { data: evidenceData, isLoading } = useEvidence(
		applicationId,
		sectionIndex,
	);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-4">
				<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
			</div>
		);
	}

	const cards = evidenceData?.evidenceCards || [];

	if (cards.length === 0) {
		return (
			<div className="text-center text-sm text-muted-foreground p-4">
				Không có dữ liệu từ Persona Lab cho section này
			</div>
		);
	}

	return (
		<div className="space-y-3">
			<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
				Dữ liệu từ Persona Lab
			</p>

			{cards.map((card: EvidenceCardDto) => (
				<Card key={card.nodeId} className="bg-muted/30">
					<CardHeader className="p-3 pb-2">
						<CardTitle className="text-sm font-medium flex items-center gap-2">
							<Tag className="w-3.5 h-3.5 text-primary" />
							{card.title}
						</CardTitle>
					</CardHeader>
					<CardContent className="p-3 pt-0 space-y-2">
						{/* Facts */}
						{card.facts && card.facts.length > 0 && (
							<ul className="space-y-1.5">
								{card.facts.map((fact, index) => (
									<li
										key={index}
										className="text-xs text-muted-foreground flex items-start gap-2 group"
									>
										<span className="flex-1">• {fact}</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() => onInsert(fact)}
										>
											<Plus className="w-3 h-3" />
										</Button>
									</li>
								))}
							</ul>
						)}

						{/* Tags */}
						{card.tags && card.tags.length > 0 && (
							<div className="flex flex-wrap gap-1 pt-1">
								{card.tags.map((tag) => (
									<Badge
										key={tag}
										variant="outline"
										className="text-[10px] px-1.5 py-0"
									>
										{tag}
									</Badge>
								))}
							</div>
						)}

						{/* Word count potential */}
						{card.wordCountPotential && (
							<p className="text-[10px] text-muted-foreground">
								~{card.wordCountPotential} từ
							</p>
						)}
					</CardContent>
				</Card>
			))}
		</div>
	);
}
