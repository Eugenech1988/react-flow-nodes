import React, { useMemo } from 'react';
import { ReactFlow, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const InputNode = () => (
  <div className="p-4 bg-slate-900 border border-[#39b39b]/30 rounded-lg shadow-lg text-left text-xs font-mono">
    <div className="text-[#39b39b] font-bold mb-1">➔ InputNode</div>
    <div className="text-slate-500">trigger: "on_click"</div>
  </div>
);

const ActionNode = () => (
  <div className="p-4 bg-slate-900 border border-slate-100/20 rounded-lg shadow-lg text-left text-xs font-mono">
    <div className="text-slate-100 font-bold mb-1">✓ ActionNode</div>
    <div className="text-slate-500">payload: {"{ status: 200 }"}</div>
  </div>
);

const nodeTypes = {
  inputNode: InputNode,
  actionNode: ActionNode,
};

export default function FlowCanvas() {
  const initialNodes = useMemo(() => [
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
  ], []);

  const initialEdges = useMemo(() => [
    {
      id: 'e1-2',
      source: '1',
      target: '2',
      animated: true,
      style: { stroke: '#39b39b', strokeWidth: 2 },
    },
  ], []);

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1e293b" gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}