// Circuit Simulator Service
// Simulates current flow and detects errors in circuits

import type { CanvasNode, CanvasEdge } from '../types';

export interface SimulationResult {
  isValid: boolean;
  isComplete: boolean;
  errors: SimulationError[];
  warnings: string[];
  currentFlow: CurrentFlowPath[];
  voltage: number;
  totalResistance: number;
  totalCurrent: number; // in Amps
}

export interface SimulationError {
  type: 'open_circuit' | 'short_circuit' | 'missing_power' | 'missing_ground' | 'component_error';
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}

export interface CurrentFlowPath {
  edgeId: string;
  fromNodeId: string;
  toNodeId: string;
  current: number; // in mA
  order: number;
}

// Check if circuit has required components
function checkRequiredComponents(nodes: CanvasNode[]): SimulationError[] {
  const errors: SimulationError[] = [];
  const types = nodes.map(n => n.data.component.type);
  
  // Check for power source
  if (!types.includes('battery')) {
    errors.push({
      type: 'missing_power',
      message: 'Circuit needs a power source (battery)',
    });
  }
  
  return errors;
}

// Build adjacency map from edges
function buildAdjacencyMap(nodes: CanvasNode[], edges: CanvasEdge[]): Map<string, string[]> {
  const adjacency = new Map<string, string[]>();
  
  nodes.forEach(node => {
    adjacency.set(node.id, []);
  });
  
  edges.forEach(edge => {
    const sourceNeighbors = adjacency.get(edge.source) || [];
    sourceNeighbors.push(edge.target);
    adjacency.set(edge.source, sourceNeighbors);
    
    // Bidirectional for circuit analysis
    const targetNeighbors = adjacency.get(edge.target) || [];
    targetNeighbors.push(edge.source);
    adjacency.set(edge.target, targetNeighbors);
  });
  
  return adjacency;
}

// Check if circuit is closed (has a complete path)
function isCircuitClosed(nodes: CanvasNode[], edges: CanvasEdge[]): boolean {
  if (nodes.length === 0 || edges.length === 0) return false;
  
  const adjacency = buildAdjacencyMap(nodes, edges);
  
  // Find battery node
  const batteryNode = nodes.find(n => n.data.component.type === 'battery');
  if (!batteryNode) return false;
  
  // BFS to check if we can get back to battery
  const visited = new Set<string>();
  const queue: string[] = [batteryNode.id];
  visited.add(batteryNode.id);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    const neighbors = adjacency.get(current) || [];
    
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  // Check if all nodes are reachable
  return visited.size === nodes.length;
}

// Calculate current flow path
function calculateCurrentFlow(nodes: CanvasNode[], edges: CanvasEdge[]): CurrentFlowPath[] {
  const flowPaths: CurrentFlowPath[] = [];
  
  // Find battery
  const batteryNode = nodes.find(n => n.data.component.type === 'battery');
  if (!batteryNode) return flowPaths;
  
  // Get battery voltage
  const voltageProp = batteryNode.data.component.properties?.find(p => p.name === 'Voltage');
  const voltage = typeof voltageProp?.value === 'number' ? voltageProp.value : 9;
  
  // Calculate total resistance
  let totalResistance = 0;
  nodes.forEach(node => {
    if (node.data.component.type === 'resistor') {
      const resProp = node.data.component.properties?.find(p => p.name === 'Resistance');
      totalResistance += typeof resProp?.value === 'number' ? resProp.value : 1000;
    }
    // Add default resistance for LEDs, buzzers, motors
    if (['led', 'buzzer', 'motor', 'lightbulb'].includes(node.data.component.type)) {
      totalResistance += 100; // Default internal resistance
    }
  });
  
  // Avoid division by zero
  if (totalResistance === 0) totalResistance = 1;
  
  // Calculate current (I = V/R) in mA
  const current = (voltage / totalResistance) * 1000;
  
  // Create flow path based on edge order
  edges.forEach((edge, idx) => {
    flowPaths.push({
      edgeId: edge.id,
      fromNodeId: edge.source,
      toNodeId: edge.target,
      current,
      order: idx,
    });
  });
  
  return flowPaths;
}

// Main simulation function
export function simulateCircuit(nodes: CanvasNode[], edges: CanvasEdge[]): SimulationResult {
  const errors: SimulationError[] = [];
  const warnings: string[] = [];
  
  // Check for empty circuit
  if (nodes.length === 0) {
    return {
      isValid: false,
      isComplete: false,
      errors: [{ type: 'open_circuit', message: 'No components in circuit' }],
      warnings: [],
      currentFlow: [],
      voltage: 0,
      totalResistance: 0,
      totalCurrent: 0,
    };
  }
  
  // Check required components
  errors.push(...checkRequiredComponents(nodes));
  
  // Check if circuit is closed
  const isClosed = isCircuitClosed(nodes, edges);
  if (!isClosed && edges.length > 0) {
    errors.push({
      type: 'open_circuit',
      message: 'Circuit is not complete. Check all connections.',
    });
  }
  
  if (edges.length === 0) {
    errors.push({
      type: 'open_circuit', 
      message: 'No connections between components. Wire them together!',
    });
  }
  
  // Calculate current flow
  const currentFlow = calculateCurrentFlow(nodes, edges);
  
  // Get voltage
  const batteryNode = nodes.find(n => n.data.component.type === 'battery');
  const voltageProp = batteryNode?.data.component.properties?.find(p => p.name === 'Voltage');
  const voltage = typeof voltageProp?.value === 'number' ? voltageProp.value : 9;
  
  // Calculate total resistance
  let totalResistance = 0;
  nodes.forEach(node => {
    if (node.data.component.type === 'resistor') {
      const resProp = node.data.component.properties?.find(p => p.name === 'Resistance');
      totalResistance += typeof resProp?.value === 'number' ? resProp.value : 1000;
    }
    if (['led', 'buzzer', 'motor', 'lightbulb'].includes(node.data.component.type)) {
      totalResistance += 100;
    }
  });
  
  // Calculate total current (I = V / R)
  const totalCurrent = totalResistance > 0 ? voltage / totalResistance : 0;

  // Add warnings for high current
  if (totalCurrent > 0.5) {
    warnings.push('Warning: High current detected. Components may overheat.');
  }
  
  // Check for LED without resistor
  const hasLed = nodes.some(n => n.data.component.type === 'led');
  const hasResistor = nodes.some(n => n.data.component.type === 'resistor');
  if (hasLed && !hasResistor) {
    warnings.push('Warning: LED without resistor may burn out!');
  }
  
  return {
    isValid: errors.length === 0,
    isComplete: isClosed,
    errors,
    warnings,
    currentFlow,
    voltage,
    totalResistance,
    totalCurrent,
  };
}

// Get simulation status message
export function getSimulationStatus(result: SimulationResult): string {
  if (!result.isValid) {
    return result.errors.map(e => e.message).join(' ');
  }
  
  const current = result.totalResistance > 0 
    ? ((result.voltage / result.totalResistance) * 1000).toFixed(2)
    : '0';
  
  return `Circuit OK! Voltage: ${result.voltage}V, Current: ${current}mA, Resistance: ${result.totalResistance}Ω`;
}
