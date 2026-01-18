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
  | "resistor"
  | "capacitor"
  | "inductor"
  | "potentiometer"
  | "fuse"
  | "battery"
  | "transformer"
  | "led"
  | "switch"
  | "pushbutton"
  | "wire"
  | "ground"
  | "voltmeter"
  | "ammeter"
  | "transistor"
  | "diode"
  | "relay"
  | "buzzer"
  | "motor"
  | "lightbulb"
  | "speaker"
  | "7segment"
  // Added analog + logic components
  | "opamp"
  | "and-gate"
  | "or-gate"
  | "not-gate"
  | "nand-gate"
  | "nor-gate"
  | "xor-gate"
  // Power & Energy
  | "dc-power-supply"
  | "ac-dc-converter"
  | "buck-converter"
  | "boost-converter"
  | "buck-boost-converter"
  | "ldo"
  | "battery-charger"
  | "battery-protection"
  | "power-path-controller"
  // Control & Compute
  | "microcontroller"
  | "microprocessor"
  | "fpga"
  | "clock-oscillator"
  | "reset-supervisor"
  | "gpio-expander"
  // Actuation & Drivers
  | "h-bridge"
  | "half-bridge"
  | "low-side-switch"
  | "high-side-switch"
  | "solid-state-relay"
  | "solenoid-driver"
  | "stepper-driver"
  // Motors & Loads
  | "stepper-motor"
  | "servo-motor"
  | "resistive-load"
  | "inductive-load"
  // Analog & Signal
  | "instrumentation-amplifier"
  | "comparator"
  | "analog-mux"
  | "rc-lpf"
  | "lc-filter"
  // Sensors
  | "analog-sensor"
  | "digital-sensor"
  | "temperature-sensor"
  | "pressure-sensor"
  | "current-sensor"
  | "voltage-sensor"
  // Communication
  | "uart"
  | "rs485"
  | "can"
  | "spi"
  | "i2c"
  | "ethernet"
  // Protection & Safety
  | "flyback-diode"
  | "tvs-diode"
  | "polyfuse"
  | "reverse-polarity"
  | "e-stop"
  // User Interfaces
  | "connector"
  | "terminal-block"
  | "led-indicator";

export type ComponentCategory =
  | "passive"
  | "active"
  | "source"
  | "measurement"
  | "output"
  | "connection";

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
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  actions?: ChatAction[];
  checkpointId?: string; // Reference to checkpoint created after this message
}

export interface ChatAction {
  type:
    | "add_component"
    | "remove_component"
    | "connect"
    | "explain"
    | "simulate";
  payload: Record<string, unknown>;
  label: string;
}

// Chat Checkpoint - saves canvas state at a point in conversation
export interface ChatCheckpoint {
  id: string;
  sessionId: string;
  messageId: string; // The message this checkpoint was created after
  name: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  timestamp: Date;
  isAutoSave?: boolean;
}

// Chat Session - represents a complete conversation
export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  checkpoints: ChatCheckpoint[];
  circuitState?: {
    nodes: CanvasNode[];
    edges: CanvasEdge[];
  }; // Stores the circuit state for this session
  createdAt: Date;
  updatedAt: Date;
  isArchived?: boolean;
  projectId?: string; // Optional link to a project
}

// Tutorial types
export interface CircuitDiagram {
  title: string;
  description: string;
  isReadOnly: boolean;
  showSimulation: boolean;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  steps: TutorialStep[];
  category: string;
  icon: string;
  completed?: boolean;
  progress?: number;
  circuitPointsReward?: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  type: "text" | "video" | "interactive" | "quiz" | "diagram";
  circuit?: CircuitDiagram | Partial<CircuitDiagram>;
  visualizeComponents?: string[]; // Component IDs to show in visualizer
  validationCriteria?: {
    requireComponents?: string[];
    requireMinConnections?: number;
    requirePowerSource?: boolean;
  };
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

// AR/Camera Analysis types
export interface ARDetectedComponent {
  type: string;
  count: number;
  colors?: string[];
  position?: string;
}

export interface ARBreadboardState {
  detected: boolean;
  type?: "mini" | "half" | "full";
  rows?: number;
}

export interface ARWiringConnection {
  color: string;
  from?: string;
  to?: string;
}

export interface ARAnalysisResult {
  components: ARDetectedComponent[];
  breadboard: ARBreadboardState;
  wiring: ARWiringConnection[];
  issues: string[];
  suggestions: string[];
  timestamp: number;
  latency?: number;
}

export type ARConnectionStatus =
  | "idle"
  | "generating"
  | "waiting"
  | "connecting"
  | "connected"
  | "error";

export type ARAnalysisStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "analyzing"
  | "stopped"
  | "error";

export interface ARCameraSource {
  type: "local" | "phone";
  stream?: MediaStream;
  peerId?: string;
}

export interface ARTutorialStep {
  id: number;
  instruction: string;
  completed: boolean;
  expectedComponents?: string[];
  feedback?: string;
}

// Shop/Pricing types
export type VendorName =
  | "octopart"
  | "findchips"
  | "amazon";

export interface VendorPrice {
  vendor: VendorName;
  vendorDisplayName: string;
  price: number;
  currency: string;
  url: string;
  inStock: boolean;
  stockQuantity?: number;
  minOrderQty?: number;
  leadTime?: string;
  partNumber?: string;
}

export interface ComponentPricing {
  componentId: string;
  componentName: string;
  componentType: string;
  quantity: number;
  prices: VendorPrice[];
  bestPrice: VendorPrice | null;
  lastUpdated: Date;
  status: "loading" | "success" | "error" | "no_results";
  errorMessage?: string;
}

export interface ShopCartItem {
  componentId: string;
  componentName: string;
  componentType: string;
  quantity: number;
  selectedVendor: VendorPrice | null;
  properties?: ComponentProperty[];
}

export interface ShopState {
  isOpen: boolean;
  items: ShopCartItem[];
  pricing: Record<string, ComponentPricing>;
  isLoadingPrices: boolean;
  totalPrice: number;
  currency: string;
}

// Live Share / Real-time Collaboration types
export type SharePermission = "view" | "edit";

export interface LiveCursor {
  oduserId: string;
  userName: string;
  userColor: string;
  x: number;
  y: number;
  lastUpdate: number;
}

export interface LiveUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  color: string;
  cursor?: { x: number; y: number };
  isOnline: boolean;
  lastSeen: number;
  permission: SharePermission;
}

export interface SharedChatMessage {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  content: string;
  timestamp: number;
  role: "user" | "assistant" | "system";
}

export interface SharedProject {
  id: string;
  shareId: string; // Short unique ID for sharing links
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  createdAt: number;
  updatedAt: number;
  isPublic: boolean;
  allowEditing: boolean;
  activeUsers: Record<string, LiveUser>;
  cursors: Record<string, LiveCursor>;
  chatMessages: SharedChatMessage[];
}

export interface LiveShareState {
  isLiveSession: boolean;
  shareId: string | null;
  projectId: string | null;
  permission: SharePermission;
  activeUsers: LiveUser[];
  chatMessages: SharedChatMessage[];
  isConnecting: boolean;
  error: string | null;
}
