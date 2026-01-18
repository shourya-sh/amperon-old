import { db, auth } from "../lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import type { Project, CanvasNode, CanvasEdge, ChatSession } from "../types";

const PROJECTS_COLLECTION = "projects";
const LOCAL_STORAGE_KEY = "amperon-projects";

// Types for Firestore documents
interface FirestoreProject {
  id: string;
  name: string;
  description: string;
  userId: string;
  nodes: string; // JSON stringified
  edges: string; // JSON stringified
  chatSessionId?: string;
  chatSession?: string; // JSON stringified chat session
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  collaborators: string[];
  isPublic: boolean;
  thumbnail?: string;
}

// Convert Firestore document to Project type
const firestoreToProject = (
  data: FirestoreProject,
): Project & { chatSessionId?: string; chatSession?: ChatSession } => {
  let chatSession: ChatSession | undefined;
  try {
    if (data.chatSession) {
      const parsed = JSON.parse(data.chatSession);
      chatSession = {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
        messages: parsed.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
        checkpoints: parsed.checkpoints.map((cp: any) => ({
          ...cp,
          timestamp: new Date(cp.timestamp),
        })),
      };
    }
  } catch (e) {
    console.error("Error parsing chat session:", e);
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    userId: data.userId,
    nodes: JSON.parse(data.nodes || "[]"),
    edges: JSON.parse(data.edges || "[]"),
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    collaborators: data.collaborators || [],
    isPublic: data.isPublic || false,
    thumbnail: data.thumbnail,
    chatSessionId: data.chatSessionId,
    chatSession,
  };
};

// Convert Project to Firestore document
const projectToFirestore = (
  project: Project & { chatSessionId?: string; chatSession?: ChatSession },
): Omit<FirestoreProject, "createdAt" | "updatedAt"> & {
  updatedAt: any;
  createdAt?: any;
} => {
  const result: any = {
    id: project.id,
    name: project.name,
    description: project.description,
    userId: project.userId,
    nodes: JSON.stringify(project.nodes),
    edges: JSON.stringify(project.edges),
    collaborators: project.collaborators,
    isPublic: project.isPublic,
    thumbnail: project.thumbnail,
    updatedAt: serverTimestamp(),
  };

  if (project.chatSessionId) {
    result.chatSessionId = project.chatSessionId;
  }

  if (project.chatSession) {
    result.chatSession = JSON.stringify({
      ...project.chatSession,
      createdAt:
        project.chatSession.createdAt instanceof Date
          ? project.chatSession.createdAt.toISOString()
          : project.chatSession.createdAt,
      updatedAt:
        project.chatSession.updatedAt instanceof Date
          ? project.chatSession.updatedAt.toISOString()
          : project.chatSession.updatedAt,
      messages: project.chatSession.messages.map((m) => ({
        ...m,
        timestamp:
          m.timestamp instanceof Date ? m.timestamp.toISOString() : m.timestamp,
      })),
      checkpoints: project.chatSession.checkpoints.map((cp) => ({
        ...cp,
        timestamp:
          cp.timestamp instanceof Date
            ? cp.timestamp.toISOString()
            : cp.timestamp,
      })),
    });
  }

  return result;
};

class ProjectService {
  // Save project to both localStorage and Firebase (if authenticated)
  async saveProject(
    project: Project & { chatSessionId?: string; chatSession?: ChatSession },
    isNew = false,
  ): Promise<void> {
    // Always save to localStorage
    this.saveToLocalStorage(project);

    // Save to Firebase if authenticated
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, PROJECTS_COLLECTION, project.id);
        const firestoreData = projectToFirestore(project);

        if (isNew) {
          firestoreData.createdAt = serverTimestamp();
        }

        await setDoc(docRef, firestoreData, { merge: !isNew });
      } catch (error) {
        console.error("Error saving project to Firebase:", error);
        // Project is still saved locally, so don't throw
      }
    }
  }

  // Get all projects for the current user
  async getProjects(): Promise<
    (Project & { chatSessionId?: string; chatSession?: ChatSession })[]
  > {
    const localProjects = this.getFromLocalStorage();

    const user = auth.currentUser;
    if (!user) {
      return localProjects;
    }

    try {
      const q = query(
        collection(db, PROJECTS_COLLECTION),
        where("userId", "==", user.uid),
        orderBy("updatedAt", "desc"),
      );

      const snapshot = await getDocs(q);
      const firebaseProjects = snapshot.docs.map((doc) =>
        firestoreToProject(doc.data() as FirestoreProject),
      );

      // Merge: Firebase projects take precedence, but keep local-only projects
      const firebaseIds = new Set(firebaseProjects.map((p) => p.id));
      const localOnlyProjects = localProjects.filter(
        (p) => !firebaseIds.has(p.id),
      );

      return [...firebaseProjects, ...localOnlyProjects];
    } catch (error) {
      console.error("Error fetching projects from Firebase:", error);
      return localProjects;
    }
  }

  // Get a single project by ID
  async getProject(
    id: string,
  ): Promise<
    (Project & { chatSessionId?: string; chatSession?: ChatSession }) | null
  > {
    // Try local first
    const localProjects = this.getFromLocalStorage();
    const localProject = localProjects.find((p) => p.id === id);

    const user = auth.currentUser;
    if (!user) {
      return localProject || null;
    }

    try {
      const docRef = doc(db, PROJECTS_COLLECTION, id);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        return firestoreToProject(snapshot.data() as FirestoreProject);
      }

      return localProject || null;
    } catch (error) {
      console.error("Error fetching project from Firebase:", error);
      return localProject || null;
    }
  }

  // Delete a project
  async deleteProject(id: string): Promise<void> {
    // Remove from localStorage
    this.removeFromLocalStorage(id);

    // Remove from Firebase if authenticated
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, PROJECTS_COLLECTION, id);
        await deleteDoc(docRef);
      } catch (error) {
        console.error("Error deleting project from Firebase:", error);
      }
    }
  }

  // Create a new project
  createProject(
    name: string,
    description: string,
    nodes: CanvasNode[] = [],
    edges: CanvasEdge[] = [],
    chatSession?: ChatSession,
  ): Project & { chatSessionId?: string; chatSession?: ChatSession } {
    const user = auth.currentUser;
    const now = new Date();

    return {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      userId: user?.uid || "local",
      nodes,
      edges,
      createdAt: now,
      updatedAt: now,
      collaborators: [],
      isPublic: false,
      chatSessionId: chatSession?.id,
      chatSession,
    };
  }

  // Local storage helpers
  private saveToLocalStorage(
    project: Project & { chatSessionId?: string; chatSession?: ChatSession },
  ): void {
    try {
      const projects = this.getFromLocalStorage();
      const existingIndex = projects.findIndex((p) => p.id === project.id);

      const projectToSave = {
        ...project,
        createdAt:
          project.createdAt instanceof Date
            ? project.createdAt.toISOString()
            : project.createdAt,
        updatedAt: new Date().toISOString(),
        chatSession: project.chatSession
          ? {
              ...project.chatSession,
              createdAt:
                project.chatSession.createdAt instanceof Date
                  ? project.chatSession.createdAt.toISOString()
                  : project.chatSession.createdAt,
              updatedAt:
                project.chatSession.updatedAt instanceof Date
                  ? project.chatSession.updatedAt.toISOString()
                  : project.chatSession.updatedAt,
              messages: project.chatSession.messages.map((m) => ({
                ...m,
                timestamp:
                  m.timestamp instanceof Date
                    ? m.timestamp.toISOString()
                    : m.timestamp,
              })),
              checkpoints: project.chatSession.checkpoints.map((cp) => ({
                ...cp,
                timestamp:
                  cp.timestamp instanceof Date
                    ? cp.timestamp.toISOString()
                    : cp.timestamp,
              })),
            }
          : undefined,
      };

      if (existingIndex >= 0) {
        projects[existingIndex] = projectToSave as any;
      } else {
        projects.unshift(projectToSave as any);
      }

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  private getFromLocalStorage(): (Project & {
    chatSessionId?: string;
    chatSession?: ChatSession;
  })[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!data) return [];

      const projects = JSON.parse(data);
      return projects.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
        chatSession: p.chatSession
          ? {
              ...p.chatSession,
              createdAt: new Date(p.chatSession.createdAt),
              updatedAt: new Date(p.chatSession.updatedAt),
              messages: p.chatSession.messages.map((m: any) => ({
                ...m,
                timestamp: new Date(m.timestamp),
              })),
              checkpoints: p.chatSession.checkpoints.map((cp: any) => ({
                ...cp,
                timestamp: new Date(cp.timestamp),
              })),
            }
          : undefined,
      }));
    } catch (error) {
      console.error("Error reading from localStorage:", error);
      return [];
    }
  }

  private removeFromLocalStorage(id: string): void {
    try {
      const projects = this.getFromLocalStorage();
      const filtered = projects.filter((p) => p.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
  }
}

export const projectService = new ProjectService();
export default projectService;
