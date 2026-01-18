import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  BackgroundVariant,
} from 'reactflow';
import type { Connection, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import CircuitNode from '../canvas/CircuitNode';
import { simulateCircuit } from '../../services/circuitSimulator';
import type { CanvasNode, CanvasEdge } from '../../types';

const nodeTypes = {
  circuit: CircuitNode,
};

interface InteractiveTutorialCanvasInnerProps {
  initialNodes?: CanvasNode[];
  initialEdges?: CanvasEdge[];
  onNodesChange?: (nodes: CanvasNode[]) => void;
  onEdgesChange?: (edges: CanvasEdge[]) => void;
  isReadOnly?: boolean;
  showSimulation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const InteractiveTutorialCanvasInner: React.FC<InteractiveTutorialCanvasInnerProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  isReadOnly = false,
  showSimulation = false,
  onValidationChange,
}) => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onRFNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onRFEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [validationMessage, setValidationMessage] = useState<{
    type: 'success' | 'warning' | 'error';
    message: string;
  } | null>(null);

  // Update store when nodes change
  useEffect(() => {
    if (onNodesChange) {
      const updatedNodes = nodes as any as CanvasNode[];
      onNodesChange(updatedNodes);
    }
  }, [nodes, onNodesChange]);

  // Update store when edges change
  useEffect(() => {
    if (onEdgesChange) {
      const updatedEdges = edges.map(e => ({
        ...e,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
      })) as any as CanvasEdge[];
      onEdgesChange(updatedEdges);
    }
  }, [edges, onEdgesChange]);

  // Validate circuit
  const validateCircuit = useCallback(() => {
    if (nodes.length === 0) {
      setValidationMessage({
        type: 'warning',
        message: '📦 Add some components to get started!',
      });
      onValidationChange?.(false);
      return false;
    }

    // Check if there's a power source
    const hasPowerSource = nodes.some((n: any) => n.data.component.category === 'source');
    if (!hasPowerSource) {
      setValidationMessage({
        type: 'error',
        message: '⚡ Every circuit needs a power source (battery)!',
      });
      onValidationChange?.(false);
      return false;
    }

    // Check if there's at least one load/output
    const hasLoad = nodes.some(
      (n: any) => n.data.component.category === 'output' || n.data.component.type === 'led'
    );
    if (!hasLoad) {
      setValidationMessage({
        type: 'warning',
        message: '💡 Add an LED or output component to see what happens!',
      });
      onValidationChange?.(false);
      return false;
    }

    // Check if components are connected
    const totalConnections = edges.length;
    if (totalConnections === 0) {
      setValidationMessage({
        type: 'error',
        message: '🔗 Connect your components with wires!',
      });
      onValidationChange?.(false);
      return false;
    }

    setValidationMessage({
      type: 'success',
      message: '✅ Circuit looks good! Ready to simulate.',
    });
    onValidationChange?.(true);
    return true;
  }, [nodes, edges, onValidationChange]);

  const handleSimulation = useCallback(() => {
    if (!validateCircuit()) {
      return;
    }

    if (isSimulating) {
      // Stop simulation
      setIsSimulating(false);
      const resetEdges = edges.map((e: any) => ({
        ...e,
        animated: false,
        style: { ...(e.style || {}), stroke: '#94a3b8', strokeWidth: 2 },
      }));
      setEdges(resetEdges);
      const resetNodes = nodes.map((n: any) => ({
        ...n,
        data: { ...n.data, isActive: false },
      }));
      setNodes(resetNodes);
      setSimulationResult(null);
    } else {
      // Start simulation
      const result = simulateCircuit(nodes as any, edges as any);
      setSimulationResult(result);
      setIsSimulating(true);

      // Update nodes and edges with simulation results
      const activePaths = (result as any).activePaths || [];
      const activeNodes = new Set(
        activePaths.flatMap((p: any) => p.path || []) || []
      );

      const updatedNodes = nodes.map((n: any) => ({
        ...n,
        data: { ...n.data, isActive: activeNodes.has(n.id) },
      }));

      const updatedEdges = edges.map((e: any) => {
        const isActive = activeNodes.has(e.source) && activeNodes.has(e.target);
        return {
          ...e,
          animated: isActive,
          style: {
            ...(e.style || {}),
            stroke: isActive ? '#22c55e' : '#94a3b8',
            strokeWidth: isActive ? 3 : 2,
          },
        };
      });

      setNodes(updatedNodes);
      setEdges(updatedEdges);
    }
  }, [nodes, edges, isSimulating, validateCircuit]);

  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setIsSimulating(false);
    setSimulationResult(null);
    setValidationMessage(null);
  }, [setNodes, setEdges]);

  const handleFitView = useCallback(() => {
    fitView();
  }, [fitView]);

  const onConnect = useCallback(
    (connection: Connection) => {
      if (!isReadOnly) {
        const newEdge = addEdge(
          {
            ...connection,
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 2 },
          },
          edges
        );
        setEdges(newEdge);
      }
    },
    [edges, setEdges, isReadOnly]
  );

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      if (!isReadOnly) {
        onRFNodesChange(changes);
      }
    },
    [isReadOnly, onRFNodesChange]
  );

  const onEdgesChangeHandler = useCallback(
    (changes: EdgeChange[]) => {
      if (!isReadOnly) {
        onRFEdgesChange(changes);
      }
    },
    [isReadOnly, onRFEdgesChange]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChangeHandler}
      onEdgesChange={onEdgesChangeHandler}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background color="#2a2a2f" variant={BackgroundVariant.Dots} />
      <Controls />

      <Panel position="top-left" className="flex flex-col gap-2">
        {!isReadOnly && (
          <>
            <button
              onClick={handleFitView}
              className="p-2 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 text-dark-300 transition-colors"
              title="Fit to view"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => {
                // Zoom in functionality (placeholder)
              }}
              className="p-2 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 text-dark-300 transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => {
                // Similar zoom out
              }}
              className="p-2 bg-dark-800 border border-dark-700 rounded-lg hover:bg-dark-700 text-dark-300 transition-colors"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
          </>
        )}
      </Panel>

      {showSimulation && (
        <Panel position="top-right" className="flex flex-col gap-2">
          <button
            onClick={handleSimulation}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              isSimulating
                ? 'bg-red-600/20 border border-red-600/50 text-red-400 hover:bg-red-600/30'
                : 'bg-forest-600 border border-forest-700 text-white hover:bg-forest-700'
            }`}
          >
            {isSimulating ? (
              <>
                <AlertCircle size={16} />
                Stop
              </>
            ) : (
              <>
                <Play size={16} />
                Simulate
              </>
            )}
          </button>
          {!isReadOnly && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-dark-300 hover:bg-dark-700 transition-colors text-sm font-medium"
            >
              Clear
            </button>
          )}
        </Panel>
      )}

      {validationMessage && (
        <Panel position="bottom-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-3 rounded-lg border flex items-center gap-2 ${
              validationMessage.type === 'success'
                ? 'bg-green-600/20 border-green-600/50 text-green-400'
                : validationMessage.type === 'warning'
                ? 'bg-amber-600/20 border-amber-600/50 text-amber-400'
                : 'bg-red-600/20 border-red-600/50 text-red-400'
            }`}
          >
            {validationMessage.type === 'success' && (
              <CheckCircle size={16} />
            )}
            {validationMessage.type === 'error' && (
              <AlertTriangle size={16} />
            )}
            {validationMessage.type === 'warning' && (
              <Lightbulb size={16} />
            )}
            <span className="text-sm">{validationMessage.message}</span>
          </motion.div>
        </Panel>
      )}

      {simulationResult && (
        <Panel position="bottom-right" className="max-w-sm">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark-900 border border-dark-800 rounded-lg p-4"
          >
            <h3 className="font-semibold text-dark-100 mb-2">📊 Simulation Results</h3>
            <div className="text-xs text-dark-400 space-y-1">
              {simulationResult.isValid ? (
                <>
                  <p className="text-green-400">✅ Circuit is working!</p>
                  {simulationResult.activePaths?.length > 0 && (
                    <p>
                      🔌 Active paths: {simulationResult.activePaths.length}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-red-400">
                  ❌ {simulationResult.error || 'Circuit validation failed'}
                </p>
              )}
            </div>
          </motion.div>
        </Panel>
      )}
    </ReactFlow>
  );
};

interface InteractiveTutorialCanvasProps {
  initialNodes?: CanvasNode[];
  initialEdges?: CanvasEdge[];
  onNodesChange?: (nodes: CanvasNode[]) => void;
  onEdgesChange?: (edges: CanvasEdge[]) => void;
  isReadOnly?: boolean;
  showSimulation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  height?: string;
}

const InteractiveTutorialCanvas: React.FC<InteractiveTutorialCanvasProps> = ({
  height = 'h-96',
  ...props
}) => {
  return (
    <div className={`${height} bg-dark-950 border border-dark-800 rounded-lg overflow-hidden`}>
      <ReactFlowProvider>
        <InteractiveTutorialCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  );
};

export default InteractiveTutorialCanvas;
