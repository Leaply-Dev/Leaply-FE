import { create } from "zustand";

export interface University {
	id: string;
	name: string;
	country: string;
	region: string;
	city: string;
	ranking: number;
	logo: string;
	averageTuition: number;
	overview: string;
	foundingYear?: number;
	type?: "public" | "private";
	websiteUrl?: string;
	acceptanceRate?: number;
	programs?: Program[];
	scholarships?: Scholarship[];
	applicationRequirements?: ApplicationRequirement[];
	reviews?: Review[];
}

export interface Program {
	id: string;
	name: string;
	level: "bachelor" | "master" | "phd";
	duration: string;
	tuition: number;
	requirements?: string[];
}

export interface Scholarship {
	id: string;
	name: string;
	amount: number;
	description: string;
	eligibility: string[];
}

export interface ApplicationRequirement {
	type: string;
	description: string;
	deadline?: string;
}

export interface Review {
	id: string;
	author: string;
	rating: number;
	comment: string;
	date: string;
}

export interface UniversityFilters {
	countries?: string[];
	majors?: string[];
	tuitionRange?: { min: number; max: number };
	rankingRange?: { min: number; max: number };
	searchQuery?: string;
}

interface UniversitiesState {
	universities: University[];
	savedUniversities: string[];
	filters: UniversityFilters;
	setUniversities: (universities: University[]) => void;
	saveUniversity: (universityId: string) => void;
	unsaveUniversity: (universityId: string) => void;
	isSaved: (universityId: string) => boolean;
	setFilters: (filters: UniversityFilters) => void;
	clearFilters: () => void;
	getFilteredUniversities: () => University[];
}

export const useUniversitiesStore = create<UniversitiesState>((set, get) => ({
	universities: [],
	savedUniversities: [],
	filters: {},

	setUniversities: (universities) => set({ universities }),

	saveUniversity: (universityId) =>
		set((state) => ({
			savedUniversities: state.savedUniversities.includes(universityId)
				? state.savedUniversities
				: [...state.savedUniversities, universityId],
		})),

	unsaveUniversity: (universityId) =>
		set((state) => ({
			savedUniversities: state.savedUniversities.filter(
				(id) => id !== universityId,
			),
		})),

	isSaved: (universityId) => get().savedUniversities.includes(universityId),

	setFilters: (filters) => set({ filters }),

	clearFilters: () => set({ filters: {} }),

	getFilteredUniversities: () => {
		const { universities, filters } = get();
		let filtered = [...universities];

		if (filters.searchQuery) {
			const query = filters.searchQuery.toLowerCase();
			filtered = filtered.filter(
				(uni) =>
					uni.name.toLowerCase().includes(query) ||
					uni.country.toLowerCase().includes(query) ||
					uni.city.toLowerCase().includes(query),
			);
		}

		if (filters.countries && filters.countries.length > 0) {
			filtered = filtered.filter((uni) =>
				filters.countries!.includes(uni.country),
			);
		}

		if (filters.tuitionRange) {
			filtered = filtered.filter(
				(uni) =>
					uni.averageTuition >= filters.tuitionRange!.min &&
					uni.averageTuition <= filters.tuitionRange!.max,
			);
		}

		if (filters.rankingRange) {
			filtered = filtered.filter(
				(uni) =>
					uni.ranking >= filters.rankingRange!.min &&
					uni.ranking <= filters.rankingRange!.max,
			);
		}

		return filtered;
	},
}));
