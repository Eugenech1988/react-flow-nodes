import { useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { ReactFlow, Background, Controls, ConnectionLineType, MiniMap, ReactFlowProvider } from '@xyflow/react';
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
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<PipelineNode, PipelineEdge> | null>(null);
  const { theme } = useTheme();

  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const getNodeID = useStore((state) => state.getNodeID);
  const addNode = useStore((state) => state.addNode);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);

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

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const gridColor = isDark ? '#374151' : '#cbd5e1';

  return (
    <div
      ref={reactFlowWrapper}
      className="w-full h-full bg-[#f1f5f9] dark:bg-[#030712] transition-colors duration-300 [--react-flow__background-color:#cbd5e1] dark:[--react-flow__background-color:#374151]"
    >
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
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};