"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/Layout";
import {
	PageTransition,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { ResourceCard } from "@/components/ResourceCard";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { mockResources } from "@/lib/data/resources";
import { useApplicationsStore } from "@/lib/store/applicationsStore";

export default function ResourcesPage() {
	const t = useTranslations("resources");
	const { resources, setResources } = useApplicationsStore();
	const [searchQuery, setSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");

	useEffect(() => {
		if (resources.length === 0) {
			setResources(mockResources);
		}
	}, [resources.length, setResources]);

	const categories = Array.from(
		new Set(mockResources.map((r) => r.category)),
	).sort();

	const filteredResources = resources.filter((resource) => {
		const matchesSearch =
			resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			resource.summary.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || resource.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	return (
		<PageTransition>
			<PageContainer>
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-foreground mb-2">
						{t("title")}
					</h1>
					<p className="text-lg text-muted-foreground">{t("subtitle")}</p>
				</div>

				{/* Search and Filter */}
				<div className="flex flex-col md:flex-row gap-4 mb-8">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder={t("searchResources")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10"
						/>
					</div>
					<Select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="md:w-48"
					>
						<option value="all">{t("allCategories")}</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</Select>
				</div>

				{/* Results Count */}
				<p className="text-sm text-muted-foreground mb-6">
					{filteredResources.length}{" "}
					{filteredResources.length !== 1 ? t("resourcePlural") : t("resource")}{" "}
					{t("found")}
				</p>

				{/* Resources Grid */}
				<StaggerContainer>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredResources.map((resource) => (
							<StaggerItem key={resource.id}>
								<ResourceCard
									title={resource.title}
									summary={resource.summary}
									url={resource.url}
									type={resource.type}
									tags={resource.tags}
								/>
							</StaggerItem>
						))}
					</div>
				</StaggerContainer>

				{filteredResources.length === 0 && (
					<div className="text-center py-16">
						<Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-foreground mb-2">
							{t("noResourcesFound")}
						</h3>
						<p className="text-muted-foreground">{t("tryAdjustingFilters")}</p>
					</div>
				)}
			</PageContainer>
		</PageTransition>
	);
}
