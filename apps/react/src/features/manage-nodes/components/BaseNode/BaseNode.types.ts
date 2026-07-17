import { type JSX } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { NodeConfig, NodeData } from '@/entities';

export type Side = 'left' | 'right';

export interface BaseNodeProps extends Omit<NodeProps, 'data'>, NodeConfig {
  data: NodeData;
  withVariables?: boolean;
}

export type NodeConfigFactory = NodeConfig | ((props: NodeProps) => JSX.Element);