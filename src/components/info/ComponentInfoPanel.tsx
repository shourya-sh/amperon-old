import React from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw, Trash2, Copy, ExternalLink, Zap } from 'lucide-react';
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
      className="absolute right-4 top-4 w-80 bg-dark-900 border-2 border-dark-700 rounded-2xl shadow-2xl overflow-hidden z-40"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-dark-800 bg-dark-850">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
            <Zap size={22} className="text-duo-green" />
          </div>
          <div>
            <h3 className="font-display font-bold text-dark-100">{component.name}</h3>
            <p className="text-xs font-display font-medium text-dark-500 capitalize">{component.category}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-dark-800 rounded-xl text-dark-500 hover:text-dark-300 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Description */}
      <div className="p-4 border-b-2 border-dark-800">
        <p className="text-sm text-dark-300 leading-relaxed">{component.description}</p>
      </div>

      {/* Properties */}
      {component.properties.length > 0 && (
        <div className="p-4 border-b-2 border-dark-800">
          <h4 className="text-xs font-display font-bold text-dark-400 uppercase tracking-wider mb-3">
            Properties
          </h4>
          <div className="space-y-3">
            {component.properties.map((prop) => (
              <div key={prop.name} className="flex items-center justify-between">
                <span className="text-sm font-display font-medium text-dark-400">{prop.name}</span>
                {prop.editable ? (
                  <input
                    type="text"
                    defaultValue={`${prop.value}`}
                    className="w-24 px-3 py-1.5 bg-dark-800 border-2 border-dark-700 rounded-lg text-sm text-dark-100 text-right focus:outline-none focus:border-duo-green transition-colors"
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
      <div className="p-4 flex items-center gap-2">
        <button
          onClick={handleRotate}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-750 border-2 border-dark-700 rounded-xl text-sm font-display font-semibold text-dark-300 hover:text-dark-100 transition-all"
        >
          <RotateCcw size={16} />
          Rotate
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-800 hover:bg-dark-750 border-2 border-dark-700 rounded-xl text-sm font-display font-semibold text-dark-300 hover:text-dark-100 transition-all">
          <Copy size={16} />
          Duplicate
        </button>
        <button
          onClick={handleDelete}
          className="p-2.5 bg-dark-800 hover:bg-duo-red/10 border-2 border-dark-700 hover:border-duo-red/30 rounded-xl text-dark-400 hover:text-duo-red transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Learn More */}
      <div className="p-4 pt-0">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-duo-green/10 border-2 border-duo-green/20 hover:border-duo-green/40 rounded-xl text-sm font-display font-semibold text-duo-green hover:text-duo-greenDark transition-all">
          <ExternalLink size={16} />
          Learn more about {component.name}
        </button>
      </div>
    </motion.div>
  );
};

export default ComponentInfoPanel;
