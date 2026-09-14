import type { TNodeExecutor } from '../model/types';

export const executeConditionNode: TNodeExecutor = (node, input) => {
  const data = node.data;
  const value = String(data.value ?? input.value ?? '');
  const compareWith = String(
    data.compareWith ?? input.compareWith ?? '',
  );
  const operator = String(data.operator || '==');

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