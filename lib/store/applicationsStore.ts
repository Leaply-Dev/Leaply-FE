import { create } from 'zustand';

export interface Application {
  id: string;
  universityId: string;
  universityName: string;
  program: string;
  status: 'draft' | 'submitted' | 'under_review' | 'accepted' | 'waitlisted' | 'rejected';
  submissionDate?: string;
  decisionDeadline?: string;
  documents: Document[];
  tasks: Task[];
  timeline: TimelineEvent[];
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  url?: string;
}

export interface Task {
  id: string;
  applicationId?: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
}

export interface TimelineEvent {
  id: string;
  date: string;
  event: string;
  description: string;
}

export interface Resource {
  id: string;
  title: string;
  summary: string;
  url: string;
  type: 'article' | 'video' | 'guide';
  tags: string[];
  category: string;
}

interface ApplicationsState {
  applications: Application[];
  tasks: Task[];
  resources: Resource[];
  
  setApplications: (applications: Application[]) => void;
  addApplication: (application: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  deleteApplication: (id: string) => void;
  getApplicationById: (id: string) => Application | undefined;
  
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;
  getTasksByApplication: (applicationId: string) => Task[];
  
  setResources: (resources: Resource[]) => void;
  getResourcesByCategory: (category: string) => Resource[];
}

export const useApplicationsStore = create<ApplicationsState>((set, get) => ({
  applications: [],
  tasks: [],
  resources: [],

  setApplications: (applications) => set({ applications }),

  addApplication: (application) =>
    set((state) => ({
      applications: [...state.applications, application],
    })),

  updateApplication: (id, updates) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, ...updates } : app
      ),
    })),

  deleteApplication: (id) =>
    set((state) => ({
      applications: state.applications.filter((app) => app.id !== id),
    })),

  getApplicationById: (id) => get().applications.find((app) => app.id === id),

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, ...updates } : task
      ),
    })),

  toggleTaskComplete: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    })),

  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),

  getTasksByApplication: (applicationId) =>
    get().tasks.filter((task) => task.applicationId === applicationId),

  setResources: (resources) => set({ resources }),

  getResourcesByCategory: (category) =>
    get().resources.filter((resource) => resource.category === category),
}));

