import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CanvasNode,
  CanvasEdge,
  Project,
  ChatMessage,
  ChatSession,
  ChatCheckpoint,
  Collaborator,
} from "../types";
import type { ExtractedSymbol } from "../services/symbolsService";
import type { SimulationResult } from "../services/circuitSimulator";
import type { CircuitAction } from "../services/aiService";

// Circuit Store
interface CircuitState {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNode: string | null;
  selectedEdge: string | null;
  zoom: number;
  viewMode: "schematic" | "breadboard";
  isSimulating: boolean;
  simulationResult: SimulationResult | null;
  shouldFitView: boolean;

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
  setViewMode: (mode: "schematic" | "breadboard") => void;
  clearCanvas: () => void;
  loadProject: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
  setIsSimulating: (isSimulating: boolean) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setAllEdgesAnimated: (animated: boolean) => void;
  triggerFitView: () => void;
  resetFitView: () => void;
}

export const useCircuitStore = create<CircuitState>((set) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  selectedEdge: null,
  zoom: 1,
  viewMode: "schematic",
  isSimulating: false,
  simulationResult: null,
  shouldFitView: false,

  addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),

  updateNode: (id, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, ...data } : node,
      ),
    })),
  updateNodes: (nodes) => set({ nodes }),

  removeNode: (id) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== id),
      edges: state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id,
      ),
      selectedNode: state.selectedNode === id ? null : state.selectedNode,
    })),

  addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),

  removeEdge: (id) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
      selectedEdge: state.selectedEdge === id ? null : state.selectedEdge,
    })),
  updateEdges: (edges) => set({ edges }),

  setSelectedNode: (id) => set({ selectedNode: id, selectedEdge: null }),
  setSelectedEdge: (id) => set({ selectedEdge: id, selectedNode: null }),
  setZoom: (zoom) => set({ zoom }),
  setViewMode: (mode) => set({ viewMode: mode }),
  clearCanvas: () =>
    set({
      nodes: [],
      edges: [],
      selectedNode: null,
      selectedEdge: null,
      isSimulating: false,
      simulationResult: null,
    }),
  loadProject: (nodes, edges) => set({ nodes, edges }),
  setIsSimulating: (isSimulating) => set({ isSimulating }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setAllEdgesAnimated: (animated) =>
    set((state) => ({
      edges: state.edges.map((edge) => ({ ...edge, animated })),
    })),
  triggerFitView: () => set({ shouldFitView: true }),
  resetFitView: () => set({ shouldFitView: false }),
}));

// Chat Store - Enhanced with Sessions, History, and Checkpoints
const createWelcomeMessage = (): ChatMessage => ({
  id: "welcome-" + Date.now(),
  role: "assistant",
  content:
    "Welcome to Amperon. I can help you build circuits, explain components, and teach you electronics concepts.\n\nTry asking me to:\n• Build an LED circuit\n• Explain how resistors work\n• Teach you Ohm's Law\n\nWhat would you like to learn?",
  timestamp: new Date(),
});

const createNewSession = (name?: string): ChatSession => ({
  id: "session-" + Date.now(),
  name: name || `Chat ${new Date().toLocaleDateString()}`,
  messages: [createWelcomeMessage()],
  checkpoints: [],
  circuitState: {
    nodes: [],
    edges: [],
  },
  createdAt: new Date(),
  updatedAt: new Date(),
});

interface ChatState {
  // Session management
  sessions: ChatSession[];
  currentSessionId: string | null;

  // UI state
  isOpen: boolean;
  isLoading: boolean;
  isHistoryOpen: boolean;
  lastCircuitAction: CircuitAction | null;

  // Computed getters
  getCurrentSession: () => ChatSession | null;
  messages: ChatMessage[];

  // Session actions
  createSession: (name?: string) => string;
  switchSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  renameSession: (sessionId: string, name: string) => void;
  archiveSession: (sessionId: string) => void;
  duplicateSession: (sessionId: string) => string;

  // Message actions
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  saveCircuitState: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;

  // Checkpoint actions
  createCheckpoint: (
    name: string,
    nodes: CanvasNode[],
    edges: CanvasEdge[],
    messageId?: string,
    isAutoSave?: boolean,
  ) => string;
  deleteCheckpoint: (checkpointId: string) => void;
  renameCheckpoint: (checkpointId: string, name: string) => void;
  getCheckpoint: (checkpointId: string) => ChatCheckpoint | null;

  // UI actions
  setIsOpen: (isOpen: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsHistoryOpen: (isOpen: boolean) => void;
  setLastCircuitAction: (action: CircuitAction | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      const initialSession = createNewSession();

      return {
        sessions: [initialSession],
        currentSessionId: initialSession.id,
        isOpen: true,
        isLoading: false,
        isHistoryOpen: false,
        lastCircuitAction: null,

        // Computed: get current session
        getCurrentSession: () => {
          const state = get();
          return (
            state.sessions.find((s) => s.id === state.currentSessionId) || null
          );
        },

        // Computed: get messages from current session (for backward compatibility)
        get messages() {
          const session = get().getCurrentSession();
          return session?.messages || [];
        },

        // Create a new chat session
        createSession: (name) => {
          const newSession = createNewSession(name);
          set((state) => ({
            sessions: [newSession, ...state.sessions],
            currentSessionId: newSession.id,
          }));
          return newSession.id;
        },

        // Switch to a different session
        switchSession: (sessionId) => {
          const state = get();
          if (state.sessions.some((s) => s.id === sessionId)) {
            set({ currentSessionId: sessionId });
          }
        },

        // Delete a session
        deleteSession: (sessionId) => {
          set((state) => {
            const newSessions = state.sessions.filter(
              (s) => s.id !== sessionId,
            );

            // If deleting current session, switch to another or create new
            let newCurrentId = state.currentSessionId;
            if (state.currentSessionId === sessionId) {
              if (newSessions.length > 0) {
                newCurrentId = newSessions[0].id;
              } else {
                const newSession = createNewSession();
                newSessions.push(newSession);
                newCurrentId = newSession.id;
              }
            }

            return {
              sessions: newSessions,
              currentSessionId: newCurrentId,
            };
          });
        },

        // Rename a session
        renameSession: (sessionId, name) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === sessionId ? { ...s, name, updatedAt: new Date() } : s,
            ),
          }));
        },

        // Archive a session
        archiveSession: (sessionId) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === sessionId
                ? { ...s, isArchived: true, updatedAt: new Date() }
                : s,
            ),
          }));
        },

        // Duplicate a session
        duplicateSession: (sessionId) => {
          const state = get();
          const original = state.sessions.find((s) => s.id === sessionId);
          if (!original) return "";

          const duplicated: ChatSession = {
            ...original,
            id: "session-" + Date.now(),
            name: `${original.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
            checkpoints: original.checkpoints.map((cp) => ({
              ...cp,
              id: "checkpoint-" + Date.now() + Math.random(),
            })),
          };

          set((state) => ({
            sessions: [duplicated, ...state.sessions],
            currentSessionId: duplicated.id,
          }));

          return duplicated.id;
        },

        // Add a message to current session
        addMessage: (message) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === state.currentSessionId
                ? {
                    ...s,
                    messages: [...s.messages, message],
                    updatedAt: new Date(),
                  }
                : s,
            ),
          }));
        },

        // Clear messages in current session (reset to welcome)
        clearMessages: () => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === state.currentSessionId
                ? {
                    ...s,
                    messages: [createWelcomeMessage()],
                    updatedAt: new Date(),
                  }
                : s,
            ),
            lastCircuitAction: null,
          }));
        },

        // Save circuit state to current session
        saveCircuitState: (nodes, edges) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === state.currentSessionId
                ? {
                    ...s,
                    circuitState: {
                      nodes: JSON.parse(JSON.stringify(nodes)),
                      edges: JSON.parse(JSON.stringify(edges)),
                    },
                    updatedAt: new Date(),
                  }
                : s,
            ),
          }));
        },

        // Create a checkpoint (save canvas state)
        createCheckpoint: (
          name,
          nodes,
          edges,
          messageId,
          isAutoSave = false,
        ) => {
          const state = get();
          const session = state.getCurrentSession();
          if (!session) return "";

          const checkpoint: ChatCheckpoint = {
            id: "checkpoint-" + Date.now(),
            sessionId: session.id,
            messageId:
              messageId ||
              (session.messages.length > 0
                ? session.messages[session.messages.length - 1].id
                : ""),
            name,
            nodes: JSON.parse(JSON.stringify(nodes)), // Deep clone
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: new Date(),
            isAutoSave,
          };

          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === state.currentSessionId
                ? {
                    ...s,
                    checkpoints: [...s.checkpoints, checkpoint],
                    updatedAt: new Date(),
                  }
                : s,
            ),
          }));

          return checkpoint.id;
        },

        // Delete a checkpoint
        deleteCheckpoint: (checkpointId) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === state.currentSessionId
                ? {
                    ...s,
                    checkpoints: s.checkpoints.filter(
                      (cp) => cp.id !== checkpointId,
                    ),
                    updatedAt: new Date(),
                  }
                : s,
            ),
          }));
        },

        // Rename a checkpoint
        renameCheckpoint: (checkpointId, name) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === state.currentSessionId
                ? {
                    ...s,
                    checkpoints: s.checkpoints.map((cp) =>
                      cp.id === checkpointId ? { ...cp, name } : cp,
                    ),
                    updatedAt: new Date(),
                  }
                : s,
            ),
          }));
        },

        // Get a checkpoint by ID
        getCheckpoint: (checkpointId) => {
          const session = get().getCurrentSession();
          return (
            session?.checkpoints.find((cp) => cp.id === checkpointId) || null
          );
        },

        // UI actions
        setIsOpen: (isOpen) => set({ isOpen }),
        setIsLoading: (isLoading) => set({ isLoading }),
        setIsHistoryOpen: (isOpen) => set({ isHistoryOpen: isOpen }),
        setLastCircuitAction: (action) => set({ lastCircuitAction: action }),
      };
    },
    {
      name: "amperon-chat-sessions",
      partialize: (state) => ({
        sessions: state.sessions.map((s) => ({
          ...s,
          // Convert Date objects to ISO strings for storage
          createdAt:
            s.createdAt instanceof Date
              ? s.createdAt.toISOString()
              : s.createdAt,
          updatedAt:
            s.updatedAt instanceof Date
              ? s.updatedAt.toISOString()
              : s.updatedAt,
          messages: s.messages.map((m) => ({
            ...m,
            timestamp:
              m.timestamp instanceof Date
                ? m.timestamp.toISOString()
                : m.timestamp,
          })),
          checkpoints: s.checkpoints.map((cp) => ({
            ...cp,
            timestamp:
              cp.timestamp instanceof Date
                ? cp.timestamp.toISOString()
                : cp.timestamp,
          })),
        })),
        currentSessionId: state.currentSessionId,
        isOpen: state.isOpen,
      }),
      merge: (persistedState: any, currentState) => {
        if (!persistedState || !persistedState.sessions) {
          return currentState;
        }

        return {
          ...currentState,
          sessions: persistedState.sessions.map((s: any) => ({
            ...s,
            createdAt: new Date(s.createdAt),
            updatedAt: new Date(s.updatedAt),
            messages: s.messages.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            })),
            checkpoints: s.checkpoints.map((cp: any) => ({
              ...cp,
              timestamp: new Date(cp.timestamp),
            })),
          })),
          currentSessionId: persistedState.currentSessionId,
          isOpen: persistedState.isOpen ?? true,
        };
      },
    },
  ),
);

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
      addSymbol: (symbol) =>
        set((state) => ({
          symbols: [...state.symbols, symbol],
        })),
      updateLastUpdated: () => set({ lastUpdated: Date.now() }),
    }),
    {
      name: "amperon-symbols",
    },
  ),
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
  updateCollaboratorCursor: (
    id: string,
    cursor: { x: number; y: number },
  ) => void;
  setIsConnected: (connected: boolean) => void;
  setIsHost: (isHost: boolean) => void;
}

export const useCollaborationStore = create<CollaborationState>((set) => ({
  sessionId: null,
  collaborators: [],
  isConnected: false,
  isHost: false,

  setSessionId: (id) => set({ sessionId: id }),
  addCollaborator: (collaborator) =>
    set((state) => ({
      collaborators: [...state.collaborators, collaborator],
    })),
  removeCollaborator: (id) =>
    set((state) => ({
      collaborators: state.collaborators.filter((c) => c.id !== id),
    })),
  updateCollaboratorCursor: (id, cursor) =>
    set((state) => ({
      collaborators: state.collaborators.map((c) =>
        c.id === id ? { ...c, cursor } : c,
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

  markTutorialComplete: (
    tutorialId: string,
    circuitPointsReward: number,
  ) => void;
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

      markTutorialComplete: (tutorialId, circuitPointsReward) =>
        set((state) => {
          const newCompleted = new Set(state.completedTutorials);
          const wasAlreadyComplete = newCompleted.has(tutorialId);
          newCompleted.add(tutorialId);

          return {
            completedTutorials: newCompleted,
            tutorialProgress: { ...state.tutorialProgress, [tutorialId]: 100 },
            totalCircuitPoints: wasAlreadyComplete
              ? state.totalCircuitPoints
              : state.totalCircuitPoints + circuitPointsReward,
          };
        }),

      updateTutorialProgress: (tutorialId, progress) =>
        set((state) => ({
          tutorialProgress: {
            ...state.tutorialProgress,
            [tutorialId]: progress,
          },
        })),

      getTutorialProgress: (tutorialId) => {
        const state = get();
        return state.tutorialProgress[tutorialId] || 0;
      },

      isTutorialComplete: (tutorialId) => {
        const state = get();
        return state.completedTutorials.has(tutorialId);
      },

      resetProgress: () =>
        set({
          completedTutorials: new Set<string>(),
          tutorialProgress: {},
          totalCircuitPoints: 0,
        }),
    }),
    {
      name: "amperon-tutorials",
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
    },
  ),
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  activePage: "designer" | "tutorials" | "projects" | "settings";
  theme: "dark" | "light";
  showComponentInfo: boolean;
  hoveredComponent: string | null;

  setSidebarOpen: (open: boolean) => void;
  setActivePage: (
    page: "designer" | "tutorials" | "projects" | "settings",
  ) => void;
  setTheme: (theme: "dark" | "light") => void;
  setShowComponentInfo: (show: boolean) => void;
  setHoveredComponent: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      activePage: "designer",
      theme: "dark",
      showComponentInfo: true,
      hoveredComponent: null,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setActivePage: (page) => set({ activePage: page }),
      setTheme: (theme) => set({ theme }),
      setShowComponentInfo: (show) => set({ showComponentInfo: show }),
      setHoveredComponent: (id) => set({ hoveredComponent: id }),
    }),
    {
      name: "amperon-ui",
    },
  ),
);

// Project Store - Enhanced with persistence and autosave
interface ExtendedProject extends Project {
  chatSessionId?: string;
  chatSession?: ChatSession;
}

interface ProjectState {
  projects: ExtendedProject[];
  currentProjectId: string | null;
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  autosaveEnabled: boolean;

  // Getters
  getCurrentProject: () => ExtendedProject | null;

  // Actions
  setProjects: (projects: ExtendedProject[]) => void;
  setCurrentProjectId: (id: string | null) => void;
  setCurrentProject: (project: ExtendedProject | null) => void;
  addProject: (project: ExtendedProject) => void;
  updateProject: (id: string, data: Partial<ExtendedProject>) => void;
  deleteProject: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
  setLastSaved: (date: Date | null) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setAutosaveEnabled: (enabled: boolean) => void;

  // Link chat session to project
  linkChatSession: (projectId: string, session: ChatSession) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,
      isLoading: false,
      lastSaved: null,
      hasUnsavedChanges: false,
      autosaveEnabled: true,

      getCurrentProject: () => {
        const state = get();
        return (
          state.projects.find((p) => p.id === state.currentProjectId) || null
        );
      },

      setProjects: (projects) => set({ projects }),
      setCurrentProjectId: (id) => set({ currentProjectId: id }),
      setCurrentProject: (project) => {
        if (project) {
          set((state) => {
            const existingIndex = state.projects.findIndex(
              (p) => p.id === project.id,
            );
            if (existingIndex >= 0) {
              const newProjects = [...state.projects];
              newProjects[existingIndex] = project;
              return { projects: newProjects, currentProjectId: project.id };
            } else {
              return {
                projects: [project, ...state.projects],
                currentProjectId: project.id,
              };
            }
          });
        } else {
          set({ currentProjectId: null });
        }
      },
      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
          currentProjectId: project.id,
        })),
      updateProject: (id, data) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p,
          ),
          hasUnsavedChanges: true,
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId:
            state.currentProjectId === id ? null : state.currentProjectId,
        })),
      setIsLoading: (loading) => set({ isLoading: loading }),
      setLastSaved: (date) =>
        set({ lastSaved: date, hasUnsavedChanges: false }),
      setHasUnsavedChanges: (hasChanges) =>
        set({ hasUnsavedChanges: hasChanges }),
      setAutosaveEnabled: (enabled) => set({ autosaveEnabled: enabled }),

      linkChatSession: (projectId, session) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  chatSessionId: session.id,
                  chatSession: session,
                  updatedAt: new Date(),
                }
              : p,
          ),
          hasUnsavedChanges: true,
        })),
    }),
    {
      name: "amperon-projects",
      partialize: (state) => ({
        projects: state.projects.map((p) => ({
          ...p,
          createdAt:
            p.createdAt instanceof Date
              ? p.createdAt.toISOString()
              : p.createdAt,
          updatedAt:
            p.updatedAt instanceof Date
              ? p.updatedAt.toISOString()
              : p.updatedAt,
          chatSession: p.chatSession
            ? {
                ...p.chatSession,
                createdAt:
                  p.chatSession.createdAt instanceof Date
                    ? p.chatSession.createdAt.toISOString()
                    : p.chatSession.createdAt,
                updatedAt:
                  p.chatSession.updatedAt instanceof Date
                    ? p.chatSession.updatedAt.toISOString()
                    : p.chatSession.updatedAt,
                messages: p.chatSession.messages.map((m) => ({
                  ...m,
                  timestamp:
                    m.timestamp instanceof Date
                      ? m.timestamp.toISOString()
                      : m.timestamp,
                })),
                checkpoints: p.chatSession.checkpoints.map((cp) => ({
                  ...cp,
                  timestamp:
                    cp.timestamp instanceof Date
                      ? cp.timestamp.toISOString()
                      : cp.timestamp,
                })),
              }
            : undefined,
        })),
        currentProjectId: state.currentProjectId,
        autosaveEnabled: state.autosaveEnabled,
      }),
      merge: (persistedState: unknown, currentState) => {
        const persisted = persistedState as {
          projects?: Array<{
            createdAt: string;
            updatedAt: string;
            chatSession?: {
              createdAt: string;
              updatedAt: string;
              messages: Array<{ timestamp: string }>;
              checkpoints: Array<{ timestamp: string }>;
            };
          }>;
          currentProjectId?: string | null;
          autosaveEnabled?: boolean;
        } | null;

        if (!persisted || !persisted.projects) {
          return currentState;
        }

        return {
          ...currentState,
          projects: persisted.projects.map((p) => ({
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            chatSession: p.chatSession
              ? {
                  ...p.chatSession,
                  createdAt: new Date(p.chatSession.createdAt),
                  updatedAt: new Date(p.chatSession.updatedAt),
                  messages: p.chatSession.messages.map((m) => ({
                    ...m,
                    timestamp: new Date(m.timestamp),
                  })),
                  checkpoints: p.chatSession.checkpoints.map((cp) => ({
                    ...cp,
                    timestamp: new Date(cp.timestamp),
                  })),
                }
              : undefined,
          })) as ExtendedProject[],
          currentProjectId: persisted.currentProjectId ?? null,
          autosaveEnabled: persisted.autosaveEnabled ?? true,
        };
      },
    },
  ),
);

// AR Store - For augmented reality breadboard analysis
interface DetectedComponent {
  type: string;
  count: number;
  colors?: string[];
  position?: string;
}

interface ARState {
  // Connection state
  connectionStatus:
    | "idle"
    | "generating"
    | "waiting"
    | "connecting"
    | "connected"
    | "error";
  peerId: string | null;
  qrCodeUrl: string | null;
  connectionError: string | null;

  // Analysis state
  isAnalyzing: boolean;
  analysisStatus:
    | "idle"
    | "connecting"
    | "connected"
    | "analyzing"
    | "stopped"
    | "error";
  detectedComponents: DetectedComponent[];
  breadboardDetected: boolean;
  currentIssues: string[];
  currentSuggestions: string[];
  lastAnalysisTimestamp: number | null;

  // Camera state
  cameraSource: "local" | "phone" | null;

  // Overlay state
  showHints: boolean;
  showDetectedComponents: boolean;
  showIssues: boolean;

  // Tutorial integration
  activeTutorialId: string | null;
  tutorialStep: number;

  // Actions
  setConnectionStatus: (status: ARState["connectionStatus"]) => void;
  setPeerId: (id: string | null) => void;
  setQrCodeUrl: (url: string | null) => void;
  setConnectionError: (error: string | null) => void;

  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisStatus: (status: ARState["analysisStatus"]) => void;
  setDetectedComponents: (components: DetectedComponent[]) => void;
  setBreadboardDetected: (detected: boolean) => void;
  setCurrentIssues: (issues: string[]) => void;
  setCurrentSuggestions: (suggestions: string[]) => void;
  updateLastAnalysis: () => void;

  setCameraSource: (source: ARState["cameraSource"]) => void;

  setShowHints: (show: boolean) => void;
  setShowDetectedComponents: (show: boolean) => void;
  setShowIssues: (show: boolean) => void;
  toggleOverlayOption: (option: "hints" | "components" | "issues") => void;

  setActiveTutorial: (tutorialId: string | null, step?: number) => void;
  setTutorialStep: (step: number) => void;

  resetARState: () => void;
}

const initialARState = {
  connectionStatus: "idle" as const,
  peerId: null,
  qrCodeUrl: null,
  connectionError: null,
  isAnalyzing: false,
  analysisStatus: "idle" as const,
  detectedComponents: [],
  breadboardDetected: false,
  currentIssues: [],
  currentSuggestions: [],
  lastAnalysisTimestamp: null,
  cameraSource: null,
  showHints: true,
  showDetectedComponents: true,
  showIssues: true,
  activeTutorialId: null,
  tutorialStep: 0,
};

export const useARStore = create<ARState>((set) => ({
  ...initialARState,

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setPeerId: (id) => set({ peerId: id }),
  setQrCodeUrl: (url) => set({ qrCodeUrl: url }),
  setConnectionError: (error) => set({ connectionError: error }),

  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setAnalysisStatus: (status) => set({ analysisStatus: status }),
  setDetectedComponents: (components) =>
    set({ detectedComponents: components }),
  setBreadboardDetected: (detected) => set({ breadboardDetected: detected }),
  setCurrentIssues: (issues) => set({ currentIssues: issues }),
  setCurrentSuggestions: (suggestions) =>
    set({ currentSuggestions: suggestions }),
  updateLastAnalysis: () => set({ lastAnalysisTimestamp: Date.now() }),

  setCameraSource: (source) => set({ cameraSource: source }),

  setShowHints: (show) => set({ showHints: show }),
  setShowDetectedComponents: (show) => set({ showDetectedComponents: show }),
  setShowIssues: (show) => set({ showIssues: show }),
  toggleOverlayOption: (option) =>
    set((state) => {
      switch (option) {
        case "hints":
          return { showHints: !state.showHints };
        case "components":
          return { showDetectedComponents: !state.showDetectedComponents };
        case "issues":
          return { showIssues: !state.showIssues };
        default:
          return state;
      }
    }),

  setActiveTutorial: (tutorialId, step = 0) =>
    set({
      activeTutorialId: tutorialId,
      tutorialStep: step,
    }),
  setTutorialStep: (step) => set({ tutorialStep: step }),

  resetARState: () => set(initialARState),
}));

// Shop Store
interface ShopState {
  isOpen: boolean;
  isLoadingPrices: boolean;
  pricing: Record<string, import("../types").ComponentPricing>;
  selectedVendors: Record<string, import("../types").VendorName>;

  setIsOpen: (isOpen: boolean) => void;
  toggleShop: () => void;
  setIsLoadingPrices: (loading: boolean) => void;
  setPricing: (
    pricing: Record<string, import("../types").ComponentPricing>,
  ) => void;
  updateComponentPricing: (
    componentId: string,
    pricing: import("../types").ComponentPricing,
  ) => void;
  setSelectedVendor: (
    componentId: string,
    vendor: import("../types").VendorName,
  ) => void;
  clearPricing: () => void;
}

export const useShopStore = create<ShopState>((set) => ({
  isOpen: false,
  isLoadingPrices: false,
  pricing: {},
  selectedVendors: {},

  setIsOpen: (isOpen) => set({ isOpen }),
  toggleShop: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsLoadingPrices: (loading) => set({ isLoadingPrices: loading }),
  setPricing: (pricing) => set({ pricing }),
  updateComponentPricing: (componentId, pricing) =>
    set((state) => ({
      pricing: { ...state.pricing, [componentId]: pricing },
    })),
  setSelectedVendor: (componentId, vendor) =>
    set((state) => ({
      selectedVendors: { ...state.selectedVendors, [componentId]: vendor },
    })),
  clearPricing: () => set({ pricing: {}, selectedVendors: {} }),
}));

// Live Share Store - For Figma-like real-time collaboration
import type {
  LiveUser,
  LiveCursor,
  SharedChatMessage,
  SharePermission,
} from "../types";

interface LiveShareState {
  // Session state
  isLiveSession: boolean;
  shareId: string | null;
  permission: SharePermission;
  isConnecting: boolean;
  error: string | null;

  // Active users (excluding current user)
  activeUsers: LiveUser[];

  // Live cursors from other users
  cursors: Record<string, LiveCursor>;

  // Shared chat messages
  chatMessages: SharedChatMessage[];

  // Actions
  setIsLiveSession: (isLive: boolean) => void;
  setShareId: (id: string | null) => void;
  setPermission: (permission: SharePermission) => void;
  setIsConnecting: (connecting: boolean) => void;
  setError: (error: string | null) => void;
  setActiveUsers: (users: LiveUser[]) => void;
  setCursors: (cursors: Record<string, LiveCursor>) => void;
  setChatMessages: (messages: SharedChatMessage[]) => void;
  addChatMessage: (message: SharedChatMessage) => void;
  clearActiveUsers: () => void;
  clearChatMessages: () => void;
  resetLiveShare: () => void;
}

export const useLiveShareStore = create<LiveShareState>((set) => ({
  isLiveSession: false,
  shareId: null,
  permission: "view",
  isConnecting: false,
  error: null,
  activeUsers: [],
  cursors: {},
  chatMessages: [],

  setIsLiveSession: (isLive) => set({ isLiveSession: isLive }),
  setShareId: (id) => set({ shareId: id }),
  setPermission: (permission) => set({ permission }),
  setIsConnecting: (connecting) => set({ isConnecting: connecting }),
  setError: (error) => set({ error }),
  setActiveUsers: (users) => set({ activeUsers: users }),
  setCursors: (cursors) => set({ cursors }),
  setChatMessages: (messages) => set({ chatMessages: messages }),
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),
  clearActiveUsers: () => set({ activeUsers: [] }),
  clearChatMessages: () => set({ chatMessages: [] }),
  resetLiveShare: () =>
    set({
      isLiveSession: false,
      shareId: null,
      permission: "view",
      isConnecting: false,
      error: null,
      activeUsers: [],
      cursors: {},
      chatMessages: [],
    }),
}));
