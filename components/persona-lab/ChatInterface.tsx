import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
    ArrowUp,
    Bot,
    Compass,
    Lightbulb,
    MessageSquare,
    Sparkles,
    User,
    Wand2,
} from "lucide-react";

interface Message {
    id: string;
    role: "user" | "ai";
    content: string;
    timestamp: Date;
}

interface ChatInterfaceProps {
    onInsightTrigger?: () => void;
}

export function ChatInterface({ onInsightTrigger }: ChatInterfaceProps) {
    const [mode, setMode] = useState<"navigator" | "persona">("persona");
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content:
                "Hi Jane! I'm your Leaply Insight Mate. I've analyzed your profile and I see you're aiming for Stanford with a strong interest in CS & AI. That's exciting! \n\nTo help you stand out, we need to dig deeper into your unique story. What's a recent project or experience that really challenged your perspective on technology?",
            timestamp: new Date(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            setIsTyping(false);
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content:
                    "That's a fascinating example! It shows not just technical skill, but also resilience. \n\nI think this could be a great angle for your 'Intellectual Vitality' essay. Shall we explore this theme further?",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);

            // Trigger insight board update simulation
            if (onInsightTrigger) {
                setTimeout(onInsightTrigger, 1000);
            }
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Leaply Insight Mate</h2>
                        <p className="text-xs text-muted-foreground">
                            AI-powered mentorship
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-full border border-border">
                    <button
                        onClick={() => setMode("navigator")}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            mode === "navigator"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        Navigator
                    </button>
                    <button
                        onClick={() => setMode("persona")}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            mode === "persona"
                                ? "bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary shadow-sm border border-primary/10"
                                : "text-muted-foreground hover:text-foreground",
                        )}
                    >
                        Persona Lab
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-6 max-w-3xl mx-auto pb-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={cn(
                                "flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                msg.role === "user" ? "flex-row-reverse" : "flex-row",
                            )}
                        >
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                    msg.role === "ai"
                                        ? "bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20"
                                        : "bg-muted text-muted-foreground",
                                )}
                            >
                                {msg.role === "ai" ? (
                                    <Sparkles className="w-4 h-4" />
                                ) : (
                                    <User className="w-4 h-4" />
                                )}
                            </div>

                            <div
                                className={cn(
                                    "p-4 rounded-2xl max-w-[80%] shadow-sm",
                                    msg.role === "ai"
                                        ? "bg-card border border-border/50 rounded-tl-none"
                                        : "bg-primary text-primary-foreground rounded-tr-none",
                                )}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                                <Sparkles className="w-4 h-4 animate-pulse" />
                            </div>
                            <div className="bg-card border border-border/50 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                            </div>
                        </div>
                    )}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-6 pt-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* Starter Chips */}
                    {messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                "Find my unique story",
                                "Analyze my extracurriculars",
                                "Review my school list",
                            ].map((chip) => (
                                <button
                                    key={chip}
                                    onClick={() => setInput(chip)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 hover:bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/10 transition-colors whitespace-nowrap"
                                >
                                    <Lightbulb className="w-3 h-3" />
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-end gap-2 bg-muted/30 p-2 rounded-xl border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all shadow-sm">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                            <Wand2 className="w-5 h-5" />
                        </Button>

                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 bg-transparent border-0 focus:ring-0 p-2.5 min-h-[44px] max-h-[120px] resize-none text-sm"
                            rows={1}
                        />

                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className={cn(
                                "h-10 w-10 rounded-lg transition-all duration-300",
                                input.trim()
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:bg-primary/90"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                            )}
                            size="icon"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground">
                        Leaply AI can make mistakes. Consider checking important information.
                    </p>
                </div>
            </div>
        </div>
    );
}
