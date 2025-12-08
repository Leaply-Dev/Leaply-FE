"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
	AlertCircle,
	CheckCircle,
	ChevronRight,
	Clock,
	Edit,
	FileText,
	GraduationCap,
	Loader2,
	MessageSquare,
	Plus,
	RefreshCw,
	Save,
	School,
	Search,
	Send,
	Sparkles,
	Trash2,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
	type Essay,
	type EssayFeedback,
	type EssayStatus,
	usePersonaStore,
} from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
	EssayStatus,
	{
		label: string;
		color: string;
		icon: React.ComponentType<{ className?: string }>;
	}
> = {
	draft: {
		label: "Bản nháp",
		color: "bg-muted text-muted-foreground",
		icon: Edit,
	},
	submitted: {
		label: "Đã gửi",
		color: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
		icon: Clock,
	},
	reviewed: {
		label: "Đã review",
		color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
		icon: CheckCircle,
	},
};

// Mock universities for demo
const UNIVERSITIES = [
	{ id: "stanford", name: "Stanford University" },
	{ id: "mit", name: "MIT" },
	{ id: "harvard", name: "Harvard University" },
	{ id: "yale", name: "Yale University" },
	{ id: "princeton", name: "Princeton University" },
	{ id: "columbia", name: "Columbia University" },
	{ id: "upenn", name: "University of Pennsylvania" },
	{ id: "caltech", name: "California Institute of Technology" },
	{ id: "duke", name: "Duke University" },
	{ id: "northwestern", name: "Northwestern University" },
];

// Essay types for higher education (graduate) applications
const ESSAY_TYPES = [
	"Personal Statement",
	"Why Us Essay",
	"Diversity Essay",
	"Research Statement",
];

function formatRelativeTime(
	timestamp: number,
	language: "en" | "vi" = "vi",
): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (language === "vi") {
		if (days > 0) return `${days} ngày trước`;
		if (hours > 0) return `${hours} giờ trước`;
		if (minutes > 0) return `${minutes} phút trước`;
		return "Vừa xong";
	} else {
		if (days > 0) return `${days}d ago`;
		if (hours > 0) return `${hours}h ago`;
		if (minutes > 0) return `${minutes}m ago`;
		return "Just now";
	}
}

interface EssaySidebarItemProps {
	essay: Essay;
	isActive: boolean;
	onClick: () => void;
}

function EssaySidebarItem({ essay, isActive, onClick }: EssaySidebarItemProps) {
	const { language } = useTranslation();
	const { t } = useTranslation();
	const statusLabel = t(
		"personaLab",
		`status${essay.status.charAt(0).toUpperCase() + essay.status.slice(1)}`,
	);
	const STATUS_CONFIG_TRANSLATED = {
		draft: {
			label: statusLabel,
			color: "bg-muted text-muted-foreground",
			icon: Edit,
		},
		submitted: {
			label: statusLabel,
			color:
				"bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
			icon: Clock,
		},
		reviewed: {
			label: statusLabel,
			color:
				"bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
			icon: CheckCircle,
		},
	};
	const status = STATUS_CONFIG_TRANSLATED[essay.status];

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"w-full text-left p-3 rounded-lg transition-all group",
				"hover:bg-muted/80",
				isActive && "bg-primary/10 border border-primary/20",
			)}
		>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"w-8 h-8 rounded-md flex items-center justify-center shrink-0",
						isActive ? "bg-primary/20" : "bg-muted",
					)}
				>
					<School
						className={cn(
							"w-4 h-4",
							isActive ? "text-primary" : "text-muted-foreground",
						)}
					/>
				</div>
				<div className="flex-1 min-w-0">
					<p
						className={cn(
							"font-medium text-sm truncate",
							isActive ? "text-primary" : "text-foreground",
						)}
					>
						{essay.schoolName}
					</p>
					<p className="text-xs text-muted-foreground truncate">
						{essay.essayType}
					</p>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs text-muted-foreground">
							{formatRelativeTime(essay.updatedAt, language)}
						</span>
						{essay.feedback.length > 0 && (
							<Badge variant="secondary" className="h-4 px-1 text-[10px]">
								<MessageSquare className="w-2.5 h-2.5 mr-0.5" />
								{essay.feedback.length}
							</Badge>
						)}
					</div>
				</div>
				<ChevronRight
					className={cn(
						"w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
						isActive && "opacity-100 text-primary",
					)}
				/>
			</div>
		</button>
	);
}

interface NewEssayDialogProps {
	onAdd: (
		essay: Omit<Essay, "id" | "createdAt" | "updatedAt" | "wordCount">,
	) => void;
	initialData?: {
		title?: string;
		description?: string;
		suggestedTypes?: string[];
	};
}

function NewEssayDialog({ onAdd, initialData }: NewEssayDialogProps) {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		schoolName: "",
		schoolId: "",
		essayType: initialData?.suggestedTypes?.[0] || "",
		prompt: initialData?.description || "",
		content: "",
		wordLimit: "",
	});

	// Update form when initialData changes
	useEffect(() => {
		if (initialData) {
			setFormData((prev) => ({
				...prev,
				essayType: initialData.suggestedTypes?.[0] || prev.essayType,
				prompt: initialData.description || prev.prompt,
			}));
			setOpen(true);
		}
	}, [initialData]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onAdd({
			schoolName: formData.schoolName,
			schoolId: formData.schoolId || undefined,
			essayType: formData.essayType,
			prompt: formData.prompt,
			content: formData.content,
			wordLimit: formData.wordLimit
				? parseInt(formData.wordLimit, 10)
				: undefined,
			status: "draft",
			feedback: [],
		});
		setFormData({
			schoolName: "",
			schoolId: "",
			essayType: "",
			prompt: "",
			content: "",
			wordLimit: "",
		});
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="w-full">
					<Plus className="w-4 h-4 mr-2" />
					{t("personaLab", "newEssay")}
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>{t("personaLab", "createNewEssay")}</DialogTitle>
					<DialogDescription>
						{t("personaLab", "selectSchoolAndType")}
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="schoolId">{t("personaLab", "university")}</Label>
						<Select
							id="schoolId"
							value={formData.schoolId}
							onChange={(e) => {
								const selected = UNIVERSITIES.find(
									(u) => u.id === e.target.value,
								);
								setFormData({
									...formData,
									schoolId: e.target.value,
									schoolName: selected?.name || "",
								});
							}}
							required
						>
							<option value="">{t("personaLab", "selectSchool")}</option>
							{UNIVERSITIES.map((uni) => (
								<option key={uni.id} value={uni.id}>
									{uni.name}
								</option>
							))}
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="essayType">{t("personaLab", "essayType")}</Label>
						<Select
							id="essayType"
							value={formData.essayType}
							onChange={(e) =>
								setFormData({ ...formData, essayType: e.target.value })
							}
							required
						>
							<option value="">{t("personaLab", "selectType")}</option>
							{ESSAY_TYPES.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="prompt">{t("personaLab", "essayPrompt")}</Label>
						<Textarea
							id="prompt"
							value={formData.prompt}
							onChange={(e) =>
								setFormData({ ...formData, prompt: e.target.value })
							}
							placeholder={t("personaLab", "enterPrompt")}
							rows={3}
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="wordLimit">{t("personaLab", "wordLimit")}</Label>
						<Select
							id="wordLimit"
							value={formData.wordLimit}
							onChange={(e) =>
								setFormData({ ...formData, wordLimit: e.target.value })
							}
						>
							<option value="">{t("personaLab", "selectWordLimit")}</option>
							<option value="150">150 {t("personaLab", "words")}</option>
							<option value="200">200 {t("personaLab", "words")}</option>
							<option value="250">250 {t("personaLab", "words")}</option>
							<option value="300">300 {t("personaLab", "words")}</option>
							<option value="350">350 {t("personaLab", "words")}</option>
							<option value="400">400 {t("personaLab", "words")}</option>
							<option value="500">500 {t("personaLab", "words")}</option>
							<option value="650">650 {t("personaLab", "words")}</option>
							<option value="800">800 {t("personaLab", "words")}</option>
							<option value="1000">1000 {t("personaLab", "words")}</option>
						</Select>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							{t("personaLab", "cancel")}
						</Button>
						<Button
							type="submit"
							disabled={
								!formData.schoolId || !formData.essayType || !formData.prompt
							}
						>
							{t("personaLab", "createEssay")}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface EssayEditorProps {
	essay: Essay;
	onUpdate: (updates: Partial<Essay>) => void;
	onDelete: () => void;
}

function EssayEditor({ essay, onUpdate, onDelete }: EssayEditorProps) {
	const { t } = useTranslation();
	const { addFeedback } = usePersonaStore();
	const [content, setContent] = useState(essay.content);
	const [isSaving, setIsSaving] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [isSyncing, setIsSyncing] = useState(false);
	const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);

	const wordCount = content.split(/\s+/).filter(Boolean).length;
	const statusLabel = t(
		"personaLab",
		`status${essay.status.charAt(0).toUpperCase() + essay.status.slice(1)}`,
	);
	const STATUS_CONFIG_TRANSLATED = {
		draft: {
			label: statusLabel,
			color: "bg-muted text-muted-foreground",
			icon: Edit,
		},
		submitted: {
			label: statusLabel,
			color:
				"bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
			icon: Clock,
		},
		reviewed: {
			label: statusLabel,
			color:
				"bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
			icon: CheckCircle,
		},
	};
	const status = STATUS_CONFIG_TRANSLATED[essay.status];
	const StatusIcon = status.icon;

	useEffect(() => {
		setContent(essay.content);
		setHasChanges(false);
	}, [essay.id, essay.content]);

	const handleContentChange = (value: string) => {
		setContent(value);
		setHasChanges(value !== essay.content);
	};

	const handleSave = () => {
		setIsSaving(true);
		setTimeout(() => {
			onUpdate({ content });
			setHasChanges(false);
			setIsSaving(false);
		}, 300);
	};

	const handleSubmit = () => {
		onUpdate({ content, status: "submitted" });
		setHasChanges(false);
	};

	// Fake sync from Google Docs
	const handleSyncFromGoogleDocs = () => {
		setIsSyncing(true);
		// Simulate API call delay
		setTimeout(() => {
			setIsSyncing(false);
			// Show a toast or notification that sync was successful
			alert("Synced successfully from Google Docs! (Demo)");
		}, 2000);
	};

	// Fake AI feedback generation
	const handleGetAIFeedback = () => {
		setIsGeneratingFeedback(true);
		// Simulate AI processing delay
		setTimeout(() => {
			// Add fake feedback
			const fakeFeedbacks = [
				{
					observation:
						"Your essay has a strong opening that draws the reader in, but the middle section could benefit from more specific examples.",
					recommendation:
						"Consider adding concrete details about your experiences - dates, names, and measurable outcomes help make your story more compelling.",
				},
				{
					observation:
						"The transition between paragraphs 2 and 3 feels abrupt. The reader needs a clearer connection between your initial challenge and your solution.",
					recommendation:
						"Add a transition sentence that explicitly connects your emotional response to the problem with your decision to take action.",
				},
				{
					observation:
						"The conclusion effectively ties back to the university, but could be more specific about programs or opportunities.",
					recommendation:
						"Research specific courses, labs, or professors at the target school and mention them by name to demonstrate genuine interest and fit.",
				},
			];

			// Randomly pick one feedback
			const randomFeedback =
				fakeFeedbacks[Math.floor(Math.random() * fakeFeedbacks.length)];
			addFeedback(essay.id, randomFeedback);
			setIsGeneratingFeedback(false);
		}, 3000);
	};

	return (
		<div className="flex-1 flex flex-col h-full">
			{/* Header */}
			<div className="border-b border-border p-4 bg-card/50 shrink-0">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
							<GraduationCap className="w-5 h-5 text-primary" />
						</div>
						<div>
							<h2 className="font-semibold text-foreground">
								{essay.schoolName}
							</h2>
							<p className="text-sm text-muted-foreground">{essay.essayType}</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleSyncFromGoogleDocs}
							disabled={isSyncing}
							className="text-xs"
						>
							{isSyncing ? (
								<Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
							) : (
								<RefreshCw className="w-3.5 h-3.5 mr-1.5" />
							)}
							{isSyncing ? "Syncing..." : "Sync from Google Docs"}
						</Button>
						<Badge className={cn("text-xs", status.color)}>
							<StatusIcon className="w-3 h-3 mr-1" />
							{status.label}
						</Badge>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
							onClick={onDelete}
						>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>

				{/* Prompt */}
				<div className="bg-muted/50 rounded-lg p-3">
					<p className="text-sm text-muted-foreground font-medium mb-1">
						{t("personaLab", "prompt")}:
					</p>
					<p className="text-sm text-foreground">{essay.prompt}</p>
				</div>
			</div>

			{/* Editor */}
			<div className="flex-1 flex overflow-hidden">
				<div className="flex-1 flex flex-col min-w-0">
					<ScrollArea className="flex-1">
						<div className="p-6">
							<Textarea
								value={content}
								onChange={(e) => handleContentChange(e.target.value)}
								placeholder={t("personaLab", "startWriting")}
								className="min-h-[400px] bg-card text-base leading-relaxed resize-none focus-visible:ring-0"
							/>
						</div>
					</ScrollArea>

					{/* Footer */}
					<div className="border-t border-border p-4 bg-card/50 shrink-0">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4 text-sm text-muted-foreground">
								<span>
									{wordCount}
									{essay.wordLimit ? ` / ${essay.wordLimit}` : ""}{" "}
									{t("personaLab", "words")}
								</span>
								{hasChanges && (
									<span className="text-amber-600 flex items-center gap-1">
										<Edit className="w-3 h-3" />
										{t("personaLab", "unsaved")}
									</span>
								)}
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={handleSave}
									disabled={!hasChanges || isSaving}
								>
									<Save className="w-4 h-4 mr-1" />
									{isSaving
										? t("personaLab", "saving")
										: t("personaLab", "save")}
								</Button>
								{essay.status === "draft" && content && (
									<Button size="sm" onClick={handleSubmit}>
										<Send className="w-4 h-4 mr-1" />
										{t("personaLab", "submitForReview")}
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Feedback Panel */}
				<div className="w-80 border-l border-border bg-card/30 hidden lg:flex flex-col shrink-0">
					<div className="border-b border-border p-4">
						<div className="flex items-center justify-between mb-1">
							<h3 className="font-semibold text-foreground flex items-center gap-2">
								<MessageSquare className="w-4 h-4 text-chart-2" />
								{t("personaLab", "feedback")}
							</h3>
							<Button
								variant="outline"
								size="sm"
								onClick={handleGetAIFeedback}
								disabled={isGeneratingFeedback || !content}
								className="text-xs h-7"
							>
								{isGeneratingFeedback ? (
									<Loader2 className="w-3 h-3 mr-1 animate-spin" />
								) : (
									<Sparkles className="w-3 h-3 mr-1" />
								)}
								{isGeneratingFeedback ? "Analyzing..." : "Get AI Feedback"}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							{t("personaLab", "feedbackFromMentor")}
						</p>
					</div>

					<ScrollArea className="flex-1 p-4">
						{essay.feedback.length > 0 ? (
							<div className="space-y-4">
								{essay.feedback.map((fb) => (
									<FeedbackCard key={fb.id} feedback={fb} />
								))}
							</div>
						) : (
							<div className="text-center py-8">
								<MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
								<p className="text-muted-foreground text-sm mb-2">
									{t("personaLab", "noFeedback")}
								</p>
								<p className="text-xs text-muted-foreground">
									{t("personaLab", "submitToGetFeedback")}
								</p>
							</div>
						)}
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}

interface FeedbackCardProps {
	feedback: EssayFeedback;
}

function FeedbackCard({ feedback }: FeedbackCardProps) {
	const { t, language } = useTranslation();

	return (
		<Card className="bg-card">
			<CardContent className="p-3 space-y-2">
				<div>
					<p className="text-xs font-medium text-amber-600 flex items-center gap-1 mb-1">
						<AlertCircle className="w-3 h-3" />
						{t("personaLab", "observation")}
					</p>
					<p className="text-sm text-muted-foreground">
						{feedback.observation}
					</p>
				</div>
				<div>
					<p className="text-xs font-medium text-green-600 flex items-center gap-1 mb-1">
						<CheckCircle className="w-3 h-3" />
						{t("personaLab", "recommendation")}
					</p>
					<p className="text-sm text-muted-foreground">
						{feedback.recommendation}
					</p>
				</div>
				<p className="text-[10px] text-muted-foreground pt-1">
					{formatRelativeTime(feedback.timestamp, language)}
				</p>
			</CardContent>
		</Card>
	);
}

function EmptyState() {
	const { t } = useTranslation();

	return (
		<div className="flex-1 flex items-center justify-center p-8">
			<div className="text-center max-w-sm">
				<div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
					<FileText className="w-8 h-8 text-muted-foreground" />
				</div>
				<h3 className="text-lg font-semibold text-foreground mb-2">
					{t("personaLab", "selectEssayToStart")}
				</h3>
				<p className="text-muted-foreground text-sm">
					{t("personaLab", "selectFromList")}
				</p>
			</div>
		</div>
	);
}

interface EssaysTabProps {
	initialEssayData?: {
		title?: string;
		description?: string;
		suggestedTypes?: string[];
	};
}

export function EssaysTab({ initialEssayData }: EssaysTabProps) {
	const { t } = useTranslation();
	const {
		essays,
		selectedEssayId,
		addEssay,
		updateEssay,
		deleteEssay,
		setSelectedEssay,
	} = usePersonaStore();

	const [searchQuery, setSearchQuery] = useState("");

	const selectedEssay = essays.find((e) => e.id === selectedEssayId);

	// Filter essays by search
	const filteredEssays = essays.filter(
		(essay) =>
			essay.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			essay.essayType.toLowerCase().includes(searchQuery.toLowerCase()),
	);

	// Group essays by school
	const essaysBySchool = filteredEssays.reduce(
		(acc, essay) => {
			if (!acc[essay.schoolName]) {
				acc[essay.schoolName] = [];
			}
			acc[essay.schoolName].push(essay);
			return acc;
		},
		{} as Record<string, Essay[]>,
	);

	const handleAddEssay = (
		essay: Omit<Essay, "id" | "createdAt" | "updatedAt" | "wordCount">,
	) => {
		addEssay(essay);
	};

	return (
		<div className="flex-1 flex h-full min-h-0 overflow-hidden">
			{/* Sidebar - Essay List */}
			<div className="w-72 border-r border-border bg-card/30 flex flex-col shrink-0">
				{/* Sidebar Header */}
				<div className="p-4 border-b border-border space-y-3">
					<NewEssayDialog
						onAdd={handleAddEssay}
						initialData={initialEssayData}
					/>

					{essays.length > 0 && (
						<div className="relative">
							<Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
							<Input
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("personaLab", "searchEssay")}
								className="pl-9 h-9"
							/>
						</div>
					)}
				</div>

				{/* Essay List */}
				<ScrollArea className="flex-1">
					<div className="p-2">
						{essays.length === 0 ? (
							<div className="text-center py-8 px-4">
								<FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
								<p className="text-sm text-muted-foreground">
									{t("personaLab", "noEssays")}
								</p>
							</div>
						) : filteredEssays.length === 0 ? (
							<div className="text-center py-8 px-4">
								<Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
								<p className="text-sm text-muted-foreground">
									{t("personaLab", "noEssayFound")}
								</p>
							</div>
						) : (
							<div className="space-y-4">
								{Object.entries(essaysBySchool).map(
									([schoolName, schoolEssays]) => (
										<div key={schoolName}>
											<p className="text-xs font-medium text-muted-foreground px-3 mb-2 flex items-center gap-1">
												<School className="w-3 h-3" />
												{schoolName}
											</p>
											<div className="space-y-1">
												{schoolEssays.map((essay) => (
													<EssaySidebarItem
														key={essay.id}
														essay={essay}
														isActive={essay.id === selectedEssayId}
														onClick={() => setSelectedEssay(essay.id)}
													/>
												))}
											</div>
										</div>
									),
								)}
							</div>
						)}
					</div>
				</ScrollArea>

				{/* Stats */}
				{essays.length > 0 && (
					<div className="border-t border-border p-4">
						<div className="grid grid-cols-3 gap-2 text-center">
							<div>
								<p className="text-lg font-bold text-foreground">
									{essays.length}
								</p>
								<p className="text-[10px] text-muted-foreground">
									{t("personaLab", "total")}
								</p>
							</div>
							<div>
								<p className="text-lg font-bold text-green-600">
									{essays.filter((e) => e.status === "reviewed").length}
								</p>
								<p className="text-[10px] text-muted-foreground">
									{t("personaLab", "reviewed")}
								</p>
							</div>
							<div>
								<p className="text-lg font-bold text-amber-600">
									{essays.filter((e) => e.status === "submitted").length}
								</p>
								<p className="text-[10px] text-muted-foreground">
									{t("personaLab", "pending")}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Main Content - Essay Editor */}
			{selectedEssay ? (
				<EssayEditor
					essay={selectedEssay}
					onUpdate={(updates) => updateEssay(selectedEssay.id, updates)}
					onDelete={() => {
						deleteEssay(selectedEssay.id);
						setSelectedEssay(null);
					}}
				/>
			) : (
				<EmptyState />
			)}
		</div>
	);
}
