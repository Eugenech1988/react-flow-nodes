import type { TPipelineEdge, TPipelineNode } from '@/entities';
import { TTERMINAL_KEYS, type TNodeExecutionResult } from './types';

interface ITargetMappingRule {
  targetKindIncludes: string;
  targetHandles?: string[];
  key: string;
}

const TARGET_MAPPING: ITargetMappingRule[] = [
  { targetKindIncludes: 'math', targetHandles: ['a'], key: 'connectedLeftOperand' },
  { targetKindIncludes: 'math', targetHandles: ['b'], key: 'connectedRightOperand' },
  { targetKindIncludes: 'condition', targetHandles: ['value'], key: 'connectedValue' },
  { targetKindIncludes: 'condition', targetHandles: ['compare'], key: 'connectedCompareWith' },
  { targetKindIncludes: 'llm', targetHandles: ['system'], key: 'connectedSystemPrompt' },
  { targetKindIncludes: 'llm', targetHandles: ['prompt'], key: 'connectedPrompt' },
  { targetKindIncludes: 'image', targetHandles: ['image'], key: 'connectedImageUrl' },
  { targetKindIncludes: 'api', targetHandles: ['input'], key: 'body' },
  { targetKindIncludes: 'output', key: 'value' },
];

const VAR_HANDLE_PREFIX = 'var-';

const resolveTargetKind = (targetNode: TPipelineNode): string =>
  String(targetNode.data?.nodeType || targetNode.type || '').toLowerCase();

const findMappingRule = (targetKind: string, targetHandle: string): ITargetMappingRule | null => {
  for (const rule of TARGET_MAPPING) {
    if (!targetKind.includes(rule.targetKindIncludes)) continue;
    if (rule.targetHandles && !rule.targetHandles.includes(targetHandle)) continue;
    return rule;
  }
  return null;
};

export const getConnectedValue = (
  output: TNodeExecutionResult,
  sourceHandle?: string | null,
): unknown => {
  if (sourceHandle && output[sourceHandle] !== undefined) {
    return output[sourceHandle];
  }
  for (const key of TTERMINAL_KEYS) {
    if (output[key] != null) return output[key];
  }
  return output;
};

export const mapOutputToTarget = (
  output: TNodeExecutionResult,
  edge: TPipelineEdge,
  targetNode: TPipelineNode,
): TNodeExecutionResult => {
  const value = getConnectedValue(output, edge.sourceHandle);
  const targetHandle = edge.targetHandle || '';

  if (targetHandle.startsWith(VAR_HANDLE_PREFIX)) {
    const variableName = targetHandle.slice(VAR_HANDLE_PREFIX.length);
    if (variableName) return { [variableName]: value };
    return {};
  }

  const targetKind = resolveTargetKind(targetNode);
  const rule = findMappingRule(targetKind, targetHandle);
  if (!rule) return {};

  return { [rule.key]: value };
};
