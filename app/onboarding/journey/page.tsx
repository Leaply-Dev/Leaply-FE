"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Compass, Target, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { OnboardingProgress } from "@/components/OnboardingProgress";
import { useUserStore } from "@/lib/store/userStore";
import { PageTransition } from "@/components/PageTransition";
import { cn } from "@/lib/utils";

const ONBOARDING_STEPS = [
	"Thông tin cơ bản",
	"Hành trình",
];

type JourneyType = "exploring" | "targeted" | null;

const JOURNEY_OPTIONS = [
	{
		id: "exploring" as const,
		icon: Compass,
		title: "Đang khám phá",
		description: "Tôi chưa chắc chắn về trường hoặc ngành phù hợp",
		details: [
			"Khám phá điểm mạnh và câu chuyện của bạn",
			"Tìm hiểu các ngành học phù hợp",
			"Nhận gợi ý trường dựa trên profile",
		],
		color: "chart-2",
		suggestion: "Bắt đầu với Persona Lab",
	},
	{
		id: "targeted" as const,
		icon: Target,
		title: "Đã có mục tiêu",
		description: "Tôi biết mình muốn apply trường nào",
		details: [
			"Thêm trường vào danh sách mục tiêu",
			"Theo dõi deadline và yêu cầu",
			"Chuẩn bị hồ sơ có chiến lược",
		],
		color: "primary",
		suggestion: "Bắt đầu khám phá trường",
	},
];

export default function JourneyTypePage() {
	const router = useRouter();
	const { completeOnboarding, login, profile, setJourneyType } = useUserStore();
	const [selectedJourney, setSelectedJourney] = useState<JourneyType>(null);

	const handleSubmit = () => {
		if (!selectedJourney) return;

		// Store journey type in the store
		setJourneyType(selectedJourney);

		// Mark onboarding as complete
		completeOnboarding();

		// If profile exists, ensure user is logged in
		if (profile) {
			login(profile);
		}

		// Navigate to home
		router.push("/home");
	};

	return (
		<PageTransition>
			<div className="min-h-[calc(100vh-4rem)] bg-muted py-12">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
					<OnboardingProgress
						steps={ONBOARDING_STEPS}
						currentStep={1}
						className="mb-12"
					/>

					<div className="text-center mb-10">
						<motion.div
							initial={{ scale: 0.8, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ duration: 0.3 }}
							className="w-20 h-20 bg-gradient-to-br from-primary/20 to-chart-2/20 rounded-full flex items-center justify-center mx-auto mb-6"
						>
							<Sparkles className="w-10 h-10 text-primary" />
						</motion.div>
						<h1 className="text-3xl font-bold text-foreground mb-3">
							Bạn đang ở đâu trên hành trình du học?
						</h1>
						<p className="text-lg text-muted-foreground max-w-xl mx-auto">
							Không có lựa chọn nào đúng hay sai - chúng tôi sẽ tùy chỉnh trải nghiệm phù hợp với bạn
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{JOURNEY_OPTIONS.map((option, index) => {
							const Icon = option.icon;
							const isSelected = selectedJourney === option.id;

							return (
								<motion.div
									key={option.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 + 0.2 }}
								>
									<Card
										className={cn(
											"relative cursor-pointer transition-all duration-300 h-full overflow-hidden group",
											isSelected
												? "ring-2 ring-primary shadow-lg scale-[1.02]"
												: "hover:shadow-md hover:scale-[1.01]"
										)}
										onClick={() => setSelectedJourney(option.id)}
									>
										{/* Selection indicator */}
										<div
											className={cn(
												"absolute top-4 right-4 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center",
												isSelected
													? "border-primary bg-primary"
													: "border-muted-foreground/30"
											)}
										>
											{isSelected && (
												<motion.div
													initial={{ scale: 0 }}
													animate={{ scale: 1 }}
													className="w-2 h-2 bg-white rounded-full"
												/>
											)}
										</div>

										<CardHeader className="pb-3">
											<div
												className={cn(
													"w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors",
													isSelected
														? "bg-primary/20"
														: "bg-muted group-hover:bg-primary/10"
												)}
											>
												<Icon
													className={cn(
														"w-7 h-7 transition-colors",
														isSelected
															? "text-primary"
															: "text-muted-foreground group-hover:text-primary"
													)}
												/>
											</div>
											<CardTitle className="text-xl">{option.title}</CardTitle>
											<CardDescription className="text-base">
												{option.description}
											</CardDescription>
										</CardHeader>
										<CardContent className="pt-0">
											<ul className="space-y-2">
												{option.details.map((detail, i) => (
													<li
														key={i}
														className="flex items-start gap-2 text-sm text-muted-foreground"
													>
														<div
															className={cn(
																"w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
																isSelected ? "bg-primary" : "bg-muted-foreground/50"
															)}
														/>
														{detail}
													</li>
												))}
											</ul>

											{/* Suggestion badge */}
											<div
												className={cn(
													"mt-4 px-3 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-1.5 transition-colors",
													isSelected
														? "bg-primary/10 text-primary"
														: "bg-muted text-muted-foreground"
												)}
											>
												<ArrowRight className="w-3.5 h-3.5" />
												{option.suggestion}
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="flex flex-col items-center gap-4"
					>
						<Button
							size="lg"
							onClick={handleSubmit}
							disabled={!selectedJourney}
							className="min-w-[200px]"
						>
							Bắt đầu hành trình
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>

						<Button
							variant="ghost"
							onClick={() => router.push("/onboarding")}
							className="text-muted-foreground"
						>
							Quay lại
						</Button>

						<p className="text-sm text-muted-foreground text-center max-w-md">
							Bạn có thể thay đổi hướng đi bất cứ lúc nào. Leaply sẽ luôn hỗ trợ bạn.
						</p>
					</motion.div>
				</div>
			</div>
		</PageTransition>
	);
}

