import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DialogBody } from './DialogBody';

describe('DialogBody', () => {
  it('renders children', () => {
    render(<DialogBody>content</DialogBody>);
    expect(screen.getByText('content')).toBeInTheDocument();
  });

  it('applies base classes', () => {
    const { container } = render(<DialogBody>content</DialogBody>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('mx-6', 'py-4');
    expect(div).not.toHaveClass('border-t');
  });

  it('applies withBorder', () => {
    const { container } = render(<DialogBody withBorder>content</DialogBody>);
    expect(container.firstChild).toHaveClass('border-t');
  });

  it('applies custom className', () => {
    const { container } = render(<DialogBody className="custom">content</DialogBody>);
    expect(container.firstChild).toHaveClass('custom');
  });
});
