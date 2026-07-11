import { Position } from '@xyflow/react';
import { createNode } from '../BaseNode';

export const OutputNode = createNode({
  title: 'Output',
  category: 'output',
  icon: '⇥',
  fields: [
    { key: 'outputName', label: 'Field Name', defaultValue: (id) => `output_${id}` },
    {
      key: 'outputType',
      label: 'Type',
      type: 'select',
      defaultValue: 'text',
      options: [
        { value: 'text', label: 'Text' },
        { value: 'image', label: 'Image' },
      ],
    },
  ],
  handles: [{ id: 'value', type: 'target', position: Position.Left }],
});
