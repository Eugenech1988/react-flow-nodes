import { Position, type NodeProps } from '@xyflow/react';
import { BaseNode } from '../BaseNode';
import type { NodeData } from '@/entities';

// Используем пересечение встроенного типа NodeProps и вашей структуры данных
export const TextNode = ({ id, data, selected, ...rest }: NodeProps & { data: NodeData }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      selected={selected}
      {...rest} // Автоматически безопасно пробрасывает position, dragging и другие внутренние свойства
      title="Text"
      category="text"
      icon="✎"
      withVariables={true}
      fields={[
        {
          key: 'text',
          label: 'Content',
          type: 'textarea',
          defaultValue: '{{input}}'
        }
      ]}
      handles={[
        { id: 'input', type: 'target', position: Position.Left },
        { id: 'output', type: 'source', position: Position.Right }
      ]}
    />
  );
};