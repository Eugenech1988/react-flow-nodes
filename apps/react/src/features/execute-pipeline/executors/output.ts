import type { TNodeExecutor } from '../model/types';

export const executeOutputNode: TNodeExecutor = (node, input) => {
  const outputName = String(node.data.outputName || 'output');
  const value =
    node.data.outputType === 'image'
      ? (input.imageUrl ?? input.processed ?? input.value ?? '')
      : (input.value ??
        input.result ??
        input.text ??
        input.response ??
        input.rows ??
        input.inputValue ??
        input);
  return { ...input, [outputName]: value, output: value };
};
