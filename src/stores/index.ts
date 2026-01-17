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
import type { ExtractedSymbol } from '../services/symbolsService';
import type { SimulationResult } from '../services/circuitSimulator';
import type { CircuitAction } from '../services/aiService';

// Circuit Store
interface CircuitState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  zoom: number;
  viewMode: 'schematic' | 'breadboard';
  isSimulating: boolean;
  simulationResult: SimulationResult | null;
  
  // Actions
  addNode: (node: CanvasNode) => void;
  updateNode: (id: string, data: Partial<CanvasNode>) => void;
  updateNodes: (nodes: CanvasNode[]) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: CanvasEdge) => void;
  removeEdge: (id: string) => void;
  updateEdges: (edges: CanvasEdge[]) => void;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  setZoom: (zoom: number) => void;
  setViewMode: (mode: 'schematic' | 'breadboard') => void;
  clearCanvas: () => void;
  loadProject: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setAllEdgesAnimated: (animated: boolean) => void;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  zoom: 1,
  viewMode: 'schematic',
  isSimulating: false,
  simulationResult: null,

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
  
  updateNode: (id, data) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === id ? { ...node, ...data } : node
    ),
  })),
  updateNodes: (nodes) => set({ nodes }),
  
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
  updateEdges: (edges) => set({ edges }),
  
  setSelectedNode: (id) => set({ selectedNode: id, selectedEdge: null }),
  setSelectedEdge: (id) => set({ selectedEdge: id, selectedNode: null }),
  setZoom: (zoom) => set({ zoom }),
  setViewMode: (mode) => set({ viewMode: mode }),
  clearCanvas: () => set({ nodes: [], edges: [], selectedNode: null, selectedEdge: null, isSimulating: false, simulationResult: null }),
  loadProject: (nodes, edges) => set({ nodes, edges }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setAllEdgesAnimated: (animated) => set((state) => ({
    edges: state.edges.map((edge) => ({ ...edge, animated })),
  })),
}));

// Chat Store
interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  lastCircuitAction: CircuitAction | null;
  
  addMessage: (message: ChatMessage) => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setLastCircuitAction: (action: CircuitAction | null) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to CircuitCo. I can help you build circuits, explain components, and teach you electronics concepts.\n\nTry asking me to:\n• Build an LED circuit\n• Explain how resistors work\n• Teach you Ohm's Law\n\nWhat would you like to learn?",
      timestamp: new Date(),
    },
  ],
  isOpen: true,
  isLoading: false,
  lastCircuitAction: null,

  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  setIsOpen: (isOpen) => set({ isOpen }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLastCircuitAction: (action) => set({ lastCircuitAction: action }),
  clearMessages: () => set({ 
    messages: [{
      id: '1',
      role: 'assistant',
      content: "Hi! I'm CircuitBot! What would you like to build today?",
      timestamp: new Date(),
    }],
    lastCircuitAction: null,
  }),
}));

// Symbols Store
interface SymbolsState {
  symbols: ExtractedSymbol[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
  
  setSymbols: (symbols: ExtractedSymbol[]) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addSymbol: (symbol: ExtractedSymbol) => void;
  updateLastUpdated: () => void;
}

export const useSymbolsStore = create<SymbolsState>()(
  persist(
    (set) => ({
      symbols: [],
      isLoading: false,
      error: null,
      lastUpdated: null,

      setSymbols: (symbols) => set({ symbols }),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      addSymbol: (symbol) => set((state) => ({
        symbols: [...state.symbols, symbol],
      })),
      updateLastUpdated: () => set({ lastUpdated: Date.now() }),
    }),
    {
      name: 'circuitco-symbols',
    }
  )
);

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
  completedTutorials: Set<string>;
  tutorialProgress: Record<string, number>;
  totalCircuitPoints: number;
  
  markTutorialComplete: (tutorialId: string, circuitPointsReward: number) => void;
  updateTutorialProgress: (tutorialId: string, progress: number) => void;
  getTutorialProgress: (tutorialId: string) => number;
  isTutorialComplete: (tutorialId: string) => boolean;
  resetProgress: () => void;
}

export const useTutorialStore = create<TutorialState>()(  
  persist(
    (set, get) => ({
      completedTutorials: new Set<string>(),
      tutorialProgress: {},
      totalCircuitPoints: 0,

      markTutorialComplete: (tutorialId, circuitPointsReward) => set((state) => {
        const newCompleted = new Set(state.completedTutorials);
        const wasAlreadyComplete = newCompleted.has(tutorialId);
        newCompleted.add(tutorialId);
        
        return {
          completedTutorials: newCompleted,
          tutorialProgress: { ...state.tutorialProgress, [tutorialId]: 100 },
          totalCircuitPoints: wasAlreadyComplete ? state.totalCircuitPoints : state.totalCircuitPoints + circuitPointsReward,
        };
      }),
      
      updateTutorialProgress: (tutorialId, progress) => set((state) => ({
        tutorialProgress: { ...state.tutorialProgress, [tutorialId]: progress },
      })),
      
      getTutorialProgress: (tutorialId) => {
        const state = get();
        return state.tutorialProgress[tutorialId] || 0;
      },
      
      isTutorialComplete: (tutorialId) => {
        const state = get();
        return state.completedTutorials.has(tutorialId);
      },
      
      resetProgress: () => set({
        completedTutorials: new Set<string>(),
        tutorialProgress: {},
        totalCircuitPoints: 0,
      }),
    }),
    {
      name: 'circuitco-tutorials',
      partialize: (state) => ({
        completedTutorials: Array.from(state.completedTutorials),
        tutorialProgress: state.tutorialProgress,
        totalCircuitPoints: state.totalCircuitPoints,
      }),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        completedTutorials: new Set(persistedState?.completedTutorials || []),
        tutorialProgress: persistedState?.tutorialProgress || {},
        totalCircuitPoints: persistedState?.totalCircuitPoints || 0,
      }),
    }
  )
);

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
