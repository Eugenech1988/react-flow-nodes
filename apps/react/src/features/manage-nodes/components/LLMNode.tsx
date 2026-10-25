import { Position } from '@xyflow/react';
import { createNode } from './BaseNode';

export const LLMNode = createNode({
  title: 'LLM',
  category: 'llm',
  icon: '✨',
  fields: [
    {
      key: 'systemPrompt',
      label: 'System Prompt',
      type: 'textarea',
      rows: 2,
      defaultValue: 'You are a helpful assistant.',
    },
    { key: 'prompt', label: 'Prompt', type: 'textarea', rows: 2, defaultValue: '' },
  ],
  handles: [
    { id: 'system', type: 'target', position: Position.Left },
    { id: 'prompt', type: 'target', position: Position.Left },
    { id: 'response', type: 'source', position: Position.Right },
  ],
});
