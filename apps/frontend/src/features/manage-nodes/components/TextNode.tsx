import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from './BaseNode';
import type { NodeData } from '@/entities';

export const TextNode = ({ id, data, selected, ...rest }: NodeProps & { data: NodeData }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      {...rest}
      title="Text"
      category="text"
      icon="✎"
      withVariables
      fields={[
        {
          key: 'text',
          label: 'Content',
          type: 'textarea',
          defaultValue: '',
        },
      ]}
      handles={[
        {
          id: 'input',
          type: 'target',
          position: Position.Left,
        },
        {
          id: 'output',
          type: 'source',
          position: Position.Right,
        },
      ]}
    />
  );
};