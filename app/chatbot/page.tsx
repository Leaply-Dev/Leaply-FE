"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Send, Loader2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage } from "@/components/ChatMessage";
import { useChatStore } from "@/lib/store/chatStore";
import { mockAIResponses } from "@/lib/data/chat";
import { PageTransition } from "@/components/PageTransition";

export default function ChatbotPage() {
	const {
		currentConversationId,
		getCurrentConversation,
		createConversation,
		addMessage,
		isTyping,
		setTyping,
	} = useChatStore();
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Create conversation if none exists
		if (!currentConversationId) {
			createConversation("New Conversation");
		}
	}, [currentConversationId, createConversation]);

	useEffect(() => {
		// Scroll to bottom when messages change
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handleSend = async () => {
		if (!input.trim() || !currentConversationId) return;

		const userMessage = input.trim();
		setInput("");

		// Add user message
		addMessage(currentConversationId, {
			role: "user",
			content: userMessage,
		});

		// Simulate AI typing
		setTyping(true);

		// Simulate delay for AI response
		setTimeout(
			() => {
				// Simple keyword matching for demo
				let response = mockAIResponses.default;

				if (
					userMessage.toLowerCase().includes("university") ||
					userMessage.toLowerCase().includes("recommend")
				) {
					response = mockAIResponses.universities;
				} else if (
					userMessage.toLowerCase().includes("essay") ||
					userMessage.toLowerCase().includes("statement")
				) {
					response = mockAIResponses.essay;
				}

				addMessage(currentConversationId, {
					role: "assistant",
					content: response,
				});

				setTyping(false);
			},
			1000 + Math.random() * 1000,
		);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const conversation = getCurrentConversation();
	const messages = conversation?.messages || [];

	return (
		<PageTransition>
			<div className="flex flex-col h-[calc(100vh-4rem)]">
				{/* Header */}
				<div className="border-b border-border bg-card">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold text-foreground">
									AI Assistant
								</h1>
								<p className="text-sm text-muted-foreground">
									Ask me anything about studying abroad
								</p>
							</div>
							<Button variant="outline" asChild>
								<Link href="/chatbot/history">
									<History className="w-4 h-4 mr-2" />
									History
								</Link>
							</Button>
						</div>
					</div>
				</div>

				{/* Messages */}
				<div className="flex-1 overflow-y-auto bg-muted">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
						{messages.length === 0 ? (
							<div className="text-center py-12">
								<div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										role="img"
										aria-label="Chatbot Icon"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
										/>
									</svg>
								</div>
								<h2 className="text-xl font-semibold text-foreground mb-2">
									Hi! I'm your study abroad assistant
								</h2>
								<p className="text-muted-foreground mb-6 max-w-md mx-auto">
									I can help you with university recommendations, application
									guidance, essay tips, and more. What would you like to know?
								</p>
								<div className="flex flex-wrap gap-2 justify-center">
									{[
										"Recommend universities for me",
										"Help me write my essay",
										"What are the deadlines?",
										"Scholarship opportunities",
									].map((suggestion) => (
										<Button
											key={suggestion}
											variant="outline"
											size="sm"
											onClick={() => setInput(suggestion)}
										>
											{suggestion}
										</Button>
									))}
								</div>
							</div>
						) : (
							<div>
								{messages.map((message) => (
									<ChatMessage
										key={message.id}
										role={message.role}
										content={message.content}
										timestamp={message.timestamp}
									/>
								))}
								{isTyping && (
									<ChatMessage role="assistant" content="Typing..." />
								)}
								<div ref={messagesEndRef} />
							</div>
						)}
					</div>
				</div>

				{/* Input */}
				<div className="border-t border-border bg-card">
					<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
						<div className="flex gap-4">
							<Input
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Ask me anything..."
								disabled={isTyping}
								className="flex-1"
							/>
							<Button onClick={handleSend} disabled={!input.trim() || isTyping}>
								{isTyping ? (
									<Loader2 className="w-4 h-4 animate-spin" />
								) : (
									<Send className="w-4 h-4" />
								)}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground mt-2">
							This is a demo. Responses are simulated and not from a real AI.
						</p>
					</div>
				</div>
			</div>
		</PageTransition>
	);
}
