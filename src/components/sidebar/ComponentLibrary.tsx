import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Zap,
  CircuitBoard,
  Cpu,
  Lightbulb,
  Gauge,
  Link,
  Info,
  GripVertical
} from 'lucide-react';
import { circuitComponents, componentCategories } from '../../data/components';
import type { CircuitComponent } from '../../types';

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Zap,
  CircuitBoard,
  Cpu,
  Lightbulb,
  Gauge,
  Link,
};

const ComponentLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['source', 'passive', 'output']);
  const [hoveredComponent, setHoveredComponent] = useState<CircuitComponent | null>(null);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredComponents = searchQuery
    ? circuitComponents.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : circuitComponents;

  const onDragStart = (event: React.DragEvent, component: CircuitComponent) => {
    event.dataTransfer.setData('application/circuitcomponent', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 h-full bg-dark-900 border-r border-dark-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-dark-800">
        <h2 className="text-sm font-semibold text-dark-200 uppercase tracking-wider mb-3">
          Components
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-9 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-dark-100 placeholder-dark-500 focus:outline-none focus:border-forest-600 transition-colors"
          />
        </div>
      </div>

      {/* Component Categories */}
      <div className="flex-1 overflow-y-auto p-2">
        {searchQuery ? (
          // Search Results
          <div className="space-y-1">
            <p className="px-2 py-1 text-xs text-dark-500">
              {filteredComponents.length} results
            </p>
            {filteredComponents.map((component) => (
              <ComponentItem
                key={component.id}
                component={component}
                onDragStart={onDragStart}
                onHover={setHoveredComponent}
              />
            ))}
          </div>
        ) : (
          // Categories
          <div className="space-y-1">
            {componentCategories.map((category) => {
              const Icon = iconMap[category.icon] || CircuitBoard;
              const isExpanded = expandedCategories.includes(category.id);
              const categoryComponents = filteredComponents.filter(
                (c) => c.category === category.id
              );

              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors group"
                  >
                    <Icon size={16} className={category.color} />
                    <span className="flex-1 text-left text-sm font-medium text-dark-200">
                      {category.name}
                    </span>
                    <span className="text-xs text-dark-500 mr-2">
                      {categoryComponents.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={14} className="text-dark-500" />
                    ) : (
                      <ChevronRight size={14} className="text-dark-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 space-y-0.5 mt-1 mb-2">
                          {categoryComponents.map((component) => (
                            <ComponentItem
                              key={component.id}
                              component={component}
                              onDragStart={onDragStart}
                              onHover={setHoveredComponent}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Component Info Tooltip */}
      <AnimatePresence>
        {hoveredComponent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-64 bottom-4 ml-2 w-72 bg-dark-800 border border-dark-700 rounded-xl p-4 shadow-xl z-50"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center text-xl">
                {hoveredComponent.symbol}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-dark-100">{hoveredComponent.name}</h4>
                <p className="text-xs text-dark-400 mt-1">{hoveredComponent.description}</p>
              </div>
            </div>
            {hoveredComponent.properties.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dark-700">
                <p className="text-xs text-dark-500 mb-2">Properties:</p>
                <div className="space-y-1">
                  {hoveredComponent.properties.map((prop) => (
                    <div key={prop.name} className="flex justify-between text-xs">
                      <span className="text-dark-400">{prop.name}</span>
                      <span className="text-dark-200">
                        {prop.value} {prop.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ComponentItemProps {
  component: CircuitComponent;
  onDragStart: (event: React.DragEvent, component: CircuitComponent) => void;
  onHover: (component: CircuitComponent | null) => void;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ component, onDragStart, onHover }) => {
  return (
    <motion.div
      draggable
      onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, component)}
      onMouseEnter={() => onHover(component)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-800/50 hover:bg-dark-800 border border-transparent hover:border-dark-700 cursor-grab active:cursor-grabbing transition-all group"
    >
      <GripVertical size={12} className="text-dark-600 group-hover:text-dark-400" />
      <span className="text-lg">{component.symbol}</span>
      <span className="flex-1 text-sm text-dark-300">{component.name}</span>
      <Info size={12} className="text-dark-600 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default ComponentLibrary;
