import type { TNodeExecutor } from '../model/types';

export const executeConditionNode: TNodeExecutor = (node, input) => {
  const data = node.data;
  const value = String(
    input.connectedValue ?? data.value ?? input.value ?? input.text ?? input.result ?? '',
  );
  const compareWith = String(
    input.connectedCompareWith ?? data.compareWith ?? input.compareWith ?? '',
  );
  const operator = String(data.operator || '==');

  if (operator === '>' || operator === '<') {
    const left = Number(value);
    const right = Number(compareWith);
    if (!Number.isFinite(left) || !Number.isFinite(right)) {
      throw new Error(`Condition operator "${operator}" requires numeric values.`);
    }
  }

  const matched =
    operator === '>'
      ? Number(value) > Number(compareWith)
      : operator === '<'
        ? Number(value) < Number(compareWith)
        : operator === '!='
          ? value !== compareWith
          : value === compareWith;

  return {
    ...input,
    matched,
  };
};
