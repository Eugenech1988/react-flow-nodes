import { useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ConnectionLineType
} from '@xyflow/react';
import type { ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStore } from '@/entities';
import type { PipelineNode, PipelineEdge } from '@/entities';

import { HistoryControls } from './components/HistoryControls';
import { ImportExportToolbar } from './components/ImportExportToolbar';
import { AutoLayoutButton } from './components/AutoLayoutButton';
import { ClearCanvasButton } from './components/ClearCanvasButton';
import { WorkflowExecutionControl } from './components/WorkflowExecutionControl';
import { ExecutionLogConsole } from './components/ExecutionLogConsole';
import { GRID_SIZE, PRO_OPTIONS, FIT_VIEW_OPTIONS, NODE_TYPES, NODE_COLORS, NODE_TYPE_TO_CATEGORY } from './config';
import { useDragAndDrop, useKeyboardShortcuts } from './lib';

export const Canvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<PipelineNode, PipelineEdge> | null>(null);

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const exportJSON = useStore((state) => state.exportJSON);
  const importJSON = useStore((state) => state.importJSON);
  const copyNodes = useStore((state) => state.copyNodes);
  const pasteNodes = useStore((state) => state.pasteNodes);
  const getNodeID = useStore((state) => state.getNodeID);

  const undo = useStore((state) => state.undo);
  const redo = useStore((state) => state.redo);

  const { getNodes, getEdges } = useReactFlow<PipelineNode, PipelineEdge>();

  const { onDrop, onDragOver } = useDragAndDrop({
    rfInstance,
    addNode,
    getNodeID,
  });

  useKeyboardShortcuts({
    copyNodes,
    pasteNodes,
    getNodes,
    getEdges,
    undo,
    redo,
  });

  const { resolvedTheme } = useTheme();

  const gridColor = resolvedTheme === 'dark' ? '#374151' : '#cbd5e1';

  const getMiniMapNodeColor = (node: PipelineNode) => {
    const category = node.data?.category || NODE_TYPE_TO_CATEGORY[node.type || ''] || 'default';
    return NODE_COLORS[category] || '#94a3b8';
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full relative bg-[#f1f5f9] dark:bg-[#030712] transition-colors duration-300 [--react-flow__background-color:#cbd5e1] dark:[--react-flow__background-color:#374151]"
    >
      <ImportExportToolbar onExport={exportJSON} onImport={importJSON} />
      <AutoLayoutButton />
      <ClearCanvasButton />
      <WorkflowExecutionControl />
      <ExecutionLogConsole />
      <ReactFlow<PipelineNode, PipelineEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={NODE_TYPES}
        proOptions={PRO_OPTIONS}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
      >
        <Background color={gridColor} gap={GRID_SIZE} />
        <Controls />
        <MiniMap pannable zoomable nodeColor={getMiniMapNodeColor} />
        <HistoryControls />
      </ReactFlow>
    </div>
  );
};