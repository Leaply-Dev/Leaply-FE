"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    ChevronRight,
    Lightbulb,
    Sparkles,
    X,
} from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import type { TrackId } from "@/lib/store/personaStore";
import { TRACK_COLORS } from "@/lib/constants/personaColors";
import { cn } from "@/lib/utils";

export type NodeType = "topic" | "story" | "insight" | "core";

export interface NodeDetailData {
    id: string;
    type: NodeType;
    trackId?: TrackId;
    title: string;
    subtitle?: string;
    content?: string;
    themes?: string[];
    relatedStories?: Array<{ id: string; title: string }>;
    suggestedAngles?: string[];
    isAIGenerated?: boolean;
}

interface NodeDetailModalProps {
    isOpen: boolean;
    data: NodeDetailData | null;
    onClose: () => void;
    onNavigate?: (nodeId: string) => void;
}

export function NodeDetailModal({
    isOpen,
    data,
    onClose,
    onNavigate,
}: NodeDetailModalProps) {
    if (!data) return null;

    const colors = data.trackId ? TRACK_COLORS[data.trackId] : null;

    const getIcon = () => {
        switch (data.type) {
            case "story":
                return <BookOpen className="w-5 h-5" />;
            case "insight":
                return <Lightbulb className="w-5 h-5" />;
            case "core":
                return <Sparkles className="w-5 h-5" />;
            default:
                return <BookOpen className="w-5 h-5" />;
        }
    };

    const getTypeLabel = () => {
        switch (data.type) {
            case "story":
                return "Your Story";
            case "insight":
                return "AI Insight";
            case "topic":
                return "Topic Overview";
            case "core":
                return "Your Archetype";
            default:
                return "";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="fixed inset-x-4 top-[10%] bottom-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg z-50"
                    >
                        <div className="h-full bg-background rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col">
                            {/* Header */}
                            <div
                                className={cn(
                                    "px-6 py-4 border-b flex items-center justify-between",
                                    colors ? `bg-[${colors.light}]` : "bg-muted/30",
                                )}
                                style={colors ? { backgroundColor: colors.light } : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center",
                                            data.type === "insight"
                                                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                                : data.type === "core"
                                                    ? "bg-gradient-to-br from-primary to-primary/80 text-white"
                                                    : colors
                                                        ? colors.bgClass
                                                        : "bg-primary/10",
                                        )}
                                        style={
                                            colors && data.type !== "insight" && data.type !== "core"
                                                ? { color: colors.primary }
                                                : undefined
                                        }
                                    >
                                        {getIcon()}
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                            {getTypeLabel()}
                                        </p>
                                        <h2 className="font-semibold text-foreground text-lg">
                                            {data.title}
                                        </h2>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Content */}
                            <ScrollArea className="flex-1 p-6">
                                <div className="space-y-6">
                                    {/* Subtitle */}
                                    {data.subtitle && (
                                        <p className="text-muted-foreground">{data.subtitle}</p>
                                    )}

                                    {/* Main content */}
                                    {data.content && (
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <p className="leading-relaxed whitespace-pre-wrap">
                                                {data.content}
                                            </p>
                                        </div>
                                    )}

                                    {/* AI Generated indicator */}
                                    {data.isAIGenerated && (
                                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg">
                                            <Sparkles className="w-4 h-4" />
                                            <span>Generated by Leaply AI based on your stories</span>
                                        </div>
                                    )}

                                    {/* Themes */}
                                    {data.themes && data.themes.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-foreground mb-2">
                                                Key Themes
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data.themes.map((theme) => (
                                                    <Badge
                                                        key={theme}
                                                        variant="secondary"
                                                        className="px-3 py-1"
                                                        style={
                                                            colors
                                                                ? {
                                                                    backgroundColor: `${colors.primary}15`,
                                                                    color: colors.primary,
                                                                }
                                                                : undefined
                                                        }
                                                    >
                                                        {theme}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Related stories */}
                                    {data.relatedStories && data.relatedStories.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-foreground mb-2">
                                                Related Stories
                                            </h3>
                                            <div className="space-y-2">
                                                {data.relatedStories.map((story) => (
                                                    <button
                                                        key={story.id}
                                                        onClick={() => onNavigate?.(story.id)}
                                                        className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-left group"
                                                    >
                                                        <span className="text-sm font-medium text-foreground">
                                                            {story.title}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Suggested angles for insights */}
                                    {data.suggestedAngles && data.suggestedAngles.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-medium text-foreground mb-2">
                                                Essay Angle Ideas
                                            </h3>
                                            <ul className="space-y-2">
                                                {data.suggestedAngles.map((angle, index) => (
                                                    <li
                                                        key={`angle-${index}`}
                                                        className="flex items-start gap-2 text-sm text-muted-foreground"
                                                    >
                                                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                                                        {angle}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t bg-muted/20 flex justify-between items-center">
                                <Button variant="ghost" onClick={onClose} size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Canvas
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
