import { create } from "zustand";

interface ApplicationState {
	selectedApplicationId: string | null;
	setSelectedApplicationId: (id: string | null) => void;
}

export const useApplicationStore = create<ApplicationState>()((set) => ({
	selectedApplicationId: null,
	setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
}));
