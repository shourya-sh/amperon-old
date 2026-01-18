import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Zap, RotateCw, Eye } from 'lucide-react';
import { circuitComponents } from '../../data/components';
import { getKiCadSvg } from '../../services/kicadSvgService';
import type { CircuitComponent } from '../../types';

interface ComponentVisualizerProps {
  componentIds: string[];
  title?: string;
  description?: string;
  interactive?: boolean;
}

const ComponentVisualizer: React.FC<ComponentVisualizerProps> = ({
  componentIds,
  title = "Component Preview",
  description,
  interactive = true,
}) => {
  const [selectedComponent, setSelectedComponent] = useState<CircuitComponent | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [rotation, setRotation] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const components = componentIds
    .map(id => circuitComponents.find(c => c.id === id))
    .filter(Boolean) as CircuitComponent[];

  useEffect(() => {
    if (components.length > 0 && !selectedComponent) {
      setSelectedComponent(components[0]);
    }
  }, [components, selectedComponent]);

  useEffect(() => {
    if (!selectedComponent) return;

    let cancelled = false;
    getKiCadSvg(selectedComponent.type)
      .then((svg) => {
        if (cancelled) return;
        // Enhance SVG with better colors
        const enhanced = svg
          .replace(/#22c55e/gi, isActive ? '#22c55e' : '#64748b')
          .replace(/stroke-width="([\d.]+)"/g, (m, w) => {
            const width = parseFloat(w) * 1.5;
            return `stroke-width="${width}"`;
          });
        setSvgContent(enhanced);
      })
      .catch(() => {
        if (!cancelled) setSvgContent('');
      });

    return () => { cancelled = true; };
  }, [selectedComponent, isActive]);

  if (components.length === 0) return null;

  return (
    <div className="my-6 p-6 bg-dark-900/80 border border-dark-700 rounded-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-forest-600/20 flex items-center justify-center">
          <Eye className="text-forest-400" size={18} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-dark-100">{title}</h4>
          {description && (
            <p className="text-sm text-dark-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Visualization Area */}
        <div className="bg-dark-950 border border-dark-800 rounded-lg p-6 flex items-center justify-center min-h-[200px] relative overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{
              backgroundImage: 'radial-gradient(circle, #22c55e 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Component SVG */}
          <AnimatePresence mode="wait">
            {svgContent && (
              <motion.div
                key={selectedComponent?.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: rotation 
                }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
                style={{
                  filter: isActive ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.5))' : 'none'
                }}
              >
                <div
                  className="w-32 h-32 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:overflow-visible"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Controls */}
          {interactive && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              <button
                onClick={() => setRotation(r => r + 90)}
                className="p-2 bg-dark-800/80 hover:bg-dark-700 border border-dark-700 rounded-lg transition-colors"
                title="Rotate"
              >
                <RotateCw size={16} className="text-dark-300" />
              </button>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`p-2 border rounded-lg transition-colors ${
                  isActive
                    ? 'bg-forest-600/20 border-forest-600/50 text-forest-400'
                    : 'bg-dark-800/80 hover:bg-dark-700 border-dark-700 text-dark-300'
                }`}
                title={isActive ? 'Deactivate' : 'Activate'}
              >
                <Zap size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Component Info */}
        <div className="space-y-4">
          {/* Component Selector */}
          {components.length > 1 && (
            <div className="space-y-2">
              <label className="text-xs font-medium text-dark-400 uppercase tracking-wider">
                Select Component
              </label>
              <div className="grid grid-cols-2 gap-2">
                {components.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedComponent(comp);
                      setRotation(0);
                      setIsActive(false);
                    }}
                    className={`p-3 rounded-lg text-left text-sm transition-all ${
                      selectedComponent?.id === comp.id
                        ? 'bg-forest-600/20 border-forest-600/50 text-forest-400 border'
                        : 'bg-dark-800 hover:bg-dark-750 border border-dark-700 text-dark-300'
                    }`}
                  >
                    <div className="font-medium">{comp.name}</div>
                    <div className="text-xs opacity-70 mt-0.5">{comp.symbol}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Component Details */}
          {selectedComponent && (
            <motion.div
              key={selectedComponent.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div>
                <h5 className="text-sm font-semibold text-dark-100 mb-1">
                  {selectedComponent.name}
                </h5>
                <p className="text-sm text-dark-400 leading-relaxed">
                  {selectedComponent.description}
                </p>
              </div>

              {/* Properties */}
              {selectedComponent.properties.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-dark-400 uppercase tracking-wider">
                    Properties
                  </div>
                  <div className="space-y-1.5">
                    {selectedComponent.properties.map((prop, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-dark-950 border border-dark-800 rounded text-sm"
                      >
                        <span className="text-dark-300">{prop.name}</span>
                        <span className="font-mono text-forest-400">
                          {prop.value} {prop.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connections */}
              <div className="flex items-center gap-2 p-2 bg-dark-950 border border-dark-800 rounded text-sm">
                <Info size={14} className="text-dark-500" />
                <span className="text-dark-300">
                  {selectedComponent.connections} connection{selectedComponent.connections !== 1 ? 's' : ''}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Hint */}
      {interactive && (
        <div className="mt-4 p-3 bg-forest-600/10 border border-forest-600/20 rounded-lg flex items-start gap-2">
          <Info size={16} className="text-forest-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-dark-300">
            Click the lightning bolt to see the component "active" or rotate it to view from different angles.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComponentVisualizer;
