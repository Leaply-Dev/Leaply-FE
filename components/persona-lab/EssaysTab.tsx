"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	FileText,
	Plus,
	ArrowLeft,
	Upload,
	Clock,
	MessageSquare,
	CheckCircle,
	AlertCircle,
	Edit,
	Trash2,
	School,
	ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	usePersonaStore,
	type Essay,
	type EssayStatus,
	type EssayFeedback,
} from "@/lib/store/personaStore";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<EssayStatus, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
	draft: {
		label: "Bản nháp",
		color: "bg-muted text-muted-foreground",
		icon: Edit,
	},
	submitted: {
		label: "Đã gửi",
		color: "bg-amber-100 text-amber-700",
		icon: Clock,
	},
	reviewed: {
		label: "Đã review",
		color: "bg-green-100 text-green-700",
		icon: CheckCircle,
	},
};

function formatDate(timestamp: number): string {
	return new Date(timestamp).toLocaleDateString("vi-VN", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

function formatRelativeTime(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60000);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days} ngày trước`;
	if (hours > 0) return `${hours} giờ trước`;
	if (minutes > 0) return `${minutes} phút trước`;
	return "Vừa xong";
}

interface EssayCardProps {
	essay: Essay;
	onClick: () => void;
}

function EssayCard({ essay, onClick }: EssayCardProps) {
	const status = STATUS_CONFIG[essay.status];
	const StatusIcon = status.icon;

	return (
		<Card
			className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
			onClick={onClick}
		>
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-3">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
							<School className="w-5 h-5 text-primary" />
						</div>
						<div>
							<h4 className="font-medium text-foreground">{essay.schoolName}</h4>
							<p className="text-sm text-muted-foreground">{essay.essayType}</p>
						</div>
					</div>
					<Badge className={cn("text-xs", status.color)}>
						<StatusIcon className="w-3 h-3 mr-1" />
						{status.label}
					</Badge>
				</div>

				<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
					{essay.prompt}
				</p>

				<div className="flex items-center justify-between text-xs text-muted-foreground">
					<div className="flex items-center gap-4">
						<span className="flex items-center gap-1">
							<Clock className="w-3 h-3" />
							{formatRelativeTime(essay.updatedAt)}
						</span>
						<span>
							{essay.wordCount}{essay.wordLimit ? ` / ${essay.wordLimit}` : ""} từ
						</span>
					</div>
					{essay.feedback.length > 0 && (
						<span className="flex items-center gap-1 text-chart-2">
							<MessageSquare className="w-3 h-3" />
							{essay.feedback.length} feedback
						</span>
					)}
				</div>

				<ChevronRight className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
			</CardContent>
		</Card>
	);
}

interface NewEssayDialogProps {
	onAdd: (essay: Omit<Essay, "id" | "createdAt" | "updatedAt" | "wordCount">) => void;
}

function NewEssayDialog({ onAdd }: NewEssayDialogProps) {
	const [open, setOpen] = useState(false);
	const [formData, setFormData] = useState({
		schoolName: "",
		essayType: "",
		prompt: "",
		content: "",
		wordLimit: "",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onAdd({
			schoolName: formData.schoolName,
			essayType: formData.essayType,
			prompt: formData.prompt,
			content: formData.content,
			wordLimit: formData.wordLimit ? parseInt(formData.wordLimit, 10) : undefined,
			status: "draft",
			feedback: [],
		});
		setFormData({ schoolName: "", essayType: "", prompt: "", content: "", wordLimit: "" });
		setOpen(false);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>
					<Plus className="w-4 h-4 mr-2" />
					Thêm essay
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Thêm essay mới</DialogTitle>
					<DialogDescription>
						Thêm essay để nhận feedback từ Leaply mentor
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="schoolName">Trường</Label>
							<Input
								id="schoolName"
								value={formData.schoolName}
								onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
								placeholder="VD: Stanford University"
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="essayType">Loại essay</Label>
							<Select
								id="essayType"
								value={formData.essayType}
								onChange={(e) => setFormData({ ...formData, essayType: e.target.value })}
								required
							>
								<option value="">Chọn loại</option>
								<option value="Personal Statement">Personal Statement</option>
								<option value="Common App Essay">Common App Essay</option>
								<option value="Why Us Essay">Why Us Essay</option>
								<option value="Supplemental Essay">Supplemental Essay</option>
								<option value="Diversity Essay">Diversity Essay</option>
								<option value="Activity Essay">Activity Essay</option>
								<option value="Other">Khác</option>
							</Select>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="prompt">Essay prompt</Label>
						<Textarea
							id="prompt"
							value={formData.prompt}
							onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
							placeholder="Nhập câu hỏi / prompt của essay..."
							rows={2}
							required
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="content">Nội dung essay</Label>
							<span className="text-xs text-muted-foreground">
								{formData.wordLimit && `Giới hạn: ${formData.wordLimit} từ`}
							</span>
						</div>
						<Textarea
							id="content"
							value={formData.content}
							onChange={(e) => setFormData({ ...formData, content: e.target.value })}
							placeholder="Paste nội dung essay của bạn ở đây..."
							rows={6}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="wordLimit">Giới hạn từ (không bắt buộc)</Label>
						<Input
							id="wordLimit"
							type="number"
							value={formData.wordLimit}
							onChange={(e) => setFormData({ ...formData, wordLimit: e.target.value })}
							placeholder="VD: 650"
						/>
					</div>

					<div className="flex justify-end gap-3 pt-4">
						<Button type="button" variant="outline" onClick={() => setOpen(false)}>
							Hủy
						</Button>
						<Button type="submit" disabled={!formData.schoolName || !formData.essayType || !formData.prompt}>
							Thêm essay
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

interface EssayDetailViewProps {
	essay: Essay;
	onBack: () => void;
	onUpdate: (updates: Partial<Essay>) => void;
	onDelete: () => void;
}

function EssayDetailView({ essay, onBack, onUpdate, onDelete }: EssayDetailViewProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(essay.content);

	const handleSave = () => {
		onUpdate({ content: editedContent });
		setIsEditing(false);
	};

	const status = STATUS_CONFIG[essay.status];
	const StatusIcon = status.icon;

	return (
		<div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
			{/* Left Panel - Essay Content */}
			<div className="flex-1 flex flex-col border-r border-border">
				{/* Header */}
				<div className="border-b border-border p-4 bg-card/50">
					<div className="flex items-center justify-between mb-3">
						<button
							onClick={onBack}
							className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
						>
							<ArrowLeft className="w-4 h-4" />
							Quay lại
						</button>
						<div className="flex items-center gap-2">
							<Badge className={cn("text-xs", status.color)}>
								<StatusIcon className="w-3 h-3 mr-1" />
								{status.label}
							</Badge>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8 text-destructive hover:text-destructive"
								onClick={onDelete}
							>
								<Trash2 className="w-4 h-4" />
							</Button>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
							<School className="w-6 h-6 text-primary" />
						</div>
						<div>
							<h2 className="text-lg font-semibold text-foreground">{essay.schoolName}</h2>
							<p className="text-sm text-muted-foreground">{essay.essayType}</p>
						</div>
					</div>
				</div>

				{/* Essay Content */}
				<ScrollArea className="flex-1 p-6">
					<div className="max-w-2xl mx-auto space-y-6">
						<div className="bg-muted/50 rounded-lg p-4">
							<h3 className="text-sm font-medium text-foreground mb-2">Prompt</h3>
							<p className="text-muted-foreground">{essay.prompt}</p>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="text-sm font-medium text-foreground">Nội dung</h3>
								<div className="flex items-center gap-2">
									<span className="text-xs text-muted-foreground">
										{essay.wordCount}{essay.wordLimit ? ` / ${essay.wordLimit}` : ""} từ
									</span>
									{!isEditing ? (
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsEditing(true)}
										>
											<Edit className="w-3 h-3 mr-1" />
											Chỉnh sửa
										</Button>
									) : (
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setEditedContent(essay.content);
													setIsEditing(false);
												}}
											>
												Hủy
											</Button>
											<Button size="sm" onClick={handleSave}>
												Lưu
											</Button>
										</div>
									)}
								</div>
							</div>

							{isEditing ? (
								<Textarea
									value={editedContent}
									onChange={(e) => setEditedContent(e.target.value)}
									className="min-h-[400px] text-base leading-relaxed"
								/>
							) : (
								<div className="prose prose-sm max-w-none">
									{essay.content ? (
										<p className="whitespace-pre-wrap text-foreground leading-relaxed">
											{essay.content}
										</p>
									) : (
										<div className="text-center py-12 text-muted-foreground">
											<FileText className="w-10 h-10 mx-auto mb-3" />
											<p>Chưa có nội dung essay</p>
											<Button
												variant="outline"
												size="sm"
												className="mt-4"
												onClick={() => setIsEditing(true)}
											>
												<Upload className="w-3 h-3 mr-1" />
												Thêm nội dung
											</Button>
										</div>
									)}
								</div>
							)}
						</div>

						<div className="text-xs text-muted-foreground pt-4 border-t border-border">
							Cập nhật lần cuối: {formatDate(essay.updatedAt)}
						</div>
					</div>
				</ScrollArea>
			</div>

			{/* Right Panel - Feedback */}
			<div className="w-full lg:w-96 flex flex-col bg-card/30">
				<div className="border-b border-border p-4">
					<h3 className="font-semibold text-foreground flex items-center gap-2">
						<MessageSquare className="w-4 h-4 text-chart-2" />
						Mentor Feedback
					</h3>
					<p className="text-xs text-muted-foreground mt-1">
						Góp ý từ Leaply mentor
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
						<div className="text-center py-12">
							<MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
							<p className="text-muted-foreground text-sm mb-4">
								Chưa có feedback
							</p>
							<p className="text-xs text-muted-foreground">
								Submit essay để nhận góp ý từ Leaply mentor
							</p>
						</div>
					)}
				</ScrollArea>

				{essay.status === "draft" && essay.content && (
					<div className="border-t border-border p-4">
						<Button
							className="w-full"
							onClick={() => onUpdate({ status: "submitted" })}
						>
							<Upload className="w-4 h-4 mr-2" />
							Gửi để nhận feedback
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}

interface FeedbackCardProps {
	feedback: EssayFeedback;
}

function FeedbackCard({ feedback }: FeedbackCardProps) {
	return (
		<Card>
			<CardContent className="p-4 space-y-3">
				<div>
					<h4 className="text-sm font-medium text-foreground flex items-center gap-2">
						<AlertCircle className="w-4 h-4 text-amber-500" />
						Quan sát
					</h4>
					<p className="text-sm text-muted-foreground mt-1">{feedback.observation}</p>
				</div>
				<div>
					<h4 className="text-sm font-medium text-foreground flex items-center gap-2">
						<CheckCircle className="w-4 h-4 text-green-500" />
						Gợi ý
					</h4>
					<p className="text-sm text-muted-foreground mt-1">{feedback.recommendation}</p>
				</div>
				<div className="text-xs text-muted-foreground pt-2 border-t border-border">
					{formatRelativeTime(feedback.timestamp)}
				</div>
			</CardContent>
		</Card>
	);
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
	return (
		<div className="flex-1 flex items-center justify-center p-8">
			<div className="text-center max-w-md">
				<div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
					<FileText className="w-10 h-10 text-muted-foreground" />
				</div>
				<h3 className="text-xl font-semibold text-foreground mb-2">
					Chưa có essay nào
				</h3>
				<p className="text-muted-foreground mb-6">
					Thêm essay của bạn để nhận feedback và góp ý từ Leaply mentor.
					Chúng tôi sẽ giúp bạn cải thiện và hoàn thiện essay.
				</p>
				<NewEssayDialog onAdd={(essay) => {
					// This will be handled by the parent
				}} />
			</div>
		</div>
	);
}

export function EssaysTab() {
	const {
		essays,
		selectedEssayId,
		addEssay,
		updateEssay,
		deleteEssay,
		setSelectedEssay,
	} = usePersonaStore();

	const selectedEssay = essays.find((e) => e.id === selectedEssayId);

	const handleAddEssay = (essay: Omit<Essay, "id" | "createdAt" | "updatedAt" | "wordCount">) => {
		addEssay(essay);
	};

	if (selectedEssay) {
		return (
			<EssayDetailView
				essay={selectedEssay}
				onBack={() => setSelectedEssay(null)}
				onUpdate={(updates) => updateEssay(selectedEssay.id, updates)}
				onDelete={() => {
					deleteEssay(selectedEssay.id);
					setSelectedEssay(null);
				}}
			/>
		);
	}

	if (essays.length === 0) {
		return (
			<div className="flex-1 flex items-center justify-center p-8">
				<div className="text-center max-w-md">
					<div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
						<FileText className="w-10 h-10 text-muted-foreground" />
					</div>
					<h3 className="text-xl font-semibold text-foreground mb-2">
						Chưa có essay nào
					</h3>
					<p className="text-muted-foreground mb-6">
						Thêm essay của bạn để nhận feedback và góp ý từ Leaply mentor.
						Chúng tôi sẽ giúp bạn cải thiện và hoàn thiện essay.
					</p>
					<NewEssayDialog onAdd={handleAddEssay} />
				</div>
			</div>
		);
	}

	// Group essays by school
	const essaysBySchool = essays.reduce((acc, essay) => {
		if (!acc[essay.schoolName]) {
			acc[essay.schoolName] = [];
		}
		acc[essay.schoolName].push(essay);
		return acc;
	}, {} as Record<string, Essay[]>);

	return (
		<ScrollArea className="flex-1">
			<div className="p-6 max-w-5xl mx-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-foreground mb-2">
							Essays
						</h2>
						<p className="text-muted-foreground">
							Quản lý và nhận feedback cho essay của bạn
						</p>
					</div>
					<NewEssayDialog onAdd={handleAddEssay} />
				</div>

				{/* Stats */}
				<div className="grid grid-cols-3 gap-4 mb-8">
					<Card>
						<CardContent className="p-4 text-center">
							<p className="text-2xl font-bold text-foreground">{essays.length}</p>
							<p className="text-sm text-muted-foreground">Tổng essays</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<p className="text-2xl font-bold text-chart-2">
								{essays.filter((e) => e.status === "reviewed").length}
							</p>
							<p className="text-sm text-muted-foreground">Đã review</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4 text-center">
							<p className="text-2xl font-bold text-amber-600">
								{essays.filter((e) => e.status === "submitted").length}
							</p>
							<p className="text-sm text-muted-foreground">Đang chờ</p>
						</CardContent>
					</Card>
				</div>

				{/* Essays by School */}
				<div className="space-y-8">
					{Object.entries(essaysBySchool).map(([schoolName, schoolEssays]) => (
						<div key={schoolName}>
							<h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
								<School className="w-5 h-5 text-primary" />
								{schoolName}
								<Badge variant="secondary" className="ml-2">
									{schoolEssays.length}
								</Badge>
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{schoolEssays.map((essay) => (
									<EssayCard
										key={essay.id}
										essay={essay}
										onClick={() => setSelectedEssay(essay.id)}
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</ScrollArea>
	);
}

