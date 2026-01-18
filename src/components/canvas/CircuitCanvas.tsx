import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  BackgroundVariant,
  ConnectionLineType,
} from 'reactflow';
import type { Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3, 
  RotateCcw,
  Trash2,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import CircuitNode from './CircuitNode';
import { useCircuitStore, useCollaborationStore } from '../../stores';
import { simulateCircuit } from '../../services/circuitSimulator';
import type { CircuitComponent, CanvasNode } from '../../types';

const nodeTypes = {
  circuit: CircuitNode,
};

const CircuitCanvasInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { project, zoomIn, zoomOut, fitView, getViewport } = useReactFlow();

  const { 
    nodes: storeNodes, 
    edges: storeEdges, 
    addNode, 
    addEdge: addStoreEdge,
    removeNode,
    selectedNode,
    setSelectedNode,
    viewMode,
    setViewMode,
    clearCanvas,
    isSimulating,
    setIsSimulating,
    simulationResult,
    setSimulationResult,
    updateEdges,
    updateNodes,
    shouldFitView,
    resetFitView
  } = useCircuitStore();

  const { collaborators, sessionId } = useCollaborationStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync Zustand store nodes with React Flow nodes
  useEffect(() => {
    setNodes(storeNodes);
  }, [storeNodes, setNodes]);

  // Sync Zustand store edges with React Flow edges
  useEffect(() => {
    setEdges(storeEdges);
  }, [storeEdges, setEdges]);

  // Trigger fitView when requested by the store
  useEffect(() => {
    if (shouldFitView) {
      // Small delay to ensure nodes are rendered before fitting view
      setTimeout(() => {
        fitView({ 
          padding: 0.4,
          duration: 400,
          maxZoom: 1.0,
          minZoom: 0.2,
        });
        resetFitView();
      }, 100);
    }
  }, [shouldFitView, fitView, resetFitView]);

  // Handle simulation play/pause
  const handleSimulation = useCallback(() => {
    if (isSimulating) {
      // Stop simulation: reset edges and nodes visuals
      setIsSimulating(false);
      const resetEdgesStore = storeEdges.map((e) => ({
        ...e,
        animated: false,
        style: { ...(e.style || {}), stroke: '#94a3b8', strokeWidth: 2 },
      }));
      setEdges(resetEdgesStore);
      updateEdges(resetEdgesStore);
      const resetNodesStore = storeNodes.map((n) => ({
        ...n,
        data: { ...n.data, isActive: false },
      }));
      setNodes(resetNodesStore);
      updateNodes(resetNodesStore);
      setSimulationResult(null);
    } else {
      // Start simulation
      const result = simulateCircuit(storeNodes, storeEdges);
      setSimulationResult(result);
      setIsSimulating(true);
      if (result.isValid) {
        // Animate and color edges with current flow
        const flowIds = new Set(result.currentFlow.map((f) => f.edgeId));
        const styledEdges = storeEdges.map((e) => ({
          ...e,
          animated: flowIds.has(e.id),
          style: { ...(e.style || {}), stroke: flowIds.has(e.id) ? '#f59e0b' : '#94a3b8', strokeWidth: flowIds.has(e.id) ? 3 : 2 },
        }));
        setEdges(styledEdges);
        updateEdges(styledEdges);
        // Mark nodes touched by flow as active
        const activeNodeIds = new Set<string>();
        result.currentFlow.forEach((p) => { activeNodeIds.add(p.fromNodeId); activeNodeIds.add(p.toNodeId); });
        const energizedNodes = storeNodes.map((n) => ({
          ...n,
          data: { ...n.data, isActive: activeNodeIds.has(n.id) },
        }));
        setNodes(energizedNodes);
        updateNodes(energizedNodes);
      }
    }
  }, [isSimulating, storeNodes, storeEdges, setIsSimulating, setSimulationResult, setEdges, setNodes, updateEdges, updateNodes]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        id: `e${params.source}-${params.target}`,
        source: params.source || '',
        target: params.target || '',
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#94a3b8', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge);
    },
    [setEdges, addStoreEdge]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

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
          label: `${component.name}1`,
        },
      };

      setNodes((nds) => [...nds, newNode]);
      addNode(newNode);
    },
    [project, setNodes, addNode]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: { id: string }) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode && e.target !== selectedNode));
      removeNode(selectedNode);
    }
  }, [selectedNode, setNodes, setEdges, removeNode]);

  const handleClearCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    clearCanvas();
  }, [setNodes, setEdges, clearCanvas]);

  const currentZoom = useMemo(() => {
    const viewport = getViewport();
    return Math.round(viewport.zoom * 100);
  }, [getViewport]);

  return (
    <div ref={reactFlowWrapper} className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
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
        className="circuit-canvas"
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20} 
          size={1} 
          color="rgba(148, 163, 184, 0)" 
          className="transition-all duration-300 [.circuit-canvas:hover_&]:!bg-[rgba(148,163,184,0.12)]"
          style={{
            backgroundColor: 'transparent',
          }}
        />
        
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
              case 'active': return '#3b82f6';
              case 'output': return '#f59e0b';
              case 'measurement': return '#06b6d4';
              case 'connection': return '#94a3b8';
              default: return '#374151';
            }
          }}
          maskColor="rgba(26, 26, 31, 0.6)"
          style={{ opacity: 0.7 }}
          className="!bg-dark-900/50 !border-dark-700 !backdrop-blur-sm"
        />

        {/* Custom Controls Panel */}
        <Panel position="bottom-center" className="!mb-4">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-1 px-2 py-1.5 bg-dark-900/90 backdrop-blur-xl border border-dark-700 rounded-xl shadow-xl"
          >
            <button
              onClick={() => zoomOut()}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-dark-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut size={18} />
            </button>
            
            <span className="px-3 py-1 text-sm font-medium text-dark-300 min-w-[50px] text-center">
              {currentZoom}%
            </span>
            
            <button
              onClick={() => zoomIn()}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-dark-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn size={18} />
            </button>

            <div className="w-px h-6 bg-dark-700 mx-1" />

            <button
              onClick={() => fitView({ padding: 0.2 })}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-dark-300 hover:text-white"
              title="Fit View"
            >
              <Maximize2 size={18} />
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'schematic' ? 'breadboard' : 'schematic')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'breadboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-dark-700 text-dark-300 hover:text-white'
              }`}
              title="Toggle Breadboard View"
            >
              <Grid3X3 size={18} />
            </button>

            <div className="w-px h-6 bg-dark-700 mx-1" />

            <button
              onClick={handleDeleteSelected}
              disabled={!selectedNode}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-dark-300 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Delete Selected"
            >
              <Trash2 size={18} />
            </button>

            <button
              onClick={handleClearCanvas}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-dark-300 hover:text-red-400"
              title="Clear Canvas"
            >
              <RotateCcw size={18} />
            </button>

            <div className="w-px h-6 bg-dark-700 mx-1" />

            {/* Simulation Play/Pause Button */}
            <button
              onClick={handleSimulation}
              disabled={nodes.length === 0}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isSimulating 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-amber-600 text-white hover:bg-amber-700'
              }`}
              title={isSimulating ? 'Stop Simulation' : 'Start Simulation'}
            >
              {isSimulating ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </motion.div>
        </Panel>

        {/* Simulation Status Panel */}
        <AnimatePresence>
          {simulationResult && (
            <Panel position="top-right" className="!mt-4 !mr-4">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className={`p-4 rounded-xl backdrop-blur-xl border shadow-xl max-w-sm ${
                  simulationResult.isValid 
                    ? 'bg-amber-900/90 border-amber-600/50' 
                    : 'bg-red-900/90 border-red-600/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {simulationResult.isValid ? (
                    <CheckCircle size={20} className="text-amber-400" />
                  ) : (
                    <AlertTriangle size={20} className="text-red-400" />
                  )}
                  <span className={`font-semibold ${simulationResult.isValid ? 'text-amber-300' : 'text-red-300'}`}>
                    {simulationResult.isValid ? 'Circuit Valid' : 'Circuit Error'}
                  </span>
                </div>

                {simulationResult.isValid && simulationResult.totalCurrent !== undefined && (
                  <div className="text-sm text-amber-200 space-y-1">
                    <div>Voltage: {simulationResult.voltage}V</div>
                    <div>Current: {(simulationResult.totalCurrent * 1000).toFixed(1)} mA</div>
                    <div>Resistance: {simulationResult.totalResistance} Ω</div>
                  </div>
                )}

                {simulationResult.errors && simulationResult.errors.length > 0 && (
                  <div className="space-y-1">
                    {simulationResult.errors.map((error, idx) => (
                      <div key={idx} className="text-sm text-red-200">
                        {error.message}
                      </div>
                    ))}
                  </div>
                )}

                {simulationResult.warnings && simulationResult.warnings.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {simulationResult.warnings.map((warning, idx) => (
                      <div key={idx} className="text-sm text-yellow-300">
                        Warning: {warning}
                      </div>
                    ))}
                  </div>
                )}

                {isSimulating && simulationResult.isValid && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-300">
                    <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    Simulating current flow...
                  </div>
                )}
              </motion.div>
            </Panel>
          )}
        </AnimatePresence>

        {/* View Mode Indicator */}
        <Panel position="top-center" className="!mt-4">
          <AnimatePresence>
            {viewMode === 'breadboard' && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="px-4 py-2 bg-blue-600/20 border border-blue-600/50 rounded-lg backdrop-blur-sm"
              >
                <p className="text-sm text-blue-300 font-medium">
                  Breadboard View Mode
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Panel>

        {/* Collaborator Cursors */}
        {sessionId && collaborators.map((collaborator) => (
          <motion.div
            key={collaborator.id}
            className="absolute pointer-events-none z-50"
            animate={{
              x: collaborator.cursor.x,
              y: collaborator.cursor.y,
            }}
            transition={{ type: 'spring', damping: 30, stiffness: 500 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M5.5 3L19.5 12L12.5 13L9.5 21L5.5 3Z"
                fill={collaborator.color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
            <div
              className="mt-1 px-2 py-0.5 rounded text-xs text-white font-medium whitespace-nowrap"
              style={{ backgroundColor: collaborator.color }}
            >
              {collaborator.name}
            </div>
          </motion.div>
        ))}
      </ReactFlow>

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-forest-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-dark-300 mb-2">
              Start Building Your Circuit!
            </h3>
            <p className="text-dark-500 max-w-sm">
              Drag components from the left panel and drop them here.
              Connect them by dragging from one handle to another!
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const CircuitCanvas: React.FC = () => {
  return (
    <ReactFlowProvider>
      <CircuitCanvasInner />
    </ReactFlowProvider>
  );
};

export default CircuitCanvas;
