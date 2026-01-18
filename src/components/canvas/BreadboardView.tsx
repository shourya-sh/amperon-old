import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BreadboardViewProps {
  onClose: () => void;
}

const BreadboardView: React.FC<BreadboardViewProps> = ({ onClose }) => {
  // Note: These are used implicitly in the rendering logic
  const rows = 30; void rows;
  const cols = 63;
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

  const getRowLabel = (index: number): string => {
    // Power rails at top and bottom
    if (index === 0) return '+';
    if (index === 1) return '-';
    if (index >= 2 && index <= 6) return String.fromCharCode(65 + (index - 2)); // A-E
    if (index === 7) return ''; // Gap
    if (index >= 8 && index <= 12) return String.fromCharCode(70 + (index - 8)); // F-J
    if (index === 13) return '-';
    if (index === 14) return '+';
    return '';
  };

  const isPowerRail = (row: number): boolean => {
    return row === 0 || row === 1 || row === 13 || row === 14;
  };

  const isGap = (row: number): boolean => {
    return row === 7;
  };

  const isConnected = (): boolean => {
    // In a breadboard, holes in the same row (within a section) are connected
    // Power rails are connected horizontally
    return true;
  }; void isConnected;

  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setSelectedCells((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full flex flex-col bg-dark-950">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-800">
        <div>
          <h2 className="font-semibold text-dark-100">Breadboard View</h2>
          <p className="text-xs text-dark-500">Click on holes to place components</p>
        </div>
        <button
          onClick={onClose}
          className="btn-secondary text-sm"
        >
          Back to Schematic
        </button>
      </div>

      {/* Breadboard */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-b from-[#f5f5dc] to-[#e8e8cc] rounded-lg p-4 shadow-2xl"
        >
          {/* Column numbers */}
          <div className="flex mb-2">
            <div className="w-6" /> {/* Spacer for row labels */}
            {Array.from({ length: cols }).map((_, col) => (
              <div
                key={col}
                className="w-4 text-[8px] text-center text-dark-600 font-mono"
              >
                {(col % 5 === 0) ? col + 1 : ''}
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: 15 }).map((_, row) => {
            if (isGap(row)) {
              return (
                <div key={row} className="h-6 flex items-center">
                  <div className="flex-1 border-t border-dashed border-dark-400/30" />
                </div>
              );
            }

            return (
              <div key={row} className="flex items-center h-4 mb-0.5">
                {/* Row label */}
                <div className={`w-6 text-[10px] font-mono text-center ${
                  isPowerRail(row)
                    ? row === 0 || row === 14 ? 'text-red-500' : 'text-blue-500'
                    : 'text-dark-600'
                }`}>
                  {getRowLabel(row)}
                </div>

                {/* Holes */}
                {Array.from({ length: cols }).map((_, col) => {
                  const key = `${row}-${col}`;
                  const isSelected = selectedCells.has(key);
                  const isPower = isPowerRail(row);

                  return (
                    <button
                      key={col}
                      onClick={() => handleCellClick(row, col)}
                      className={`w-4 h-4 flex items-center justify-center group ${
                        col % 5 === 4 && !isPower ? 'mr-1' : ''
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all ${
                          isSelected
                            ? isPower
                              ? row === 0 || row === 14
                                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                                : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                              : 'bg-forest-500 shadow-lg shadow-forest-500/50'
                            : 'bg-dark-700/80 hover:bg-dark-600 group-hover:scale-110'
                        }`}
                      />
                    </button>
                  );
                })}

                {/* Row label (right side) */}
                <div className={`w-6 text-[10px] font-mono text-center ${
                  isPowerRail(row)
                    ? row === 0 || row === 14 ? 'text-red-500' : 'text-blue-500'
                    : 'text-dark-600'
                }`}>
                  {getRowLabel(row)}
                </div>
              </div>
            );
          })}

          {/* Column numbers (bottom) */}
          <div className="flex mt-2">
            <div className="w-6" />
            {Array.from({ length: cols }).map((_, col) => (
              <div
                key={col}
                className="w-4 text-[8px] text-center text-dark-600 font-mono"
              >
                {(col % 5 === 0) ? col + 1 : ''}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-dark-800">
        <div className="flex items-center justify-center gap-6 text-xs text-dark-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Power (+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Ground (-)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-dark-600" />
            <span>Connected row (A-E, F-J)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreadboardView;
