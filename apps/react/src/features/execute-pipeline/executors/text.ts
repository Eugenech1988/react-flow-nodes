import type { TNodeExecutor } from '../model/types';
import { resolveTemplate } from '../model/utils';

export const executeTextNode: TNodeExecutor = (node, input) => {
  const data = node.data;

  return {
    ...input,
    text: resolveTemplate(String(data.text || ''), input),
  };
};