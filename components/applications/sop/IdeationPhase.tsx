"use client";

import { ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	type AngleDto,
	useGenerateIdeation,
	useIdeation,
	useUpdateIdeation,
} from "@/lib/api/sop-workspace";
import { cn } from "@/lib/utils";

interface IdeationPhaseProps {
	applicationId: string;
	onContinue: () => void;
}

export function IdeationPhase({
	applicationId,
	onContinue,
}: IdeationPhaseProps) {
	const [selectedAngleId, setSelectedAngleId] = useState<string | null>(null);

	const { data: ideation, isLoading } = useIdeation(applicationId);
	const generateIdeation = useGenerateIdeation();
	const updateIdeation = useUpdateIdeation();

	// Set initial values from server data
	useEffect(() => {
		if (ideation?.selectedAngleId) {
			setSelectedAngleId(ideation.selectedAngleId);
		}
	}, [ideation?.selectedAngleId]);

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
					tonePreference: "academic",
				},
			});
			onContinue();
		} catch {
			toast.error("Không thể lưu lựa chọn. Vui lòng thử lại.");
		}
	};

	// Loading state
	if (isLoading && !generateIdeation.data) {
		return (
			<div className="flex items-center justify-center min-h-[300px]">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	const angles = generateIdeation.data?.angles || ideation?.angles || [];

	// No angles yet - show generate button
	if (angles.length === 0) {
		return (
			<Card className="max-w-xl mx-auto">
				<CardHeader className="text-center pb-4">
					<CardTitle className="flex items-center justify-center gap-2 text-lg">
						<Sparkles className="w-5 h-5 text-amber-500" />
						Chọn góc viết
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-center text-sm text-muted-foreground">
						AI sẽ phân tích Persona Lab và đề xuất các góc viết phù hợp.
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
								Tạo gợi ý
							</>
						)}
					</Button>
				</CardContent>
			</Card>
		);
	}

	// Show angles in a simple list
	return (
		<div className="max-w-2xl mx-auto space-y-6">
			<div className="text-center">
				<h2 className="text-lg font-semibold">Chọn góc viết cho SOP</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Chọn một hướng tiếp cận phù hợp với câu chuyện của bạn
				</p>
			</div>

			{/* Angle Cards - Simple version */}
			<div className="space-y-3">
				{angles.map((angle: AngleDto) => (
					<button
						key={angle.id}
						type="button"
						onClick={() => setSelectedAngleId(angle.id)}
						className={cn(
							"w-full text-left p-4 rounded-lg border transition-all",
							"hover:border-primary/50 hover:bg-primary/5",
							selectedAngleId === angle.id
								? "border-primary bg-primary/5 ring-2 ring-primary/20"
								: "border-border",
						)}
					>
						<div className="flex items-start justify-between gap-3">
							<div className="flex-1 min-w-0">
								<h3 className="font-medium text-foreground">{angle.title}</h3>
								{angle.hook && (
									<p className="text-sm text-muted-foreground mt-1 italic">
										"{angle.hook}"
									</p>
								)}
								{angle.fitReason && (
									<p className="text-xs text-muted-foreground mt-2">
										{angle.fitReason}
									</p>
								)}
							</div>
							{angle.fitScore && (
								<span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
									{Math.round(angle.fitScore * 100)}%
								</span>
							)}
						</div>
					</button>
				))}
			</div>

			{/* Actions */}
			<div className="flex items-center justify-between pt-4 border-t">
				<Button
					variant="ghost"
					size="sm"
					onClick={handleGenerate}
					disabled={generateIdeation.isPending}
				>
					{generateIdeation.isPending ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<RefreshCw className="w-4 h-4 mr-2" />
					)}
					Tạo lại
				</Button>

				<Button
					onClick={handleContinue}
					disabled={!selectedAngleId || updateIdeation.isPending}
					size="lg"
				>
					{updateIdeation.isPending ? (
						<Loader2 className="w-4 h-4 mr-2 animate-spin" />
					) : (
						<ArrowRight className="w-4 h-4 mr-2" />
					)}
					Tiếp tục viết
				</Button>
			</div>
		</div>
	);
}
