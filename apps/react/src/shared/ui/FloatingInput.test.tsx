import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRef, type InputHTMLAttributes } from 'react';
import { FloatingInput } from './FloatingInput';

vi.mock('@pipeline/ui', () => ({
  Input: ({
    ref,
    ...props
  }: InputHTMLAttributes<HTMLInputElement> & { ref?: React.Ref<HTMLInputElement> }) => (
    <input ref={ref} {...props} />
  ),
}));

describe('FloatingInput', () => {
  it('renders label', () => {
    render(<FloatingInput label="Email" />);
    expect(screen.getByText('Email', { selector: 'label' })).toBeInTheDocument();
  });

  it('forwards props to input', () => {
    render(<FloatingInput label="Email" placeholder="test" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('calls onChange', () => {
    const onChange = vi.fn();
    render(<FloatingInput label="Email" onChange={onChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'a@b.com' } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders error message when error and errorMessage provided', () => {
    render(<FloatingInput label="Email" error errorMessage="Required" />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('does not render error message without error flag', () => {
    render(<FloatingInput label="Email" errorMessage="Required" />);
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('renders icon', () => {
    render(<FloatingInput label="Search" icon={<span data-testid="icon" />} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards ref to input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<FloatingInput label="Email" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('renders disabled input', () => {
    render(<FloatingInput label="Email" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
