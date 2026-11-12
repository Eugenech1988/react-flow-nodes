'use client';

import { useState, useEffect } from 'react';
import { useMediaQuery } from '@/shared/hooks';
import '@xyflow/react/dist/style.css';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeProps,
  type NodeTypes,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import { Cpu, Database, ShieldCheck, type LucideIcon } from 'lucide-react';

type TCustomNodeData = {
  label: string;
  icon: LucideIcon;
  status: string;
  hasTarget?: boolean;
  hasSource?: boolean;
};

type TCustomNodeType = Node<TCustomNodeData, 'custom'>;

const initialNodes: TCustomNodeType[] = [
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
    style: { stroke: 'var(--theme-accent)', strokeWidth: 2 },
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    style: { stroke: 'var(--theme-accent)', strokeWidth: 2 },
  },
];

const CustomNode = ({ data }: NodeProps<TCustomNodeType>) => {
  const Icon = data.icon;
  const hasTarget = data.hasTarget ?? true;
  const hasSource = data.hasSource ?? true;

  return (
    <div className="border-theme-accent/40 bg-theme-surface/90 relative flex cursor-grab items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_0_20px_color-mix(in_oklab,var(--theme-accent)_15%,transparent)]">
      {hasTarget && (
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={false}
          className="border-theme-surface bg-theme-accent -left-1.5 h-3 w-3 rounded-full border-2 shadow-[0_0_8px_var(--theme-accent)]"
        />
      )}

      <div className="border-theme-accent/30 bg-theme-accent/10 text-theme-accent flex h-9 w-9 items-center justify-center rounded-lg border">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-theme-fg font-mono text-xs font-bold">{data.label}</div>
        <div className="text-theme-accent/80 flex items-center gap-1.5 font-mono text-[9px]">
          <span className="bg-theme-accent h-1.5 w-1.5 animate-pulse rounded-full motion-reduce:animate-none" />
          {data.status}
        </div>
      </div>

      {hasSource && (
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={false}
          className="border-theme-surface bg-theme-accent -right-1.5 h-3 w-3 rounded-full border-2 shadow-[0_0_8px_var(--theme-accent)]"
        />
      )}
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
} as NodeTypes;

export const ClientFlowCanvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<TCustomNodeType>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInteractive = useMediaQuery('(hover: hover) and (pointer: fine)');

  useEffect(() => {
    const timer = setTimeout(() => {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [setNodes, setEdges]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {isLoading && (
        <div className="bg-theme-bg/80 text-theme-accent/40 absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-xs">
          <Cpu className="text-theme-accent h-8 w-8 animate-pulse motion-reduce:animate-none sm:h-16 sm:w-16" />
          <span className="font-mono text-[8px] tracking-widest uppercase sm:text-xs">
            INITIALIZING_CANVAS_NODES...
          </span>
        </div>
      )}

      <div
        className={`h-full w-full transition-all duration-600 ease-out motion-reduce:transition-none ${isInteractive ? '' : 'pointer-events-none'} ${
          isLoading ? 'pointer-events-none scale-[0.98] opacity-0' : 'scale-100 opacity-100'
        }`}
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
          panOnDrag={isInteractive}
          preventScrolling={false}
          nodesDraggable={isInteractive}
          nodesConnectable={false}
          elementsSelectable={isInteractive}
        >
          <Background color="var(--theme-accent)" gap={32} size={1} style={{ opacity: 0.1 }} />
        </ReactFlow>
      </div>
    </div>
  );
};
