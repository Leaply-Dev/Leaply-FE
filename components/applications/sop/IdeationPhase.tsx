"use client";

import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type AngleDto,
	useGenerateIdeation,
	useIdeation,
	useUpdateIdeation,
} from "@/lib/api/sop-workspace";
import { AngleCard } from "./AngleCard";
import { ToneSelector } from "./ToneSelector";

interface IdeationPhaseProps {
	applicationId: string;
	onContinue: () => void;
}

type Tone = "academic" | "passionate" | "direct";

export function IdeationPhase({
	applicationId,
	onContinue,
}: IdeationPhaseProps) {
	const [selectedAngleId, setSelectedAngleId] = useState<string | null>(null);
	const [selectedTone, setSelectedTone] = useState<Tone>("academic");

	const { data: ideation, isLoading, error } = useIdeation(applicationId);
	const generateIdeation = useGenerateIdeation();
	const updateIdeation = useUpdateIdeation();

	// Set initial values from server data
	useState(() => {
		if (ideation?.selectedAngleId) {
			setSelectedAngleId(ideation.selectedAngleId);
		}
		if (ideation?.tonePreference) {
			setSelectedTone(ideation.tonePreference as Tone);
		}
	});

	const handleGenerate = async () => {
		try {
			await generateIdeation.mutateAsync(applicationId);
			toast.success("Đã tạo gợi ý góc viết");
		} catch {
			toast.error("Không thể tạo gợi ý. Vui lòng thử lại.");
		}
	};

	const handleContinue = async () => {
		if (!selectedAngleId) {
			toast.error("Vui lòng chọn một góc viết");
			return;
		}

		try {
			await updateIdeation.mutateAsync({
				applicationId,
				data: {
					selectedAngleId,
					tonePreference: selectedTone,
				},
			});
			onContinue();
		} catch {
			toast.error("Không thể lưu lựa chọn. Vui lòng thử lại.");
		}
	};

	// Loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[300px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	// No angles yet - show generate button
	const angles = ideation?.angles || [];
	if (angles.length === 0 || error) {
		return (
			<Card className="max-w-2xl mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="flex items-center justify-center gap-2">
						<Sparkles className="w-5 h-5 text-amber-500" />
						Tìm góc viết độc đáo
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<p className="text-center text-muted-foreground">
						AI sẽ phân tích Persona Lab của bạn và đề xuất các góc viết phù hợp
						nhất với SOP prompt và chương trình.
					</p>

					<Button
						onClick={handleGenerate}
						disabled={generateIdeation.isPending}
						className="w-full"
						size="lg"
					>
						{generateIdeation.isPending ? (
							<>
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Đang phân tích...
							</>
						) : (
							<>
								<Sparkles className="w-4 h-4 mr-2" />
								Tạo gợi ý góc viết
							</>
						)}
					</Button>

					<p className="text-xs text-center text-muted-foreground">
						Đảm bảo bạn đã hoàn thành Persona Lab để có kết quả tốt nhất
					</p>
				</CardContent>
			</Card>
		);
	}

	// Show angles
	return (
		<div className="space-y-8">
			{/* Angle selection */}
			<div className="space-y-4">
				<h2 className="text-lg font-semibold text-foreground">
					Chọn góc viết cho SOP
				</h2>
				<p className="text-sm text-muted-foreground">
					Dựa trên Persona Lab của bạn, AI đề xuất các góc viết sau. Chọn một
					góc phù hợp nhất với câu chuyện bạn muốn kể.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{angles.map((angle: AngleDto) => (
						<AngleCard
							key={angle.id}
							angle={angle}
							isSelected={selectedAngleId === angle.id}
							onSelect={() => setSelectedAngleId(angle.id)}
						/>
					))}
				</div>
			</div>

			{/* Tone selection */}
			{selectedAngleId && (
				<div className="border-t pt-6">
					<ToneSelector value={selectedTone} onChange={setSelectedTone} />
				</div>
			)}

			{/* Continue button */}
			{selectedAngleId && (
				<div className="flex justify-end pt-4 border-t">
					<Button
						onClick={handleContinue}
						disabled={updateIdeation.isPending}
						size="lg"
					>
						{updateIdeation.isPending ? (
							<Loader2 className="w-4 h-4 mr-2 animate-spin" />
						) : (
							<ArrowRight className="w-4 h-4 mr-2" />
						)}
						Tiếp tục tạo Outline
					</Button>
				</div>
			)}

			{/* Regenerate option */}
			<div className="text-center">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleGenerate}
					disabled={generateIdeation.isPending}
				>
					{generateIdeation.isPending ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<Sparkles className="w-4 h-4 mr-2" />
					)}
					Tạo lại gợi ý khác
				</Button>
			</div>
		</div>
	);
}
