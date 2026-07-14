import type { PipelineNode, PipelineEdge } from '@/entities';

export interface ValidationReport {
  isDag: boolean;
  requiredFieldsFilled: boolean;
  outputConnected: boolean;
  inputConnected: boolean;
  noIsolatedNodes: boolean;
  noCycles: boolean;
  variableExists: boolean;
  noDuplicateVariables: boolean;
  isValid: boolean;
  errors: string[];
}

const normalize = (value: unknown) =>
  String(value ?? '').trim().toLowerCase();

const getInputName = (node: PipelineNode) => {
  const type = String(node.type ?? '').toLowerCase();
  const nodeType = String(node.data?.nodeType ?? '').toLowerCase();

  const rawName =
    node.data?.inputName ??
    node.data?.fieldName ??
    node.data?.name ??
    node.data?.label ??
    node.data?.value;

  if (rawName !== undefined) {
    return normalize(rawName);
  }

  if (type.includes('input') || nodeType.includes('input')) {
    return normalize(`input_${node.id}`);
  }

  return '';
};

const getOutputName = (node: PipelineNode) => {
  const type = String(node.type ?? '').toLowerCase();
  const nodeType = String(node.data?.nodeType ?? '').toLowerCase();

  const rawName =
    node.data?.outputName ??
    node.data?.fieldName ??
    node.data?.name ??
    node.data?.label ??
    node.data?.value;

  if (rawName !== undefined) {
    return normalize(rawName);
  }

  if (type.includes('output') || nodeType.includes('output')) {
    return normalize(`output_${node.id}`);
  }

  return '';
};

export const validatePipeline = (
  nodes: PipelineNode[],
  edges: PipelineEdge[]
): ValidationReport => {
  const errors: string[] = [];

  const adjacency: Record<string, string[]> = {};
  const indegree: Record<string, number> = {};

  for (const node of nodes) {
    adjacency[node.id] = [];
    indegree[node.id] = 0;
  }

  for (const edge of edges) {
    if (!adjacency[edge.source] || !adjacency[edge.target]) continue;
    adjacency[edge.source].push(edge.target);
    indegree[edge.target]++;
  }

  const queue = Object.keys(indegree).filter(id => indegree[id] === 0);
  let visited = 0;

  while (queue.length) {
    const current = queue.shift()!;
    visited++;

    for (const next of adjacency[current]) {
      indegree[next]--;
      if (indegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  const noCycles = visited === nodes.length;
  const isDag = noCycles;

  if (!noCycles) {
    errors.push('Loop detected: The workflow contains recursive connections.');
  }

  const inputNodes = nodes.filter(node => {
    const type = String(node.type ?? '').toLowerCase();
    const nodeType = String(node.data?.nodeType ?? '').toLowerCase();
    return type.includes('input') || nodeType.includes('input');
  });

  const textNodes = nodes.filter(node => {
    const type = String(node.type ?? '').toLowerCase();
    const nodeType = String(node.data?.nodeType ?? '').toLowerCase();
    return type.includes('text') || nodeType.includes('text');
  });

  const outputNodes = nodes.filter(node => {
    const type = String(node.type ?? '').toLowerCase();
    const nodeType = String(node.data?.nodeType ?? '').toLowerCase();
    return type.includes('output') || nodeType.includes('output');
  });

  let requiredFieldsFilled = true;

  for (const node of nodes) {
    const type = String(node.type ?? '').toLowerCase();
    const nodeType = String(node.data?.nodeType ?? '').toLowerCase();

    if (type.includes('text') || nodeType.includes('text')) {
      const text = String(node.data?.text ?? node.data?.content ?? '').trim();
      if (!text) {
        requiredFieldsFilled = false;
        errors.push(`Empty parameter: Text node "${node.id}" has no content.`);
      }
    }

    if (type.includes('input') || nodeType.includes('input')) {
      const fieldName = getInputName(node);
      if (!fieldName) {
        requiredFieldsFilled = false;
        errors.push(`Missing field name: Input node "${node.id}" is unnamed.`);
      }
    }

    if (type.includes('output') || nodeType.includes('output')) {
      const fieldName = getOutputName(node);
      if (!fieldName) {
        requiredFieldsFilled = false;
        errors.push(`Missing field name: Output node "${node.id}" is unnamed.`);
      }
    }
  }

  const outputConnected =
    outputNodes.length === 0 ||
    outputNodes.every(node =>
      edges.some(edge => edge.target === node.id)
    );

  if (!outputConnected) {
    errors.push('Unconnected Output: Result destination node lacks an incoming connection.');
  }

  const noIsolatedNodes =
    nodes.length <= 1 ||
    nodes.every(node =>
      edges.some(e => e.source === node.id || e.target === node.id)
    );

  if (!noIsolatedNodes) {
    errors.push('Orphaned nodes: Some elements on the canvas are fully disconnected.');
  }

  const inputNames = inputNodes.map(getInputName).filter(Boolean);
  const noDuplicateVariables =
    inputNames.length === new Set(inputNames).size;

  if (!noDuplicateVariables) {
    errors.push('Name collision: Multiple inputs share duplicate parameter names.');
  }

  const variables = new Set<string>();
  for (const node of textNodes) {
    const text = node.data?.text ?? node.data?.content ?? '';
    if (typeof text !== 'string') continue;
    const matches = text.matchAll(/\{\{\s*([^}]+?)\s*\}\}/g);
    for (const match of matches) {
      variables.add(normalize(match[1]));
    }
  }

  const variableExists =
    [...variables].every(variable =>
      inputNames.includes(variable)
    );

  if (!variableExists) {
    errors.push('Unresolved reference: Text template uses variables that do not exist.');
  }

  let inputConnected = true;

  if (inputNodes.length === 0) {
    inputConnected = false;
    errors.push('Workflow requirements failed: At least one Input node must be placed on the canvas.');
  } else {
    const allInputsHaveOutgoing = inputNodes.every(inputNode =>
      edges.some(edge => edge.source === inputNode.id)
    );

    if (!allInputsHaveOutgoing) {
      inputConnected = false;
      errors.push('Disconnected variables: Active inputs must map to their target steps.');
    } else if (variables.size > 0) {
      for (const variable of variables) {
        const inputNode = inputNodes.find(
          node => getInputName(node) === variable
        );

        if (!inputNode) {
          inputConnected = false;
          break;
        }

        const connected = edges.some(edge => {
          if (edge.source !== inputNode.id) return false;
          const target = nodes.find(n => n.id === edge.target);
          if (!target) return false;
          const type = String(target.type ?? '').toLowerCase();
          const nodeType = String(target.data?.nodeType ?? '').toLowerCase();
          return type.includes('text') || nodeType.includes('text');
        });

        if (!connected) {
          inputConnected = false;
          break;
        }
      }

      if (!inputConnected) {
        errors.push('Disconnected variables: Active inputs must map to their target steps.');
      }
    }
  }

  const isValid =
    isDag &&
    noCycles &&
    requiredFieldsFilled &&
    outputConnected &&
    noIsolatedNodes &&
    variableExists &&
    noDuplicateVariables &&
    inputConnected;

  return {
    isDag,
    requiredFieldsFilled,
    outputConnected,
    inputConnected,
    noIsolatedNodes,
    noCycles,
    variableExists,
    noDuplicateVariables,
    isValid,
    errors,
  };
};