import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { NodeComponentProps } from '@/entities';

type DatabaseNodeProps = Omit<NodeProps, keyof NodeComponentProps> & NodeComponentProps;

export const DatabaseNode = (props: DatabaseNodeProps) => (
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