import React, { useState, useRef, useEffect } from 'react';
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

const quickActions = [
  { id: 'led-circuit', label: 'Build LED circuit', prompt: 'Build me a simple LED circuit' },
  { id: 'motor-circuit', label: 'Motor with switch', prompt: 'Build a motor circuit with a switch to control it' },
  { id: 'explain', label: 'What is a capacitor?', prompt: 'Explain what a capacitor is and how it works' },
  { id: 'ohms-law', label: "Ohm's Law", prompt: 'Teach me about Ohm\'s Law with an example' },
];

const ChatPanel: React.FC = () => {
  const { messages, addMessage, isOpen, setIsOpen, isLoading, setIsLoading, clearMessages, lastCircuitAction, setLastCircuitAction } = useChatStore();
  const { addNode, addEdge, clearCanvas } = useCircuitStore();
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const computeLayout = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number }>
  ) => {
    const baseX = 140;
    const baseY = 140;
    const xSpacing = 200;
    const ySpacing = 120;

    const nodeCount = components.length;
    const adjacency = new Map<number, Set<number>>();
    for (let i = 0; i < nodeCount; i++) adjacency.set(i, new Set());
    connections.forEach((c) => {
      adjacency.get(c.from)?.add(c.to);
      adjacency.get(c.to)?.add(c.from);
    });

    const batteryIndex = components.findIndex((c) => c.type === 'battery');
    const root = batteryIndex >= 0 ? batteryIndex : 0;
    const depth = new Map<number, number>();
    const visited = new Set<number>();
    const queue: number[] = [root];
    depth.set(root, 0);
    visited.add(root);

    while (queue.length > 0) {
      const current = queue.shift() as number;
      const neighbors = adjacency.get(current) || new Set();
      neighbors.forEach((n) => {
        if (!visited.has(n)) {
          visited.add(n);
          depth.set(n, (depth.get(current) || 0) + 1);
          queue.push(n);
        }
      });
    }

    // Any disconnected nodes go to the last column
    const maxDepth = Math.max(...Array.from(depth.values())) || 0;
    for (let i = 0; i < nodeCount; i++) {
      if (!depth.has(i)) depth.set(i, maxDepth + 1);
    }

    // Group by depth
    const levels = new Map<number, number[]>();
    for (let i = 0; i < nodeCount; i++) {
      const d = depth.get(i) || 0;
      if (!levels.has(d)) levels.set(d, []);
      levels.get(d)?.push(i);
    }

    const positions: Array<{ x: number; y: number }> = new Array(nodeCount).fill({ x: 0, y: 0 });
    Array.from(levels.entries()).sort((a, b) => a[0] - b[0]).forEach(([d, nodes]) => {
      nodes.sort((a, b) => a - b);
      nodes.forEach((idx, row) => {
        positions[idx] = {
          x: baseX + d * xSpacing,
          y: baseY + row * ySpacing,
        };
      });
    });

    const groundIndex = components.findIndex((c) => c.type === 'ground');
    if (groundIndex >= 0) {
      const groundDepth = Math.max(...Array.from(depth.values())) + 1;
      positions[groundIndex] = {
        x: baseX + groundDepth * xSpacing,
        y: baseY + (levels.get(depth.get(root) || 0)?.length || 1) * ySpacing,
      };
    }

    return positions;
  };

  const getHandleIds = (
    sourcePos: { x: number; y: number },
    targetPos: { x: number; y: number }
  ) => {
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    if (Math.abs(dy) > Math.abs(dx)) {
      return dy >= 0
        ? { sourceHandle: 'sourceBottom', targetHandle: 'targetTop' }
        : { sourceHandle: 'sourceTop', targetHandle: 'targetBottom' };
    }
    return dx >= 0
      ? { sourceHandle: 'source', targetHandle: 'target' }
      : { sourceHandle: 'sourceLeft', targetHandle: 'targetRight' };
  };

  const repairConnections = (
    components: Array<{ type: string }>,
    connections: Array<{ from: number; to: number; label?: string }>
  ): Array<{ from: number; to: number; label?: string }> => {
    if (components.length === 0) return [];

    const pairKey = (a: number, b: number) => (a < b ? `${a}-${b}` : `${b}-${a}`);
    const dedup = new Map<string, { from: number; to: number; label?: string }>();

    const addEdge = (from: number, to: number, label?: string) => {
      if (from === to) return;
      const nodesCount = components.length;
      if (from < 0 || to < 0 || from >= nodesCount || to >= nodesCount) return;
      const key = pairKey(from, to);
      if (!dedup.has(key)) {
        dedup.set(key, { from, to, label });
      }
    };

    connections.forEach((c) => addEdge(c.from, c.to, c.label));

    const nodesCount = components.length;
    const adjacency = Array.from({ length: nodesCount }, () => new Set<number>());
    dedup.forEach((c) => {
      adjacency[c.from].add(c.to);
      adjacency[c.to].add(c.from);
    });

    const batteryIdx = components.findIndex((c) => c.type === 'battery');
    const groundIdx = components.findIndex((c) => c.type === 'ground');

    if (batteryIdx === -1) {
      return Array.from(dedup.values());
    }

    // Connect all nodes to the battery component
    const visited = new Set<number>();
    const queue: number[] = [batteryIdx];
    visited.add(batteryIdx);
    while (queue.length) {
      const n = queue.shift() as number;
      adjacency[n].forEach((nbr) => {
        if (!visited.has(nbr)) {
          visited.add(nbr);
          queue.push(nbr);
        }
      });
    }

    let lastAttach = batteryIdx;
    for (let i = 0; i < nodesCount; i++) {
      if (!visited.has(i)) {
        addEdge(lastAttach, i);
        visited.add(i);
        lastAttach = i;
      }
    }

    // Ensure ground has a path
    if (groundIdx >= 0 && adjacency[groundIdx].size === 0) {
      addEdge(lastAttach, groundIdx, 'GND');
    }

    // Ensure two-terminal parts are connected on both ends and avoid dangling parts
    const twoTerminal = new Set([
      'resistor', 'capacitor', 'inductor', 'led', 'diode', 'buzzer', 'motor', 'lightbulb', 'switch', 'wire'
    ]);
    for (let i = 0; i < nodesCount; i++) {
      const type = components[i].type;
      if (!twoTerminal.has(type)) continue;

      let degree = adjacency[i].size || 0;

      // Attempt to attach to battery first (if present and not self)
      if (degree < 2 && batteryIdx >= 0 && batteryIdx !== i && !adjacency[i].has(batteryIdx)) {
        addEdge(i, batteryIdx);
        degree = adjacency[i].size || 0;
      }

      // If still dangling, attach to nearest non-self node (simple heuristic)
      if (degree < 2) {
        // find a candidate neighbor index
        let candidate = -1;
        for (let j = 0; j < nodesCount; j++) {
          if (j === i) continue;
          if (!adjacency[i].has(j)) { candidate = j; break; }
        }
        if (candidate >= 0) {
          addEdge(i, candidate);
          degree = adjacency[i].size || 0;
        }
      }

      // Final fallback: attach to ground if present
      if (degree < 2 && groundIdx >= 0 && !adjacency[i].has(groundIdx)) {
        addEdge(i, groundIdx, 'GND');
        degree = adjacency[i].size || 0;
      }

      if (degree < 2) {
        console.warn(`Component ${i} (${type}) remains with degree ${degree} — attached to battery/nearest/ground where possible.`);
      }
    }

    return Array.from(dedup.values());
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

    const safeConnections = connections ? [...connections] : [];
    const groundIndex = components.findIndex((c) => c.type === 'ground');
    if (groundIndex >= 0) {
      const hasGroundConnection = safeConnections.some((c) => c.from === groundIndex || c.to === groundIndex);
      if (!hasGroundConnection) {
        const batteryIndex = components.findIndex((c) => c.type === 'battery');
        const attachIndex = batteryIndex >= 0 ? batteryIndex : 0;
        safeConnections.push({ from: attachIndex, to: groundIndex, label: 'GND' });
      }
    }

    const repairedConnections = repairConnections(components, safeConnections);

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
      repairedConnections.forEach((conn) => {
        if (conn.from < nodeIds.length && conn.to < nodeIds.length) {
          const sourcePos = positions[conn.from];
          const targetPos = positions[conn.to];
          const { sourceHandle, targetHandle } = getHandleIds(sourcePos, targetPos);
          const edgeId = `e${nodeIds[conn.from]}-${nodeIds[conn.to]}`;
          const newEdge: CanvasEdge = {
            id: edgeId,
            source: nodeIds[conn.from],
            target: nodeIds[conn.to],
            sourceHandle,
            targetHandle,
            type: 'smoothstep',
            animated: false,
            style: { stroke: '#22c55e', strokeWidth: 4 },
            markerEnd: {
              type: 'arrowclosed',
              color: '#22c55e',
            },
            label: conn.label,
            labelStyle: { fill: '#a7f3d0', fontSize: 11 },
            labelBgStyle: { fill: 'rgba(17, 24, 39, 0.9)', rx: 4, ry: 4 },
            labelBgPadding: [6, 4],
          };
          console.log('Adding edge:', edgeId, 'from', nodeIds[conn.from], 'to', nodeIds[conn.to]);
          addEdge(newEdge);
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
      
      // Call real AI service
      const aiResponse = await sendMessageToAI(userInput, {
        history: messages
          .filter((m): m is ChatMessage & { role: 'user' | 'assistant' } => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.content })),
        lastCircuit: lastCircuitAction,
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
