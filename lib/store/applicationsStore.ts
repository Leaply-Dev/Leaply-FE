import { create } from "zustand";
import {
	getApplications,
	createApplication,
	updateApplication as updateApplicationApi,
	deleteApplication as deleteApplicationApi,
} from "@/lib/api/applicationsApi";
import type {
	ApplicationResponse,
	ApplicationListResponse,
	ApplicationSummaryDto,
	UpcomingDeadlineDto,
	CreateApplicationRequest,
	UpdateApplicationRequest,
} from "@/lib/api/types";

interface ApplicationsState {
	// Data
	applications: ApplicationResponse[];
	summary: ApplicationSummaryDto | null;
	upcomingDeadlines: UpcomingDeadlineDto[];

	// UI State
	isLoading: boolean;
	error: string | null;
	selectedApplicationId: string | null;

	// Actions
	fetchApplications: () => Promise<void>;
	addApplication: (request: CreateApplicationRequest) => Promise<string | null>;
	updateApplicationStatus: (
		id: string,
		request: UpdateApplicationRequest,
	) => Promise<boolean>;
	removeApplication: (id: string) => Promise<boolean>;
	setSelectedApplication: (id: string | null) => void;
	getSelectedApplication: () => ApplicationResponse | null;
	clearError: () => void;
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
	// Initial state
	applications: [],
	summary: null,
	upcomingDeadlines: [],
	isLoading: false,
	error: null,
	selectedApplicationId: null,

	// Fetch all applications
	fetchApplications: async () => {
		set({ isLoading: true, error: null });
		try {
			const response: ApplicationListResponse = await getApplications();
			set({
				applications: response.applications,
				summary: response.summary,
				upcomingDeadlines: response.upcomingDeadlines,
				isLoading: false,
			});

			// Auto-select first if none selected
			const state = get();
			if (!state.selectedApplicationId && response.applications.length > 0) {
				set({ selectedApplicationId: response.applications[0].id });
			}
		} catch (error) {
			console.error("Failed to fetch applications:", error);
			set({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to load applications",
			});
		}
	},

	// Add a new application (from Explore page)
	addApplication: async (request: CreateApplicationRequest) => {
		set({ isLoading: true, error: null });
		try {
			const response = await createApplication(request);

			// Refresh the list to get the new application with full data
			await get().fetchApplications();

			// Select the new application
			set({ selectedApplicationId: response.id });

			return response.id;
		} catch (error) {
			console.error("Failed to create application:", error);
			set({
				isLoading: false,
				error:
					error instanceof Error
						? error.message
						: "Failed to add program to applications",
			});
			return null;
		}
	},

	// Update application status
	updateApplicationStatus: async (
		id: string,
		request: UpdateApplicationRequest,
	) => {
		try {
			await updateApplicationApi(id, request);

			// Update local state
			set((state) => ({
				applications: state.applications.map((app) =>
					app.id === id ? { ...app, status: request.status || app.status } : app,
				),
			}));

			return true;
		} catch (error) {
			console.error("Failed to update application:", error);
			set({
				error:
					error instanceof Error
						? error.message
						: "Failed to update application",
			});
			return false;
		}
	},

	// Remove an application
	removeApplication: async (id: string) => {
		try {
			await deleteApplicationApi(id);

			// Update local state
			set((state) => {
				const newApplications = state.applications.filter(
					(app) => app.id !== id,
				);
				const newSelectedId =
					state.selectedApplicationId === id
						? newApplications[0]?.id || null
						: state.selectedApplicationId;

				return {
					applications: newApplications,
					selectedApplicationId: newSelectedId,
					summary: state.summary
						? { ...state.summary, total: state.summary.total - 1 }
						: null,
				};
			});

			return true;
		} catch (error) {
			console.error("Failed to delete application:", error);
			set({
				error:
					error instanceof Error
						? error.message
						: "Failed to remove application",
			});
			return false;
		}
	},

	// Set selected application
	setSelectedApplication: (id: string | null) => {
		set({ selectedApplicationId: id });
	},

	// Get selected application
	getSelectedApplication: () => {
		const state = get();
		return (
			state.applications.find(
				(app) => app.id === state.selectedApplicationId,
			) || null
		);
	},

	// Clear error
	clearError: () => {
		set({ error: null });
	},
}));
