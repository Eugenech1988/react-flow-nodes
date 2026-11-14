import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NodeHandles, NodeMeta, NodeField, NodeHeader, VariableTags } from './BaseNode.parts';

vi.mock('@pipeline/ui', () => ({
  Input: (props: unknown) => <input data-testid="input" {...props} />,
  Textarea: (props: unknown) => <textarea data-testid="textarea" {...props} />,
  Select: ({ value, onValueChange, children }: unknown) => (
    <select data-testid="select" value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectValue: () => <span />,
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({ value, children }: unknown) => <option value={value}>{children}</option>,
}));

vi.mock('@xyflow/react', () => ({
  Handle: ({ id, type }: unknown) => <div data-testid={`handle-${id}`} data-type={type} />,
  Position: { Left: 'left', Right: 'right', Top: 'top', Bottom: 'bottom' },
}));

vi.mock('@/shared/ui', () => ({
  AutosizeTextarea: (props: unknown) => <textarea data-testid="autosize" {...props} />,
}));

describe('BaseNode.parts', () => {
  describe('NodeHandles', () => {
    it('renders handles of type target', () => {
      render(
        <NodeHandles
          handles={[{ id: 'in', type: 'target' }]}
          type="target"
        />
      );
      expect(screen.getByTestId('handle-in')).toHaveAttribute('data-type', 'target');
    });

    it('renders handles of type source', () => {
      render(
        <NodeHandles
          handles={[{ id: 'out', type: 'source' }]}
          type="source"
        />
      );
      expect(screen.getByTestId('handle-out')).toHaveAttribute('data-type', 'source');
    });

    it('renders multiple handles', () => {
      render(
        <NodeHandles
          handles={[
            { id: 'a', type: 'target' },
            { id: 'b', type: 'target' },
          ]}
          type="target"
        />
      );
      expect(screen.getByTestId('handle-a')).toBeInTheDocument();
      expect(screen.getByTestId('handle-b')).toBeInTheDocument();
    });
  });

  describe('NodeMeta', () => {
    it('renders title only', () => {
      render(<NodeMeta title="Text Node" />);
      expect(screen.getByText('Text Node')).toBeInTheDocument();
    });

    it('renders title and subtitle', () => {
      render(<NodeMeta title="Input" subtitle="Trigger" />);
      expect(screen.getByText('Input')).toBeInTheDocument();
      expect(screen.getByText('Trigger')).toBeInTheDocument();
    });

    it('renders nothing when no title', () => {
      const { container } = render(<NodeMeta />);
      expect(container.querySelector('.node-meta')).toBeInTheDocument();
    });
  });

  describe('NodeField', () => {
    it('renders select', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{
            key: 'op',
            label: 'Op',
            type: 'select',
            options: [
              { value: 'a', label: 'A' },
              { value: 'b', label: 'B' },
            ],
          }}
          value="a"
          onChange={onChange}
        />
      );
      fireEvent.change(screen.getByTestId('select'), { target: { value: 'b' } });
      expect(onChange).toHaveBeenCalledWith('b');
    });

    it('renders textarea', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'txt', label: 'Txt', type: 'textarea' }}
          value="hello"
          onChange={onChange}
        />
      );
      fireEvent.change(screen.getByTestId('autosize'), { target: { value: 'world' } });
      expect(onChange).toHaveBeenCalledWith('world');
    });

    it('renders text input', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'txt', label: 'Txt', type: 'text' }}
          value="hello"
          onChange={onChange}
        />
      );
      fireEvent.change(screen.getByTestId('input'), { target: { value: 'world' } });
      expect(onChange).toHaveBeenCalledWith('world');
    });

    it('renders number input', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'num', label: 'Num', type: 'number' }}
          value={42}
          onChange={onChange}
        />
      );
      const input = screen.getByTestId('input');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('NodeHeader', () => {
    it('renders icon and delete button', () => {
      const onDelete = vi.fn();
      render(<NodeHeader icon="★" onDelete={onDelete} />);
      expect(screen.getByText('★')).toBeInTheDocument();
      fireEvent.click(screen.getByTitle('Delete node'));
      expect(onDelete).toHaveBeenCalled();
    });

    it('renders without icon', () => {
      const onDelete = vi.fn();
      render(<NodeHeader onDelete={onDelete} />);
      expect(screen.getByTitle('Delete node')).toBeInTheDocument();
    });
  });

  describe('VariableTags', () => {
    it('returns null for empty array', () => {
      const { container } = render(<VariableTags variables={[]} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders all variable names', () => {
      render(<VariableTags variables={['name', 'email']} />);
      expect(screen.getByText('name')).toBeInTheDocument();
      expect(screen.getByText('email')).toBeInTheDocument();
    });
  });
});

describe('BaseNode.parts — branch edge cases', () => {
  describe('NodeHandles', () => {
    it('renders empty fragment for empty handles array', () => {
      const { container } = render(<NodeHandles handles={[]} type="target" />);
      expect(container.firstChild).toBeNull();
    });

    it('uses default position when handle.position undefined (target)', () => {
      render(<NodeHandles handles={[{ id: 'h', type: 'target' }]} type="target" />);
      expect(screen.getByTestId('handle-h')).toBeInTheDocument();
    });

    it('uses default position when handle.position undefined (source)', () => {
      render(<NodeHandles handles={[{ id: 'h', type: 'source' }]} type="source" />);
      expect(screen.getByTestId('handle-h')).toBeInTheDocument();
    });
  });

  describe('NodeField — edge cases', () => {
    it('falls back to text input when field.type is undefined', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'x', label: 'X' }}
          value=""
          onChange={onChange}
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('handles select with undefined options (renders nothing inside)', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'x', label: 'X', type: 'select' }}
          value=""
          onChange={onChange}
        />
      );
      const select = screen.getByTestId('select') as HTMLSelectElement;
      expect(select.querySelectorAll('option')).toHaveLength(0);
    });

    it('passes null from Select as empty string to onChange', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'x', label: 'X', type: 'select', options: [{ value: 'a', label: 'A' }] }}
          value="a"
          onChange={onChange}
        />
      );
      const select = screen.getByTestId('select') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: '' } });
      expect(onChange).toHaveBeenCalledWith('');
    });

    it('renders number input with field.type="number"', () => {
      const onChange = vi.fn();
      render(
        <NodeField
          field={{ key: 'n', label: 'N', type: 'number' }}
          value={5}
          onChange={onChange}
        />
      );
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
    });
  });

  describe('NodeMeta — empty title', () => {
    it('renders without title text', () => {
      const { container } = render(<NodeMeta subtitle="Only subtitle" />);
      expect(container.textContent).toContain('Only subtitle');
    });
  });
});
