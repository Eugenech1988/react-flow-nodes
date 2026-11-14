import { Position } from '@xyflow/react';
import { createNode } from './BaseNode';
import { InputNodeContent } from './InputNodeContent';

export const InputNode = createNode({
  title: 'Input',
  subtitle: 'Start workflow',
  category: 'input',
  icon: '▶',
  fields: [
    { key: 'inputName', label: 'Field Name', defaultValue: (id) => `input_${id}` },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'text',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'file', label: 'File' },
      ],
    },
  ],
  handles: [{ id: 'value', type: 'source', position: Position.Right }],
  children: (args) => (
    <InputNodeContent values={args.values} handleFieldChange={args.handleFieldChange} />
  ),
});
