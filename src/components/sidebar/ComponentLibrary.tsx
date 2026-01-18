import React, { useEffect, useState } from 'react';
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
  GripVertical,
} from 'lucide-react';
import { circuitComponents, componentCategories } from '../../data/components';
import { getKiCadSvg } from '../../services/kicadSvgService';
import type { CircuitComponent } from '../../types';
// Match the canvas palette so sidebar and board stay visually consistent.
const categoryColorMap: Record<string, string> = {
  source: '#ef4444',
  passive: '#a855f7',
  active: '#3b82f6',
  output: '#f59e0b',
  measurement: '#06b6d4',
  connection: '#9ca3af',
};

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Zap,
  CircuitBoard,
  Cpu,
  Lightbulb,
  Gauge,
  Link,
};

const recolorAndThicken = (svg: string, color: string): string => {
  const recolored = svg.replace(/#22c55e/gi, color);
  return recolored.replace(/stroke-width="([\d.]+)"/g, (_m, w) => {
    const numeric = Number.parseFloat(w);
    const scaled = Number.isFinite(numeric) ? Math.max(numeric * 1.6, 1.6) : 2;
    return `stroke-width="${scaled.toFixed(2)}"`;
  });
};

const ComponentIcon: React.FC<{ component: CircuitComponent; color: string }> = ({ component, color }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getKiCadSvg(component.type)
      .then((svg) => {
        if (cancelled) return;
        setSvgContent(recolorAndThicken(svg, color));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setSvgContent('');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [component.type, color]);

  if (loading) {
    return <div className="w-5 h-5 border-2 border-dark-600 border-t-transparent rounded-full animate-spin" />;
  }

  if (!svgContent) {
    return <div className="w-5 h-5 border border-dark-600 rounded-sm" />;
  }

  return (
    <div
      className="w-5 h-5 flex items-center justify-center [&>svg]:block [&>svg]:mx-auto [&>svg]:my-auto [&>svg]:h-5 [&>svg]:w-5 [&>svg]:overflow-visible"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{ color }}
    />
  );
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
                    <div className="pl-0 space-y-0.5 mt-0.5 mb-1">
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
  const accent = categoryColorMap[component.category] || '#22c55e';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component)}
      onMouseEnter={() => onHover(component)}
      onMouseLeave={() => onHover(null)}
      className="flex items-center gap-3 px-2.5 py-2 rounded-lg hover:bg-dark-800 cursor-grab active:cursor-grabbing transition-colors group"
    >
      <GripVertical size={12} className="text-dark-600 group-hover:text-dark-500" />
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-md bg-dark-850 border border-dark-700 shadow-inner flex items-center justify-center">
          <ComponentIcon component={component} color={accent} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm text-dark-200 truncate">{component.name}</span>
          <span className="text-xs text-dark-500">{component.symbol}</span>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;
