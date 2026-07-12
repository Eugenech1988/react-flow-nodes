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

export interface HistoryState {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}

export interface GraphState {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  nodeIDs: Record<string, number>;
  past: HistoryState[];
  future: HistoryState[];
}

export interface GraphActions {
  getNodeID: (type: string) => string;
  addNode: (node: PipelineNode) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: PipelineNode[]) => void;
  setGraph: (nodes: PipelineNode[], edges: PipelineEdge[]) => void;
  onNodesChange: (changes: NodeChange<PipelineNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<PipelineEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: string | number) => void;
  takeSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  exportJSON: () => void;
  importJSON: (file: File) => void;
  clearCanvas: () => void;
}

export type ExecutionStatus = 'idle' | 'running' | 'success' | 'failed';

export interface ExecutionLog {
  id: string;
  nodeId?: string;
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
}

export interface ExecutionState {
  executionStatus: ExecutionStatus;
  activeNodeId: string | null;
  logs: ExecutionLog[];
}

export interface ExecutionActions {
  runWorkflow: () => Promise<void>;
  stopWorkflow: () => void;
  clearLogs: () => void;
  addLog: (message: string, type?: ExecutionLog['type'], nodeId?: string) => void;
}

export type PipelineStore = GraphState & GraphActions & ExecutionState & ExecutionActions;