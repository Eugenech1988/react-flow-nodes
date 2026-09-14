import type { TNodeExecutor } from '../model/types';

export const executeInputNode: TNodeExecutor = (node) => {
  const data = node.data;
  const fieldName = String(data.inputName || 'input');

  return {
    [fieldName]: data.inputValue ?? '',
  };
};