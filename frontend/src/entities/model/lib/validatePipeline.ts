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

export const validatePipeline = (nodes: PipelineNode[], edges: PipelineEdge[]): ValidationReport => {
  const errors: string[] = [];

  const adjacency: Record<string, string[]> = {};
  const inDegree: Record<string, number> = {};

  nodes.forEach(node => {
    adjacency[node.id] = [];
    inDegree[node.id] = 0;
  });

  edges.forEach(edge => {
    if (adjacency[edge.source] && adjacency[edge.target]) {
      adjacency[edge.source].push(edge.target);
      inDegree[edge.target]++;
    }
  });

  const queue: string[] = [];
  nodes.forEach(node => {
    if (inDegree[node.id] === 0) queue.push(node.id);
  });

  let visitedCount = 0;
  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedCount++;
    (adjacency[current] || []).forEach(neighbor => {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) queue.push(neighbor);
    });
  }

  const noCycles = visitedCount === nodes.length;
  const isDag = noCycles;

  if (!noCycles) errors.push('The pipeline contains loops/cycles.');

  const requiredFieldsFilled = nodes.every(node => {
    if (node.type === 'text' || node.data?.nodeType === 'text') {
      return node.data?.text !== undefined && node.data?.text !== null && node.data?.text !== '';
    }

    if (node.data?.requiredFields) {
      return (node.data.requiredFields as string[]).every((field: string) => {
        const val = node.data?.[field];
        return val !== undefined && val !== null && val !== '';
      });
    }
    return true;
  });

  if (!requiredFieldsFilled) errors.push('Some required fields are empty.');

  const outputNodes = nodes.filter(node =>
    node.type === 'customOutput' || node.type === 'output' || node.data?.nodeType === 'customOutput'
  );
  const outputConnected = outputNodes.length > 0
    ? outputNodes.every(outNode => edges.some(edge => edge.target === outNode.id))
    : true;

  if (!outputConnected) errors.push('Output nodes must have incoming connections.');

  const noIsolatedNodes = nodes.length <= 1 || nodes.every(node => {
    const hasIncoming = edges.some(edge => edge.target === node.id);
    const hasOutgoing = edges.some(edge => edge.source === node.id);
    return hasIncoming || hasOutgoing;
  });

  if (!noIsolatedNodes) errors.push('Some nodes are completely isolated.');

  const inputNodeNames = nodes
    .filter(node => (node.type === 'customInput' || node.type === 'input') && node.data?.fieldName)
    .map(node => String(node.data.fieldName).trim());

  const noDuplicateVariables = inputNodeNames.length === new Set(inputNodeNames).size;
  if (!noDuplicateVariables) errors.push('Duplicate input field names detected.');

  const extractedVariables: string[] = [];
  const textNodesWithVariables = nodes.filter(node => node.type === 'text' || node.data?.nodeType === 'text');

  textNodesWithVariables.forEach(node => {
    const textContent = node.data?.text || node.data?.content;
    if (textContent && typeof textContent === 'string') {
      const matches = textContent.matchAll(/\{\{\s*([\w-]+)\s*\}\}/g);
      for (const match of matches) {
        if (match[1]) {
          extractedVariables.push(match[1].trim());
        }
      }
    }
  });

  const variableExists = extractedVariables.length > 0
    ? extractedVariables.every(v => inputNodeNames.includes(v))
    : true;

  if (!variableExists) {
    errors.push('Some variables used in Text fields do not match any Input names.');
  }

  let inputConnected = true;
  if (extractedVariables.length > 0) {
    inputConnected = extractedVariables.every(variable => {
      const targetInputNode = nodes.find(
        node => (node.type === 'customInput' || node.type === 'input') && String(node.data?.fieldName).trim() === variable
      );
      if (!targetInputNode) return false;

      return edges.some(edge => {
        const isFromCorrectInput = edge.source === targetInputNode.id;
        const targetNode = nodes.find(n => n.id === edge.target);
        const isToTextNode = targetNode && (targetNode.type === 'text' || targetNode.data?.nodeType === 'text');

        return isFromCorrectInput && isToTextNode;
      });
    });
  } else {
    const basicInputNodes = nodes.filter(node => node.type === 'customInput' || node.type === 'input' || node.data?.nodeType === 'customInput');
    inputConnected = basicInputNodes.length > 0
      ? basicInputNodes.every(inNode => edges.some(edge => edge.source === inNode.id))
      : true;
  }

  if (!inputConnected) {
    errors.push('Required inputs for variables are not correctly connected to their handles.');
  }

  const isValid = isDag && requiredFieldsFilled && inputConnected && outputConnected && noIsolatedNodes && variableExists && noDuplicateVariables;

  return {
    isDag,
    requiredFieldsFilled,
    inputConnected,
    outputConnected,
    noIsolatedNodes,
    noCycles,
    variableExists,
    noDuplicateVariables,
    isValid,
    errors
  };
};