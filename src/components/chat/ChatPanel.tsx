import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Sparkles, 
  X, 
  ChevronRight, 
  Lightbulb,
  Zap,
  HelpCircle,
  Wand2,
  Trash2,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { useChatStore, useCircuitStore } from '../../stores';
import { circuitComponents } from '../../data/components';
import type { ChatMessage } from '../../types';

const quickActions = [
  { id: 'led-circuit', label: '💡 Build an LED circuit', prompt: 'Help me build a simple LED circuit with a battery and resistor' },
  { id: 'explain', label: '🤔 What is a resistor?', prompt: 'Explain what a resistor is and how it works' },
  { id: 'series-parallel', label: '🔀 Series vs Parallel?', prompt: 'What is the difference between series and parallel circuits?' },
  { id: 'ohms-law', label: '📐 Ohm\'s Law', prompt: 'Teach me about Ohm\'s Law with examples' },
];

const ChatPanel: React.FC = () => {
  const { messages, addMessage, isOpen, setIsOpen, isLoading, setIsLoading, clearMessages } = useChatStore();
  const { addNode } = useCircuitStore();
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

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response - In production, this would call your AI API
    const lowerMessage = userMessage.toLowerCase();
    
    // Component explanations
    for (const component of circuitComponents) {
      if (lowerMessage.includes(component.name.toLowerCase())) {
        return `## ${component.name} ${component.symbol}\n\n${component.description}\n\n### Key Properties:\n${component.properties.map(p => `- **${p.name}**: ${p.value} ${p.unit}`).join('\n')}\n\n### Connections:\nThis component has ${component.connections} connection point${component.connections > 1 ? 's' : ''}.\n\nWould you like me to add one to your circuit? Just say "add ${component.name.toLowerCase()}"!`;
      }
    }

    // Add component commands
    if (lowerMessage.includes('add')) {
      for (const component of circuitComponents) {
        if (lowerMessage.includes(component.name.toLowerCase())) {
          // Add the component to the canvas
          const newNode = {
            id: `${component.type}-${Date.now()}`,
            type: 'circuit',
            position: { x: 250 + Math.random() * 200, y: 150 + Math.random() * 200 },
            data: { 
              component,
              rotation: 0,
              label: component.name,
            },
          };
          addNode(newNode);
          return `✅ Added a **${component.name}** to your circuit!\n\nI placed it on the canvas for you. You can drag it to position it where you want, and connect it to other components by dragging from the green handles.`;
        }
      }
    }

    // LED circuit help
    if (lowerMessage.includes('led') && (lowerMessage.includes('circuit') || lowerMessage.includes('build'))) {
      return `## Building an LED Circuit! 💡\n\nGreat choice! Here's how to build a simple LED circuit:\n\n### Components Needed:\n1. **Battery** (9V) - Power source\n2. **Resistor** (330Ω) - Protects the LED\n3. **LED** - The light!\n\n### Steps:\n1. Drag a **Battery** to the canvas\n2. Add a **Resistor** next to it\n3. Add an **LED** after the resistor\n4. Connect them: Battery (+) → Resistor → LED → Battery (-)\n\n### Why the Resistor?\nLEDs can only handle about 20mA of current. The resistor limits the current so the LED doesn't burn out!\n\nWant me to add these components for you? Just say "add the LED circuit components"!`;
    }

    // Ohm's Law
    if (lowerMessage.includes('ohm')) {
      return `## Ohm's Law ⚡\n\nThe most important formula in electronics!\n\n# V = I × R\n\n### What it means:\n- **V** (Voltage) = Electrical pressure (Volts)\n- **I** (Current) = Flow of electrons (Amps)\n- **R** (Resistance) = Opposition to flow (Ohms)\n\n### The Triangle Trick:\n\`\`\`\n    V\n   ───\n  I × R\n\`\`\`\nCover what you want to find!\n\n### Example:\nWith a 9V battery and 1000Ω resistor:\nI = V ÷ R = 9 ÷ 1000 = 0.009A = **9mA**\n\nTry calculating: What resistor do you need for an LED that uses 20mA with a 9V battery?`;
    }

    // Series vs Parallel
    if (lowerMessage.includes('series') || lowerMessage.includes('parallel')) {
      return `## Series vs Parallel Circuits 🔀\n\n### Series Circuit ➡️\nComponents connected in a **single path**\n- Current is the **SAME** everywhere\n- Voltage is **SPLIT** between components\n- If one breaks, circuit stops!\n\n### Parallel Circuit 🔀\nComponents have **multiple paths**\n- Voltage is the **SAME** for each\n- Current is **SPLIT** between paths\n- If one breaks, others work!\n\n### Real World:\n- Christmas lights (old): Series 🎄\n- Your house wiring: Parallel 🏠\n\nWant to try building both? Start with "build a series circuit with 2 LEDs"!`;
    }

    // Default response
    return `I'd love to help you with that! 🔧\n\nHere are some things I can do:\n\n- **Explain components** - Ask about resistors, LEDs, capacitors, etc.\n- **Build circuits** - Say "add a battery" or "build an LED circuit"\n- **Teach concepts** - Ask about Ohm's Law, series/parallel, etc.\n- **Debug problems** - Describe what's not working!\n\nWhat would you like to explore?`;
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
    setInput('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await generateResponse(userMessage.content);

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    addMessage(assistantMessage);
    setIsLoading(false);
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
      <motion.button
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 p-4 bg-forest-600 hover:bg-forest-500 text-white rounded-full shadow-lg shadow-forest-600/30 z-50"
      >
        <Sparkles size={24} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className={`h-full bg-dark-900 border-l border-dark-800 flex flex-col ${
        isExpanded ? 'w-[480px]' : 'w-80'
      } transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-dark-100">CircuitBot</h2>
            <p className="text-xs text-dark-500">Your circuit assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-dark-200 transition-colors"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={clearMessages}
            className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-dark-200 transition-colors"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-dark-800 rounded-lg text-dark-400 hover:text-dark-200 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-forest-600 text-white rounded-br-md'
                    : 'bg-dark-800 text-dark-100 rounded-bl-md'
                }`}
              >
                <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    // Simple markdown-like rendering
                    if (line.startsWith('## ')) {
                      return <h3 key={i} className="text-base font-semibold mt-2 mb-1">{line.slice(3)}</h3>;
                    }
                    if (line.startsWith('### ')) {
                      return <h4 key={i} className="text-sm font-semibold mt-2 mb-1 text-forest-400">{line.slice(4)}</h4>;
                    }
                    if (line.startsWith('# ')) {
                      return <h2 key={i} className="text-lg font-bold mt-2 mb-1 text-forest-300">{line.slice(2)}</h2>;
                    }
                    if (line.startsWith('- ')) {
                      return <li key={i} className="ml-4">{line.slice(2)}</li>;
                    }
                    if (line.startsWith('```')) {
                      return null;
                    }
                    return <p key={i} className={line ? 'mb-1' : 'mb-2'}>{line || '\u00A0'}</p>;
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-dark-800 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-forest-500 rounded-full"
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.6,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
                <span className="text-sm text-dark-400">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-dark-500 mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickAction(action.prompt)}
                className="px-3 py-1.5 text-xs bg-dark-800 hover:bg-dark-700 border border-dark-700 hover:border-dark-600 rounded-full text-dark-300 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-dark-800">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about circuits..."
            rows={1}
            className="w-full px-4 py-3 pr-12 bg-dark-800 border border-dark-700 rounded-xl text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-forest-600 resize-none transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-forest-600 hover:bg-forest-500 disabled:bg-dark-700 disabled:cursor-not-allowed rounded-lg text-white transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[10px] text-dark-600 mt-2 text-center">
          CircuitBot can make mistakes. Always verify your circuits!
        </p>
      </div>
    </motion.div>
  );
};

export default ChatPanel;
