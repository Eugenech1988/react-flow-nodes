import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DetailsRow } from './DetailsRow';

describe('DetailsRow', () => {
  it('renders label and value', () => {
    render(<DetailsRow label="ID" value="123" />);
    expect(screen.getByText('ID:')).toBeInTheDocument();
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('applies mono class', () => {
    const { container } = render(<DetailsRow label="ID" value="abc" mono />);
    expect(container.querySelector('.font-mono')).toBeInTheDocument();
  });

  it('hides border when last', () => {
    const { container } = render(<DetailsRow label="ID" value="123" last />);
    expect(container.firstChild).not.toHaveClass('border-b');
  });
});
