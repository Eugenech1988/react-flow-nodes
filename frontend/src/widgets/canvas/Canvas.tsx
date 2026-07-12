import { useRef, useState } from 'react';
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
import { GRID_SIZE, PRO_OPTIONS, FIT_VIEW_OPTIONS, NODE_TYPES } from './config';
import { useDragAndDrop, useKeyboardShortcuts, useThemeSync } from './lib';
import { ImportExportToolbar } from '@/widgets/canvas/components/ImportExportToolbar.tsx';
import { AutoLayoutButton } from '@/widgets/canvas/components/AutoLayoutButton.tsx';
import { ClearCanvasButton } from '@/widgets/canvas/components/ClearCanvasButton.tsx';
import { WorkflowExecutionControl } from '@/widgets/canvas/components/WorkflowExecutionControl.tsx';
import { ExecutionLogConsole } from '@/widgets/canvas/components/ExecutionLogConsole.tsx';

export const Canvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<PipelineNode, PipelineEdge> | null>(null);

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const takeSnapshot = useStore((state) => state.takeSnapshot);
  const exportJSON = useStore((state) => state.exportJSON);
  const importJSON = useStore((state) => state.importJSON);
  const copyNodes = useStore((state) => state.copyNodes);
  const pasteNodes = useStore((state) => state.pasteNodes);
  const getNodeID = useStore((state) => state.getNodeID);

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
  });

  const gridColor = useThemeSync();

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full relative bg-[#f1f5f9] dark:bg-[#030712] transition-colors duration-300 [--react-flow__background-color:#cbd5e1] dark:[--react-flow__background-color:#374151]"
    >
      <ImportExportToolbar onExport={exportJSON} onImport={importJSON}/>
      <AutoLayoutButton/>
      <ClearCanvasButton/>
      <WorkflowExecutionControl/>
      <ExecutionLogConsole/>
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
        onNodeDragStart={takeSnapshot}
        proOptions={PRO_OPTIONS}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={FIT_VIEW_OPTIONS}
      >
        <Background color={gridColor} gap={GRID_SIZE}/>
        <Controls/>
        <MiniMap pannable zoomable/>
        <HistoryControls/>
      </ReactFlow>
    </div>
  );
};