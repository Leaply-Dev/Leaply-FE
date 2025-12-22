"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	ArrowLeft,
	BookOpen,
	ChevronRight,
	Compass,
	Heart,
	Lightbulb,
	Rocket,
	Sparkles,
	Star,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
	type DiscoveryTrack,
	type TrackId,
	usePersonaStore,
} from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

// Topic metadata with friendly wording
const TOPIC_META: Record<
	TrackId,
	{
		icon: React.ReactNode;
		gradient: string;
		bgLight: string;
		borderColor: string;
	}
> = {
	academic: {
		icon: <BookOpen className="w-6 h-6" />,
		gradient: "from-blue-500 to-blue-600",
		bgLight: "bg-blue-50 dark:bg-blue-950/30",
		borderColor: "border-blue-200 dark:border-blue-900",
	},
	activities: {
		icon: <Star className="w-6 h-6" />,
		gradient: "from-amber-500 to-orange-500",
		bgLight: "bg-amber-50 dark:bg-amber-950/30",
		borderColor: "border-amber-200 dark:border-amber-900",
	},
	values: {
		icon: <Heart className="w-6 h-6" />,
		gradient: "from-rose-500 to-pink-500",
		bgLight: "bg-rose-50 dark:bg-rose-950/30",
		borderColor: "border-rose-200 dark:border-rose-900",
	},
	future: {
		icon: <Rocket className="w-6 h-6" />,
		gradient: "from-violet-500 to-purple-600",
		bgLight: "bg-violet-50 dark:bg-violet-950/30",
		borderColor: "border-violet-200 dark:border-violet-900",
	},
};

// Friendly topic titles (will be used for both languages)
const TOPIC_TITLES: Record<TrackId, { en: string; vi: string }> = {
	academic: {
		en: "Your Learning Story",
		vi: "Câu chuyện học tập",
	},
	activities: {
		en: "What Drives You",
		vi: "Điều thúc đẩy bạn",
	},
	values: {
		en: "Your Core Beliefs",
		vi: "Giá trị cốt lõi",
	},
	future: {
		en: "Where You're Headed",
		vi: "Hướng đi tương lai",
	},
};

const TOPIC_DESCRIPTIONS: Record<TrackId, { en: string; vi: string }> = {
	academic: {
		en: "Share your academic journey and discoveries",
		vi: "Chia sẻ hành trình học tập của bạn",
	},
	activities: {
		en: "Tell us about activities that matter to you",
		vi: "Kể về những hoạt động có ý nghĩa với bạn",
	},
	values: {
		en: "Explore what shapes who you are",
		vi: "Khám phá điều định hình con người bạn",
	},
	future: {
		en: "Envision your path forward",
		vi: "Hình dung con đường phía trước",
	},
};

// Circular progress component
function CircularProgress({
	progress,
	size = 48,
	strokeWidth = 4,
	className,
}: {
	progress: number;
	size?: number;
	strokeWidth?: number;
	className?: string;
}) {
	const radius = (size - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const offset = circumference - (progress / 100) * circumference;

	return (
		<svg
			width={size}
			height={size}
			className={cn("rotate-[-90deg]", className)}
		>
			{/* Background circle */}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="currentColor"
				strokeWidth={strokeWidth}
				className="text-muted/30"
			/>
			{/* Progress circle */}
			<circle
				cx={size / 2}
				cy={size / 2}
				r={radius}
				fill="none"
				stroke="url(#progressGradient)"
				strokeWidth={strokeWidth}
				strokeLinecap="round"
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				className="transition-all duration-500 ease-out"
			/>
			<defs>
				<linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
					<stop offset="0%" stopColor="hsl(var(--primary))" />
					<stop offset="100%" stopColor="hsl(var(--chart-2))" />
				</linearGradient>
			</defs>
		</svg>
	);
}

interface TopicCardProps {
	track: DiscoveryTrack;
	onStart: () => void;
}

function TopicCard({ track, onStart }: TopicCardProps) {
	const meta = TOPIC_META[track.id];
	const answeredCount = track.answers.length;
	const totalQuestions = track.questions.length;
	const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
	const isCompleted = track.status === "completed";
	const isStarted = track.status !== "not_started";

	// Get locale (simplified - in production, use proper hook)
	const title = TOPIC_TITLES[track.id].en;
	const description = TOPIC_DESCRIPTIONS[track.id].en;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card
				className={cn(
					"group cursor-pointer transition-all duration-300",
					"hover:shadow-lg hover:scale-[1.02]",
					"border-2",
					isCompleted
						? "ring-2 ring-primary/20 border-primary/30"
						: meta.borderColor,
					meta.bgLight,
				)}
				onClick={onStart}
			>
				<CardContent className="p-5">
					<div className="flex items-start gap-4">
						{/* Icon with progress ring */}
						<div className="relative shrink-0">
							{isStarted && !isCompleted ? (
								<>
									<CircularProgress progress={progress} size={52} strokeWidth={3} />
									<div
										className={cn(
											"absolute inset-0 flex items-center justify-center",
											`bg-gradient-to-br ${meta.gradient} bg-clip-text text-transparent`,
										)}
									>
										{meta.icon}
									</div>
								</>
							) : (
								<div
									className={cn(
										"w-13 h-13 rounded-xl flex items-center justify-center",
										isCompleted
											? "bg-gradient-to-br from-primary to-primary/80 text-white"
											: `bg-gradient-to-br ${meta.gradient} text-white`,
									)}
								>
									{isCompleted ? (
										<Sparkles className="w-6 h-6" />
									) : (
										meta.icon
									)}
								</div>
							)}
						</div>

						{/* Content */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between mb-1">
								<h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
									{title}
								</h3>
								<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
							</div>
							<p className="text-sm text-muted-foreground line-clamp-2">
								{description}
							</p>

							{/* Status indicator */}
							<div className="mt-3 flex items-center gap-2">
								{isCompleted ? (
									<span className="text-xs font-medium text-primary flex items-center gap-1">
										<Sparkles className="w-3 h-3" />
										Complete
									</span>
								) : isStarted ? (
									<span className="text-xs text-muted-foreground">
										{answeredCount} of {totalQuestions}
									</span>
								) : (
									<span className="text-xs text-muted-foreground">
										{totalQuestions} questions
									</span>
								)}
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}

interface ConversationFlowProps {
	track: DiscoveryTrack;
	onBack: () => void;
	onComplete: () => void;
}

function ConversationFlow({ track, onBack, onComplete }: ConversationFlowProps) {
	const { t } = useTranslation();
	const { answerQuestion, nextQuestion, previousQuestion, completeTrack } =
		usePersonaStore();

	const currentQuestion = track.questions[track.currentQuestionIndex];
	const existingAnswer = track.answers.find(
		(a) => a.questionId === currentQuestion.id,
	);
	const [answer, setAnswer] = useState(existingAnswer?.answer || "");
	const isLastQuestion =
		track.currentQuestionIndex === track.questions.length - 1;
	const canProceed = !currentQuestion.required || answer.trim().length > 0;
	const meta = TOPIC_META[track.id];
	const title = TOPIC_TITLES[track.id].en;

	const handleNext = () => {
		if (answer.trim()) {
			answerQuestion(track.id, currentQuestion.id, answer.trim());
		}

		if (isLastQuestion) {
			completeTrack(track.id);
			onComplete();
		} else {
			nextQuestion(track.id);
			const nextQ = track.questions[track.currentQuestionIndex + 1];
			const nextAnswer = track.answers.find((a) => a.questionId === nextQ?.id);
			setAnswer(nextAnswer?.answer || "");
		}
	};

	const handlePrevious = () => {
		if (answer.trim()) {
			answerQuestion(track.id, currentQuestion.id, answer.trim());
		}

		if (track.currentQuestionIndex > 0) {
			previousQuestion(track.id);
			const prevQ = track.questions[track.currentQuestionIndex - 1];
			const prevAnswer = track.answers.find((a) => a.questionId === prevQ?.id);
			setAnswer(prevAnswer?.answer || "");
		} else {
			onBack();
		}
	};

	return (
		<div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 py-6">
			{/* Header */}
			<div className="mb-6">
				<button
					onClick={onBack}
					className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
				>
					<ArrowLeft className="w-4 h-4" />
					<span className="text-sm">{title}</span>
				</button>

				{/* Minimal progress indicator */}
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span className="font-medium text-foreground">
						{track.currentQuestionIndex + 1}
					</span>
					<span>of</span>
					<span>{track.questions.length}</span>
				</div>
			</div>

			{/* Chat-like question display */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentQuestion.id}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					transition={{ duration: 0.2 }}
					className="flex-1 flex flex-col"
				>
					{/* AI Question bubble */}
					<div className="flex gap-3 mb-6">
						<div
							className={cn(
								"w-9 h-9 rounded-full flex items-center justify-center shrink-0",
								`bg-gradient-to-br ${meta.gradient} text-white`,
							)}
						>
							<Compass className="w-4 h-4" />
						</div>
						<div className="flex-1">
							<div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-full">
								<p className="text-foreground leading-relaxed">
									{currentQuestion.question}
									{currentQuestion.required && (
										<span className="text-destructive ml-1">*</span>
									)}
								</p>
							</div>
							{currentQuestion.hint && (
								<p className="text-xs text-muted-foreground mt-2 flex items-start gap-1.5 px-1">
									<Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500" />
									{currentQuestion.hint}
								</p>
							)}
						</div>
					</div>

					{/* User answer area */}
					<div className="flex-1 flex flex-col gap-4">
						<Textarea
							value={answer}
							onChange={(e) => setAnswer(e.target.value)}
							placeholder={t("personaLab", "writeAnswer")}
							className="flex-1 min-h-[150px] resize-none text-base leading-relaxed rounded-xl border-2 focus:border-primary/50"
						/>

						{/* Action Buttons */}
						<div className="flex items-center justify-between pt-2">
							<Button variant="ghost" onClick={handlePrevious} size="sm">
								<ArrowLeft className="w-4 h-4 mr-2" />
								{track.currentQuestionIndex === 0
									? t("personaLab", "exit")
									: t("personaLab", "back")}
							</Button>

							<Button
								onClick={handleNext}
								disabled={!canProceed}
								className={cn(
									"px-6",
									`bg-gradient-to-r ${meta.gradient} hover:opacity-90`,
								)}
							>
								{isLastQuestion
									? t("personaLab", "complete")
									: t("personaLab", "next")}
								{!isLastQuestion && <ChevronRight className="w-4 h-4 ml-1" />}
							</Button>
						</div>
					</div>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

interface DiscoveryTabProps {
	onComplete?: () => void;
}

export function DiscoveryTab({ onComplete }: DiscoveryTabProps) {
	const { t } = useTranslation();
	const { tracks, startTrack, setActiveTrack } = usePersonaStore();
	const [selectedTrackId, setSelectedTrackId] = useState<TrackId | null>(null);

	const activeTrack = tracks.find((t) => t.id === selectedTrackId);

	const handleStartTrack = (trackId: TrackId) => {
		const track = tracks.find((t) => t.id === trackId);
		if (track?.status === "not_started") {
			startTrack(trackId);
		}
		setSelectedTrackId(trackId);
		setActiveTrack(trackId);
	};

	const handleBack = () => {
		setSelectedTrackId(null);
		setActiveTrack(null);
	};

	const handleTrackComplete = () => {
		// Check if ALL tracks are now completed (including the one just finished)
		const newCompletedCount =
			tracks.filter((t) => t.status === "completed").length + 1;
		const allTracksCompleted = newCompletedCount >= tracks.length;

		setSelectedTrackId(null);
		setActiveTrack(null);

		// Only navigate to persona view when ALL tracks are completed
		if (allTracksCompleted && onComplete) {
			// Small delay to allow state to update
			setTimeout(onComplete, 100);
		}
		// Otherwise, user stays on discovery tab to continue with other tracks
	};

	if (activeTrack) {
		return (
			<ScrollArea className="flex-1">
				<ConversationFlow
					track={activeTrack}
					onBack={handleBack}
					onComplete={handleTrackComplete}
				/>
			</ScrollArea>
		);
	}

	return (
		<ScrollArea className="flex-1">
			<div className="p-6 max-w-3xl mx-auto">
				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-2xl font-bold text-foreground mb-2">
						{t("personaLab", "discoveryTitle")}
					</h2>
					<p className="text-muted-foreground">
						Share your story, and we'll help you discover what makes you unique
					</p>
				</div>

				{/* Topic Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{tracks.map((track, index) => (
						<motion.div
							key={track.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<TopicCard
								track={track}
								onStart={() => handleStartTrack(track.id)}
							/>
						</motion.div>
					))}
				</div>

				{/* Encouragement footer */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className="mt-8 text-center"
				>
					<p className="text-sm text-muted-foreground">
						<Sparkles className="w-4 h-4 inline mr-1 text-primary" />
						Complete all topics to unlock your full persona insights
					</p>
				</motion.div>
			</div>
		</ScrollArea>
	);
}
