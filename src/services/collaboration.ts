import { io, Socket } from 'socket.io-client';
import { useCollaborationStore } from '../stores';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

class CollaborationService {
  private socket: Socket | null = null;
  private userId: string | null = null;
  private userName: string | null = null;
  private userColor: string = '#22c55e';

  private colors = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  connect(userId: string, userName: string) {
    this.userId = userId;
    this.userName = userName;
    this.userColor = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    const store = useCollaborationStore.getState();

    this.socket.on('connect', () => {
      store.setIsConnected(true);
    });

    this.socket.on('disconnect', () => {
      store.setIsConnected(false);
    });

    this.socket.on('user-joined', (data: { id: string; name: string; color: string }) => {
      store.addCollaborator({
        id: data.id,
        name: data.name,
        color: data.color,
        cursor: { x: 0, y: 0 },
        isActive: true,
      });
    });

    this.socket.on('user-left', (data: { id: string }) => {
      store.removeCollaborator(data.id);
    });

    this.socket.on('cursor-move', (data: { id: string; x: number; y: number }) => {
      store.updateCollaboratorCursor(data.id, { x: data.x, y: data.y });
    });

    this.socket.on('node-added', (data: { node: unknown }) => {
      // Handle node addition from other users
      console.log('Node added by collaborator:', data);
    });

    this.socket.on('node-moved', (data: { nodeId: string; position: { x: number; y: number } }) => {
      // Handle node movement from other users
      console.log('Node moved by collaborator:', data);
    });

    this.socket.on('node-removed', (data: { nodeId: string }) => {
      // Handle node removal from other users
      console.log('Node removed by collaborator:', data);
    });

    this.socket.on('edge-added', (data: { edge: unknown }) => {
      // Handle edge addition from other users
      console.log('Edge added by collaborator:', data);
    });
  }

  joinSession(sessionId: string) {
    if (!this.socket || !this.userId) return;

    this.socket.emit('join-session', {
      sessionId,
      userId: this.userId,
      userName: this.userName,
      userColor: this.userColor,
    });

    useCollaborationStore.getState().setSessionId(sessionId);
  }

  leaveSession() {
    if (!this.socket) return;

    const sessionId = useCollaborationStore.getState().sessionId;
    if (sessionId) {
      this.socket.emit('leave-session', { sessionId, userId: this.userId });
    }

    useCollaborationStore.getState().setSessionId(null);
  }

  createSession(): string {
    const sessionId = this.generateSessionId();
    this.joinSession(sessionId);
    useCollaborationStore.getState().setIsHost(true);
    return sessionId;
  }

  moveCursor(x: number, y: number) {
    if (!this.socket) return;

    const sessionId = useCollaborationStore.getState().sessionId;
    if (sessionId) {
      this.socket.emit('cursor-move', {
        sessionId,
        userId: this.userId,
        x,
        y,
      });
    }
  }

  addNode(node: unknown) {
    if (!this.socket) return;

    const sessionId = useCollaborationStore.getState().sessionId;
    if (sessionId) {
      this.socket.emit('node-added', { sessionId, node });
    }
  }

  moveNode(nodeId: string, position: { x: number; y: number }) {
    if (!this.socket) return;

    const sessionId = useCollaborationStore.getState().sessionId;
    if (sessionId) {
      this.socket.emit('node-moved', { sessionId, nodeId, position });
    }
  }

  removeNode(nodeId: string) {
    if (!this.socket) return;

    const sessionId = useCollaborationStore.getState().sessionId;
    if (sessionId) {
      this.socket.emit('node-removed', { sessionId, nodeId });
    }
  }

  addEdge(edge: unknown) {
    if (!this.socket) return;

    const sessionId = useCollaborationStore.getState().sessionId;
    if (sessionId) {
      this.socket.emit('edge-added', { sessionId, edge });
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSessionLink(): string {
    const sessionId = useCollaborationStore.getState().sessionId;
    return `${window.location.origin}/collaborate/${sessionId}`;
  }
}

export const collaborationService = new CollaborationService();
