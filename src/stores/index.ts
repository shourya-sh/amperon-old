import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  CanvasNode, 
  CanvasEdge, 
  Project, 
  ChatMessage, 
  Collaborator,
  Tutorial
} from '../types';

// Circuit Store
interface CircuitState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  zoom: number;
  viewMode: 'schematic' | 'breadboard';
  
  // Actions
  addNode: (node: CanvasNode) => void;
  updateNode: (id: string, data: Partial<CanvasNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: 'schematic' | 'breadboard') => void;
  clearCanvas: () => void;
  loadProject: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  zoom: 1,
  viewMode: 'schematic',

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  
  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === id ? { ...node, ...data } : node
    ),
  })),
  
  removeNode: (id) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== id),
    edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
    selectedNode: state.selectedNode === id ? null : state.selectedNode,
  })),
  
  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
  
  removeEdge: (id) => set((state) => ({
    edges: state.edges.filter((edge) => edge.id !== id),
    selectedEdge: state.selectedEdge === id ? null : state.selectedEdge,
  })),
  
  setSelectedNode: (id) => set({ selectedNode: id, selectedEdge: null }),
  setSelectedEdge: (id) => set({ selectedEdge: id, selectedNode: null }),
  setZoom: (zoom) => set({ zoom }),
  setViewMode: (mode) => set({ viewMode: mode }),
  clearCanvas: () => set({ nodes: [], edges: [], selectedNode: null, selectedEdge: null }),
  loadProject: (nodes, edges) => set({ nodes, edges }),
}));

// Chat Store
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  
  addMessage: (message: ChatMessage) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "Hi! 👋 I'm CircuitBot, your friendly circuit design helper! I can help you:\n\n• **Build circuits** - Just tell me what you want to create!\n• **Explain components** - Ask me about any component\n• **Debug problems** - I'll help find what's wrong\n• **Learn concepts** - I'll teach you electronics!\n\nWhat would you like to build today?",
      timestamp: new Date(),
    },
  ],
  isOpen: true,
  isLoading: false,

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsLoading: (isLoading) => set({ isLoading }),
  clearMessages: () => set({ 
    messages: [{
      id: '1',
      role: 'assistant',
      content: "Hi! 👋 I'm CircuitBot! What would you like to build today?",
      timestamp: new Date(),
    }] 
  }),
}));

// Collaboration Store
interface CollaborationState {
  sessionId: string | null;
  collaborators: Collaborator[];
  isConnected: boolean;
  isHost: boolean;
  
  setSessionId: (id: string | null) => void;
  addCollaborator: (collaborator: Collaborator) => void;
  removeCollaborator: (id: string) => void;
  updateCollaboratorCursor: (id: string, cursor: { x: number; y: number }) => void;
  setIsConnected: (connected: boolean) => void;
  setIsHost: (isHost: boolean) => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  sessionId: null,
  collaborators: [],
  isConnected: false,
  isHost: false,

  setSessionId: (id) => set({ sessionId: id }),
  addCollaborator: (collaborator) => set((state) => ({
    collaborators: [...state.collaborators, collaborator],
  })),
  removeCollaborator: (id) => set((state) => ({
    collaborators: state.collaborators.filter((c) => c.id !== id),
  })),
  updateCollaboratorCursor: (id, cursor) => set((state) => ({
    collaborators: state.collaborators.map((c) =>
      c.id === id ? { ...c, cursor } : c
    ),
  })),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setIsHost: (isHost) => set({ isHost }),
}));

// Tutorial Store
interface TutorialState {
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  currentStep: number;
  
  setCurrentTutorial: (tutorial: Tutorial | null) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (tutorialId: string, stepIndex: number) => void;
  completeTutorial: (tutorialId: string) => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  tutorials: [],
  currentTutorial: null,
  currentStep: 0,

  setCurrentTutorial: (tutorial) => set({ currentTutorial: tutorial, currentStep: 0 }),
  setCurrentStep: (step) => set({ currentStep: step }),
  completeStep: (tutorialId, stepIndex) => set((state) => ({
    tutorials: state.tutorials.map((t) =>
      t.id === tutorialId
        ? {
            ...t,
            steps: t.steps.map((s, i) =>
              i === stepIndex ? { ...s, completed: true } : s
            ),
          }
        : t
    ),
  })),
  completeTutorial: (tutorialId) => set((state) => ({
    tutorials: state.tutorials.map((t) =>
      t.id === tutorialId ? { ...t, completed: true, progress: 100 } : t
    ),
  })),
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  activePage: 'designer' | 'tutorials' | 'projects' | 'settings';
  theme: 'dark' | 'light';
  showComponentInfo: boolean;
  hoveredComponent: string | null;
  
  setSidebarOpen: (open: boolean) => void;
  setActivePage: (page: 'designer' | 'tutorials' | 'projects' | 'settings') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setShowComponentInfo: (show: boolean) => void;
  setHoveredComponent: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activePage: 'designer',
      theme: 'dark',
      showComponentInfo: true,
      hoveredComponent: null,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActivePage: (page) => set({ activePage: page }),
      setTheme: (theme) => set({ theme }),
      setShowComponentInfo: (show) => set({ showComponentInfo: show }),
      setHoveredComponent: (id) => set({ hoveredComponent: id }),
    }),
    {
      name: 'circuitco-ui',
    }
  )
);

// Project Store
interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,

  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addProject: (project) => set((state) => ({
    projects: [...state.projects, project],
  })),
  updateProject: (id, data) => set((state) => ({
    projects: state.projects.map((p) =>
      p.id === id ? { ...p, ...data } : p
    ),
    currentProject: state.currentProject?.id === id 
      ? { ...state.currentProject, ...data } 
      : state.currentProject,
  })),
  deleteProject: (id) => set((state) => ({
    projects: state.projects.filter((p) => p.id !== id),
    currentProject: state.currentProject?.id === id ? null : state.currentProject,
  })),
}));
