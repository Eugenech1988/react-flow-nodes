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

export type ClipboardNodesData = {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
};

export interface HistoryState {
  past: Array<{ nodes: any[]; edges: any[] }>;
  future: Array<{ nodes: any[]; edges: any[] }>;
}

export interface GraphState {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  nodeIDs: Record<string, number>;
  clipboard: ClipboardNodesData | null;
  isDragging: boolean;
  past: Array<{ nodes: PipelineNode[]; edges: PipelineEdge[] }>;
  future: Array<{ nodes: PipelineNode[]; edges: PipelineEdge[] }>;
  isHistoryAction: boolean;
}

export interface GraphActions {
  getNodeID: (type: string) => string;
  addNode: (node: PipelineNode) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: PipelineNode[]) => void;
  setGraph: (nodes: PipelineNode[], edges: PipelineEdge[]) => void;
  onNodesChange: (changes: NodeChange<PipelineNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<PipelineEdge>[]) => void;
  copyNodes: (nodes: PipelineNode[], edges: PipelineEdge[]) => void;
  pasteNodes: () => void;
  onConnect: (connection: Connection) => void;
  updateNodeField: (nodeId: string, fieldName: string, fieldValue: string | number) => void;
  exportJSON: () => void;
  importJSON: (file: File) => void;
  clearCanvas: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  takeSnapshot: () => void;
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
  successNodeIds: string[];
  failedNodeId: string | null;
}

export interface ExecutionActions {
  runWorkflow: () => Promise<void>;
  stopWorkflow: () => void;
  clearLogs: () => void;
  addLog: (message: string, type?: ExecutionLog['type'], nodeId?: string) => void;
}

export type PipelineStore = GraphState & GraphActions & ExecutionState & ExecutionActions;