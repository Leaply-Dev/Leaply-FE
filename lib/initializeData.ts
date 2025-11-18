/**
 * Initialize all stores with mock data for demo purposes
 * This ensures consistent data across the app
 */

import { useUniversitiesStore } from "./store/universitiesStore";
import { useApplicationsStore } from "./store/applicationsStore";
import { useChatStore } from "./store/chatStore";
import { mockUniversities } from "./data/universities";
import { mockApplications, mockTasks } from "./data/applications";
import { mockResources } from "./data/resources";
import { mockConversations } from "./data/chat";

export function initializeAppData() {
	const { setUniversities } = useUniversitiesStore.getState();
	const { setApplications, setTasks, setResources } =
		useApplicationsStore.getState();
	const { setConversations } = useChatStore.getState();

	// Initialize universities
	if (useUniversitiesStore.getState().universities.length === 0) {
		setUniversities(mockUniversities);
	}

	// Initialize applications and tasks
	if (useApplicationsStore.getState().applications.length === 0) {
		setApplications(mockApplications);
	}
	if (useApplicationsStore.getState().tasks.length === 0) {
		setTasks(mockTasks);
	}
	if (useApplicationsStore.getState().resources.length === 0) {
		setResources(mockResources);
	}

	// Initialize chat conversations
	if (useChatStore.getState().conversations.length === 0) {
		setConversations(mockConversations);
	}
}
