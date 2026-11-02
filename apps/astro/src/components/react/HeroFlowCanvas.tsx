import React, { useState } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  type Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const InputNode = () => (
  <div className="relative rounded-lg border border-[#39b39b]/30 bg-slate-900 p-4 text-left font-mono text-xs shadow-lg">
    <div className="mb-1 font-bold text-[#39b39b]">➔ InputNode</div>
    <div className="text-slate-500">trigger: "on_click"</div>
    <Handle
      type="source"
      position={Position.Right}
      style={{ background: '#39b39b', width: 8, height: 8 }}
    />
  </div>
);

const ActionNode = () => (
  <div className="relative rounded-lg border border-slate-100/20 bg-slate-900 p-4 text-left font-mono text-xs shadow-lg">
    <Handle
      type="target"
      position={Position.Left}
      style={{ background: '#39b39b', width: 8, height: 8 }}
    />
    <div className="mb-1 font-bold text-slate-100">✓ ActionNode</div>
    <div className="text-slate-500">payload: {'{ status: 200 }'}</div>
  </div>
);

const nodeTypes = {
  inputNode: InputNode,
  actionNode: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'inputNode',
    position: { x: 100, y: 100 },
    data: {},
  },
  {
    id: '2',
    type: 'actionNode',
    position: { x: 450, y: 180 },
    data: {},
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#39b39b', strokeWidth: 2 },
  },
];

export const HeroFlowCanvas = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = (changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  };

  const onEdgesChange: OnEdgesChange = (changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onConnect: OnConnect = (connection: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          animated: true,
          style: { stroke: '#39b39b', strokeWidth: 2 },
        },
        eds,
      ),
    );
  };

  return (
    <div className="h-full w-full touch-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        panOnDrag={false}
        preventScrolling={true}
        autoPanOnNodeDrag={false}
        autoPanOnConnect={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="rgba(57, 179, 155, 0.3)"
          gap={20}
          size={1.5}
        />
      </ReactFlow>
    </div>
  );
};
