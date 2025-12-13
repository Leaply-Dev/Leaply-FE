"use client";

import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/Layout";
import { PageTransition } from "@/components/PageTransition";
import { TaskItem } from "@/components/TaskItem";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { mockTasks } from "@/lib/data/applications";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

export default function TasksPage() {
	const { t } = useTranslation();
	const { tasks, setTasks, toggleTaskComplete } = useApplicationsStore();
	const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
	const [sortBy, setSortBy] = useState<"dueDate" | "priority">("dueDate");

	useEffect(() => {
		if (tasks.length === 0) {
			setTasks(mockTasks);
		}
	}, [tasks.length, setTasks]);

	const filteredTasks = tasks.filter((task) => {
		if (filter === "pending") return !task.completed;
		if (filter === "completed") return task.completed;
		return true;
	});

	const sortedTasks = [...filteredTasks].sort((a, b) => {
		if (sortBy === "dueDate") {
			return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
		} else {
			const priorityOrder = { high: 0, medium: 1, low: 2 };
			return (
				(priorityOrder[a.priority || "medium"] || 1) -
				(priorityOrder[b.priority || "medium"] || 1)
			);
		}
	});

	return (
		<PageTransition>
			<PageContainer>
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-foreground mb-2">
							{t("tasks", "title")}
						</h1>
						<p className="text-lg text-muted-foreground">
							{t("tasks", "subtitle")}
						</p>
					</div>
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						{t("tasks", "addTask")}
					</Button>
				</div>

				{/* Filters */}
				<div className="flex flex-wrap items-center gap-4 mb-6">
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{t("tasks", "show")}
						</span>
						<Select
							value={filter}
							onChange={(e) =>
								setFilter(e.target.value as "all" | "pending" | "completed")
							}
							className="w-40"
						>
							<option value="all">{t("tasks", "allTasks")}</option>
							<option value="pending">{t("tasks", "pending")}</option>
							<option value="completed">{t("tasks", "completed")}</option>
						</Select>
					</div>

					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{t("tasks", "sortBy")}
						</span>
						<Select
							value={sortBy}
							onChange={(e) =>
								setSortBy(e.target.value as "dueDate" | "priority")
							}
							className="w-40"
						>
							<option value="dueDate">{t("tasks", "dueDate")}</option>
							<option value="priority">{t("tasks", "priority")}</option>
						</Select>
					</div>

					<span className="text-sm text-muted-foreground ml-auto">
						{sortedTasks.length}{" "}
						{sortedTasks.length !== 1
							? t("tasks", "taskPlural")
							: t("tasks", "task")}
					</span>
				</div>

				{/* Tasks List */}
				{sortedTasks.length > 0 ? (
					<div className="space-y-3">
						{sortedTasks.map((task) => (
							<TaskItem
								key={task.id}
								id={task.id}
								title={task.title}
								description={task.description}
								dueDate={task.dueDate}
								completed={task.completed}
								priority={task.priority}
								onToggle={toggleTaskComplete}
							/>
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<h3 className="text-xl font-semibold text-foreground mb-2">
							{t("tasks", "noTasksFound")}
						</h3>
						<p className="text-muted-foreground mb-6">
							{filter === "completed"
								? t("tasks", "noCompletedTasks")
								: filter === "pending"
									? t("tasks", "noPendingTasks")
									: t("tasks", "startByAdding")}
						</p>
						{filter === "all" && (
							<Button>
								<Plus className="w-4 h-4 mr-2" />
								{t("tasks", "addYourFirstTask")}
							</Button>
						)}
					</div>
				)}
			</PageContainer>
		</PageTransition>
	);
}
