import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { useShallow } from 'zustand/react/shallow';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ConnectionLineType,
} from '@xyflow/react';
import type { ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useUser } from '@/shared/hooks';
import { useStore } from '@/entities';
import type { TPipelineNode, TPipelineEdge } from '@/entities';

import {
  HistoryControls,
  ImportExportToolbar,
  AutoLayoutButton,
  ClearCanvasButton,
  ExecutionLogConsole,
} from './components';
import {
  GRID_SIZE,
  PRO_OPTIONS,
  FIT_VIEW_OPTIONS,
  NODE_TYPES,
  NODE_COLORS,
  NODE_TYPE_TO_CATEGORY,
} from './config';
import { useDragAndDrop, useKeyboardShortcuts, useSavePipeline } from './hooks';
import { NodesToolbar } from '@/widgets/nodes-toolbar';

export const Canvas = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance<
    TPipelineNode,
    TPipelineEdge
  > | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    nodes,
    edges,
    initGraph,
    resetGraph,
    runWorkflow,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    exportJSON,
    importJSON,
    copyNodes,
    pasteNodes,
    getNodeID,
    undo,
    redo,
  } = useStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      initGraph: state.initGraph,
      resetGraph: state.resetGraph,
      runWorkflow: state.runWorkflow,
      addNode: state.addNode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      exportJSON: state.exportJSON,
      importJSON: state.importJSON,
      copyNodes: state.copyNodes,
      pasteNodes: state.pasteNodes,
      getNodeID: state.getNodeID,
      undo: state.undo,
      redo: state.redo,
    }))
  );

  const { user } = useUser();
  const currentPipeline = user?.currentPipeline;

  useEffect(() => {
    if (currentPipeline) {
      const pipelineRecord = currentPipeline as unknown as Record<string, unknown>;
      const graph = pipelineRecord.graphData as
        | {
        nodes?: TPipelineNode[];
        edges?: TPipelineEdge[];
      }
        | null
        | undefined;

      const pipelineId = String(pipelineRecord.id || '');
      initGraph(graph?.nodes || [], graph?.edges || [], pipelineId);    }

    return () => {
      resetGraph();
    };
  }, [currentPipeline?.id, initGraph, resetGraph]);

  useEffect(() => {
    const navState = location.state as { autoRun?: boolean } | null;

    if (navState?.autoRun && nodes.length > 0) {
      runWorkflow();

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, nodes.length, runWorkflow, navigate, location.pathname]);

  const { getNodes, getEdges } = useReactFlow<TPipelineNode, TPipelineEdge>();

  useSavePipeline({ wrapperRef });

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

  const getMiniMapNodeColor = (node: TPipelineNode) => {
    const category = node.data?.category || NODE_TYPE_TO_CATEGORY[node.type || ''] || 'default';
    return NODE_COLORS[category] || '#94a3b8';
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-full w-full bg-[#f1f5f9] transition-colors duration-300 [--react-flow__background-color:#cbd5e1] dark:bg-[#030712] dark:[--react-flow__background-color:#374151]"
    >
      <ImportExportToolbar onExport={exportJSON} onImport={importJSON} />
      <NodesToolbar />
      <HistoryControls />
      <AutoLayoutButton />
      <ClearCanvasButton />
      <ExecutionLogConsole />
      <ReactFlow
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
      </ReactFlow>
    </div>
  );
};