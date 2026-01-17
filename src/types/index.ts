// Circuit component types
export interface CircuitComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  symbol: string;
  category: ComponentCategory;
  properties: ComponentProperty[];
  connections: number;
  icon: string;
}

export type ComponentType = 
  | 'resistor' 
  | 'capacitor' 
  | 'inductor' 
  | 'battery' 
  | 'led' 
  | 'switch' 
  | 'wire' 
  | 'ground'
  | 'voltmeter'
  | 'ammeter'
  | 'transistor'
  | 'diode'
  | 'buzzer'
  | 'motor'
  | 'lightbulb'
  // Added analog + logic components
  | 'opamp'
  | 'and-gate'
  | 'or-gate'
  | 'not-gate'
  | 'nand-gate'
  | 'nor-gate'
  | 'xor-gate';

export type ComponentCategory = 
  | 'passive' 
  | 'active' 
  | 'source' 
  | 'measurement' 
  | 'output'
  | 'connection';

export interface ComponentProperty {
  name: string;
  value: string | number;
  unit: string;
  editable: boolean;
}

// Canvas types
export interface CanvasNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    component: CircuitComponent;
    rotation: number;
    label?: string;
    // Visual state driven by simulation
    isActive?: boolean;
  };
}

export interface CanvasEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  type?: string;
  animated?: boolean;
  style?: { stroke?: string; strokeWidth?: number };
  label?: string;
  // Use a permissive type here to avoid React Flow TS incompatibilities
  markerEnd?: any;
  labelStyle?: { fill?: string; fontSize?: number };
  labelBgStyle?: { fill?: string; rx?: number; ry?: number };
  labelBgPadding?: [number, number];
}

// User & Auth types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  projects: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Project types
export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  createdAt: Date;
  updatedAt: Date;
  collaborators: string[];
  isPublic: boolean;
  thumbnail?: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
}

export interface ChatAction {
  type: 'add_component' | 'remove_component' | 'connect' | 'explain' | 'simulate';
  payload: Record<string, unknown>;
  label: string;
}

// Tutorial types
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  steps: TutorialStep[];
  category: string;
  icon: string;
  completed?: boolean;
  progress?: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'video' | 'interactive' | 'quiz';
  action?: {
    type: string;
    component?: string;
    position?: { x: number; y: number };
  };
  completed: boolean;
}

// Collaboration types
export interface Collaborator {
  id: string;
  name: string;
  color: string;
  cursor: { x: number; y: number };
  isActive: boolean;
}

export interface CollaborationState {
  sessionId: string | null;
  collaborators: Collaborator[];
  isConnected: boolean;
  isHost: boolean;
}

// Breadboard types
export interface BreadboardCell {
  row: string;
  col: number;
  connected: boolean;
  componentId?: string;
  wireColor?: string;
}

export interface BreadboardState {
  rows: number;
  cols: number;
  cells: BreadboardCell[][];
  powerRails: {
    positive: number[];
    negative: number[];
  };
}
