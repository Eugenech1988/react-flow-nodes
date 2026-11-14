import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRef, type TextareaHTMLAttributes } from 'react';
import { FloatingTextarea } from './FloatingTextarea';

vi.mock('@pipeline/ui', () => ({
  Textarea: ({
    ref,
    ...props
  }: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: React.Ref<HTMLTextAreaElement> }) => (
    <textarea ref={ref} {...props} />
  ),
}));

describe('FloatingTextarea', () => {
  it('renders label', () => {
    render(<FloatingTextarea label="Description" />);
    expect(screen.getByText('Description', { selector: 'label' })).toBeInTheDocument();
  });

  it('renders textarea with default rows=3', () => {
    render(<FloatingTextarea label="Description" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '3');
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(<FloatingTextarea label="Description" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders error message', () => {
    render(<FloatingTextarea label="Description" error errorMessage="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('forwards ref to textarea', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<FloatingTextarea label="Description" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('respects custom rows', () => {
    render(<FloatingTextarea label="Description" rows={6} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '6');
  });

  it('renders disabled textarea', () => {
    render(<FloatingTextarea label="Description" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
