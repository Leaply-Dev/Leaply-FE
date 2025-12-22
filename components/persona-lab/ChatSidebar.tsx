"use client";

import {
	ArrowUp,
	Book,
	Check,
	ChevronRight,
	Gem,
	Rocket,
	Sparkles,
	Star,
	User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { type TrackId, usePersonaStore } from "@/lib/store/personaStore";
import { TRACK_COLORS } from "@/lib/constants/personaColors";

interface Message {
	id: string;
	role: "user" | "ai" | "menu";
	content: string;
	menuOptions?: TrackId[];
}

const TRACK_CONFIG: Record<
	TrackId,
	{ icon: React.ReactNode; label: string; shortLabel: string }
> = {
	academic: {
		icon: <Book className="w-4 h-4" />,
		label: "Academic Journey",
		shortLabel: "Academic",
	},
	activities: {
		icon: <Star className="w-4 h-4" />,
		label: "Activities & Impact",
		shortLabel: "Activities",
	},
	values: {
		icon: <Gem className="w-4 h-4" />,
		label: "Values & Identity",
		shortLabel: "Values",
	},
	future: {
		icon: <Rocket className="w-4 h-4" />,
		label: "Future Vision",
		shortLabel: "Future",
	},
};

const INITIAL_MESSAGES: Record<TrackId, string> = {
	academic:
		"Let's explore your academic journey! What subject or field of study excites you the most, and why?",
	activities:
		"Tell me about your activities! What's an extracurricular or project you've put significant time into?",
	values:
		"Let's discover your values. What are 2-3 principles that guide your decisions?",
	future:
		"Let's talk about your future! Where do you see yourself in 10 years?",
};

export function ChatSidebar() {
	const { tracks, answerQuestion, completeTrack } = usePersonaStore();
	const [activeTrack, setActiveTrack] = useState<TrackId | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [showWelcome, setShowWelcome] = useState(true);
	const scrollRef = useRef<HTMLDivElement>(null);

	// Calculate overall progress
	const completedCount = tracks.filter((t) => t.status === "completed").length;
	const overallProgress = (completedCount / tracks.length) * 100;

	// Get available tracks (not completed)
	const availableTracks = tracks
		.filter((t) => t.status !== "completed")
		.map((t) => t.id);

	// Initialize with welcome message and menu
	useEffect(() => {
		if (showWelcome && messages.length === 0) {
			const welcomeMessages: Message[] = [
				{
					id: "welcome",
					role: "ai",
					content:
						completedCount === tracks.length
							? "Amazing! You've completed all discovery tracks. Your persona canvas is now fully unlocked!"
							: `Welcome to your discovery journey! I'll help you uncover your unique story. ${completedCount > 0 ? `You've completed ${completedCount}/${tracks.length} tracks.` : ""} Choose a track to explore:`,
				},
			];

			if (availableTracks.length > 0) {
				welcomeMessages.push({
					id: "menu",
					role: "menu",
					content: "",
					menuOptions: availableTracks,
				});
			}

			setMessages(welcomeMessages);
			setShowWelcome(false);
		}
	}, [showWelcome, messages.length, completedCount, tracks.length, availableTracks]);

	// Scroll to bottom on new messages
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSelectTrack = (trackId: TrackId) => {
		setActiveTrack(trackId);
		setQuestionIndex(0);

		// Remove menu message and add selection + first question
		setMessages((prev) => {
			const filtered = prev.filter((m) => m.role !== "menu");
			return [
				...filtered,
				{
					id: `select-${trackId}`,
					role: "user",
					content: `Let's explore ${TRACK_CONFIG[trackId].label}`,
				},
			];
		});

		setIsTyping(true);
		setTimeout(() => {
			setIsTyping(false);
			setMessages((prev) => [
				...prev,
				{
					id: "initial",
					role: "ai",
					content: INITIAL_MESSAGES[trackId],
				},
			]);
		}, 800);
	};

	const handleSend = () => {
		if (!input.trim() || !activeTrack) return;

		const track = tracks.find((t) => t.id === activeTrack);
		if (!track) return;

		// Add user message
		const userMessage: Message = {
			id: Date.now().toString(),
			role: "user",
			content: input,
		};
		setMessages((prev) => [...prev, userMessage]);

		// Save answer to store
		const currentQuestion = track.questions[questionIndex];
		if (currentQuestion) {
			answerQuestion(activeTrack, currentQuestion.id, input);
		}

		setInput("");
		setIsTyping(true);

		// Simulate AI response
		setTimeout(() => {
			setIsTyping(false);
			const nextIndex = questionIndex + 1;

			if (nextIndex >= track.questions.length) {
				// Track complete
				completeTrack(activeTrack);
				setActiveTrack(null);

				const remainingTracks = tracks
					.filter((t) => t.id !== activeTrack && t.status !== "completed")
					.map((t) => t.id);

				const completionMessages: Message[] = [
					{
						id: (Date.now() + 1).toString(),
						role: "ai",
						content: `Excellent! You've completed the ${TRACK_CONFIG[activeTrack].label} track. Your insights have been added to your canvas.${remainingTracks.length > 0 ? " Ready for the next track?" : " All tracks complete!"}`,
					},
				];

				if (remainingTracks.length > 0) {
					completionMessages.push({
						id: "menu-next",
						role: "menu",
						content: "",
						menuOptions: remainingTracks,
					});
				}

				setMessages((prev) => [...prev, ...completionMessages]);
			} else {
				// Next question
				const nextQuestion = track.questions[nextIndex];
				const aiResponse: Message = {
					id: (Date.now() + 1).toString(),
					role: "ai",
					content: nextQuestion.question,
				};
				setMessages((prev) => [...prev, aiResponse]);
				setQuestionIndex(nextIndex);
			}
		}, 1000);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	// Get current track info for header
	const currentTrack = activeTrack ? tracks.find((t) => t.id === activeTrack) : null;
	const chatProgress = currentTrack
		? ((questionIndex + 1) / currentTrack.questions.length) * 100
		: 0;

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="px-4 py-3 border-b border-border shrink-0">
				<div className="flex items-center gap-2 mb-2">
					<div className="p-1.5 rounded-lg bg-primary/10">
						<Sparkles className="w-4 h-4 text-primary" />
					</div>
					<div className="flex-1">
						<h2 className="font-semibold text-sm">Discovery Chat</h2>
						{activeTrack && currentTrack && (
							<div className="flex items-center gap-2 mt-1">
								<span
									className="text-xs px-1.5 py-0.5 rounded"
									style={{
										backgroundColor: `${TRACK_COLORS[activeTrack].primary}20`,
										color: TRACK_COLORS[activeTrack].primary,
									}}
								>
									{TRACK_CONFIG[activeTrack].shortLabel}
								</span>
								<Progress value={chatProgress} className="h-1 flex-1 max-w-20" />
								<span className="text-[10px] text-muted-foreground">
									{questionIndex + 1}/{currentTrack.questions.length}
								</span>
							</div>
						)}
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Progress value={overallProgress} className="h-1.5 flex-1" />
					<span className="text-[10px] text-muted-foreground font-medium">
						{completedCount}/{tracks.length}
					</span>
				</div>
			</div>

			{/* Messages */}
			<ScrollArea className="flex-1 p-3">
				<div className="space-y-3">
					{messages.map((msg) => {
						// Menu message - TUI style options
						if (msg.role === "menu" && msg.menuOptions) {
							return (
								<div key={msg.id} className="space-y-1.5 pl-8">
									{msg.menuOptions.map((trackId, idx) => {
										const config = TRACK_CONFIG[trackId];
										const colors = TRACK_COLORS[trackId];
										const track = tracks.find((t) => t.id === trackId);
										const isCompleted = track?.status === "completed";

										return (
											<button
												key={trackId}
												type="button"
												onClick={() => !isCompleted && handleSelectTrack(trackId)}
												disabled={isCompleted}
												className={cn(
													"w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all text-sm",
													"border hover:border-2",
													isCompleted && "opacity-50 cursor-not-allowed",
												)}
												style={{
													borderColor: `${colors.primary}40`,
													backgroundColor: `${colors.primary}05`,
												}}
											>
												<span
													className="text-xs font-mono text-muted-foreground w-4"
												>
													{idx + 1}.
												</span>
												<span style={{ color: colors.primary }}>
													{config.icon}
												</span>
												<span className="flex-1 font-medium">
													{config.shortLabel}
												</span>
												{isCompleted ? (
													<Check className="w-4 h-4 text-primary" />
												) : (
													<ChevronRight
														className="w-4 h-4 text-muted-foreground"
													/>
												)}
											</button>
										);
									})}
								</div>
							);
						}

						// Regular messages
						return (
							<div
								key={msg.id}
								className={cn(
									"flex gap-2",
									msg.role === "user" ? "flex-row-reverse" : "flex-row",
								)}
							>
								<div
									className={cn(
										"w-6 h-6 rounded-full flex items-center justify-center shrink-0",
										msg.role === "ai"
											? "bg-primary text-primary-foreground"
											: "bg-muted",
									)}
								>
									{msg.role === "ai" ? (
										<Sparkles className="w-3 h-3" />
									) : (
										<User className="w-3 h-3" />
									)}
								</div>
								<div
									className={cn(
										"px-3 py-2 rounded-xl text-sm max-w-[85%]",
										msg.role === "ai"
											? "bg-muted/50 border border-border rounded-tl-none"
											: "bg-primary text-primary-foreground rounded-tr-none",
									)}
								>
									{msg.content}
								</div>
							</div>
						);
					})}
					{isTyping && (
						<div className="flex gap-2">
							<div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
								<Sparkles className="w-3 h-3 animate-pulse" />
							</div>
							<div className="bg-muted/50 border border-border px-3 py-2 rounded-xl rounded-tl-none flex items-center gap-1">
								<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
								<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
								<span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
							</div>
						</div>
					)}
					<div ref={scrollRef} />
				</div>
			</ScrollArea>

			{/* Input - Only show when track is active */}
			{activeTrack && (
				<div className="p-3 border-t border-border shrink-0">
					<div className="flex items-end gap-2 bg-muted/30 p-2 rounded-xl border border-border focus-within:border-primary/50">
						<textarea
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder="Share your thoughts..."
							className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none p-1.5 min-h-[36px] max-h-[80px] resize-none text-sm placeholder:text-muted-foreground"
							rows={1}
						/>
						<Button
							onClick={handleSend}
							disabled={!input.trim() || isTyping}
							size="icon"
							className="h-8 w-8 rounded-lg shrink-0"
						>
							<ArrowUp className="w-4 h-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}
