import { Position } from '@xyflow/react';
import { BaseNode } from '../BaseNode';
import type { NodeComponentProps } from '@/entities/pipeline';

export const DatabaseNode = (props: NodeComponentProps) => (
  <BaseNode
    {...props}
    title="Database"
    category="database"
    icon="⛁"
    fields={[
      { key: 'query', label: 'Query', type: 'textarea', defaultValue: 'SELECT * FROM table' }
    ]}
    handles={[
      { id: 'params', type: 'target', position: Position.Left },
      { id: 'rows', type: 'source', position: Position.Right },
    ]}
  />
);