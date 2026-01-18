import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  X, 
  MessageSquare,
  Trash2,
  Maximize2,
  Minimize2,
  Loader2
} from 'lucide-react';
import { useChatStore, useCircuitStore } from '../../stores';
import { circuitComponents } from '../../data/components';
import { sendMessageToAI } from '../../services/aiService';
import type { ChatMessage, CanvasEdge } from '../../types';
import type { CurrentCircuitState } from '../../services/aiService';

const quickActions = [
  { id: 'led-circuit', label: 'Build LED circuit', prompt: 'Build me a simple LED circuit' },
  { id: 'motor-circuit', label: 'Motor with switch', prompt: 'Build a motor circuit with a switch to control it' },
  { id: 'explain', label: 'What is a capacitor?', prompt: 'Explain what a capacitor is and how it works' },
  { id: 'ohms-law', label: "Ohm's Law", prompt: 'Teach me about Ohm\'s Law with an example' },
];

const ChatPanel: React.FC = () => {
  const { messages, addMessage, isOpen, setIsOpen, isLoading, setIsLoading, clearMessages, lastCircuitAction, setLastCircuitAction } = useChatStore();
  const { nodes, edges, addNode, addEdge, clearCanvas, triggerFitView } = useCircuitStore();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Build current circuit state from canvas nodes/edges for AI context
  const getCurrentCircuitState = useCallback((): CurrentCircuitState => {
    const components = nodes.map(node => ({
      type: node.data.component?.type || 'unknown',
      id: node.id,
      label: node.data.label,
    }));
    
    const connections = edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      return {
        fromType: sourceNode?.data.component?.type || 'unknown',
        toType: targetNode?.data.component?.type || 'unknown',
      };
    });
    
    return { components, connections };
  }, [nodes, edges]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Label mapping for clarity
  const getLabelPrefix = (type: string) => {
    switch (type) {
      case 'battery': return 'B';
      case 'resistor': return 'R';
      case 'capacitor': return 'C';
      case 'inductor': return 'L';
      case 'led': return 'LED';
      case 'diode': return 'D';
      case 'transistor': return 'Q';
      case 'switch': return 'SW';
      case 'motor': return 'M';
      case 'lightbulb': return 'LAMP';
      case 'buzzer': return 'BZ';
      case 'voltmeter': return 'V';
      case 'ammeter': return 'A';
      case 'ground': return 'GND';
      default: return type.toUpperCase();
    }
  };

  // Layout components based on circuit topology - handles parallel branches
  const computeLayout = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number }>
  ) => {
    const baseX = 200;
    const baseY = 200;
    const hSpacing = 200;  // Horizontal spacing between components
    const vSpacing = 180;  // Vertical spacing between rows
    const snap = (value: number) => Math.round(value / 20) * 20;

    const nodeCount = components.length;
    const positions: Array<{ x: number; y: number }> = new Array(nodeCount);
    
    if (nodeCount === 0) return positions;

    // Component type classifications for layout
    const POWER_SOURCES = new Set(['battery', 'dc-power-supply', 'ac-dc-converter']);
    const REGULATORS = new Set(['buck-converter', 'boost-converter', 'buck-boost-converter', 'ldo']);
    const MOTOR_DRIVERS = new Set(['h-bridge', 'half-bridge', 'stepper-driver', 'solenoid-driver']);
    const MOTORS = new Set(['motor', 'stepper-motor', 'servo-motor']);
    const SENSORS = new Set(['analog-sensor', 'digital-sensor', 'temperature-sensor', 'pressure-sensor', 'current-sensor', 'voltage-sensor']);

    // Build adjacency list and reverse adjacency (to find what connects TO each node)
    const outgoing = new Map<number, number[]>();
    const incoming = new Map<number, number[]>();
    connections.forEach(({ from, to }) => {
      if (!outgoing.has(from)) outgoing.set(from, []);
      outgoing.get(from)!.push(to);
      if (!incoming.has(to)) incoming.set(to, []);
      incoming.get(to)!.push(from);
    });

    // Find key component indices
    const batteryIdx = components.findIndex((c) => POWER_SOURCES.has(c.type));
    const groundIdx = components.findIndex((c) => c.type === 'ground');
    const regulatorIdxs = components.map((c, i) => REGULATORS.has(c.type) ? i : -1).filter(i => i >= 0);
    const motorDriverIdxs = components.map((c, i) => MOTOR_DRIVERS.has(c.type) ? i : -1).filter(i => i >= 0);
    const motorIdxs = components.map((c, i) => MOTORS.has(c.type) ? i : -1).filter(i => i >= 0);
    const sensorIdxs = components.map((c, i) => SENSORS.has(c.type) ? i : -1).filter(i => i >= 0);

    // Organize into rows based on circuit hierarchy
    // Row 0: Power source
    // Row 1: Regulators (if any)
    // Row 2: Power distribution (motor drivers, main circuit path)
    // Row 3: Loads (motors, LEDs, sensors)
    // Row 4: Ground
    
    const rows: number[][] = [[], [], [], [], []];
    const placed = new Set<number>();

    // Row 0: Power source
    if (batteryIdx >= 0) {
      rows[0].push(batteryIdx);
      placed.add(batteryIdx);
    }

    // Row 1: Regulators
    regulatorIdxs.forEach(idx => {
      if (!placed.has(idx)) {
        rows[1].push(idx);
        placed.add(idx);
      }
    });

    // Row 2: Motor drivers and intermediate components
    motorDriverIdxs.forEach(idx => {
      if (!placed.has(idx)) {
        rows[2].push(idx);
        placed.add(idx);
      }
    });

    // Row 3: Motors and sensors (loads)
    motorIdxs.forEach(idx => {
      if (!placed.has(idx)) {
        rows[3].push(idx);
        placed.add(idx);
      }
    });
    sensorIdxs.forEach(idx => {
      if (!placed.has(idx)) {
        rows[3].push(idx);
        placed.add(idx);
      }
    });

    // Row 4: Ground
    if (groundIdx >= 0 && !placed.has(groundIdx)) {
      rows[4].push(groundIdx);
      placed.add(groundIdx);
    }

    // Place remaining components based on connections
    components.forEach((comp, idx) => {
      if (placed.has(idx)) return;
      
      // Determine best row based on component type
      const type = comp.type;
      if (['led', 'lightbulb', 'buzzer', 'speaker', 'resistive-load', 'inductive-load'].includes(type)) {
        rows[3].push(idx);
      } else if (['resistor', 'capacitor', 'inductor', 'switch', 'pushbutton', 'relay'].includes(type)) {
        // Put control/passive components in row 2
        rows[2].push(idx);
      } else {
        // Default to row 2
        rows[2].push(idx);
      }
      placed.add(idx);
    });

    // Calculate positions for each row
    let currentY = baseY;
    rows.forEach((row, rowIdx) => {
      if (row.length === 0) return;
      
      // Calculate total width for centering
      const rowWidth = (row.length - 1) * hSpacing;
      const startX = baseX - rowWidth / 2 + (rowIdx === 0 || rowIdx === 4 ? hSpacing * (row.length > 1 ? 0 : (motorDriverIdxs.length > 0 ? (motorDriverIdxs.length - 1) / 2 : 0)) : 0);
      
      // If this is the motor/loads row, try to align motors under their drivers
      if (rowIdx === 3 && motorDriverIdxs.length > 0 && motorIdxs.length > 0) {
        row.forEach((idx, i) => {
          if (MOTORS.has(components[idx].type)) {
            // Try to position motor under its driver
            const driverIdx = motorDriverIdxs[i % motorDriverIdxs.length];
            const driverPos = positions[driverIdx];
            if (driverPos) {
              positions[idx] = { x: snap(driverPos.x + (i >= motorDriverIdxs.length ? hSpacing / 2 : 0)), y: snap(currentY) };
            } else {
              positions[idx] = { x: snap(startX + i * hSpacing), y: snap(currentY) };
            }
          } else {
            // Other loads: position normally
            const offsetX = motorIdxs.length * hSpacing;
            positions[idx] = { x: snap(startX + offsetX + (i - motorIdxs.length) * hSpacing), y: snap(currentY) };
          }
        });
      } else {
        // Normal row positioning - center the row
        const centerOffset = (rows[2].length > 0 ? rows[2].length - 1 : rows[3].length > 0 ? rows[3].length - 1 : row.length - 1) * hSpacing / 2;
        row.forEach((idx, i) => {
          const x = baseX - centerOffset + i * hSpacing;
          positions[idx] = { x: snap(x), y: snap(currentY) };
        });
      }
      
      currentY += vSpacing;
    });

    // Ensure all positions are defined
    components.forEach((_, idx) => {
      if (!positions[idx]) {
        positions[idx] = { x: snap(baseX), y: snap(baseY + vSpacing * 2) };
      }
    });

    return positions;
  };

  // Determine which handles to use based on relative positions
  // Uses simple directional logic: wire goes OUT from source side facing target, IN to target side facing source
  // Tracks used sides to prevent overlapping wires
  const getHandleIdsForConnection = (
    fromIdx: number,
    toIdx: number,
    positions: Array<{ x: number; y: number }>,
    _components: Array<{ type: string }>,
    _batteryIdx: number,
    usedSides: Map<number, Set<string>>
  ) => {
    const sourcePos = positions[fromIdx];
    const targetPos = positions[toIdx];
    
    // Initialize tracking sets
    if (!usedSides.has(fromIdx)) usedSides.set(fromIdx, new Set());
    if (!usedSides.has(toIdx)) usedSides.set(toIdx, new Set());
    
    const sourceUsedSides = usedSides.get(fromIdx)!;
    const targetUsedSides = usedSides.get(toIdx)!;
    
    // Calculate direction from source to target
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    
    // Determine the best side to exit from and enter to based on direction
    // Priority: direction toward target, then perpendicular, then opposite
    const getPreferredSides = (deltaX: number, deltaY: number, isSource: boolean) => {
      const sides: string[] = [];
      
      if (Math.abs(deltaX) >= Math.abs(deltaY)) {
        // Primarily horizontal
        if (deltaX > 0) {
          sides.push(isSource ? 'right' : 'left');
          sides.push('bottom', 'top');
          sides.push(isSource ? 'left' : 'right');
        } else {
          sides.push(isSource ? 'left' : 'right');
          sides.push('bottom', 'top');
          sides.push(isSource ? 'right' : 'left');
        }
      } else {
        // Primarily vertical
        if (deltaY > 0) {
          sides.push(isSource ? 'bottom' : 'top');
          sides.push('right', 'left');
          sides.push(isSource ? 'top' : 'bottom');
        } else {
          sides.push(isSource ? 'top' : 'bottom');
          sides.push('right', 'left');
          sides.push(isSource ? 'bottom' : 'top');
        }
      }
      return sides;
    };
    
    // Map side to handle names
    const sideToSourceHandle: Record<string, string> = {
      'right': 'source',
      'left': 'sourceLeft',
      'top': 'sourceTop',
      'bottom': 'sourceBottom'
    };
    
    const sideToTargetHandle: Record<string, string> = {
      'right': 'targetRight',
      'left': 'target',
      'top': 'targetTop',
      'bottom': 'targetBottom'
    };
    
    // Find best available source side
    const sourceSides = getPreferredSides(dx, dy, true);
    let sourceSide = sourceSides[0];
    for (const side of sourceSides) {
      if (!sourceUsedSides.has(side)) {
        sourceSide = side;
        break;
      }
    }
    
    // Find best available target side
    const targetSides = getPreferredSides(dx, dy, false);
    let targetSide = targetSides[0];
    for (const side of targetSides) {
      if (!targetUsedSides.has(side)) {
        targetSide = side;
        break;
      }
    }
    
    // Mark as used
    sourceUsedSides.add(sourceSide);
    targetUsedSides.add(targetSide);
    
    return {
      sourceHandle: sideToSourceHandle[sourceSide],
      targetHandle: sideToTargetHandle[targetSide]
    };
  };

  // Component type classifications for intelligent connection repair
  const POWER_SOURCES = new Set(['battery', 'dc-power-supply', 'ac-dc-converter']);
  const REGULATORS = new Set(['buck-converter', 'boost-converter', 'buck-boost-converter', 'ldo']);
  const MOTOR_DRIVERS = new Set(['h-bridge', 'half-bridge', 'stepper-driver', 'solenoid-driver']);
  const MOTORS = new Set(['motor', 'stepper-motor', 'servo-motor']);

  const repairConnections = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number; label?: string }>
  ): Array<{ from: number; to: number; label?: string }> => {
    if (components.length === 0) return [];

    const batteryIdx = components.findIndex((comp) => POWER_SOURCES.has(comp.type));
    const groundIdx = components.findIndex((comp) => comp.type === 'ground');
    const regulatorIdxs = components.map((c, i) => REGULATORS.has(c.type) ? i : -1).filter(i => i >= 0);
    const motorDriverIdxs = components.map((c, i) => MOTOR_DRIVERS.has(c.type) ? i : -1).filter(i => i >= 0);
    const motorIdxs = components.map((c, i) => MOTORS.has(c.type) ? i : -1).filter(i => i >= 0);
    
    // If AI provided valid connections, validate and use them with minimal repair
    if (connections && connections.length > 0) {
      const result: Array<{ from: number; to: number; label?: string }> = [];
      const connectedToSource = new Set<number>();
      const connectedToGround = new Set<number>();
      
      // Copy valid AI connections and track connectivity
      connections.forEach(conn => {
        if (conn.from >= 0 && conn.from < components.length && 
            conn.to >= 0 && conn.to < components.length &&
            conn.from !== conn.to) {
          result.push({ ...conn });
          
          // Track what's connected to power and ground
          if (conn.from === batteryIdx || connectedToSource.has(conn.from)) {
            connectedToSource.add(conn.to);
          }
          if (conn.to === groundIdx || connectedToGround.has(conn.to)) {
            connectedToGround.add(conn.from);
          }
        }
      });
      
      // Determine power distribution point (regulator output if present, else battery)
      let powerPoint = batteryIdx >= 0 ? batteryIdx : 0;
      if (regulatorIdxs.length > 0) {
        const regConnected = result.some(c => c.from === batteryIdx && regulatorIdxs.includes(c.to));
        if (regConnected) {
          powerPoint = regulatorIdxs[0];
        }
      }
      
      // Ensure motor drivers are connected to power
      motorDriverIdxs.forEach(driverIdx => {
        const hasIncoming = result.some(c => c.to === driverIdx);
        if (!hasIncoming && driverIdx !== powerPoint) {
          result.push({ from: powerPoint, to: driverIdx });
        }
      });
      
      // Ensure motors are connected to drivers (or power if no drivers)
      motorIdxs.forEach((motorIdx, i) => {
        const hasIncoming = result.some(c => c.to === motorIdx);
        if (!hasIncoming) {
          if (motorDriverIdxs.length > 0) {
            const driverIdx = motorDriverIdxs[i % motorDriverIdxs.length];
            result.push({ from: driverIdx, to: motorIdx });
          } else {
            result.push({ from: powerPoint, to: motorIdx });
          }
        }
      });
      
      // Ensure all components have path to ground
      if (groundIdx >= 0) {
        // Check which components need ground connections
        const needsGround = components.map((_, i) => i).filter(i => 
          i !== batteryIdx && 
          i !== groundIdx && 
          !result.some(c => c.from === i && c.to === groundIdx)
        );
        
        // Only add ground connections for terminal components (motors, loads, drivers)
        const terminals = needsGround.filter(i => 
          MOTORS.has(components[i].type) || 
          MOTOR_DRIVERS.has(components[i].type) ||
          ['led', 'buzzer', 'lightbulb', 'speaker'].includes(components[i].type) ||
          components[i].type.includes('sensor')
        );
        
        terminals.forEach(idx => {
          // Check if already has ground path
          const hasGroundPath = result.some(c => c.from === idx && c.to === groundIdx);
          if (!hasGroundPath) {
            result.push({ from: idx, to: groundIdx, label: 'GND' });
          }
        });
        
        // Close the loop: ground back to battery
        const hasReturnPath = result.some(c => c.from === groundIdx && c.to === batteryIdx);
        if (!hasReturnPath && batteryIdx >= 0) {
          result.push({ from: groundIdx, to: batteryIdx });
        }
      }
      
      console.log('Repaired connections:', result.map((c) => `${c.from}→${c.to}${c.label ? ` (${c.label})` : ''}`).join(', '));
      return result;
    }

    // Fallback: If no AI connections, build intelligent topology from scratch
    const result: Array<{ from: number; to: number; label?: string }> = [];
    
    if (batteryIdx === -1) {
      // No power source - just chain everything
      for (let i = 0; i < components.length - 1; i++) {
        result.push({ from: i, to: i + 1 });
      }
      return result;
    }

    let powerPoint = batteryIdx;
    const connected = new Set<number>();
    connected.add(batteryIdx);
    
    // Connect regulator to battery first
    if (regulatorIdxs.length > 0) {
      result.push({ from: batteryIdx, to: regulatorIdxs[0] });
      connected.add(regulatorIdxs[0]);
      powerPoint = regulatorIdxs[0];
    }
    
    // Connect motor drivers to power
    motorDriverIdxs.forEach(driverIdx => {
      result.push({ from: powerPoint, to: driverIdx });
      connected.add(driverIdx);
    });
    
    // Connect motors to drivers
    motorIdxs.forEach((motorIdx, i) => {
      if (motorDriverIdxs.length > 0) {
        const driverIdx = motorDriverIdxs[i % motorDriverIdxs.length];
        result.push({ from: driverIdx, to: motorIdx });
      } else {
        result.push({ from: powerPoint, to: motorIdx });
      }
      connected.add(motorIdx);
      
      if (groundIdx >= 0) {
        result.push({ from: motorIdx, to: groundIdx, label: 'GND' });
      }
    });
    
    // Connect motor drivers to ground
    if (groundIdx >= 0) {
      motorDriverIdxs.forEach(driverIdx => {
        result.push({ from: driverIdx, to: groundIdx, label: 'GND' });
      });
      connected.add(groundIdx);
    }
    
    // Connect any remaining components
    components.forEach((_, idx) => {
      if (!connected.has(idx) && idx !== groundIdx) {
        result.push({ from: powerPoint, to: idx });
        connected.add(idx);
        if (groundIdx >= 0) {
          result.push({ from: idx, to: groundIdx, label: 'GND' });
        }
      }
    });
    
    // Close the loop
    if (groundIdx >= 0 && batteryIdx >= 0) {
      result.push({ from: groundIdx, to: batteryIdx });
    }

    console.log('Built connections from scratch:', result.map((c) => `${c.from}→${c.to}${c.label ? ` (${c.label})` : ''}`).join(', '));
    return result;
  };

  // Add components to canvas based on AI response
  const addComponentsToCanvas = (
    components: Array<{ type: string }>,
    connections?: Array<{ from: number; to: number; label?: string }>,
    mode?: 'replace' | 'merge'
  ) => {
    if (!components || components.length === 0) {
      console.log('No components to add');
      return;
    }

    console.log('Adding components to canvas:', components);
    console.log('Mode:', mode);
    console.log('Current nodes on canvas:', nodes.length);
    console.log('Adding connections:', connections);
    
    // Clear canvas if replacing OR if we have existing components (to prevent overlap)
    if (mode === 'replace' || nodes.length > 0) {
      console.log('Clearing canvas to prevent overlap');
      clearCanvas();
    }

    // Repair connections to ensure proper series circuit with battery loop closure
    const repairedConnections = repairConnections(components, connections || []);

    // Store node IDs so we can reference them for connections
    const nodeIds: string[] = [];
    const labelCounters = new Map<string, number>();

    const positions = computeLayout(components, repairedConnections);
    console.log('Computed positions:', positions.map((p, i) => `${i}: (${p.x}, ${p.y})`).join(', '));

    // Use timestamp to ensure unique IDs
    const baseTimestamp = Date.now();

    components.forEach((comp, idx) => {
      const componentData = circuitComponents.find(c => c.type === comp.type);
      if (!componentData) {
        console.error(`Component type not found: ${comp.type}`);
        return;
      }

      console.log(`Adding component ${idx}: ${componentData.name} at (${positions[idx].x}, ${positions[idx].y})`);

      const count = (labelCounters.get(componentData.type) || 0) + 1;
      labelCounters.set(componentData.type, count);
      const labelPrefix = getLabelPrefix(componentData.type);
      const nodeLabel = componentData.type === 'ground' ? 'GND' : `${labelPrefix}${count}`;

      const nodeId = `${componentData.type}-${baseTimestamp}-${idx}`;
      nodeIds.push(nodeId);
      
      const newNode = {
        id: nodeId,
        type: 'circuit',
        position: positions[idx],
        data: { 
          component: componentData,
          rotation: 0,
          label: `${nodeLabel} • ${componentData.name}`,
        },
      };
      
      // Add immediately
      console.log('Adding node:', newNode.id);
      addNode(newNode);
    });

    // Add connections/edges
    if (repairedConnections && repairedConnections.length > 0) {
      const batteryIdx = components.findIndex((c) => c.type === 'battery');
      const usedSides = new Map<number, Set<string>>(); // Track used SIDES (not handles) to prevent overlap
      
      console.log('Creating edges from', repairedConnections.length, 'connections');
      repairedConnections.forEach((conn, idx) => {
        console.log(`Processing connection ${idx}: ${conn.from} → ${conn.to}`);
        if (conn.from < nodeIds.length && conn.to < nodeIds.length) {
          const { sourceHandle, targetHandle } = getHandleIdsForConnection(
            conn.from,
            conn.to,
            positions,
            components,
            batteryIdx,
            usedSides
          );
          const edgeId = `e${nodeIds[conn.from]}-${nodeIds[conn.to]}`;
          const newEdge: CanvasEdge = {
            id: edgeId,
            source: nodeIds[conn.from],
            target: nodeIds[conn.to],
            sourceHandle,
            targetHandle,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            label: conn.label,
            labelStyle: { fill: '#a7f3d0', fontSize: 11 },
            labelBgStyle: { fill: 'rgba(17, 24, 39, 0.9)', rx: 4, ry: 4 },
            labelBgPadding: [6, 4],
          };
          console.log('✓ Adding edge:', edgeId, `[${sourceHandle}→${targetHandle}]`);
          addEdge(newEdge);
        } else {
          console.warn(`✗ Skipping edge: indices out of range (${conn.from}, ${conn.to}) for nodeIds.length=${nodeIds.length}`);
        }
      });
    }

    // Trigger auto-fit after adding all components
    setTimeout(() => {
      triggerFitView();
    }, 150);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    addMessage(userMessage);
    const userInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      console.log('Sending message to AI:', userInput);
      
      // Get current circuit state from canvas for modification context
      const currentCircuitState = getCurrentCircuitState();
      console.log('Current circuit state:', currentCircuitState);
      
      // Call real AI service with current circuit context
      const aiResponse = await sendMessageToAI(userInput, {
        history: messages
          .filter((m): m is ChatMessage & { role: 'user' | 'assistant' } => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.content })),
        lastCircuit: lastCircuitAction,
        currentCircuitState: currentCircuitState.components.length > 0 ? currentCircuitState : null,
      });
      
      console.log('AI Response received:', aiResponse);

      // If AI returned components to add, add them to canvas
      if (aiResponse.components && aiResponse.components.length > 0) {
        console.log('Processing components:', aiResponse.components);
        console.log('Processing connections:', aiResponse.connections);
        console.log('AI response type:', aiResponse.type, 'mode:', aiResponse.mode);
        
        // Always use 'replace' mode for build_circuit to prevent overlaps
        const mode = aiResponse.mode || (aiResponse.type === 'build_circuit' ? 'replace' : 'merge');
        console.log('Final mode:', mode);
        
        addComponentsToCanvas(aiResponse.components, aiResponse.connections, mode);
        if (aiResponse.type === 'build_circuit' || aiResponse.type === 'add_component') {
          setLastCircuitAction(aiResponse);
        }
      } else {
        console.log('No components in response');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.message,
        timestamp: new Date(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      
      addMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 p-4 bg-duo-green hover:bg-duo-greenDark border-2 border-duo-greenDeep text-white rounded-2xl z-50 transition-all shadow-[0_4px_0_0_#16a34a] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#16a34a] active:translate-y-[4px] active:shadow-none"
      >
        <MessageSquare size={22} />
      </button>
    );
  }

  return (
    <div
      className={`h-full bg-dark-900/95 border-l-2 border-dark-700 flex flex-col ${
        isExpanded ? 'w-96' : 'w-80'
      } transition-all duration-150 backdrop-blur-md`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-dark-700 bg-dark-850">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
            <MessageSquare size={18} className="text-duo-green" />
          </div>
          <span className="font-display font-bold text-dark-100">AI Helper</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-dark-800 rounded-xl text-dark-400 hover:text-dark-200 transition-colors"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={clearMessages}
            className="p-2 hover:bg-dark-800 rounded-xl text-dark-400 hover:text-dark-200 transition-colors"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-dark-800 rounded-xl text-dark-400 hover:text-dark-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center mb-4">
              <MessageSquare size={28} className="text-duo-green" />
            </div>
            <p className="font-display font-bold text-dark-200 text-lg mb-1">AI Circuit Helper</p>
            <p className="text-dark-500 text-sm">Ask me to build circuits or explain concepts!</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                message.role === 'user'
                  ? 'bg-duo-green text-white font-medium'
                  : 'bg-dark-850 text-dark-200 border-2 border-dark-700'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark-850 rounded-2xl px-4 py-3 border-2 border-dark-700">
              <div className="flex items-center gap-2 text-dark-400">
                <Loader2 size={16} className="animate-spin text-duo-green" />
                <span className="text-sm font-display font-medium">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="px-4 pb-3">
          <p className="text-sm font-display font-semibold text-dark-400 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="px-3 py-2 text-sm font-display font-medium bg-dark-850 hover:bg-dark-800 border-2 border-dark-700 hover:border-duo-green/30 rounded-xl text-dark-300 hover:text-dark-100 transition-all"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t-2 border-dark-700 bg-dark-850">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask to build a circuit..."
            rows={2}
            disabled={isLoading}
            className="w-full px-4 py-3 pr-14 bg-dark-900 border-2 border-dark-700 rounded-xl text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-duo-green focus:ring-2 focus:ring-duo-green/20 resize-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-duo-green hover:bg-duo-greenDark disabled:bg-dark-700 disabled:text-dark-500 rounded-xl text-white transition-all shadow-[0_3px_0_0_#16a34a] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#16a34a] active:translate-y-[3px] active:shadow-none disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
