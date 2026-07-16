import { Position } from '@xyflow/react';
import { createNode } from './BaseNode';

export const ImageNode = createNode({
  title: 'Image Processor',
  category: 'media',
  icon: '▧',
  fields: [
    {
      key: 'filter',
      label: 'Filter Effect',
      type: 'select',
      defaultValue: 'blur',
      options: [
        { value: 'blur', label: 'Blur' },
        { value: 'grayscale', label: 'Grayscale' },
        { value: 'invert', label: 'Invert' },
        { value: 'sepia', label: 'Sepia' },
      ],
    },
  ],
  handles: [
    { id: 'image', type: 'target', position: Position.Left },
    { id: 'processed', type: 'source', position: Position.Right },
  ],
});
