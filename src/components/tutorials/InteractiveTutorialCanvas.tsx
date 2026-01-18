import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  MiniMap,
  ConnectionLineType,
} from 'reactflow';
import type { Connection, NodeChange, EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  AlertCircle,
  Trash2,
  Maximize2,
} from 'lucide-react';
import CircuitNode from '../canvas/CircuitNode';
import { simulateCircuit } from '../../services/circuitSimulator';
import CompactComponentLibrary from './CompactComponentLibrary';
import type { CanvasNode, CanvasEdge, CircuitComponent } from '../../types';

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
  showComponentLibrary?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

const InteractiveTutorialCanvasInner: React.FC<InteractiveTutorialCanvasInnerProps> = ({
  initialNodes = [],
  initialEdges = [],
  onNodesChange,
  onEdgesChange,
  isReadOnly = false,
  showSimulation = false,
  showComponentLibrary = true,
  onValidationChange,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { fitView, project, zoomIn, zoomOut } = useReactFlow();
  const [nodes, setNodes, onRFNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onRFEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
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
    setSelectedNode(null);
  }, [setNodes, setEdges]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode && e.target !== selectedNode));
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2 });
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

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    setSelectedNode(node.id);
  }, []);

  // Drag and drop handlers for components
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (isReadOnly) return;

      const componentData = event.dataTransfer.getData('application/circuitcomponent');
      if (!componentData) return;

      const component: CircuitComponent = JSON.parse(componentData);

      if (!reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      const newNode: CanvasNode = {
        id: `${component.type}-${Date.now()}`,
        type: 'circuit',
        position,
        data: {
          component,
          rotation: 0,
          label: `${component.name}`,
        },
      };

      setNodes((nds) => [...nds, newNode as any]);
    },
    [project, setNodes, isReadOnly]
  );

  const onDragStart = useCallback((event: React.DragEvent, component: CircuitComponent) => {
    event.dataTransfer.setData('application/circuitcomponent', JSON.stringify(component));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <div className="flex h-full w-full" ref={reactFlowWrapper}>
      {/* Compact Component Library */}
      {showComponentLibrary && !isReadOnly && (
        <CompactComponentLibrary 
          onDragStart={onDragStart}
          excludeGround={true}
        />
      )}

      {/* Canvas */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChangeHandler}
          onEdgesChange={onEdgesChangeHandler}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          defaultEdgeOptions={{
            type: 'smoothstep',
            style: { stroke: '#94a3b8', strokeWidth: 2 },
            animated: false,
          }}
          connectionLineStyle={{ stroke: '#cbd5e1', strokeWidth: 1.5 }}
          connectionLineType={ConnectionLineType.SmoothStep}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#2a2a2f" variant={BackgroundVariant.Dots} gap={20} size={1} />
          <Controls 
            showZoom={false}
            showFitView={false}
            showInteractive={false}
            className="!hidden"
          />
          <MiniMap 
            nodeColor={(node) => {
              const component = node.data?.component;
              if (!component) return '#374151';
              switch (component.category) {
                case 'source': return '#ef4444';
                case 'passive': return '#a855f7';
                case 'output': return '#f59e0b';
                default: return '#374151';
              }
            }}
            maskColor="rgba(26, 26, 31, 0.6)"
            style={{ opacity: 0.6, width: 100, height: 60 }}
            className="!bg-dark-900/50 !border-dark-700"
          />

          {/* Controls Panel */}
          <Panel position="bottom-center" className="!mb-2">
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center gap-1 px-2 py-1 bg-dark-900/90 backdrop-blur border border-dark-700 rounded-lg shadow-lg"
            >
              <button
                onClick={() => zoomOut()}
                className="p-1.5 hover:bg-dark-700 rounded transition-colors text-dark-300 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <button
                onClick={() => zoomIn()}
                className="p-1.5 hover:bg-dark-700 rounded transition-colors text-dark-300 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                onClick={handleFitView}
                className="p-1.5 hover:bg-dark-700 rounded transition-colors text-dark-300 hover:text-white"
                title="Fit View"
              >
                <Maximize2 size={14} />
              </button>

              {!isReadOnly && (
                <>
                  <div className="w-px h-4 bg-dark-600 mx-1" />
                  <button
                    onClick={handleDeleteSelected}
                    disabled={!selectedNode}
                    className="p-1.5 hover:bg-dark-700 rounded transition-colors text-dark-300 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Selected"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-1.5 hover:bg-dark-700 rounded transition-colors text-dark-300 hover:text-red-400"
                    title="Clear All"
                  >
                    <RotateCcw size={14} />
                  </button>
                </>
              )}

              {showSimulation && (
                <>
                  <div className="w-px h-4 bg-dark-600 mx-1" />
                  <button
                    onClick={handleSimulation}
                    disabled={nodes.length === 0}
                    className={`p-1.5 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isSimulating 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-forest-600 text-white hover:bg-forest-700'
                    }`}
                    title={isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                  >
                    {isSimulating ? <Pause size={14} /> : <Play size={14} />}
                  </button>
                </>
              )}
            </motion.div>
          </Panel>

          {/* Validation Message */}
          <AnimatePresence>
            {validationMessage && (
              <Panel position="top-center" className="!mt-2">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`px-3 py-2 rounded-lg border flex items-center gap-2 text-sm ${
                    validationMessage.type === 'success'
                      ? 'bg-green-600/20 border-green-600/50 text-green-400'
                      : validationMessage.type === 'warning'
                      ? 'bg-amber-600/20 border-amber-600/50 text-amber-400'
                      : 'bg-red-600/20 border-red-600/50 text-red-400'
                  }`}
                >
                  {validationMessage.type === 'success' && <CheckCircle size={14} />}
                  {validationMessage.type === 'error' && <AlertTriangle size={14} />}
                  {validationMessage.type === 'warning' && <Lightbulb size={14} />}
                  <span className="text-xs">{validationMessage.message}</span>
                </motion.div>
              </Panel>
            )}
          </AnimatePresence>

          {/* Simulation Results */}
          <AnimatePresence>
            {simulationResult && (
              <Panel position="top-right" className="!mt-2 !mr-2">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className={`p-3 rounded-lg border max-w-xs ${
                    simulationResult.isValid 
                      ? 'bg-forest-900/90 border-forest-600/50' 
                      : 'bg-red-900/90 border-red-600/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {simulationResult.isValid ? (
                      <CheckCircle size={16} className="text-forest-400" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-400" />
                    )}
                    <span className={`text-sm font-medium ${simulationResult.isValid ? 'text-forest-300' : 'text-red-300'}`}>
                      {simulationResult.isValid ? 'Circuit Valid' : 'Circuit Error'}
                    </span>
                  </div>

                  {simulationResult.isValid && simulationResult.totalCurrent !== undefined && (
                    <div className="text-xs text-forest-200 space-y-0.5">
                      <div>Voltage: {simulationResult.voltage}V</div>
                      <div>Current: {(simulationResult.totalCurrent * 1000).toFixed(1)} mA</div>
                      <div>Resistance: {simulationResult.totalResistance} Ω</div>
                    </div>
                  )}

                  {simulationResult.errors?.length > 0 && (
                    <div className="space-y-0.5">
                      {simulationResult.errors.map((error: any, idx: number) => (
                        <div key={idx} className="text-xs text-red-200">
                          {error.message}
                        </div>
                      ))}
                    </div>
                  )}

                  {isSimulating && simulationResult.isValid && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-forest-300">
                      <div className="w-1.5 h-1.5 bg-forest-400 rounded-full animate-pulse" />
                      Simulating...
                    </div>
                  )}
                </motion.div>
              </Panel>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {nodes.length === 0 && !isReadOnly && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-duo-green/10 border-2 border-duo-green/20 flex items-center justify-center">
                  <AlertCircle className="w-7 h-7 text-duo-green" />
                </div>
                <h3 className="font-display font-bold text-dark-200 mb-1">
                  Build Your Circuit
                </h3>
                <p className="text-sm text-dark-500 max-w-[220px]">
                  Drag components from the left panel and connect them!
                </p>
              </motion.div>
            </div>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

interface InteractiveTutorialCanvasProps {
  initialNodes?: CanvasNode[];
  initialEdges?: CanvasEdge[];
  onNodesChange?: (nodes: CanvasNode[]) => void;
  onEdgesChange?: (edges: CanvasEdge[]) => void;
  isReadOnly?: boolean;
  showSimulation?: boolean;
  showComponentLibrary?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  height?: string;
}

const InteractiveTutorialCanvas: React.FC<InteractiveTutorialCanvasProps> = ({
  height = 'h-[400px]',
  showComponentLibrary = true,
  ...props
}) => {
  return (
    <div className={`${height} bg-dark-950 border-2 border-dark-800 rounded-2xl overflow-hidden`}>
      <ReactFlowProvider>
        <InteractiveTutorialCanvasInner 
          {...props} 
          showComponentLibrary={showComponentLibrary && !props.isReadOnly}
        />
      </ReactFlowProvider>
    </div>
  );
};

export default InteractiveTutorialCanvas;
