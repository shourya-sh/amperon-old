import React, { useCallback, useRef, useMemo } from 'react';
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
} from 'reactflow';
import type { Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Grid3X3, 
  RotateCcw,
  Trash2,
  Copy,
  Download,
  Upload
} from 'lucide-react';
import CircuitNode from './CircuitNode';
import { useCircuitStore, useCollaborationStore } from '../../stores';
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
    clearCanvas
  } = useCircuitStore();

  const { collaborators, sessionId } = useCollaborationStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#22c55e', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addStoreEdge(newEdge as Edge);
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

  const onNodeClick = useCallback((_: React.MouseEvent, node: CanvasNode) => {
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
          style: { stroke: '#22c55e', strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
        className="circuit-canvas"
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20} 
          size={1} 
          color="rgba(34, 197, 94, 0.15)" 
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
              case 'connection': return '#22c55e';
              default: return '#374151';
            }
          }}
          maskColor="rgba(26, 26, 31, 0.8)"
          className="!bg-dark-900/80 !border-dark-700"
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
                  ? 'bg-forest-600 text-white' 
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
          </motion.div>
        </Panel>

        {/* View Mode Indicator */}
        <Panel position="top-center" className="!mt-4">
          <AnimatePresence>
            {viewMode === 'breadboard' && (
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="px-4 py-2 bg-forest-600/20 border border-forest-600/50 rounded-lg backdrop-blur-sm"
              >
                <p className="text-sm text-forest-300 font-medium">
                  🔧 Breadboard View Mode
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
            <div className="text-6xl mb-4">⚡</div>
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
