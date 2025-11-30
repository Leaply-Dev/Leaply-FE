"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Tag,
	BookOpen,
	Lightbulb,
	Pin,
	PinOff,
	Plus,
	X,
	Edit2,
	Check,
	Compass,
	Sparkles,
	RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	usePersonaStore,
	type PersonalityTag,
	type KeyStory,
	type EssayAngle,
} from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface EditableTagProps {
	tag: PersonalityTag;
	onUpdate: (label: string) => void;
	onRemove: () => void;
}

function EditableTag({ tag, onUpdate, onRemove }: EditableTagProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editValue, setEditValue] = useState(tag.label);

	const handleSave = () => {
		if (editValue.trim()) {
			onUpdate(editValue.trim());
		}
		setIsEditing(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleSave();
		} else if (e.key === "Escape") {
			setEditValue(tag.label);
			setIsEditing(false);
		}
	};

	if (isEditing && tag.isEditable) {
		return (
			<div className="flex items-center gap-1">
				<Input
					value={editValue}
					onChange={(e) => setEditValue(e.target.value)}
					onKeyDown={handleKeyDown}
					onBlur={handleSave}
					className="h-7 w-28 text-xs"
					autoFocus
				/>
				<Button
					variant="ghost"
					size="icon"
					className="h-6 w-6"
					onClick={handleSave}
				>
					<Check className="w-3 h-3" />
				</Button>
			</div>
		);
	}

	return (
		<Badge
			variant="secondary"
			className={cn(
				"bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 text-sm cursor-default group",
				tag.isEditable && "cursor-pointer"
			)}
		>
			{tag.label}
			{tag.isEditable && (
				<span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
					<button
						onClick={() => setIsEditing(true)}
						className="hover:text-primary"
					>
						<Edit2 className="w-3 h-3" />
					</button>
					<button onClick={onRemove} className="hover:text-destructive">
						<X className="w-3 h-3" />
					</button>
				</span>
			)}
		</Badge>
	);
}

interface StoryCardProps {
	story: KeyStory;
	onTogglePin: () => void;
}

function StoryCard({ story, onTogglePin }: StoryCardProps) {
	return (
		<Card className={cn(
			"transition-all hover:shadow-md",
			story.isPinned && "ring-1 ring-primary/30 bg-primary/5"
		)}>
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-2">
					<h4 className="font-medium text-foreground">{story.title}</h4>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						onClick={onTogglePin}
					>
						{story.isPinned ? (
							<Pin className="w-4 h-4 text-primary" />
						) : (
							<PinOff className="w-4 h-4 text-muted-foreground" />
						)}
					</Button>
				</div>
				<p className="text-sm text-muted-foreground line-clamp-3">
					{story.summary}
				</p>
				<Badge variant="outline" className="mt-3 text-xs">
					{story.sourceTrack}
				</Badge>
			</CardContent>
		</Card>
	);
}

interface EssayAngleCardProps {
	angle: EssayAngle;
	onTogglePin: () => void;
	onCreateEssay: () => void;
}

function EssayAngleCard({ angle, onTogglePin, onCreateEssay }: EssayAngleCardProps) {
	const { t } = useTranslation();
	
	return (
		<Card className={cn(
			"transition-all hover:shadow-md",
			angle.isPinned && "ring-1 ring-chart-2/30 bg-chart-2/5"
		)}>
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-2">
					<div className="flex items-center gap-2">
						<Lightbulb className="w-4 h-4 text-chart-2" />
						<h4 className="font-medium text-foreground">{angle.title}</h4>
					</div>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8 shrink-0"
						onClick={onTogglePin}
					>
						{angle.isPinned ? (
							<Pin className="w-4 h-4 text-chart-2" />
						) : (
							<PinOff className="w-4 h-4 text-muted-foreground" />
						)}
					</Button>
				</div>
				<p className="text-sm text-muted-foreground mb-3">
					{angle.description}
				</p>
				{angle.suggestedFor && angle.suggestedFor.length > 0 && (
					<div className="flex flex-wrap gap-1 mb-3">
						{angle.suggestedFor.map((type) => (
							<Badge key={type} variant="secondary" className="text-xs">
								{type}
							</Badge>
						))}
					</div>
				)}
				<Button
					variant="outline"
					size="sm"
					className="w-full mt-2 border-chart-2/30 text-chart-2 hover:bg-chart-2/10 hover:text-chart-2"
					onClick={onCreateEssay}
				>
					<Plus className="w-3 h-3 mr-1" />
					{t("personaLab", "createEssayFromIdea")}
				</Button>
			</CardContent>
		</Card>
	);
}

function EmptyState() {
	const { t } = useTranslation();
	
	return (
		<div className="flex-1 flex items-center justify-center p-8">
			<div className="text-center max-w-md">
				<div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
					<Compass className="w-10 h-10 text-muted-foreground" />
				</div>
				<h3 className="text-xl font-semibold text-foreground mb-2">
					{t("personaLab", "noPersonaData")}
				</h3>
				<p className="text-muted-foreground mb-6">
					{t("personaLab", "completeOneTrack")}
				</p>
				<Button variant="outline" asChild>
					<a href="#" onClick={() => {
						// Switch to discovery tab
						const discoveryTab = document.querySelector('[value="discovery"]');
						if (discoveryTab) (discoveryTab as HTMLElement).click();
					}}>
						<Sparkles className="w-4 h-4 mr-2" />
						{t("personaLab", "startDiscovery")}
					</a>
				</Button>
			</div>
		</div>
	);
}

interface MyPersonaTabProps {
	onCreateEssayFromAngle?: (angleTitle: string, angleDescription: string, suggestedTypes?: string[]) => void;
	onRetakeQuiz?: () => void;
}

export function MyPersonaTab({ onCreateEssayFromAngle, onRetakeQuiz }: MyPersonaTabProps) {
	const { t } = useTranslation();
	const {
		personalityTags,
		keyStories,
		essayAngles,
		addPersonalityTag,
		removePersonalityTag,
		updatePersonalityTag,
		toggleStoryPin,
		toggleAnglePin,
		getCompletedTracks,
	} = usePersonaStore();

	const [newTagInput, setNewTagInput] = useState("");
	const [isAddingTag, setIsAddingTag] = useState(false);

	const completedTracks = getCompletedTracks();
	const hasData = completedTracks.length > 0 || personalityTags.length > 0;

	const handleAddTag = () => {
		if (newTagInput.trim()) {
			addPersonalityTag({
				label: newTagInput.trim(),
				source: "academic", // Default source
				isEditable: true,
			});
			setNewTagInput("");
			setIsAddingTag(false);
		}
	};

	const handleTagKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			handleAddTag();
		} else if (e.key === "Escape") {
			setNewTagInput("");
			setIsAddingTag(false);
		}
	};

	if (!hasData) {
		return <EmptyState />;
	}

	const pinnedStories = keyStories.filter((s) => s.isPinned);
	const unpinnedStories = keyStories.filter((s) => !s.isPinned);
	const pinnedAngles = essayAngles.filter((a) => a.isPinned);
	const unpinnedAngles = essayAngles.filter((a) => !a.isPinned);

	return (
		<ScrollArea className="flex-1">
			<div className="p-6 max-w-5xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex items-start justify-between">
					<div>
						<h2 className="text-2xl font-bold text-foreground mb-2">
							{t("personaLab", "myPersonaTitle")}
						</h2>
						<p className="text-muted-foreground">
							{t("personaLab", "myPersonaSubtitle")}
						</p>
					</div>
					{onRetakeQuiz && (
						<Button
							variant="outline"
							size="sm"
							onClick={onRetakeQuiz}
							className="shrink-0"
						>
							<RefreshCw className="w-4 h-4 mr-2" />
							{t("personaLab", "retakeQuiz")}
						</Button>
					)}
				</div>

				{/* Personality Tags Section */}
				<section className="space-y-4">
					<div className="flex items-center justify-between">
						<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
							<Tag className="w-5 h-5 text-primary" />
							{t("personaLab", "personalityTags")}
						</h3>
					</div>

					<Card>
						<CardContent className="p-6">
							<div className="flex flex-wrap gap-2">
								{personalityTags.map((tag) => (
									<motion.div
										key={tag.id}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
									>
										<EditableTag
											tag={tag}
											onUpdate={(label) => updatePersonalityTag(tag.id, label)}
											onRemove={() => removePersonalityTag(tag.id)}
										/>
									</motion.div>
								))}

								{/* Add Tag Button/Input */}
								{isAddingTag ? (
									<div className="flex items-center gap-1">
										<Input
											value={newTagInput}
											onChange={(e) => setNewTagInput(e.target.value)}
											onKeyDown={handleTagKeyDown}
											onBlur={() => {
												if (!newTagInput.trim()) setIsAddingTag(false);
											}}
											placeholder={t("personaLab", "enterTag")}
											className="h-8 w-32 text-sm"
											autoFocus
										/>
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8"
											onClick={handleAddTag}
										>
											<Check className="w-4 h-4" />
										</Button>
									</div>
								) : (
									<Button
										variant="outline"
										size="sm"
										className="h-8 border-dashed"
										onClick={() => setIsAddingTag(true)}
									>
										<Plus className="w-3 h-3 mr-1" />
										{t("personaLab", "addTag")}
									</Button>
								)}
							</div>

							{personalityTags.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-4">
									{t("personaLab", "completeDiscoveryForTags")}
								</p>
							)}
						</CardContent>
					</Card>
				</section>

				{/* Key Stories Section */}
				<section className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
						<BookOpen className="w-5 h-5 text-chart-4" />
						{t("personaLab", "keyStories")}
					</h3>

					{keyStories.length > 0 ? (
						<div className="space-y-4">
							{pinnedStories.length > 0 && (
								<div className="space-y-3">
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
										{t("personaLab", "pinned")}
									</p>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{pinnedStories.map((story) => (
											<StoryCard
												key={story.id}
												story={story}
												onTogglePin={() => toggleStoryPin(story.id)}
											/>
										))}
									</div>
								</div>
							)}

							{unpinnedStories.length > 0 && (
								<div className="space-y-3">
									{pinnedStories.length > 0 && (
										<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
											{t("personaLab", "other")}
										</p>
									)}
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{unpinnedStories.map((story) => (
											<StoryCard
												key={story.id}
												story={story}
												onTogglePin={() => toggleStoryPin(story.id)}
											/>
										))}
									</div>
								</div>
							)}
						</div>
					) : (
						<Card>
							<CardContent className="p-8 text-center">
								<BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
								<p className="text-muted-foreground">
									{t("personaLab", "storiesAppear")}
								</p>
							</CardContent>
						</Card>
					)}
				</section>

				{/* Essay Angles Section */}
				<section className="space-y-4">
					<h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
						<Lightbulb className="w-5 h-5 text-chart-2" />
						{t("personaLab", "essayAngles")}
					</h3>

					<div className="space-y-4">
						{pinnedAngles.length > 0 && (
							<div className="space-y-3">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
									{t("personaLab", "pinned")}
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{pinnedAngles.map((angle) => (
										<EssayAngleCard
											key={angle.id}
											angle={angle}
											onTogglePin={() => toggleAnglePin(angle.id)}
											onCreateEssay={() => onCreateEssayFromAngle?.(angle.title, angle.description, angle.suggestedFor)}
										/>
									))}
								</div>
							</div>
						)}

						{unpinnedAngles.length > 0 && (
							<div className="space-y-3">
								{pinnedAngles.length > 0 && (
									<p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
										{t("personaLab", "suggested")}
									</p>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{unpinnedAngles.map((angle) => (
										<EssayAngleCard
											key={angle.id}
											angle={angle}
											onTogglePin={() => toggleAnglePin(angle.id)}
											onCreateEssay={() => onCreateEssayFromAngle?.(angle.title, angle.description, angle.suggestedFor)}
										/>
									))}
								</div>
							</div>
						)}
					</div>
				</section>
			</div>
		</ScrollArea>
	);
}

