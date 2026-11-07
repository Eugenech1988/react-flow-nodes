'use client';

import { useState, useEffect } from 'react';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { Cpu, Database, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 50, y: 50 },
    data: {
      label: 'CORE.INGEST',
      icon: Database,
      status: 'ONLINE',
      hasTarget: false,
      hasSource: true,
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 300, y: 150 },
    data: {
      label: 'NEURAL.ENGINE',
      icon: Cpu,
      status: 'PROCESSING',
      hasTarget: true,
      hasSource: true,
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 550, y: 80 },
    data: {
      label: 'SHIELD.SECURE',
      icon: ShieldCheck,
      status: 'SECURE',
      hasTarget: true,
      hasSource: false,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    style: { stroke: '#2dd4bf', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
    style: { stroke: '#2dd4bf', strokeWidth: 2 },
  },
];

const CustomNode = ({
  data,
}: {
  data: { label: string; icon: any; status: string; hasTarget?: boolean; hasSource?: boolean };
}) => {
  const Icon = data.icon;
  const hasTarget = data.hasTarget ?? true;
  const hasSource = data.hasSource ?? true;

  return (
    <div className="relative flex cursor-grab items-center gap-3 rounded-xl border border-[#2dd4bf]/40 bg-[#0a1210]/90 px-4 py-3 shadow-[0_0_20px_rgba(45,212,191,0.15)] backdrop-blur-md">
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="-left-1.5! h-3! w-3! rounded-full! border-2! border-[#0a1210]! bg-[#2dd4bf]! shadow-[0_0_8px_#2dd4bf]"
        />
      )}

      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2dd4bf]/30 bg-[#2dd4bf]/10 text-[#2dd4bf]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-mono text-xs font-bold text-slate-100">{data.label}</div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#2dd4bf]/80">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#2dd4bf]" />
          {data.status}
        </div>
      </div>

      {hasSource && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="-right-1.5! h-3! w-3! rounded-full! border-2! border-[#0a1210]! bg-[#2dd4bf]! shadow-[0_0_8px_#2dd4bf]"
        />
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

export const ClientFlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#040a09]/80 text-[#2dd4bf]/40 backdrop-blur-xs">
          <Cpu className="h-8 w-8 animate-pulse text-[#2dd4bf] sm:h-16 sm:w-16" />
          <span className="font-mono text-[8px] tracking-widest uppercase sm:text-xs">
            INITIALIZING_CANVAS_NODES...
          </span>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.98 : 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="h-full w-full"
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          panOnDrag={true}
          preventScrolling={true}
        >
          <Background color="#2dd4bf" gap={32} size={1} style={{ opacity: 0.1 }} />
        </ReactFlow>
      </motion.div>
    </div>
  );
};
