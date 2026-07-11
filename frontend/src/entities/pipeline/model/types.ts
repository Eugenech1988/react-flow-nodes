import type { CSSProperties, ReactNode } from 'react';
import type { Connection, Edge, EdgeChange, Node, NodeChange, Position } from '@xyflow/react';

export interface NodeData {
  id: string;
  nodeType: string;
  [key: string]: string | number | undefined;
}

export type PipelineNode = Node<NodeData>;
export type PipelineEdge = Edge<Record<string, never>>;

export type FieldType = 'text' | 'number' | 'select' | 'textarea';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FieldConfig {
  key: string;
  label: string;
  type?: FieldType;
  rows?: number;
  defaultValue?: string | number | ((nodeId: string) => string | number);
  options?: SelectOption[];
}

export interface HandleConfig {
  id: string;
  type: 'source' | 'target';
  position?: Position;
  style?: CSSProperties;
}

export type NodeFieldValues = Record<string, string | number>;

export interface NodeRenderArgs {
  values: NodeFieldValues;
  handleFieldChange: (key: string, value: string) => void;
  id: string;
}

export interface NodeConfig {
  title?: string;
  category?: string;
  icon?: ReactNode;
  fields?: FieldConfig[];
  handles?: HandleConfig[];
  children?: (args: NodeRenderArgs) => ReactNode;
  minWidth?: number;
}

export interface NodeComponentProps {
  id: string;
  data: NodeData;
}

export interface PipelineState {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  nodeIDs: Record<string, number>;
  getNodeID: (type: string) => string;
  addNode: (node: PipelineNode) => void;
  deleteNode: (nodeId: string) => void;
  onNodesChange: (changes: NodeChange<PipelineNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<PipelineEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: string | number) => void;
}
