import { Position } from '@xyflow/react';
import { createNode } from '../BaseNode';

const COMPARISON_OPERATORS = ['>', '<', '==', '!='] as const;

export const ConditionalNode = createNode({
  title: 'Condition',
  category: 'logic',
  icon: '⑂',
  fields: [
    {
      key: 'operator',
      label: 'Operator',
      type: 'select',
      defaultValue: '>',
      options: COMPARISON_OPERATORS.map((operator) => ({ value: operator, label: operator })),
    },
  ],
  handles: [
    { id: 'value', type: 'target', position: Position.Left },
    { id: 'compare', type: 'target', position: Position.Left },
    { id: 'true', type: 'source', position: Position.Right },
    { id: 'false', type: 'source', position: Position.Right },
  ],
});
