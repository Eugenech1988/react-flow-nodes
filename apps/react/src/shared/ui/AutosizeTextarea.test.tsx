import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createRef, type ChangeEvent, type Ref } from 'react';
import { AutosizeTextarea } from './AutosizeTextarea';

interface ITextareaProps {
  value?: string;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

vi.mock('@pipeline/ui', () => ({
  Textarea: ({ ref, ...props }: ITextareaProps) => {
    const attachRef = (el: HTMLTextAreaElement | null) => {
      if (el) {
        Object.defineProperty(el, 'scrollHeight', { configurable: true, value: 120 });
      }
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref && typeof ref === 'object') {
        (ref as { current: HTMLTextAreaElement | null }).current = el;
      }
    };

    return <textarea ref={attachRef} {...props} />;
  },
}));

vi.mock('@/shared/hooks', () => ({
  useAutosizeTextarea: vi.fn(),
}));

describe('AutosizeTextarea', () => {
  it('renders with value', () => {
    render(<AutosizeTextarea value="hello" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('calls onChange when change event fires', () => {
    const onChange = vi.fn();
    render(<AutosizeTextarea value="" onChange={onChange} />);
    const textarea = screen.getByRole('textbox');
    textarea.dispatchEvent(new Event('change', { bubbles: true }));
    expect(onChange).toBeDefined();
  });

  it('applies custom className', () => {
    render(<AutosizeTextarea value="" onChange={vi.fn()} className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('forwards object ref', () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<AutosizeTextarea value="" onChange={vi.fn()} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('forwards function ref', () => {
    const fn = vi.fn();
    render(<AutosizeTextarea value="" onChange={vi.fn()} ref={fn} />);
    expect(fn).toHaveBeenCalled();
    const call = fn.mock.calls[0][0];
    expect(call).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('renders with disabled', () => {
    render(<AutosizeTextarea value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
