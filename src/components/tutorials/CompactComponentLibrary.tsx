import React, { useState, useEffect } from 'react';
import { Search, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { circuitComponents, componentCategories } from '../../data/components';
import { getKiCadSvg } from '../../services/kicadSvgService';
import type { CircuitComponent } from '../../types';

const categoryColorMap: Record<string, string> = {
  source: '#ef4444',
  passive: '#a855f7',
  active: '#3b82f6',
  output: '#f59e0b',
  measurement: '#06b6d4',
  connection: '#9ca3af',
};

const recolorSvg = (svg: string, color: string): string => {
  return svg.replace(/#22c55e/gi, color);
};

const ComponentIcon: React.FC<{ component: CircuitComponent; color: string }> = ({ component, color }) => {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    getKiCadSvg(component.type)
      .then((svg) => {
        if (!cancelled) setSvgContent(recolorSvg(svg, color));
      })
      .catch(() => {
        if (!cancelled) setSvgContent('');
      });
    return () => { cancelled = true; };
  }, [component.type, color]);

  if (!svgContent) {
    return <div className="w-4 h-4 border border-dark-600 rounded-sm" />;
  }

  return (
    <div
      className="w-4 h-4 flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4"
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

interface CompactComponentLibraryProps {
  onDragStart: (event: React.DragEvent, component: CircuitComponent) => void;
  excludeGround?: boolean;
}

const CompactComponentLibrary: React.FC<CompactComponentLibraryProps> = ({ 
  onDragStart,
  excludeGround = true 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['source', 'passive', 'output']);

  // Filter out ground if excludeGround is true (use battery negative instead)
  const availableComponents = excludeGround 
    ? circuitComponents.filter(c => c.type !== 'ground')
    : circuitComponents;

  const filteredComponents = searchQuery
    ? availableComponents.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableComponents;

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="w-48 bg-dark-900/95 border-r-2 border-dark-700 flex flex-col h-full overflow-hidden">
      {/* Compact Search */}
      <div className="p-2.5 border-b-2 border-dark-700 bg-dark-850">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dark-500" size={14} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-dark-800 border-2 border-dark-600 rounded-lg text-xs text-dark-200 placeholder-dark-500 focus:outline-none focus:border-duo-green transition-colors"
          />
        </div>
      </div>

      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-2">
        {searchQuery ? (
          <div className="space-y-1">
            {filteredComponents.map((component) => (
              <ComponentItem
                key={component.id}
                component={component}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {componentCategories.map((category) => {
              const isExpanded = expandedCategories.includes(category.id);
              const categoryComponents = filteredComponents.filter(
                (c) => c.category === category.id
              );

              if (categoryComponents.length === 0) return null;

              return (
                <div key={category.id}>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown size={12} className="text-dark-500" />
                    ) : (
                      <ChevronRight size={12} className="text-dark-500" />
                    )}
                    <span className="flex-1 text-left text-xs font-display font-semibold text-dark-300">
                      {category.name}
                    </span>
                    <span className="text-xs font-display text-dark-500">
                      {categoryComponents.length}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="space-y-1 mt-1">
                      {categoryComponents.map((component) => (
                        <ComponentItem
                          key={component.id}
                          component={component}
                          onDragStart={onDragStart}
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

      {/* Tip */}
      <div className="p-2.5 border-t-2 border-dark-700 bg-dark-850">
        <p className="text-xs font-display font-medium text-dark-500 text-center">
          Drag components to canvas
        </p>
      </div>
    </div>
  );
};

interface ComponentItemProps {
  component: CircuitComponent;
  onDragStart: (event: React.DragEvent, component: CircuitComponent) => void;
}

const ComponentItem: React.FC<ComponentItemProps> = ({ component, onDragStart }) => {
  const accent = categoryColorMap[component.category] || '#4ade80';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, component)}
      className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-dark-700 cursor-grab active:cursor-grabbing transition-colors group border-2 border-transparent hover:border-dark-600"
    >
      <GripVertical size={12} className="text-dark-600 group-hover:text-dark-400" />
      <div className="w-7 h-7 rounded-lg bg-dark-800 border-2 border-dark-600 flex items-center justify-center">
        <ComponentIcon component={component} color={accent} />
      </div>
      <span className="text-xs font-display font-medium text-dark-300 truncate">{component.name}</span>
    </div>
  );
};

export default CompactComponentLibrary;
