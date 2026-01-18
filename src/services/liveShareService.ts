import {
  ref,
  set,
  onValue,
  onDisconnect,
  push,
  update,
  remove,
  off,
  get,
} from "firebase/database";
import { realtimeDb } from "../lib/firebase";
import { useLiveShareStore, useCircuitStore } from "../stores";
import type {
  CanvasNode,
  CanvasEdge,
  LiveUser,
  LiveCursor,
  SharedChatMessage,
  SharePermission,
} from "../types";

// Generate a short, URL-friendly share ID
const generateShareId = (): string => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Random colors for user cursors
const CURSOR_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#6366f1",
];

const getRandomColor = (): string => {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
};

class LiveShareService {
  private userId: string | null = null;
  private userName: string | null = null;
  private userColor: string = getRandomColor();
  private shareId: string | null = null;
  private projectRef: string | null = null;
  private unsubscribers: (() => void)[] = [];
  private cursorThrottle: ReturnType<typeof setTimeout> | null = null;
  private pendingCursor: { x: number; y: number } | null = null;
  private isProcessingRemoteChanges = false;

  // Initialize user info
  setUser(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
    this.userColor = getRandomColor();
  }

  // Create a new shared project
  async createSharedProject(
    name: string,
    description: string,
    nodes: CanvasNode[],
    edges: CanvasEdge[],
    isPublic: boolean = false,
    allowEditing: boolean = true,
  ): Promise<string> {
    if (!this.userId || !this.userName) {
      throw new Error("User not authenticated");
    }

    const shareId = generateShareId();
    const projectRef = ref(realtimeDb, `shared-projects/${shareId}`);

    const project = {
      id: shareId,
      shareId,
      name,
      description,
      ownerId: this.userId,
      ownerName: this.userName,
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPublic,
      allowEditing,
      activeUsers: {},
      cursors: {},
      chatMessages: [],
    };

    await set(projectRef, project);

    // Auto-join the session as host
    await this.joinSession(shareId, "edit");

    return shareId;
  }

  // Join an existing shared project
  async joinSession(
    shareId: string,
    permission: SharePermission = "view",
  ): Promise<boolean> {
    if (!this.userId || !this.userName) {
      throw new Error("User not authenticated");
    }

    const store = useLiveShareStore.getState();
    store.setIsConnecting(true);
    store.setError(null);

    try {
      // Check if project exists
      const projectRef = ref(realtimeDb, `shared-projects/${shareId}`);
      const snapshot = await get(projectRef);

      if (!snapshot.exists()) {
        store.setError("Project not found");
        store.setIsConnecting(false);
        return false;
      }

      const projectData = snapshot.val();

      // Determine permission based on project settings
      let effectivePermission = permission;
      if (projectData.ownerId === this.userId) {
        effectivePermission = "edit";
      } else if (!projectData.allowEditing) {
        effectivePermission = "view";
      }

      this.shareId = shareId;
      this.projectRef = `shared-projects/${shareId}`;

      // Add user to active users
      const userRef = ref(
        realtimeDb,
        `${this.projectRef}/activeUsers/${this.userId}`,
      );
      const userData: LiveUser = {
        id: this.userId,
        name: this.userName,
        email: "",
        color: this.userColor,
        isOnline: true,
        lastSeen: Date.now(),
        permission: effectivePermission,
      };

      await set(userRef, userData);

      // Set up disconnect handler
      onDisconnect(userRef).update({
        isOnline: false,
        lastSeen: Date.now(),
      });

      // Set up real-time listeners
      this.setupListeners();

      // Load initial canvas state
      const circuitStore = useCircuitStore.getState();
      if (projectData.nodes) {
        circuitStore.loadProject(projectData.nodes, projectData.edges || []);
      }

      store.setShareId(shareId);
      store.setPermission(effectivePermission);
      store.setIsLiveSession(true);
      store.setIsConnecting(false);

      return true;
    } catch (error) {
      console.error("Failed to join session:", error);
      store.setError("Failed to join session");
      store.setIsConnecting(false);
      return false;
    }
  }

  // Leave the current session
  async leaveSession() {
    if (!this.userId || !this.projectRef) return;

    const store = useLiveShareStore.getState();

    // Clean up listeners
    this.unsubscribers.forEach((unsub) => unsub());
    this.unsubscribers = [];

    // Remove cursor
    const cursorRef = ref(
      realtimeDb,
      `${this.projectRef}/cursors/${this.userId}`,
    );
    await remove(cursorRef);

    // Update user status to offline
    const userRef = ref(
      realtimeDb,
      `${this.projectRef}/activeUsers/${this.userId}`,
    );
    await update(userRef, {
      isOnline: false,
      lastSeen: Date.now(),
    });

    this.shareId = null;
    this.projectRef = null;

    store.setIsLiveSession(false);
    store.setShareId(null);
    store.clearActiveUsers();
    store.clearChatMessages();
  }

  // Set up real-time listeners for the project
  private setupListeners() {
    if (!this.projectRef) return;

    // Listen for active users changes
    const usersRef = ref(realtimeDb, `${this.projectRef}/activeUsers`);
    onValue(usersRef, (snapshot) => {
      const users: LiveUser[] = [];
      snapshot.forEach((child) => {
        const user = child.val() as LiveUser;
        // Don't include current user in the list
        if (user.id !== this.userId) {
          users.push(user);
        }
      });
      useLiveShareStore.getState().setActiveUsers(users);
    });
    this.unsubscribers.push(() => off(usersRef));

    // Listen for cursor updates
    const cursorsRef = ref(realtimeDb, `${this.projectRef}/cursors`);
    onValue(cursorsRef, (snapshot) => {
      const cursors: Record<string, LiveCursor> = {};
      snapshot.forEach((child) => {
        const cursor = child.val() as LiveCursor;
        if (cursor.oduserId !== this.userId) {
          cursors[cursor.oduserId] = cursor;
        }
      });
      useLiveShareStore.getState().setCursors(cursors);
    });
    this.unsubscribers.push(() => off(cursorsRef));

    // Listen for node changes
    const nodesRef = ref(realtimeDb, `${this.projectRef}/nodes`);
    onValue(nodesRef, (snapshot) => {
      if (this.isProcessingRemoteChanges) return;

      const nodes = snapshot.val() as CanvasNode[] | null;
      if (nodes) {
        this.isProcessingRemoteChanges = true;
        useCircuitStore.getState().updateNodes(nodes);
        this.isProcessingRemoteChanges = false;
      }
    });
    this.unsubscribers.push(() => off(nodesRef));

    // Listen for edge changes
    const edgesRef = ref(realtimeDb, `${this.projectRef}/edges`);
    onValue(edgesRef, (snapshot) => {
      if (this.isProcessingRemoteChanges) return;

      const edges = snapshot.val() as CanvasEdge[] | null;
      if (edges) {
        this.isProcessingRemoteChanges = true;
        useCircuitStore.getState().updateEdges(edges);
        this.isProcessingRemoteChanges = false;
      }
    });
    this.unsubscribers.push(() => off(edgesRef));

    // Listen for chat messages
    const chatRef = ref(realtimeDb, `${this.projectRef}/chatMessages`);
    onValue(chatRef, (snapshot) => {
      const messages: SharedChatMessage[] = [];
      snapshot.forEach((child) => {
        messages.push(child.val() as SharedChatMessage);
      });
      // Sort by timestamp
      messages.sort((a, b) => a.timestamp - b.timestamp);
      useLiveShareStore.getState().setChatMessages(messages);
    });
    this.unsubscribers.push(() => off(chatRef));
  }

  // Update cursor position (throttled)
  updateCursor(x: number, y: number) {
    if (!this.userId || !this.projectRef) return;

    this.pendingCursor = { x, y };

    // Throttle cursor updates to ~30fps
    if (!this.cursorThrottle) {
      this.cursorThrottle = setTimeout(() => {
        if (this.pendingCursor && this.projectRef) {
          const cursorRef = ref(
            realtimeDb,
            `${this.projectRef}/cursors/${this.userId}`,
          );
          const cursor: LiveCursor = {
            oduserId: this.userId!,
            userName: this.userName!,
            userColor: this.userColor,
            x: this.pendingCursor.x,
            y: this.pendingCursor.y,
            lastUpdate: Date.now(),
          };
          set(cursorRef, cursor);
        }
        this.cursorThrottle = null;
      }, 33); // ~30fps
    }
  }

  // Sync node changes to Firebase
  async syncNodes(nodes: CanvasNode[]) {
    if (!this.projectRef || this.isProcessingRemoteChanges) return;

    const store = useLiveShareStore.getState();
    if (store.permission === "view") return; // Read-only users can't edit

    const nodesRef = ref(realtimeDb, `${this.projectRef}/nodes`);
    await set(nodesRef, JSON.parse(JSON.stringify(nodes)));

    // Update project timestamp
    const updatedRef = ref(realtimeDb, `${this.projectRef}/updatedAt`);
    await set(updatedRef, Date.now());
  }

  // Sync edge changes to Firebase
  async syncEdges(edges: CanvasEdge[]) {
    if (!this.projectRef || this.isProcessingRemoteChanges) return;

    const store = useLiveShareStore.getState();
    if (store.permission === "view") return;

    const edgesRef = ref(realtimeDb, `${this.projectRef}/edges`);
    await set(edgesRef, JSON.parse(JSON.stringify(edges)));

    // Update project timestamp
    const updatedRef = ref(realtimeDb, `${this.projectRef}/updatedAt`);
    await set(updatedRef, Date.now());
  }

  // Send a chat message
  async sendChatMessage(
    content: string,
    role: "user" | "assistant" | "system" = "user",
  ) {
    if (!this.userId || !this.userName || !this.projectRef) return;

    const chatRef = ref(realtimeDb, `${this.projectRef}/chatMessages`);
    const newMessageRef = push(chatRef);

    const message: SharedChatMessage = {
      id: newMessageRef.key!,
      userId: this.userId,
      userName: this.userName,
      userColor: this.userColor,
      content,
      timestamp: Date.now(),
      role,
    };

    await set(newMessageRef, message);
  }

  // Get share URL for the current project
  getShareUrl(): string | null {
    if (!this.shareId) return null;
    return `${window.location.origin}/project/${this.shareId}`;
  }

  // Check if currently in a live session
  isInSession(): boolean {
    return !!this.shareId;
  }

  // Get current share ID
  getShareId(): string | null {
    return this.shareId;
  }

  // Update project settings (owner only)
  async updateProjectSettings(settings: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    allowEditing?: boolean;
  }) {
    if (!this.projectRef) return;

    const projectRef = ref(realtimeDb, this.projectRef);
    await update(projectRef, {
      ...settings,
      updatedAt: Date.now(),
    });
  }

  // Get project info without joining
  async getProjectInfo(shareId: string): Promise<{
    name: string;
    ownerName: string;
    isPublic: boolean;
    allowEditing: boolean;
    activeUserCount: number;
  } | null> {
    const projectRef = ref(realtimeDb, `shared-projects/${shareId}`);
    const snapshot = await get(projectRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    return {
      name: data.name,
      ownerName: data.ownerName,
      isPublic: data.isPublic,
      allowEditing: data.allowEditing,
      activeUserCount: Object.keys(data.activeUsers || {}).filter(
        (key) => data.activeUsers[key].isOnline,
      ).length,
    };
  }
}

// Singleton instance
export const liveShareService = new LiveShareService();
export default liveShareService;
