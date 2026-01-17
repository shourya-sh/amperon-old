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
  const { nodes, edges, addNode, addEdge, clearCanvas } = useCircuitStore();
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

  // Layout components in a clean series arrangement:
  // Battery on left, components flow right, ground below last component far right
  // Return path goes along bottom back to battery (avoiding component overlap)
  const computeLayout = (
    components: Array<{ type: string }>,
    _connections: Array<{ from: number; to: number }>
  ) => {
    const baseX = 160;
    const baseY = 160;
    const xSpacing = 220;  // Increased spacing to prevent wire overlap
    const ySpacing = 220;  // Increased vertical spacing for return path
    const snap = (value: number) => Math.round(value / 20) * 20;

    const nodeCount = components.length;
    const batteryIdx = components.findIndex((c) => c.type === 'battery');
    const groundIdx = components.findIndex((c) => c.type === 'ground');

    // Get intermediate components (not battery, not ground) in order
    const intermediates = components
      .map((_, idx) => idx)
      .filter((idx) => idx !== batteryIdx && idx !== groundIdx);

    const positions: Array<{ x: number; y: number }> = new Array(nodeCount).fill({ x: 0, y: 0 });

    // Battery goes at far left, top row
    if (batteryIdx >= 0) {
      positions[batteryIdx] = { x: snap(baseX), y: snap(baseY) };
    }

    // Intermediate components flow left-to-right on top row with sufficient spacing
    intermediates.forEach((idx, i) => {
      positions[idx] = {
        x: snap(baseX + (i + 1) * xSpacing),
        y: snap(baseY),
      };
    });

    // Ground goes to the FAR RIGHT below the last component for clean wire routing
    // This ensures the return wire has room to come back along the bottom
    if (groundIdx >= 0) {
      const lastComponentX = intermediates.length > 0
        ? baseX + (intermediates.length + 1) * xSpacing
        : baseX + xSpacing;
      positions[groundIdx] = {
        x: snap(lastComponentX),
        y: snap(baseY + ySpacing),
      };
    }

    return positions;
  };

  // Determine which handles to use based on component positions and circuit role
  // Key rules:
  // - Battery: output from RIGHT, return input to LEFT
  // - Series components: input on LEFT, output on RIGHT
  // - Ground: input from TOP (since it's below), output from LEFT back to battery
  const getHandleIdsForConnection = (
    fromIdx: number,
    toIdx: number,
    positions: Array<{ x: number; y: number }>,
    components: Array<{ type: string }>,
    batteryIdx: number
  ) => {
    const sourcePos = positions[fromIdx];
    const targetPos = positions[toIdx];
    const fromType = components[fromIdx]?.type;
    const toType = components[toIdx]?.type;
    
    // Connection returning TO battery (the loop-closing wire)
    if (toIdx === batteryIdx) {
      // Return path enters battery from the LEFT
      if (fromType === 'ground') {
        // Ground is below and to the right, so exit from ground's LEFT, enter battery's LEFT
        return { sourceHandle: 'sourceLeft', targetHandle: 'target' };
      }
      // Other component returning to battery
      return { sourceHandle: 'sourceLeft', targetHandle: 'target' };
    }
    
    // Connection FROM battery (outgoing power)
    if (fromIdx === batteryIdx) {
      // Battery outputs from RIGHT to next component's LEFT
      return { sourceHandle: 'source', targetHandle: 'target' };
    }
    
    // Connection TO ground (downward)
    if (toType === 'ground') {
      // Last component connects down to ground
      // Exit from source's BOTTOM, enter ground's TOP
      return { sourceHandle: 'sourceBottom', targetHandle: 'targetTop' };
    }
    
    // Standard series connection: component to component (left to right)
    const dx = targetPos.x - sourcePos.x;
    if (dx >= 0) {
      // Target is to the right: exit RIGHT, enter LEFT
      return { sourceHandle: 'source', targetHandle: 'target' };
    } else {
      // Target is to the left: exit LEFT, enter RIGHT
      return { sourceHandle: 'sourceLeft', targetHandle: 'targetRight' };
    }
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
    console.log('Adding connections:', connections);
    
    if (mode === 'replace') {
      clearCanvas();
    }

    // Repair connections to ensure proper series circuit with battery loop closure
    const repairedConnections = repairConnections(components, connections || []);

    // Store node IDs so we can reference them for connections
    const nodeIds: string[] = [];
    const labelCounters = new Map<string, number>();

    const positions = computeLayout(components, repairedConnections);

    components.forEach((comp, idx) => {
      const componentData = circuitComponents.find(c => c.type === comp.type);
      if (!componentData) {
        console.error(`Component type not found: ${comp.type}`);
        return;
      }

      console.log(`Adding component: ${componentData.name} (${componentData.type})`);

      const count = (labelCounters.get(componentData.type) || 0) + 1;
      labelCounters.set(componentData.type, count);
      const labelPrefix = getLabelPrefix(componentData.type);
      const nodeLabel = componentData.type === 'ground' ? 'GND' : `${labelPrefix}${count}`;

      const nodeId = `${componentData.type}-${Date.now()}-${Math.random()}`;
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
      console.log('Creating edges from', repairedConnections.length, 'connections');
      repairedConnections.forEach((conn, idx) => {
        console.log(`Processing connection ${idx}: ${conn.from} → ${conn.to}`);
        if (conn.from < nodeIds.length && conn.to < nodeIds.length) {
          const { sourceHandle, targetHandle } = getHandleIdsForConnection(
            conn.from,
            conn.to,
            positions,
            components,
            batteryIdx
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
        const mode = aiResponse.mode || (aiResponse.type === 'build_circuit' ? 'replace' : 'merge');
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
            className="w-full px-3 py-2 pr-10 bg-dark-850 border border-dark-700 rounded-lg text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-forest-600 focus:ring-1 focus:ring-forest-600/50 resize-none transition-colors disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-1.5 bg-forest-600 hover:bg-forest-500 disabled:bg-dark-700 disabled:text-dark-500 rounded text-white transition-colors"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        <p className="text-[10px] text-dark-500 mt-1.5 text-center">
          Powered by Gemini AI
        </p>
      </div>
    </div>
  );
};

export default ChatPanel;
