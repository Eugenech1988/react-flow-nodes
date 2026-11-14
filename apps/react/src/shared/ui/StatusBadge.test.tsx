import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusBadge } from './StatusBadge';

const MockIcon = ({ className }: { className?: string }) => (
  <span data-testid="badge-icon" data-class={className} />
);

describe('StatusBadge', () => {
  it('renders label', () => {
    render(
      <StatusBadge config={{ label: 'Active', icon: MockIcon, className: 'bg-green-500' }} />,
    );
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders icon with iconClassName', () => {
    render(
      <StatusBadge
        config={{
          label: 'Running',
          icon: MockIcon,
          className: 'bg-blue-500',
          iconClassName: 'animate-spin',
        }}
      />,
    );
    expect(screen.getByTestId('badge-icon').getAttribute('data-class')).toContain('animate-spin');
  });

  it('applies className', () => {
    const { container } = render(
      <StatusBadge config={{ label: 'X', icon: MockIcon, className: 'custom-class' }} />,
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('handles missing iconClassName', () => {
    render(
      <StatusBadge config={{ label: 'X', icon: MockIcon, className: 'c' }} />,
    );
    expect(screen.getByTestId('badge-icon').getAttribute('data-class')).not.toContain('animate');
  });
});
