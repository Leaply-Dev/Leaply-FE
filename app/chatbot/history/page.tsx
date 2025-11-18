"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/Layout";
import { useChatStore } from "@/lib/store/chatStore";
import { mockConversations } from "@/lib/data/chat";
import {
	PageTransition,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";

export default function ChatHistoryPage() {
	const router = useRouter();
	const {
		conversations,
		setConversations,
		setCurrentConversation,
		deleteConversation,
	} = useChatStore();

	useEffect(() => {
		// Initialize with mock conversations if none exist
		if (conversations.length === 0) {
			setConversations(mockConversations);
		}
	}, [conversations.length, setConversations]);

	const handleOpenConversation = (id: string) => {
		setCurrentConversation(id);
		router.push("/chatbot");
	};

	const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (confirm("Are you sure you want to delete this conversation?")) {
			deleteConversation(id);
		}
	};

	return (
		<PageTransition>
			<PageContainer>
				<Button
					variant="ghost"
					onClick={() => router.push("/chatbot")}
					className="mb-6"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Chat
				</Button>

				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						Conversation History
					</h1>
					<p className="text-lg text-muted-foreground">
						Review your past conversations with the AI assistant
					</p>
				</div>

				{conversations.length > 0 ? (
					<StaggerContainer>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{conversations.map((conversation) => (
								<StaggerItem key={conversation.id}>
									<Card
										className="cursor-pointer hover:shadow-lg transition-shadow"
										onClick={() => handleOpenConversation(conversation.id)}
									>
										<CardContent className="p-6">
											<div className="flex items-start gap-3 mb-4">
												<div className="p-2 bg-primary/10 rounded-lg">
													<MessageSquare className="w-5 h-5 text-primary" />
												</div>
												<div className="flex-1 min-w-0">
													<h3 className="font-semibold text-foreground truncate">
														{conversation.title}
													</h3>
													<p className="text-xs text-muted-foreground mt-1">
														{new Date(
															conversation.updatedAt,
														).toLocaleDateString()}
													</p>
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={(e) =>
														handleDeleteConversation(conversation.id, e)
													}
													className="shrink-0"
												>
													<Trash2 className="w-4 h-4 text-red-600" />
												</Button>
											</div>

											<div className="space-y-2">
												<p className="text-sm text-muted-foreground">
													{conversation.messages.length} message
													{conversation.messages.length !== 1 ? "s" : ""}
												</p>
												{conversation.messages.length > 0 && (
													<p className="text-sm text-muted-foreground line-clamp-2">
														{
															conversation.messages[
																conversation.messages.length - 1
															].content
														}
													</p>
												)}
											</div>
										</CardContent>
									</Card>
								</StaggerItem>
							))}
						</div>
					</StaggerContainer>
				) : (
					<div className="text-center py-16">
						<MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-foreground mb-2">
							No conversations yet
						</h3>
						<p className="text-muted-foreground mb-6">
							Start a conversation with the AI assistant to see your history
							here
						</p>
						<Button onClick={() => router.push("/chatbot")}>
							Start New Conversation
						</Button>
					</div>
				)}
			</PageContainer>
		</PageTransition>
	);
}
