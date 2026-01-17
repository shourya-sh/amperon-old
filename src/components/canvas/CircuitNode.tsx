import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import type { CircuitComponent } from '../../types';

interface CircuitNodeData {
  component: CircuitComponent;
  rotation: number;
  label?: string;
  isSelected?: boolean;
}

const CircuitNode: React.FC<NodeProps<CircuitNodeData>> = ({ data, selected }) => {
  const { component, rotation = 0, label } = data;

  const getComponentVisual = () => {
    switch (component.type) {
      case 'resistor':
        return <ResistorVisual />;
      case 'capacitor':
        return <CapacitorVisual />;
      case 'led':
        return <LEDVisual />;
      case 'battery':
        return <BatteryVisual />;
      case 'switch':
        return <SwitchVisual />;
      case 'ground':
        return <GroundVisual />;
      case 'transistor':
        return <TransistorVisual />;
      case 'diode':
        return <DiodeVisual />;
      case 'lightbulb':
        return <LightbulbVisual />;
      case 'buzzer':
        return <BuzzerVisual />;
      case 'motor':
        return <MotorVisual />;
      case 'voltmeter':
        return <VoltmeterVisual />;
      case 'ammeter':
        return <AmmeterVisual />;
      case 'inductor':
        return <InductorVisual />;
      default:
        return <DefaultVisual component={component} />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative group ${selected ? 'z-10' : ''}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Connection Handles */}
      {component.type !== 'ground' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-forest-500 !border-2 !border-dark-800 hover:!bg-forest-400 transition-colors"
        />
      )}
      <Handle
        type="source"
        position={component.type === 'ground' ? Position.Top : Position.Right}
        className="!w-3 !h-3 !bg-forest-500 !border-2 !border-dark-800 hover:!bg-forest-400 transition-colors"
      />
      {component.type === 'transistor' && (
        <Handle
          type="target"
          position={Position.Bottom}
          id="base"
          className="!w-3 !h-3 !bg-amber-500 !border-2 !border-dark-800"
        />
      )}

      {/* Component Body */}
      <div
        className={`
          relative px-4 py-3 rounded-xl bg-dark-800/90 border-2 backdrop-blur-sm
          transition-all duration-200 min-w-[80px]
          ${selected 
            ? 'border-forest-500 shadow-lg shadow-forest-500/30' 
            : 'border-dark-600 hover:border-dark-500'
          }
        `}
      >
        {/* Component Visual */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 flex items-center justify-center">
            {getComponentVisual()}
          </div>
          
          {/* Label */}
          <div className="text-center">
            <p className="text-xs font-medium text-dark-200">{component.name}</p>
            {label && (
              <p className="text-[10px] text-dark-400 mt-0.5">{label}</p>
            )}
          </div>
        </div>

        {/* Selection Indicator */}
        {selected && (
          <motion.div
            layoutId="selection"
            className="absolute inset-0 rounded-xl border-2 border-forest-400 pointer-events-none"
            initial={false}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
      </div>

      {/* Tooltip on hover */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-dark-800 border border-dark-600 rounded-lg px-3 py-1.5 shadow-xl">
          <p className="text-xs text-dark-200 whitespace-nowrap">{component.description.slice(0, 50)}...</p>
        </div>
      </div>
    </motion.div>
  );
};

// Component Visuals
const ResistorVisual = () => (
  <svg viewBox="0 0 48 24" className="w-full h-auto">
    <path
      d="M0 12 H8 L10 4 L14 20 L18 4 L22 20 L26 4 L30 20 L34 4 L38 12 H48"
      fill="none"
      stroke="#c084fc"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CapacitorVisual = () => (
  <svg viewBox="0 0 48 32" className="w-full h-auto">
    <line x1="0" y1="16" x2="18" y2="16" stroke="#60a5fa" strokeWidth="2.5" />
    <line x1="18" y1="4" x2="18" y2="28" stroke="#60a5fa" strokeWidth="3" />
    <line x1="30" y1="4" x2="30" y2="28" stroke="#60a5fa" strokeWidth="3" />
    <line x1="30" y1="16" x2="48" y2="16" stroke="#60a5fa" strokeWidth="2.5" />
  </svg>
);

const LEDVisual = () => (
  <svg viewBox="0 0 48 32" className="w-full h-auto">
    <polygon
      points="12,4 12,28 36,16"
      fill="none"
      stroke="#fbbf24"
      strokeWidth="2.5"
    />
    <line x1="36" y1="4" x2="36" y2="28" stroke="#fbbf24" strokeWidth="2.5" />
    <line x1="0" y1="16" x2="12" y2="16" stroke="#fbbf24" strokeWidth="2.5" />
    <line x1="36" y1="16" x2="48" y2="16" stroke="#fbbf24" strokeWidth="2.5" />
    {/* Light rays */}
    <line x1="38" y1="6" x2="44" y2="2" stroke="#fbbf24" strokeWidth="1.5" />
    <line x1="40" y1="10" x2="46" y2="8" stroke="#fbbf24" strokeWidth="1.5" />
  </svg>
);

const BatteryVisual = () => (
  <svg viewBox="0 0 48 32" className="w-full h-auto">
    <line x1="0" y1="16" x2="14" y2="16" stroke="#f87171" strokeWidth="2.5" />
    <line x1="14" y1="6" x2="14" y2="26" stroke="#f87171" strokeWidth="3" />
    <line x1="22" y1="10" x2="22" y2="22" stroke="#f87171" strokeWidth="3" />
    <line x1="30" y1="6" x2="30" y2="26" stroke="#f87171" strokeWidth="3" />
    <line x1="38" y1="10" x2="38" y2="22" stroke="#f87171" strokeWidth="3" />
    <line x1="38" y1="16" x2="48" y2="16" stroke="#f87171" strokeWidth="2.5" />
    {/* Plus sign */}
    <text x="4" y="8" fill="#f87171" fontSize="8" fontWeight="bold">+</text>
    <text x="42" y="8" fill="#f87171" fontSize="8" fontWeight="bold">-</text>
  </svg>
);

const SwitchVisual = () => (
  <svg viewBox="0 0 48 24" className="w-full h-auto">
    <line x1="0" y1="16" x2="12" y2="16" stroke="#a78bfa" strokeWidth="2.5" />
    <circle cx="14" cy="16" r="3" fill="#a78bfa" />
    <line x1="14" y1="16" x2="34" y2="6" stroke="#a78bfa" strokeWidth="2.5" />
    <circle cx="36" cy="16" r="3" fill="#a78bfa" />
    <line x1="38" y1="16" x2="48" y2="16" stroke="#a78bfa" strokeWidth="2.5" />
  </svg>
);

const GroundVisual = () => (
  <svg viewBox="0 0 32 32" className="w-full h-auto">
    <line x1="16" y1="0" x2="16" y2="12" stroke="#6ee7b7" strokeWidth="2.5" />
    <line x1="4" y1="12" x2="28" y2="12" stroke="#6ee7b7" strokeWidth="2.5" />
    <line x1="8" y1="18" x2="24" y2="18" stroke="#6ee7b7" strokeWidth="2.5" />
    <line x1="12" y1="24" x2="20" y2="24" stroke="#6ee7b7" strokeWidth="2.5" />
  </svg>
);

const TransistorVisual = () => (
  <svg viewBox="0 0 48 48" className="w-full h-auto">
    <circle cx="24" cy="24" r="18" fill="none" stroke="#22c55e" strokeWidth="2" />
    <line x1="0" y1="24" x2="14" y2="24" stroke="#22c55e" strokeWidth="2.5" />
    <line x1="14" y1="12" x2="14" y2="36" stroke="#22c55e" strokeWidth="2.5" />
    <line x1="14" y1="18" x2="32" y2="8" stroke="#22c55e" strokeWidth="2.5" />
    <line x1="14" y1="30" x2="32" y2="40" stroke="#22c55e" strokeWidth="2.5" />
    <line x1="32" y1="8" x2="48" y2="8" stroke="#22c55e" strokeWidth="2.5" />
    <line x1="32" y1="40" x2="48" y2="40" stroke="#22c55e" strokeWidth="2.5" />
    <polygon points="26,36 32,40 28,32" fill="#22c55e" />
  </svg>
);

const DiodeVisual = () => (
  <svg viewBox="0 0 48 24" className="w-full h-auto">
    <line x1="0" y1="12" x2="16" y2="12" stroke="#f472b6" strokeWidth="2.5" />
    <polygon points="16,4 16,20 32,12" fill="none" stroke="#f472b6" strokeWidth="2.5" />
    <line x1="32" y1="4" x2="32" y2="20" stroke="#f472b6" strokeWidth="2.5" />
    <line x1="32" y1="12" x2="48" y2="12" stroke="#f472b6" strokeWidth="2.5" />
  </svg>
);

const LightbulbVisual = () => (
  <svg viewBox="0 0 32 40" className="w-full h-auto">
    <circle cx="16" cy="14" r="12" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
    <path d="M12 26 L12 32 L20 32 L20 26" fill="none" stroke="#fbbf24" strokeWidth="2.5" />
    <line x1="11" y1="30" x2="21" y2="30" stroke="#fbbf24" strokeWidth="2" />
    <path d="M12 18 Q16 10 20 18" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
  </svg>
);

const BuzzerVisual = () => (
  <svg viewBox="0 0 40 32" className="w-full h-auto">
    <rect x="8" y="4" width="24" height="24" rx="4" fill="none" stroke="#f97316" strokeWidth="2.5" />
    <circle cx="20" cy="16" r="6" fill="none" stroke="#f97316" strokeWidth="2" />
    <line x1="0" y1="16" x2="8" y2="16" stroke="#f97316" strokeWidth="2.5" />
    <line x1="32" y1="16" x2="40" y2="16" stroke="#f97316" strokeWidth="2.5" />
  </svg>
);

const MotorVisual = () => (
  <svg viewBox="0 0 40 40" className="w-full h-auto">
    <circle cx="20" cy="20" r="16" fill="none" stroke="#06b6d4" strokeWidth="2.5" />
    <text x="20" y="24" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">M</text>
    <line x1="0" y1="20" x2="4" y2="20" stroke="#06b6d4" strokeWidth="2.5" />
    <line x1="36" y1="20" x2="40" y2="20" stroke="#06b6d4" strokeWidth="2.5" />
  </svg>
);

const VoltmeterVisual = () => (
  <svg viewBox="0 0 40 40" className="w-full h-auto">
    <circle cx="20" cy="20" r="16" fill="none" stroke="#14b8a6" strokeWidth="2.5" />
    <text x="20" y="24" textAnchor="middle" fill="#14b8a6" fontSize="12" fontWeight="bold">V</text>
    <line x1="0" y1="20" x2="4" y2="20" stroke="#14b8a6" strokeWidth="2.5" />
    <line x1="36" y1="20" x2="40" y2="20" stroke="#14b8a6" strokeWidth="2.5" />
  </svg>
);

const AmmeterVisual = () => (
  <svg viewBox="0 0 40 40" className="w-full h-auto">
    <circle cx="20" cy="20" r="16" fill="none" stroke="#eab308" strokeWidth="2.5" />
    <text x="20" y="24" textAnchor="middle" fill="#eab308" fontSize="12" fontWeight="bold">A</text>
    <line x1="0" y1="20" x2="4" y2="20" stroke="#eab308" strokeWidth="2.5" />
    <line x1="36" y1="20" x2="40" y2="20" stroke="#eab308" strokeWidth="2.5" />
  </svg>
);

const InductorVisual = () => (
  <svg viewBox="0 0 48 24" className="w-full h-auto">
    <line x1="0" y1="12" x2="8" y2="12" stroke="#818cf8" strokeWidth="2.5" />
    <path
      d="M8 12 Q12 0 16 12 Q20 24 24 12 Q28 0 32 12 Q36 24 40 12"
      fill="none"
      stroke="#818cf8"
      strokeWidth="2.5"
    />
    <line x1="40" y1="12" x2="48" y2="12" stroke="#818cf8" strokeWidth="2.5" />
  </svg>
);

const DefaultVisual: React.FC<{ component: CircuitComponent }> = ({ component }) => (
  <div className="w-12 h-12 rounded-lg bg-dark-700 flex items-center justify-center text-2xl">
    {component.symbol}
  </div>
);

export default memo(CircuitNode);
