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

  // Layout components in a proper circuit loop following connection topology
  const computeLayout = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number }>
  ) => {
    const baseX = 200;
    const baseY = 200;
    const spacing = 320;
    const snap = (value: number) => Math.round(value / 20) * 20;

    const nodeCount = components.length;
    const positions: Array<{ x: number; y: number }> = new Array(nodeCount);
    
    if (nodeCount === 0) return positions;

    // Find battery as starting point
    const batteryIdx = components.findIndex((c) => c.type === 'battery');

    // Build adjacency list from connections to understand circuit flow
    const adjacency = new Map<number, number[]>();
    connections.forEach(({ from, to }) => {
      if (!adjacency.has(from)) adjacency.set(from, []);
      adjacency.get(from)!.push(to);
    });

    // Trace the circuit path starting from battery
    const circuitPath: number[] = [];
    const visited = new Set<number>();
    
    let current = batteryIdx >= 0 ? batteryIdx : 0;
    while (current !== undefined && !visited.has(current)) {
      circuitPath.push(current);
      visited.add(current);
      
      const neighbors = adjacency.get(current) || [];
      const nextUnvisited = neighbors.find(n => !visited.has(n));
      current = nextUnvisited !== undefined ? nextUnvisited : -1;
      if (current === -1) break;
    }

    // Add any remaining components not in the main path
    for (let i = 0; i < nodeCount; i++) {
      if (!visited.has(i)) {
        circuitPath.push(i);
      }
    }

    // Layout components in a rectangular loop - ALWAYS use rectangle even for small circuits
    const pathLength = circuitPath.length;
    
    if (pathLength === 1) {
      positions[circuitPath[0]] = { x: snap(baseX), y: snap(baseY) };
    } else if (pathLength === 2) {
      // 2 components: horizontal line
      positions[circuitPath[0]] = { x: snap(baseX), y: snap(baseY) };
      positions[circuitPath[1]] = { x: snap(baseX + spacing), y: snap(baseY) };
    } else {
      // 3+ components: rectangular layout
      // Calculate how many on each side to make it as square as possible
      const cols = Math.ceil(pathLength / 2);
      
      circuitPath.forEach((idx, i) => {
        let x: number, y: number;
        
        if (i < cols) {
          // Top row: left to right
          x = baseX + i * spacing;
          y = baseY;
        } else {
          // Bottom row: right to left (creates the loop)
          const bottomIdx = i - cols;
          x = baseX + (cols - 1 - bottomIdx) * spacing;
          y = baseY + spacing;
        }
        
        positions[idx] = { x: snap(x), y: snap(y) };
      });
    }

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

  const repairConnections = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number; label?: string }>
  ): Array<{ from: number; to: number; label?: string }> => {
    if (components.length === 0) return [];

    const batteryIdx = components.findIndex((comp) => comp.type === 'battery');
    const groundIdx = components.findIndex((comp) => comp.type === 'ground');

    if (batteryIdx === -1) {
      return connections;
    }

    // Build proper series circuit: battery → components → back to battery
    // Ground (if present) acts as a return path node
    const result: Array<{ from: number; to: number; label?: string }> = [];
    const visited = new Set<number>();
    visited.add(batteryIdx);

    // Collect non-battery, non-ground components in order
    const intermediates = components
      .map((_, idx) => idx)
      .filter((idx) => idx !== batteryIdx && idx !== groundIdx);

    // Build chain: battery → intermediate[0] → intermediate[1] → ... → ground (if exists) → back to battery
    let current = batteryIdx;
    for (const next of intermediates) {
      result.push({ from: current, to: next });
      visited.add(next);
      current = next;
    }

    // If ground exists, route the last component TO ground, then ground BACK to battery
    if (groundIdx >= 0) {
      result.push({ from: current, to: groundIdx, label: 'GND' });
      result.push({ from: groundIdx, to: batteryIdx });
      visited.add(groundIdx);
    } else if (intermediates.length > 0) {
      // No ground, close loop directly back to battery from the last component
      result.push({ from: current, to: batteryIdx });
    }

    console.log('Repaired connections:', result.map((c) => `${c.from}→${c.to}${c.label ? ` (${c.label})` : ''}`).join(', '));

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
        className="fixed right-4 bottom-4 p-3 bg-dark-850 hover:bg-dark-800 border border-dark-700 text-dark-300 rounded-lg z-50 transition-colors"
      >
        <MessageSquare size={20} />
      </button>
    );
  }

  return (
    <div
      className={`h-full bg-dark-900/80 border-l border-dark-700 flex flex-col ${
        isExpanded ? 'w-96' : 'w-72'
      } transition-all duration-150 backdrop-blur-sm`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-dark-700">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-forest-500" />
          <span className="text-sm font-medium text-dark-200">AI Assistant</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-dark-800 rounded text-dark-500 hover:text-dark-300 transition-colors"
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button
            onClick={clearMessages}
            className="p-1.5 hover:bg-dark-800 rounded text-dark-500 hover:text-dark-300 transition-colors"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-dark-800 rounded text-dark-500 hover:text-dark-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare size={32} className="mx-auto text-dark-600 mb-3" />
            <p className="text-dark-400 text-sm mb-1">AI Circuit Assistant</p>
            <p className="text-dark-500 text-xs">Ask me to build circuits or explain concepts</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-forest-600 text-white'
                  : 'bg-dark-850 text-dark-200 border border-dark-700'
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
            <div className="bg-dark-850 rounded-lg px-3 py-2 border border-dark-700">
              <div className="flex items-center gap-2 text-dark-400">
                <Loader2 size={14} className="animate-spin" />
                <span className="text-xs">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 0 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-dark-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-1.5">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="px-2 py-1 text-xs bg-dark-850 hover:bg-dark-800 border border-dark-700 rounded text-dark-400 hover:text-dark-200 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-dark-700">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask to build a circuit..."
            rows={2}
            disabled={isLoading}
            className="w-full px-3 py-3 pr-14 bg-dark-850 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600/50 resize-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center bg-forest-600 hover:bg-forest-500 disabled:bg-dark-700 disabled:text-dark-500 rounded-md text-white transition-colors"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
