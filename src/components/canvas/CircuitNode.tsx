import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { getKiCadSvg } from '../../services/kicadSvgService';
import type { CircuitComponent } from '../../types';

interface CircuitNodeData {
  component: CircuitComponent;
  rotation: number;
  label?: string;
  isSelected?: boolean;
}

const CircuitNode: React.FC<NodeProps<CircuitNodeData>> = ({ data, selected }) => {
  const { component, rotation = 0 } = data;
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch KiCAD SVG for this component type
    getKiCadSvg(component.type).then((svg) => {
      setSvgContent(svg);
      setLoading(false);
    });
  }, [component.type]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative group ${selected ? 'z-10' : ''}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="target"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="source"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="sourceLeft"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="targetRight"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="targetTop"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="sourceBottom"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="sourceTop"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="targetBottom"
        className="!w-2.5 !h-2.5 !bg-forest-500 !border-2 !border-dark-700 hover:!bg-forest-400 transition-colors"
      />
      {component.type === 'transistor' && (
        <Handle
          type="target"
          position={Position.Bottom}
          id="base"
          className="!w-2.5 !h-2.5 !bg-amber-500 !border-2 !border-dark-700"
        />
      )}

      {/* Pure SVG Component Visual without box */}
      <div className="w-16 h-16 flex items-center justify-center relative">
        {!loading && svgContent && (
          <div
            className="w-16 h-16 flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
        {(!svgContent || loading) && (
          <div className="w-12 h-12 border-2 border-forest-500 rounded-full animate-spin" />
        )}
        
        {/* Selection glow effect */}
        {selected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-forest-400 pointer-events-none"
            initial={false}
            animate={{ boxShadow: '0 0 20px rgba(22, 163, 74, 0.5)' }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Label */}
      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2">
        <div className="bg-dark-900/90 border border-dark-700 rounded-md px-2 py-0.5 shadow">
          <p className="text-[11px] text-dark-200 whitespace-nowrap">{data.label || component.name}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CircuitNode);
