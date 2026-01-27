import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ApplicationState {
	selectedApplicationId: string | null;
	setSelectedApplicationId: (id: string | null) => void;
	sidebarCollapsed: boolean;
	setSidebarCollapsed: (collapsed: boolean) => void;
	toggleSidebar: () => void;
}

export const useApplicationStore = create<ApplicationState>()(
	persist(
		(set) => ({
			selectedApplicationId: null,
			setSelectedApplicationId: (id) => set({ selectedApplicationId: id }),
			sidebarCollapsed: false,
			setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
			toggleSidebar: () =>
				set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
		}),
		{
			name: "application-store",
			partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
		},
	),
);
