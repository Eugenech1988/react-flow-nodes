import type { CSSProperties, ReactNode } from 'react';
import type { Connection, Edge, EdgeChange, Node, NodeChange, Position } from '@xyflow/react';

// ==========================================
// 1. DOMAIN & HELPER TYPES
// ==========================================

export type TNodeData = {
  id: string;
  nodeType: string;
  [key: string]: string | number | undefined;
};

export type TPipelineNode = Node<TNodeData>;
export type TPipelineEdge = Edge<Record<string, never>>;

export type TClipboardNodesData = {
  nodes: TPipelineNode[];
  edges: TPipelineEdge[];
};

export type TLastRunStatus = 'SUCCESS' | 'FAILED' | 'RUNNING' | null;
export type TExecutionStatus = 'idle' | 'running' | 'success' | 'failed';

export type TExecutionLog = {
  id: string;
  nodeId?: string;
  timestamp: string;
  type: 'info' | 'success' | 'error';
  message: string;
};

// ==========================================
// 2. STATES
// ==========================================

export type THistorySnapshot = {
  nodes: TPipelineNode[];
  edges: TPipelineEdge[];
};

export type THistoryState = {
  past: THistorySnapshot[];
  future: THistorySnapshot[];
};

export type TGraphState = {
  nodes: TPipelineNode[];
  edges: TPipelineEdge[];
  nodeIDs: Record<string, number>;
  clipboard: TClipboardNodesData | null;
  isDragging: boolean;
  past: THistorySnapshot[];
  future: THistorySnapshot[];
  isHistoryAction: boolean;
  lastRunAt: Date | string | null;
  lastRunStatus: TLastRunStatus;
  saveAction: (() => Promise<void> | void) | null;
};

export type TExecutionState = {
  executionStatus: TExecutionStatus;
  activeNodeId: string | null;
  logs: TExecutionLog[];
  successNodeIds: string[];
  failedNodeId: string | null;
};

// ==========================================
// 3. ACTIONS
// ==========================================

export type TGraphActions = {
  getNodeID: (type: string) => string;
  addNode: (node: TPipelineNode) => void;
  deleteNode: (nodeId: string) => void;
  setNodes: (nodes: TPipelineNode[]) => void;
  setGraph: (nodes: TPipelineNode[], edges: TPipelineEdge[]) => void;
  onNodesChange: (changes: NodeChange<TPipelineNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<TPipelineEdge>[]) => void;
  copyNodes: (nodes: TPipelineNode[], edges: TPipelineEdge[]) => void;
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
  setSaveAction: (action: (() => Promise<void> | void) | null) => void;
  triggerSave: () => Promise<void>;
  setLastRunInfo: (status: TLastRunStatus, date?: Date | string) => void;
};

export type TExecutionActions = {
  runWorkflow: () => Promise<void>;
  stopWorkflow: () => void;
  clearLogs: () => void;
  addLog: (message: string, type?: TExecutionLog['type'], nodeId?: string) => void;
};

// ==========================================
// 4. COMBINED STORE TYPES
// ==========================================

export type TPipelineStoreState = TGraphState & TExecutionState;
export type TPipelineStoreActions = TGraphActions & TExecutionActions;
export type TPipelineStore = TPipelineStoreState & TPipelineStoreActions;

// ==========================================
// 5. NODE CONFIG & RENDER TYPES
// ==========================================

export type TFieldType = 'text' | 'number' | 'select' | 'textarea';

export type TSelectOption = {
  value: string;
  label: string;
};

export type TFieldConfig = {
  key: string;
  label: string;
  type?: TFieldType;
  rows?: number;
  defaultValue?: string | number | ((nodeId: string) => string | number);
  options?: TSelectOption[];
};

export type THandleConfig = {
  id: string;
  type: 'source' | 'target';
  position?: Position;
  style?: CSSProperties;
};

export type TNodeFieldValues = Record<string, string | number>;

export type TNodeRenderArgs = {
  values: TNodeFieldValues;
  handleFieldChange: (key: string, value: string) => void;
  id: string;
};

export type TNodeConfig = {
  title?: string;
  category?: string;
  icon?: ReactNode;
  fields?: TFieldConfig[];
  handles?: THandleConfig[];
  children?: (args: TNodeRenderArgs) => ReactNode;
  minWidth?: number;
};

export type TNodeComponentProps = {
  id: string;
  data: TNodeData;
};