import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseNode, createNode } from './BaseNode';
import type { TFieldConfig } from '@/entities';

const {
  updateNodeField,
  deleteElements,
  extractVariables,
  mockRunNode,
  mockExecutionStatus,
} = vi.hoisted(() => ({
  updateNodeField: vi.fn(),
  deleteElements: vi.fn(),
  mockRunNode: vi.fn(),
  mockExecutionStatus: { current: 'idle' as string },
  extractVariables: vi.fn((text: string) => {
    const matches = text.match(/\{\{(.*?)\}\}/g) ?? [];
    return matches.map((v) => v.slice(2, -2));
  }),
}));

vi.mock('@/entities', () => ({
  useStore: (selector: (state: unknown) => unknown) =>
    selector({
      updateNodeField,
      activeNodeId: 'node-active',
      successNodeIds: ['node-success'],
      failedNodeId: 'node-failed',
      executionStatus: mockExecutionStatus.current,
      runNode: mockRunNode,
    }),
}));

vi.mock('@xyflow/react', () => ({
  Position: { Left: 'left', Right: 'right' },
  Handle: ({ id }: { id: string }) => <div data-testid={`handle-${id}`} />,
  useReactFlow: () => ({ deleteElements }),
}));

vi.mock('@pipeline/ui', () => ({
  Input: ({ value, onChange }: unknown) => <input data-testid="input" value={value} onChange={onChange} />,
  Textarea: ({ value, onChange }: unknown) => <textarea data-testid="textarea" value={value} onChange={onChange} />,
  Select: ({ value, onValueChange, children }: unknown) => (
    <select data-testid="select" value={value} onChange={(e) => onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectValue: () => <span />,
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({ value, children }: unknown) => <option value={value}>{children}</option>,
  AutosizeTextarea: ({ value, onChange }: unknown) => <textarea data-testid="textarea" value={value} onChange={onChange} />,
}));

vi.mock('@/shared/lib', () => ({
  extractVariables,
}));

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

describe('BaseNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecutionStatus.current = 'idle';
  });

  it('renders title and icon', () => {
    render(<BaseNode {...createMockNodeProps('node-1')} title="Text Node" icon="✎" />);
    expect(screen.getByText('Text Node')).toBeInTheDocument();
    expect(screen.getByText('✎')).toBeInTheDocument();
  });

  it('triggers updateNodeField inside useEffect if nodeType is missing or different', () => {
    render(<BaseNode {...createMockNodeProps('node-1', '')} title="Text" />);
    expect(updateNodeField).toHaveBeenCalledWith('node-1', 'nodeType', 'text');
  });

  it('updates input field and triggers updateNodeField', () => {
    const fields: TFieldConfig[] = [{ key: 'name', label: 'Name', type: 'text' }];
    render(<BaseNode {...createMockNodeProps('node-1')} fields={fields} />);

    fireEvent.change(screen.getByTestId('input'), { target: { value: 'John' } });
    expect(updateNodeField).toHaveBeenCalledWith('node-1', 'name', 'John');
  });

  it('renders handles', () => {
    render(
      <BaseNode {...createMockNodeProps('node-1')} handles={[{ id: 'input', type: 'target' }]} />,
    );
    expect(screen.getByTestId('handle-input')).toBeInTheDocument();
  });

  it('renders extracted variables as tags', () => {
    extractVariables.mockReturnValue(['name', 'email']);
    render(
      <BaseNode
        {...createMockNodeProps('node-1')}
        withVariables
        fields={[{ key: 'text', label: 'Content', type: 'textarea' }]}
      />,
    );
    expect(screen.getByText('name')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
  });

  it('triggers deleteElements on delete button click', () => {
    render(<BaseNode {...createMockNodeProps('node-1')} title="Delete Test" />);
    fireEvent.click(screen.getByTitle('Delete node'));
    expect(deleteElements).toHaveBeenCalledWith({ nodes: [{ id: 'node-1' }] });
  });

  it('shows loader indicator when node is active', () => {
    const { container } = render(<BaseNode {...createMockNodeProps('node-active')} />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('shows checkmark indicator when node execution is successful', () => {
    render(<BaseNode {...createMockNodeProps('node-success')} />);
    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('shows cross indicator when node execution failed', () => {
    const { container } = render(<BaseNode {...createMockNodeProps('node-failed')} />);
    const failedIndicator = container.querySelector('.bg-rose-500');
    expect(failedIndicator).toHaveTextContent('✕');
  });

  it('createNode factory generates a valid component from configuration object', () => {
    const NodeComponent = createNode({ title: 'Config Node', category: 'test-category' });
    render(<NodeComponent {...createMockNodeProps('node-factory', 'test-category', { selected: true })} />);
    expect(screen.getByText('Config Node')).toBeInTheDocument();
  });

  it('syncs values when data prop changes', () => {
    const fields: TFieldConfig[] = [{ key: 'name', label: 'Name', type: 'text' }];
    const { rerender } = render(
      <BaseNode {...createMockNodeProps('node-1')} data={{ name: 'A' }} fields={fields} />
    );
    expect(screen.getByTestId('input')).toHaveValue('A');

    rerender(
      <BaseNode {...createMockNodeProps('node-1')} data={{ name: 'B' }} fields={fields} />
    );
    expect(screen.getByTestId('input')).toHaveValue('B');
  });

  it('toggles continueOnError', () => {
    const fields: TFieldConfig[] = [{ key: 'name', label: 'Name', type: 'text' }];
    render(<BaseNode {...createMockNodeProps('node-1')} fields={fields} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(updateNodeField).toHaveBeenCalledWith('node-1', 'continueOnError', 'true');
  });

  it('calls runNode when Run node is clicked', () => {
    const fields: TFieldConfig[] = [{ key: 'name', label: 'Name', type: 'text' }];
    render(<BaseNode {...createMockNodeProps('node-1')} fields={fields} />);
    fireEvent.click(screen.getByText('Run node'));
    expect(mockRunNode).toHaveBeenCalledWith('node-1');
  });

  it('disables Run node when executionStatus is running', () => {
    mockExecutionStatus.current = 'running';
    const fields: TFieldConfig[] = [{ key: 'name', label: 'Name', type: 'text' }];
    render(<BaseNode {...createMockNodeProps('node-1')} fields={fields} />);
    expect(screen.getByText('Run node').closest('button')).toBeDisabled();
  });
});
