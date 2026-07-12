import { render } from '@testing-library/react';
import { Position } from '@xyflow/react';
import { describe, expect, it, vi } from 'vitest';
import { TextNode } from './TextNode';
import type { BaseNodeProps } from '../BaseNode';

const { baseNodeProps } = vi.hoisted(() => ({
  baseNodeProps: {
    current: null as BaseNodeProps | null,
  },
}));

vi.mock('../BaseNode', () => ({
  BaseNode: (props: BaseNodeProps) => {
    baseNodeProps.current = props;
    return <div data-testid="base-node" />;
  },
}));

// Хелпер для генерации всех обязательных пропсов XYFlow
const createMockNodeProps = (id: string, nodeType = 'text', overrides = {}) => ({
  id,
  data: { id, nodeType },
  type: 'custom',
  dragging: false,
  zIndex: 1,
  selectable: true,
  draggable: true,
  deletable: true,
  parentId: undefined,
  positionAbsolute: { x: 0, y: 0 },
  selected: false,
  isConnectable: true,
  positionAbsoluteX: 0,
  positionAbsoluteY: 0,
  ...overrides,
});

describe('TextNode', () => {
  it('passes correct configuration to BaseNode', () => {
    const mockProps = createMockNodeProps('text-1', 'text');

    render(
      <TextNode
        {...mockProps}
        data={{
          id: 'text-1',
          nodeType: 'text',
          text: 'Hello {{name}} {{email}}',
        }}
      />
    );

    const props = baseNodeProps.current;

    expect(props).toBeTruthy();
    if (!props) return;

    expect(props.withVariables).toBe(true);

    expect(props.title).toBe('Text');
    expect(props.category).toBe('text');
    expect(props.icon).toBe('✎');

    expect(props.fields).toEqual([
      {
        key: 'text',
        label: 'Content',
        type: 'textarea',
        defaultValue: '{{input}}',
      },
    ]);

    expect(props.handles).toEqual([
      { id: 'input', type: 'target', position: Position.Left },
      { id: 'output', type: 'source', position: Position.Right },
    ]);
  });
});