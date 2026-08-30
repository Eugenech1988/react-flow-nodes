import { Position } from '@xyflow/react';
import { createNode } from './BaseNode';

export const MathNode = createNode({
  title: 'Math',
  category: 'math',
  icon: '∑',
  fields: [
    { key: 'leftOperand', label: 'Left operand', type: 'number', defaultValue: 0 },
    { key: 'rightOperand', label: 'Right operand', type: 'number', defaultValue: 0 },
    {
      key: 'operation',
      label: 'Operation',
      type: 'select',
      defaultValue: 'add',
      options: [
        { value: 'add', label: 'Add' },
        { value: 'subtract', label: 'Subtract' },
        { value: 'multiply', label: 'Multiply' },
        { value: 'divide', label: 'Divide' },
      ],
    },
  ],
  handles: [
    { id: 'a', type: 'target', position: Position.Left },
    { id: 'b', type: 'target', position: Position.Left },
    { id: 'result', type: 'source', position: Position.Right },
  ],
});
