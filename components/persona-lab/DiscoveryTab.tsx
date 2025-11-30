"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	BookOpen,
	Star,
	Heart,
	Rocket,
	ChevronRight,
	Check,
	ArrowLeft,
	Lightbulb,
	SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePersonaStore, type TrackId, type DiscoveryTrack } from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

const TRACK_ICONS: Record<TrackId, React.ComponentType<{ className?: string }>> = {
	academic: BookOpen,
	activities: Star,
	values: Heart,
	future: Rocket,
};

const TRACK_COLORS: Record<TrackId, string> = {
	academic: "bg-blue-500/10 text-blue-600 border-blue-200",
	activities: "bg-amber-500/10 text-amber-600 border-amber-200",
	values: "bg-rose-500/10 text-rose-600 border-rose-200",
	future: "bg-violet-500/10 text-violet-600 border-violet-200",
};

interface TrackCardProps {
	track: DiscoveryTrack;
	onStart: () => void;
}

function TrackCard({ track, onStart }: TrackCardProps) {
	const { t } = useTranslation();
	const Icon = TRACK_ICONS[track.id];
	const answeredCount = track.answers.length;
	const totalQuestions = track.questions.length;
	const progress = (answeredCount / totalQuestions) * 100;

	return (
		<Card
			className={cn(
				"group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
				track.status === "completed" && "ring-2 ring-primary/20"
			)}
			onClick={onStart}
		>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between">
					<div
						className={cn(
							"w-12 h-12 rounded-xl flex items-center justify-center mb-3",
							TRACK_COLORS[track.id]
						)}
					>
						<span className="text-2xl">{track.icon}</span>
					</div>
					<Badge
						variant={
							track.status === "completed"
								? "default"
								: track.status === "in_progress"
									? "secondary"
									: "outline"
						}
						className="text-xs"
					>
						{track.status === "completed" && <Check className="w-3 h-3 mr-1" />}
						{track.status === "completed"
							? t("personaLab", "statusCompleted")
							: track.status === "in_progress"
								? t("personaLab", "statusInProgress")
								: t("personaLab", "statusNotStarted")}
					</Badge>
				</div>
				<CardTitle className="text-lg group-hover:text-primary transition-colors">
					{track.title}
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<p className="text-sm text-muted-foreground mb-4">{track.description}</p>
				
				{track.status !== "not_started" && (
					<div className="space-y-2">
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>{answeredCount} / {totalQuestions} {t("personaLab", "questions")}</span>
							<span>{Math.round(progress)}%</span>
						</div>
						<Progress value={progress} className="h-1.5" />
					</div>
				)}

				<div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
					<span className="text-xs text-muted-foreground">
						{totalQuestions} {t("personaLab", "questions")}
					</span>
					<ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
				</div>
			</CardContent>
		</Card>
	);
}

interface DiscoveryFlowProps {
	track: DiscoveryTrack;
	onBack: () => void;
	onComplete: () => void;
}

function DiscoveryFlow({ track, onBack, onComplete }: DiscoveryFlowProps) {
	const { t } = useTranslation();
	const {
		answerQuestion,
		nextQuestion,
		previousQuestion,
		completeTrack,
	} = usePersonaStore();

	const currentQuestion = track.questions[track.currentQuestionIndex];
	const existingAnswer = track.answers.find(
		(a) => a.questionId === currentQuestion.id
	);
	const [answer, setAnswer] = useState(existingAnswer?.answer || "");
	const isLastQuestion = track.currentQuestionIndex === track.questions.length - 1;
	const canProceed = !currentQuestion.required || answer.trim().length > 0;

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

	const handleSkip = () => {
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

	const progress = ((track.currentQuestionIndex + 1) / track.questions.length) * 100;

	return (
		<div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8">
			{/* Header */}
			<div className="mb-8">
				<button
					onClick={onBack}
					className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
				>
					<ArrowLeft className="w-4 h-4" />
					{t("personaLab", "backToList")}
				</button>

				<div className="flex items-center gap-3 mb-4">
					<div
						className={cn(
							"w-10 h-10 rounded-lg flex items-center justify-center",
							TRACK_COLORS[track.id]
						)}
					>
						<span className="text-xl">{track.icon}</span>
					</div>
					<div>
						<h2 className="font-semibold text-foreground">{track.title}</h2>
						<p className="text-sm text-muted-foreground">
							{t("personaLab", "question")} {track.currentQuestionIndex + 1} / {track.questions.length}
						</p>
					</div>
				</div>

				<Progress value={progress} className="h-2" />
			</div>

			{/* Question Card */}
			<AnimatePresence mode="wait">
				<motion.div
					key={currentQuestion.id}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.3 }}
					className="flex-1 flex flex-col"
				>
					<Card className="flex-1 flex flex-col">
						<CardHeader className="pb-4">
							<CardTitle className="text-xl leading-relaxed">
								{currentQuestion.question}
								{currentQuestion.required && (
									<span className="text-destructive ml-1">*</span>
								)}
							</CardTitle>
							{currentQuestion.hint && (
								<p className="text-sm text-muted-foreground flex items-start gap-2 mt-2">
									<Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
									{currentQuestion.hint}
								</p>
							)}
						</CardHeader>
						<CardContent className="flex-1 flex flex-col pt-0">
							<Textarea
								value={answer}
								onChange={(e) => setAnswer(e.target.value)}
								placeholder={t("personaLab", "writeAnswer")}
								className="flex-1 min-h-[200px] resize-none text-base leading-relaxed"
							/>

							{/* Action Buttons */}
							<div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
								<div className="flex gap-2">
									<Button
										variant="outline"
										onClick={handlePrevious}
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										{track.currentQuestionIndex === 0 ? t("personaLab", "exit") : t("personaLab", "back")}
									</Button>

									{!currentQuestion.required && (
										<Button
											variant="ghost"
											onClick={handleSkip}
											className="text-muted-foreground"
										>
											<SkipForward className="w-4 h-4 mr-2" />
											{t("personaLab", "skip")}
										</Button>
									)}
								</div>

								<Button
									onClick={handleNext}
									disabled={!canProceed}
								>
									{isLastQuestion ? t("personaLab", "complete") : t("personaLab", "next")}
									{!isLastQuestion && <ChevronRight className="w-4 h-4 ml-2" />}
								</Button>
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

export function DiscoveryTab() {
	const { t } = useTranslation();
	const { tracks, activeTrackId, startTrack, setActiveTrack } = usePersonaStore();
	const [selectedTrackId, setSelectedTrackId] = useState<TrackId | null>(null);

	const activeTrack = tracks.find((t) => t.id === selectedTrackId);
	const completedCount = tracks.filter((t) => t.status === "completed").length;

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

	const handleComplete = () => {
		setSelectedTrackId(null);
		setActiveTrack(null);
	};

	if (activeTrack) {
		return (
			<ScrollArea className="flex-1">
				<DiscoveryFlow
					track={activeTrack}
					onBack={handleBack}
					onComplete={handleComplete}
				/>
			</ScrollArea>
		);
	}

	return (
		<ScrollArea className="flex-1">
			<div className="p-6 max-w-5xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-foreground mb-2">
						{t("personaLab", "discoveryTitle")}
					</h2>
					<p className="text-muted-foreground">
						{t("personaLab", "discoverySubtitle")}
					</p>
					<div className="flex items-center gap-2 mt-4">
						<Progress value={(completedCount / tracks.length) * 100} className="flex-1 h-2" />
						<span className="text-sm text-muted-foreground">
							{completedCount} / {tracks.length} {t("personaLab", "tracks")}
						</span>
					</div>
				</div>

				{/* Track Cards Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{tracks.map((track) => (
						<TrackCard
							key={track.id}
							track={track}
							onStart={() => handleStartTrack(track.id)}
						/>
					))}
				</div>

				{/* Info Card */}
				<Card className="mt-8 bg-primary/5 border-primary/20">
					<CardContent className="p-6">
						<div className="flex items-start gap-4">
							<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
								<Lightbulb className="w-5 h-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-foreground mb-1">
									{t("personaLab", "whyImportant")}
								</h3>
								<p className="text-sm text-muted-foreground">
									{t("personaLab", "whyImportantDesc")}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</ScrollArea>
	);
}

