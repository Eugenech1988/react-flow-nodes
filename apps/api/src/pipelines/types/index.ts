export interface ICustomInputData {
  id: string;
  nodeType: 'input';
  [key: string]: unknown;
}

export interface ICustomOutputData {
  id: string;
  nodeType: 'output';
  outputType: string;
  [key: string]: unknown;
}

export interface IBaseNode<TData = Record<string, unknown>, TType extends string = string> {
  id: string;
  type: TType;
  position: { x: number; y: number };
  data: TData;
  measured?: { width: number; height: number };
  selected?: boolean;
  dragging?: boolean;
  [key: string]: unknown;
}

export type TCustomInputNode = IBaseNode<ICustomInputData, 'customInput'>;
export type TCustomOutputNode = IBaseNode<ICustomOutputData, 'customOutput'>;

export type TAppNode = TCustomInputNode | TCustomOutputNode;

export interface TAppEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  selected?: boolean;
  [key: string]: unknown;
}

export interface IFlowGraphState {
  nodes: TAppNode[];
  edges: TAppEdge[];
}