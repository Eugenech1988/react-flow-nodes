import type { TPipelineNode, TPipelineEdge } from '@/entities';

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

type NodeKind = 'input' | 'text' | 'output';

const normalize = (value: unknown) =>
  String(value ?? '')
    .trim()
    .toLowerCase();

const getNodeKinds = (node: TPipelineNode): Set<NodeKind> => {
  const type = `${node.type ?? ''} ${node.data?.nodeType ?? ''}`.toLowerCase();
  const kinds = new Set<NodeKind>();
  if (type.includes('input')) kinds.add('input');
  if (type.includes('text')) kinds.add('text');
  if (type.includes('output')) kinds.add('output');
  return kinds;
};

const getFieldName = (node: TPipelineNode, kind: 'input' | 'output') => {
  const rawName =
    kind === 'input'
      ? (node.data?.inputName ??
        node.data?.fieldName ??
        node.data?.name ??
        node.data?.label ??
        node.data?.value)
      : (node.data?.outputName ??
        node.data?.fieldName ??
        node.data?.name ??
        node.data?.label ??
        node.data?.value);

  if (rawName !== undefined) return normalize(rawName);
  return normalize(`${kind}_${node.id}`);
};

export const validatePipeline = (
  nodes: TPipelineNode[],
  edges: TPipelineEdge[],
): ValidationReport => {
  const errors: string[] = [];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const kinds = new Map(nodes.map((node) => [node.id, getNodeKinds(node)]));
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, TPipelineEdge[]>();
  const connected = new Set<string>();
  const hasIncoming = new Set<string>();

  nodes.forEach((node) => {
    incoming.set(node.id, 0);
    outgoing.set(node.id, []);
  });

  for (const edge of edges) {
    if (!nodeById.has(edge.source) || !nodeById.has(edge.target)) continue;
    outgoing.get(edge.source)!.push(edge);
    incoming.set(edge.target, incoming.get(edge.target)! + 1);
    hasIncoming.add(edge.target);
    connected.add(edge.source);
    connected.add(edge.target);
  }

  const queue = [...incoming].filter(([, degree]) => degree === 0).map(([id]) => id);
  let visited = 0;

  for (let index = 0; index < queue.length; index++) {
    const currentId = queue[index];
    visited++;

    for (const edge of outgoing.get(currentId)!) {
      const degree = incoming.get(edge.target)! - 1;
      incoming.set(edge.target, degree);
      if (degree === 0) queue.push(edge.target);
    }
  }

  const noCycles = visited === nodes.length;
  const isDag = noCycles;
  if (!noCycles) errors.push('Loop detected: The workflow contains recursive connections.');

  const inputNodes = nodes.filter((node) => kinds.get(node.id)?.has('input'));
  const textNodes = nodes.filter((node) => kinds.get(node.id)?.has('text'));
  const outputNodes = nodes.filter((node) => kinds.get(node.id)?.has('output'));
  let requiredFieldsFilled = true;

  for (const node of nodes) {
    const nodeKinds = kinds.get(node.id);
    if (nodeKinds?.has('text')) {
      const text = String(node.data?.text ?? node.data?.content ?? '').trim();
      if (!text) {
        requiredFieldsFilled = false;
        errors.push(`Empty parameter: Text node "${node.id}" has no content.`);
      }
    }

    if (nodeKinds?.has('input') && !getFieldName(node, 'input')) {
      requiredFieldsFilled = false;
      errors.push(`Missing field name: Input node "${node.id}" is unnamed.`);
    }

    if (nodeKinds?.has('output') && !getFieldName(node, 'output')) {
      requiredFieldsFilled = false;
      errors.push(`Missing field name: Output node "${node.id}" is unnamed.`);
    }
  }

  const outputConnected = outputNodes.every((node) => hasIncoming.has(node.id));
  if (!outputConnected) {
    errors.push('Unconnected Output: Result destination node lacks an incoming connection.');
  }

  const noIsolatedNodes = nodes.length <= 1 || nodes.every((node) => connected.has(node.id));
  if (!noIsolatedNodes) {
    errors.push('Orphaned nodes: Some elements on the canvas are fully disconnected.');
  }

  const inputNames = inputNodes.map((node) => getFieldName(node, 'input')).filter(Boolean);
  const inputNameSet = new Set(inputNames);
  const noDuplicateVariables = inputNames.length === inputNameSet.size;
  if (!noDuplicateVariables) {
    errors.push('Name collision: Multiple inputs share duplicate parameter names.');
  }

  const variables = new Set<string>();
  for (const node of textNodes) {
    const text = node.data?.text ?? node.data?.content ?? '';
    if (typeof text !== 'string') continue;
    for (const match of text.matchAll(/\{\{\s*([^}]+?)\s*}}/g)) {
      variables.add(normalize(match[1]));
    }
  }

  const variableExists = [...variables].every((variable) => inputNameSet.has(variable));
  if (!variableExists) {
    errors.push('Unresolved reference: Text template uses variables that do not exist.');
  }

  let inputConnected = true;
  if (inputNodes.length === 0) {
    inputConnected = false;
    errors.push(
      'Workflow requirements failed: At least one Input node must be placed on the canvas.',
    );
  } else {
    const allInputsHaveOutgoing = inputNodes.every((node) => outgoing.get(node.id)!.length > 0);

    if (!allInputsHaveOutgoing) {
      inputConnected = false;
      errors.push('Disconnected variables: Active inputs must map to their target steps.');
    } else {
      for (const variable of variables) {
        const input = inputNodes.find((node) => getFieldName(node, 'input') === variable);
        const hasTextTarget = input
          ? outgoing.get(input.id)!.some((edge) => kinds.get(edge.target)?.has('text'))
          : false;
        if (!hasTextTarget) {
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
