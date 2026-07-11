import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { ReactFlow, Background, Controls, ConnectionLineType, MiniMap, ReactFlowProvider } from '@xyflow/react';
import { HistoryControls } from '@/widgets/historyControls/';
import type { ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useStore } from '@/entities/pipeline';
import type { NodeData, PipelineNode, PipelineEdge } from '@/entities/pipeline';
import { useTheme } from '@/app/providers';

import {
  APINode,
  ConditionalNode,
  DatabaseNode,
  ImageNode,
  InputNode,
  LLMNode,
  MathNode,
  OutputNode,
  TextNode
} from '@/features/manage-nodes';

const GRID_SIZE = 20;
const PRO_OPTIONS = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  math: MathNode,
  conditional: ConditionalNode,
  api: APINode,
  database: DatabaseNode,
  image: ImageNode
};

interface DragPayload {
  nodeType?: string;
}

export const Canvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<PipelineNode, PipelineEdge> | null>(null);

  const { theme } = useTheme();

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const takeSnapshot = useStore((state) => state.takeSnapshot);
  const exportJSON = useStore((state) => state.exportJSON);
  const importJSON = useStore((state) => state.importJSON);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? event.metaKey : event.ctrlKey;

      if (modifier && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          useStore.getState().redo();
        } else {
          useStore.getState().undo();
        }
      } else if (modifier && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        useStore.getState().redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getInitNodeData = (nodeID: string, type: string): NodeData => ({
    id: nodeID,
    nodeType: type
  });

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const rawData = event.dataTransfer.getData('application/reactflow');
    if (!rawData || !reactFlowInstance) {
      return;
    }

    const appData = JSON.parse(rawData) as DragPayload;
    const type = appData.nodeType;
    if (!type) {
      return;
    }

    const position = reactFlowInstance.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    });

    const nodeID = getNodeID(type);
    const newNode: PipelineNode = {
      id: nodeID,
      type,
      position,
      data: getInitNodeData(nodeID, type)
    };

    addNode(newNode);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importJSON(file);
    }
    event.target.value = '';
  };

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const gridColor = isDark ? '#374151' : '#cbd5e1';

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full relative bg-[#f1f5f9] dark:bg-[#030712] transition-colors duration-300 [--react-flow__background-color:#cbd5e1] dark:[--react-flow__background-color:#374151]"
    >
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button
          onClick={exportJSON}
          className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Export
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Import
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".json"
          className="hidden"
        />
      </div>

      <ReactFlowProvider>
        <ReactFlow<PipelineNode, PipelineEdge>
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setReactFlowInstance}
          nodeTypes={nodeTypes}
          onNodeDragStart={takeSnapshot}
          proOptions={PRO_OPTIONS}
          snapGrid={[GRID_SIZE, GRID_SIZE]}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{
            padding: 0.2,
            maxZoom: 1.2
          }}
        >
          <Background color={gridColor} gap={GRID_SIZE} />
          <Controls />
          <MiniMap pannable zoomable />
          <HistoryControls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};