import { Position } from '@xyflow/react';
import { createNode } from './BaseNode';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;

export const APINode = createNode({
  title: 'API Call',
  category: 'api',
  icon: '⇄',
  fields: [
    { key: 'url', label: 'Endpoint URL', type: 'text', defaultValue: 'https://api.example.com' },
    {
      key: 'method',
      label: 'Method',
      type: 'select',
      defaultValue: 'GET',
      options: HTTP_METHODS.map((method) => ({ value: method, label: method })),
    },
  ],
  handles: [
    { id: 'input', type: 'target', position: Position.Left },
    { id: 'response', type: 'source', position: Position.Right },
  ],
});
