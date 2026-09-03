import { create } from "zustand";

export const MAX_COMPARE_ITEMS = 4;

interface CompareState {
	selectedIds: Set<string>;
	toggle: (id: string) => void;
	add: (id: string) => void;
	remove: (id: string) => void;
	clear: () => void;
	isFull: () => boolean;
	has: (id: string) => boolean;
}

/**
 * Generic selection store for compare surfaces (program IDs, strategy option
 * refs, etc.). Keeps only IDs so Phase 6 can reuse it without changing shape.
 */
export const useCompareStore = create<CompareState>()((set, get) => ({
	selectedIds: new Set(),

	toggle: (id) => {
		set((state) => {
			const next = new Set(state.selectedIds);
			if (next.has(id)) {
				next.delete(id);
			} else if (next.size < MAX_COMPARE_ITEMS) {
				next.add(id);
			}
			return { selectedIds: next };
		});
	},

	add: (id) => {
		set((state) => {
			if (state.selectedIds.size >= MAX_COMPARE_ITEMS) return state;
			const next = new Set(state.selectedIds);
			next.add(id);
			return { selectedIds: next };
		});
	},

	remove: (id) => {
		set((state) => {
			const next = new Set(state.selectedIds);
			next.delete(id);
			return { selectedIds: next };
		});
	},

	clear: () => set({ selectedIds: new Set() }),

	isFull: () => get().selectedIds.size >= MAX_COMPARE_ITEMS,

	has: (id) => get().selectedIds.has(id),
}));
