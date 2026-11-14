import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { FloatingSelect } from './FloatingSelect';

interface ISelectProps {
  value?: string;
  onValueChange?: (v: string) => void;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
}

interface IItemProps {
  value: string;
  children: ReactNode;
}

interface IValueProps {
  children?: ReactNode;
  placeholder?: string;
}

interface ITriggerProps {
  id?: string;
  className?: string;
  children?: ReactNode;
}

interface IContentProps {
  children?: ReactNode;
}

vi.mock('@pipeline/ui', () => ({
  Select: ({ onValueChange, onOpenChange, disabled, children }: ISelectProps) => (
    <div data-testid="select" data-disabled={String(Boolean(disabled))}>
      <button data-testid="select-trigger-mock" onClick={() => onOpenChange?.(true)}>
        open
      </button>
      <button data-testid="select-change" onClick={() => onValueChange?.('b')}>
        pick-b
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, id }: ITriggerProps) => <div data-id={id}>{children}</div>,
  SelectValue: ({ children }: IValueProps) => <span>{children}</span>,
  SelectContent: ({ children }: IContentProps) => <>{children}</>,
  SelectItem: ({ value, children }: IItemProps) => (
    <div data-testid={`option-${value}`}>{children}</div>
  ),
}));

describe('FloatingSelect', () => {
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' },
  ];

  it('renders label', () => {
    render(<FloatingSelect label="Country" options={options} />);
    expect(screen.getByText('Country', { selector: 'label' })).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<FloatingSelect label="Country" options={options} />);
    expect(screen.getByTestId('option-a')).toBeInTheDocument();
    expect(screen.getByTestId('option-b')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    const onChange = vi.fn();
    render(<FloatingSelect label="Country" options={options} onChange={onChange} />);
    fireEvent.click(screen.getByTestId('select-change'));
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('does not call onChange with null value', () => {
    const onChange = vi.fn();
    render(<FloatingSelect label="Country" options={options} onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders error message', () => {
    render(
      <FloatingSelect label="Country" options={options} error errorMessage="Required" />,
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('passes disabled to Select', () => {
    render(<FloatingSelect label="Country" options={options} disabled />);
    expect(screen.getByTestId('select')).toHaveAttribute('data-disabled', 'true');
  });

  it('renders selected option value', () => {
    render(<FloatingSelect label="Country" options={options} value="a" />);
    expect(screen.getAllByText('Option A').length).toBeGreaterThan(0);
  });
});
