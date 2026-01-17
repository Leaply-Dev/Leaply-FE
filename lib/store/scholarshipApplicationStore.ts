import { create } from "zustand";

type TabType = "overview" | "documents" | "essay";

interface ScholarshipApplicationState {
	selectedApplicationId: string | null;
	activeTab: TabType;
	setSelectedApplicationId: (id: string | null) => void;
	setActiveTab: (tab: TabType) => void;
}

export const useScholarshipApplicationStore =
	create<ScholarshipApplicationState>()((set) => ({
		selectedApplicationId: null,
		activeTab: "overview",
		setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
		setActiveTab: (tab) => set({ activeTab: tab }),
	}));
