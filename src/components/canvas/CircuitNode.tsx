import React, { memo, useState, useEffect, useMemo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { getKiCadSvg } from '../../services/kicadSvgService';
import { fetchComponentInsight } from '../../services/aiService';
import type { CircuitComponent } from '../../types';

interface CircuitNodeData {
  component: CircuitComponent;
  rotation: number;
  label?: string;
  isSelected?: boolean;
  isActive?: boolean;
}

const CircuitNode: React.FC<NodeProps<CircuitNodeData>> = ({ data, selected }) => {
  const { component, rotation = 0, isActive = false } = data;
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [insight, setInsight] = useState('');
  const [insightStatus, setInsightStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');

  const formattedInsight = useMemo(() => {
    const text = insight || component.description;
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    return withBold.replace(/\n/g, '<br />');
  }, [insight, component.description]);

  const componentColor = useMemo(() => {
    const palette: Record<string, string> = {
      source: '#ef4444',
      passive: '#a855f7',
      active: '#3b82f6',
      output: '#f59e0b',
      measurement: '#06b6d4',
      connection: '#9ca3af',
    };
    return palette[component.category] || '#9ca3af';
  }, [component.category]);

  const activeGlow = useMemo(() => {
    if (!isActive) return 'none';
    if (component.type === 'led') return '0 0 18px rgba(245, 158, 11, 0.9)';
    if (component.category === 'output') return '0 0 14px rgba(245, 158, 11, 0.6)';
    return '0 0 10px rgba(59, 130, 246, 0.45)';
  }, [isActive, component.type, component.category]);

  useEffect(() => {
    setInsight('');
    setInsightStatus('idle');
  }, [component.type]);

  useEffect(() => {
    // Fetch KiCAD SVG for this component type
    getKiCadSvg(component.type).then((svg) => {
      // Replace default green strokes with category color
      const recolored = svg.replace(/#22c55e/gi, componentColor);
      // Thicken symbol strokes for readability
      const thickened = recolored.replace(/stroke-width="([\d.]+)"/g, (_m, w) => {
        const numeric = Number.parseFloat(w);
        const scaled = Number.isFinite(numeric) ? Math.max(numeric * 1.6, 1.6) : 2;
        return `stroke-width="${scaled.toFixed(2)}"`;
      });
      setSvgContent(thickened);
      setLoading(false);
    });
  }, [component.type, componentColor]);

  useEffect(() => {
    if (!hovering || insightStatus !== 'idle') return;
    let cancelled = false;
    setInsightStatus('loading');

    fetchComponentInsight(component)
      .then((text) => {
        if (cancelled) return;
        setInsight(text);
        setInsightStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setInsightStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [hovering, insightStatus, component]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative group ${selected ? 'z-10' : ''}`}
      style={{ transform: `rotate(${rotation}deg)` }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Hover insight card pulled from Gemini with local fallback */}
      <div className={`pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-72 transition-all duration-200 ${hovering ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}>
        <div className="bg-dark-900/95 border border-dark-700 rounded-lg shadow-xl px-3 py-2 glass">
          <p className="text-[11px] text-dark-100 font-semibold mb-1" style={{ color: componentColor }}>
            {component.name} insight
          </p>
          {insightStatus === 'loading' && (
            <div className="flex items-center gap-2 text-[11px] text-dark-300">
              <div className="w-3 h-3 border-2 border-dark-500 border-t-transparent rounded-full animate-spin" />
              <span>Asking Gemini...</span>
            </div>
          )}
          {insightStatus !== 'loading' && (
            <p
              className="text-[11px] text-dark-200 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formattedInsight }}
            />
          )}
        </div>
      </div>

      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="sourceLeft"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="targetRight"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="targetTop"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sourceBottom"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="source"
        position={Position.Top}
        id="sourceTop"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="targetBottom"
        className="!w-3.5 !h-3.5 !bg-dark-600 !border-2 !border-dark-700 hover:!bg-dark-500 transition-colors"
        style={{ backgroundColor: componentColor }}
      />
      {component.type === 'transistor' && (
        <Handle
          type="target"
          position={Position.Bottom}
          id="base"
          className="!w-3.5 !h-3.5 !border-2 !border-dark-700"
          style={{ backgroundColor: componentColor }}
        />
      )}

      {/* Pure SVG Component Visual without box */}
      <div className="w-20 h-20 flex items-center justify-center relative">
        {!loading && svgContent && (
          <div
            className="w-14 h-14 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
            style={{ filter: isActive ? 'drop-shadow(0 0 4px rgba(255,255,255,0.2))' : 'none' }}
          />
        )}
        {(!svgContent || loading) && (
          <div className="w-12 h-12 border-2 border-dark-500 rounded-full animate-spin" />
        )}
        
        {/* Selection glow effect */}
        {selected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 pointer-events-none"
            initial={false}
            animate={{ boxShadow: '0 0 14px rgba(96, 165, 250, 0.4)' }}
            style={{ borderColor: componentColor }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Active glow for outputs (e.g., LED) */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={false}
            animate={{ boxShadow: activeGlow }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: 'mirror' }}
          />
        )}
      </div>

      {/* Label */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2">
        <div className="bg-dark-900/90 border border-dark-700 rounded-md px-2 py-0.5 shadow"
             style={{ borderColor: componentColor }}>
          <p className="text-[11px] text-dark-200 whitespace-nowrap">{data.label || component.name}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CircuitNode);
