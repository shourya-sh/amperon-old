import React, { useState } from 'react';
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
    <div className="w-56 h-full bg-dark-900 border-r border-dark-800 flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-dark-800">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-500" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 bg-dark-850 border border-dark-700 rounded-md text-sm text-dark-200 placeholder-dark-500 focus:outline-none focus:border-dark-600 transition-colors"
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
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-dark-800 transition-colors"
                  >
                    <Icon size={14} className="text-dark-400" />
                    <span className="flex-1 text-left text-sm text-dark-300">
                      {category.name}
                    </span>
                    <span className="text-xs text-dark-500">
                      {categoryComponents.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={12} className="text-dark-500" />
                    ) : (
                      <ChevronRight size={12} className="text-dark-500" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="pl-3 space-y-0.5 mt-0.5 mb-1">
                      {categoryComponents.map((component) => (
                        <ComponentItem
                          key={component.id}
                          component={component}
                          onDragStart={onDragStart}
                          onHover={setHoveredComponent}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Component Info Tooltip */}
      {hoveredComponent && (
        <div className="absolute left-56 bottom-4 ml-2 w-64 bg-dark-850 border border-dark-700 rounded-lg p-3 shadow-lg z-50">
          <div className="flex items-start gap-2">
            <span className="text-base">{hoveredComponent.symbol}</span>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-dark-200">{hoveredComponent.name}</h4>
              <p className="text-xs text-dark-400 mt-0.5 leading-relaxed">{hoveredComponent.description}</p>
            </div>
          </div>
          {hoveredComponent.properties.length > 0 && (
            <div className="mt-2 pt-2 border-t border-dark-700">
              <div className="space-y-0.5">
                {hoveredComponent.properties.map((prop) => (
                  <div key={prop.name} className="flex justify-between text-xs">
                    <span className="text-dark-500">{prop.name}</span>
                    <span className="text-dark-300">
                      {prop.value} {prop.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component)}
      onMouseEnter={() => onHover(component)}
      onMouseLeave={() => onHover(null)}
      className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-dark-800 cursor-grab active:cursor-grabbing transition-colors group"
    >
      <GripVertical size={10} className="text-dark-600 group-hover:text-dark-500" />
      <span className="text-sm">{component.symbol}</span>
      <span className="flex-1 text-sm text-dark-400 group-hover:text-dark-300">{component.name}</span>
    </div>
  );
};

export default ComponentLibrary;
