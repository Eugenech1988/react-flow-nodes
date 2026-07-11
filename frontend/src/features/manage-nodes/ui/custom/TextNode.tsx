import { Position } from '@xyflow/react';
import { type BaseNodeProps, BaseNode } from '../BaseNode';

export const TextNode = (props: BaseNodeProps) => {
  return (
    <BaseNode
      {...props}
      title="Text"
      category="text"
      icon="✎"
      withVariables={true}
      fields={[
        { key: 'text', label: 'Content', type: 'textarea', defaultValue: '{{input}}' }
      ]}
      handles={[
        { id: 'input', type: 'target', position: Position.Left },
        { id: 'output', type: 'source', position: Position.Right }
      ]}
    />
  );
};