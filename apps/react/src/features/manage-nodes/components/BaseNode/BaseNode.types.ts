import { type JSX } from 'react';
import type { NodeProps } from '@xyflow/react';
import type { TNodeConfig, TNodeData } from '@/entities';

export type Side = 'left' | 'right';

export interface BaseNodeProps extends Omit<NodeProps, 'data'>, TNodeConfig {
  data: TNodeData;
  withVariables?: boolean;
}

export type NodeConfigFactory = TNodeConfig | ((props: NodeProps) => JSX.Element);