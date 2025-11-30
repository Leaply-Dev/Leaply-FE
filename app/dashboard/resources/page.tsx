"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ResourceCard } from "@/components/ResourceCard";
import { PageContainer } from "@/components/Layout";
import { useApplicationsStore } from "@/lib/store/applicationsStore";
import { mockResources } from "@/lib/data/resources";
import {
	PageTransition,
	StaggerContainer,
	StaggerItem,
} from "@/components/PageTransition";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ResourcesPage() {
	const { t } = useTranslation();
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
					<h1 className="text-3xl font-bold text-foreground mb-2">{t("resources", "title")}</h1>
					<p className="text-lg text-muted-foreground">
						{t("resources", "subtitle")}
					</p>
				</div>

				{/* Search and Filter */}
				<div className="flex flex-col md:flex-row gap-4 mb-8">
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
						<Input
							type="text"
							placeholder={t("resources", "searchResources")}
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
						<option value="all">{t("resources", "allCategories")}</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</Select>
				</div>

				{/* Results Count */}
				<p className="text-sm text-muted-foreground mb-6">
					{filteredResources.length} {filteredResources.length !== 1 ? t("resources", "resourcePlural") : t("resources", "resource")} {t("resources", "found")}
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
							{t("resources", "noResourcesFound")}
						</h3>
						<p className="text-muted-foreground">
							{t("resources", "tryAdjustingFilters")}
						</p>
					</div>
				)}
			</PageContainer>
		</PageTransition>
	);
}
