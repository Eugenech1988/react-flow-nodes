import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InputNode } from './InputNode';

const { mockUpdateNodeField, mockToastError } = vi.hoisted(() => ({
  mockUpdateNodeField: vi.fn(),
  mockToastError: vi.fn(),
}));

vi.mock('@/entities', () => ({
  useStore: (selector: (state: unknown) => unknown) =>
    selector({
      updateNodeField: mockUpdateNodeField,
      activeNodeId: null,
      successNodeIds: [],
      failedNodeId: null,
      executionStatus: 'idle',
      runNode: vi.fn(),
    }),
}));

vi.mock('@xyflow/react', () => ({
  Position: { Left: 'left', Right: 'right' },
  Handle: () => <div />,
  useReactFlow: () => ({ deleteElements: vi.fn() }),
}));

vi.mock('@pipeline/ui', () => ({
  Input: (props: unknown) => <input data-testid="text-input" {...props} />,
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

vi.mock('sonner', () => ({
  toast: { error: mockToastError },
}));

vi.mock('@/shared/lib', () => ({
  extractVariables: vi.fn(() => []),
}));
class MockFileReader {
  result: string | null = null;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  readAsDataURL(file: File) {
    this.result = `data:${file.type};base64,bW9jaw==`;
    this.onload?.();
  }
}
(globalThis as unknown as { FileReader: typeof FileReader }).FileReader = MockFileReader;

const getDropzone = (): HTMLElement => {
  const inner = screen.getByText('Click to upload or drag & drop').parentElement!;
  return inner.parentElement as HTMLElement;
};

describe('InputNode', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text input by default', () => {
    render(<InputNode id="in1" data={{}} selected={false} {...({} as unknown as never)} />);
    const inputs = screen.getAllByTestId('text-input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders file dropzone when inputType is file', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    expect(screen.getByText('Click to upload or drag & drop')).toBeInTheDocument();
  });

  it('shows error on file larger than 10MB', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const bigFile = new File(['a'], 'a.txt', { type: 'text/plain' });
    Object.defineProperty(bigFile, 'size', { value: 11 * 1024 * 1024 });

    fireEvent.change(fileInput, { target: { files: [bigFile] } });
    expect(mockToastError).toHaveBeenCalledWith('File must be 10MB or smaller.');
  });

  it('adds highlight class on dragOver and removes on dragLeave', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const dropzone = getDropzone();

    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('bg-[var(--node-accent)]/10');

    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('bg-[var(--node-accent)]/10');
  });

  it('uploads file via FileReader and shows filename', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockUpdateNodeField).toHaveBeenCalledWith('in1', 'inputFileName', 'test.txt');
    expect(mockUpdateNodeField).toHaveBeenCalledWith(
      'in1',
      'inputValue',
      'data:text/plain;base64,bW9jaw==',
    );
  });

  it('removes file when X is clicked', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    mockUpdateNodeField.mockClear();
    fireEvent.click(screen.getByTitle('Remove file'));
    expect(mockUpdateNodeField).toHaveBeenCalledWith('in1', 'inputFileName', '');
    expect(mockUpdateNodeField).toHaveBeenCalledWith('in1', 'inputValue', '');
  });

  it('handles file drop via dataTransfer', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const dropzone = getDropzone();
    const file = new File(['hello'], 'dropped.txt', { type: 'text/plain' });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockUpdateNodeField).toHaveBeenCalledWith('in1', 'inputFileName', 'dropped.txt');
  });
});

describe('InputNode — drag & FileReader edge cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getDropzone = (): HTMLElement => {
    const inner = screen.getByText('Click to upload or drag & drop').parentElement!;
    return inner.parentElement as HTMLElement;
  };

  it('handleDragOver prevents default and stops propagation', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const dropzone = getDropzone();
    const event = new Event('dragover', { bubbles: true, cancelable: true });

    dropzone.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('handleDragLeave removes highlight', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const dropzone = getDropzone();

    fireEvent.dragOver(dropzone);
    expect(dropzone.className).toContain('bg-[var(--node-accent)]/10');

    fireEvent.dragLeave(dropzone);
    expect(dropzone.className).not.toContain('bg-[var(--node-accent)]/10');
  });

  it('handles drop with empty files gracefully', () => {
    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const dropzone = getDropzone();
    mockUpdateNodeField.mockClear();

    fireEvent.drop(dropzone, { dataTransfer: { files: [] } });

    expect(mockUpdateNodeField).not.toHaveBeenCalled();
  });

  it('shows toast on FileReader error', () => {
    class FailingFileReader {
      result: string | null = null;
      onload: (() => void) | null = null;
      onerror: (() => void) | null = null;
      readAsDataURL() {
        this.onerror?.();
      }
    }
    const original = (globalThis as unknown as { FileReader: typeof FileReader }).FileReader;
    (globalThis as unknown as { FileReader: typeof FileReader }).FileReader = FailingFileReader;

    render(<InputNode id="in1" data={{ inputType: 'file' }} selected={false} {...({} as unknown as never)} />);
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['x'], 'fail.txt', { type: 'text/plain' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(mockToastError).toHaveBeenCalledWith('Could not read the selected file.');

    (globalThis as unknown as { FileReader: typeof FileReader }).FileReader = original;
  });
});
