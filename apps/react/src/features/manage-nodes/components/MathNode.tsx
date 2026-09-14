import { Position } from '@xyflow/react';
import { createNode } from './BaseNode';

export const MathNode = createNode({
  title: 'Math',
  category: 'math',
  icon: '∑',
  fields: [
    {
      key: 'leftOperand',
      label: 'Left operand',
      type: 'text',
      defaultValue: '0',
    },
    {
      key: 'rightOperand',
      label: 'Right operand',
      type: 'text',
      defaultValue: '0',
    },
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
        { value: 'modulo', label: 'Modulo' },
        { value: 'power', label: 'Power' },
        { value: 'min', label: 'Min' },
        { value: 'max', label: 'Max' },
        { value: 'avg', label: 'Average' },
        { value: 'abs', label: 'Abs (|x|)' },
        { value: 'round', label: 'Round' },
        { value: 'floor', label: 'Floor' },
        { value: 'ceil', label: 'Ceil' },
        { value: 'sqrt', label: 'Square root' },
        { value: 'negate', label: 'Negate' },
      ],
    },
    {
      key: 'precision',
      label: 'Precision (0–20)',
      type: 'number',
      defaultValue: '',
    },
  ],
  handles: [
    { id: 'a', type: 'target', position: Position.Left },
    { id: 'b', type: 'target', position: Position.Left },
    { id: 'result', type: 'source', position: Position.Right },
  ],
});