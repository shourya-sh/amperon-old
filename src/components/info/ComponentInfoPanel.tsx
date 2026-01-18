import React from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Trash2, Copy, ExternalLink } from 'lucide-react';
import { useCircuitStore } from '../../stores';
import type { CircuitComponent } from '../../types';

interface ComponentInfoPanelProps {
  component: CircuitComponent;
  nodeId: string;
  onClose: () => void;
}

const ComponentInfoPanel: React.FC<ComponentInfoPanelProps> = ({ component, nodeId, onClose }) => {
  const { removeNode, updateNode } = useCircuitStore();

  const handleDelete = () => {
    removeNode(nodeId);
    onClose();
  };

  const handleRotate = () => {
    // Rotate the component
    updateNode(nodeId, {
      data: {
        component,
        rotation: 90, // Would need to track current rotation
      },
    } as any);
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      className="absolute right-4 top-4 w-72 bg-dark-900 border border-dark-700 rounded-xl shadow-2xl overflow-hidden z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-2xl">
            {component.symbol}
          </div>
          <div>
            <h3 className="font-semibold text-dark-100">{component.name}</h3>
            <p className="text-xs text-dark-500 capitalize">{component.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-dark-800 rounded-lg text-dark-500 hover:text-dark-300"
        >
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      <div className="p-4 border-b border-dark-800">
        <p className="text-sm text-dark-300 leading-relaxed">{component.description}</p>
      </div>

      {/* Properties */}
      {component.properties.length > 0 && (
        <div className="p-4 border-b border-dark-800">
          <h4 className="text-xs font-medium text-dark-500 uppercase tracking-wider mb-3">
            Properties
          </h4>
          <div className="space-y-2">
            {component.properties.map((prop) => (
              <div key={prop.name} className="flex items-center justify-between">
                <span className="text-sm text-dark-400">{prop.name}</span>
                {prop.editable ? (
                  <input
                    type="text"
                    defaultValue={`${prop.value}`}
                    className="w-24 px-2 py-1 bg-dark-800 border border-dark-700 rounded text-sm text-dark-100 text-right focus:outline-none focus:border-forest-600"
                  />
                ) : (
                  <span className="text-sm text-dark-200 font-medium">
                    {prop.value} {prop.unit}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="p-3 flex items-center gap-2">
        <button
          onClick={handleRotate}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 transition-colors"
        >
          <RotateCcw size={14} />
          Rotate
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-dark-800 hover:bg-dark-700 rounded-lg text-sm text-dark-300 transition-colors">
          <Copy size={14} />
          Duplicate
        </button>
        <button
          onClick={handleDelete}
          className="p-2 bg-dark-800 hover:bg-red-900/30 rounded-lg text-dark-300 hover:text-red-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Learn More */}
      <div className="p-3 pt-0">
        <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dark-700 hover:border-forest-600 rounded-lg text-sm text-forest-400 transition-colors">
          <ExternalLink size={14} />
          Learn more about {component.name}
        </button>
      </div>
    </motion.div>
  );
};

export default ComponentInfoPanel;
