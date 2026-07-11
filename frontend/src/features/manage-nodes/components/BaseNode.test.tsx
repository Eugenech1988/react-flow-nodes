import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseNode, createNode } from './BaseNode';
import type { FieldConfig } from '@/entities/pipeline';
import type { ChangeEvent } from 'react';

const { updateNodeField, deleteElements, extractVariables } = vi.hoisted(() => ({
  updateNodeField: vi.fn(),
  deleteElements: vi.fn(),
  extractVariables: vi.fn((text: string) => {
    const matches = text.match(/\{\{(.*?)\}\}/g) ?? [];
    return matches.map((v) => v.slice(2, -2));
  }),
}));

vi.mock('@/entities/pipeline', () => ({
  useStore: (selector: (state: { updateNodeField: typeof updateNodeField }) => unknown) =>
    selector({ updateNodeField }),
}));

vi.mock('@xyflow/react', () => ({
  Position: { Left: 'left', Right: 'right' },
  Handle: ({ id }: { id: string }) => <div data-testid={id} />,
  useReactFlow: () => ({ deleteElements }),
}));

vi.mock('@/shared/ui', () => ({
  Input: ({ value, onChange }: { value: string | number; onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <input data-testid="input" value={value} onChange={onChange} />
  ),
  Select: ({ value, onChange, options }: { value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options?: { value: string; label: string }[] }) => (
    <select data-testid="select" value={value} onChange={onChange}>
      {options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  ),
}));

vi.mock('@/shared/ui/custom/AutosizeTextarea.tsx', () => ({
  AutosizeTextarea: ({ value, onChange }: { value: string; onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) => (
    <textarea data-testid="textarea" value={value} onChange={onChange} />
  ),
}));

vi.mock('@/features/manage-nodes', () => ({
  extractVariables,
}));

describe('BaseNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and icon', () => {
    render(<BaseNode id="node-1" data={{ id: 'node-1', nodeType: 'text' }} title="Text Node" icon="✎" />);
    expect(screen.getByText('Text Node')).toBeInTheDocument();
    expect(screen.getByText('✎')).toBeInTheDocument();
  });

  it('updates input field', () => {
    const fields: FieldConfig[] = [{ key: 'name', label: 'Name', type: 'text' }];
    render(<BaseNode id="node-1" data={{ id: 'node-1', nodeType: 'text' }} fields={fields} />);

    fireEvent.change(screen.getByTestId('input'), { target: { value: 'John' } });
    expect(updateNodeField).toHaveBeenCalledWith('node-1', 'name', 'John');
  });

  it('renders handles', () => {
    render(<BaseNode id="node-1" data={{ id: 'node-1', nodeType: 'text' }} handles={[{ id: 'input', type: 'target' }]} />);
    expect(screen.getByTestId('node-1-input')).toBeInTheDocument();
  });

  it('renders extracted variables', () => {
    extractVariables.mockReturnValue(['name', 'email']);
    render(
      <BaseNode
        id="node-1"
        withVariables
        data={{ id: 'node-1', nodeType: 'text', text: '{{name}} {{email}}' }}
        fields={[{ key: 'text', label: 'Content', type: 'textarea' }]}
      />
    );
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  it('createNode creates component from config', () => {
    const Node = createNode({ title: 'Config Node' });
    render(<Node id="node-1" data={{ id: 'node-1', nodeType: 'text' }} />);
    expect(screen.getByText('Config Node')).toBeInTheDocument();
  });
});