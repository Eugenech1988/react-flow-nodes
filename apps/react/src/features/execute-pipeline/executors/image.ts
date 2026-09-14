import type { TNodeExecutor } from '../model/types';

export const executeImageNode: TNodeExecutor = (node, input) => {
  const data = node.data;

  return {
    ...input,
    imageUrl: data.imageUrl ?? data.url ?? input.imageUrl ?? '',
  };
};