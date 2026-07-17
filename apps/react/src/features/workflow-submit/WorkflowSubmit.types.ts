export interface ParseResult {
  num_nodes: number;
  num_edges: number;
  is_dag: boolean;
}

export interface ValidationMetrics {
  isDag: boolean;
  inputConnected: boolean;
  requiredFieldsFilled: boolean;
  outputConnected: boolean;
  noIsolatedNodes: boolean;
  noCycles: boolean;
  variableExists: boolean;
  noDuplicateVariables: boolean;
}