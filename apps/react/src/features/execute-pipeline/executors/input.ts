import type { TNodeExecutor } from '../model/types';

export const executeInputNode: TNodeExecutor = (node, input) => {
  const data = node.data;
  const fieldName = String(data.inputName || 'input');

  return {
    ...input,
    [fieldName]: data.inputValue ?? '',
    value: data.inputValue ?? '',
  };
};
