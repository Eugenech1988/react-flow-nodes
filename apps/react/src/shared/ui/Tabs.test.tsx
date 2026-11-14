import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Tabs } from './Tabs';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, layoutId, transition, ...props }: unknown) => (
      <div data-layout-id={layoutId} {...props}>
        {children}
      </div>
    ),
  },
}));

const tabs = [
  { id: 'tab1', label: 'Tab 1' },
  { id: 'tab2', label: 'Tab 2' },
  { id: 'tab3', label: 'Tab 3', badge: 'NEW' },
];

describe('Tabs', () => {
  it('renders all tabs', () => {
    render(<Tabs tabs={tabs} currentTab="tab1" onTabChange={vi.fn()} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('highlights active tab', () => {
    render(<Tabs tabs={tabs} currentTab="tab2" onTabChange={vi.fn()} />);
    expect(screen.getByText('Tab 2').closest('button')).toHaveClass('text-teal-700');
    expect(screen.getByText('Tab 1').closest('button')).toHaveClass('text-muted-foreground');
  });

  it('renders active indicator only on active tab', () => {
    const { container } = render(
      <Tabs tabs={tabs} currentTab="tab1" onTabChange={vi.fn()} />,
    );
    const indicators = container.querySelectorAll('[data-layout-id]');
    expect(indicators).toHaveLength(1);
  });

  it('calls onTabChange with tab id', () => {
    const onTabChange = vi.fn();
    render(<Tabs tabs={tabs} currentTab="tab1" onTabChange={onTabChange} />);
    fireEvent.click(screen.getByText('Tab 2'));
    expect(onTabChange).toHaveBeenCalledWith('tab2');
  });

  it('renders badge', () => {
    render(<Tabs tabs={tabs} currentTab="tab1" onTabChange={vi.fn()} />);
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const Icon = () => <span data-testid="tab-icon" />;
    render(
      <Tabs
        tabs={[{ id: 'x', label: 'X', icon: Icon as unknown as never }]}
        currentTab="x"
        onTabChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId('tab-icon')).toBeInTheDocument();
  });

  it('applies capitalizeLabels', () => {
    render(
      <Tabs
        tabs={[{ id: 'a', label: 'lower' }]}
        currentTab="a"
        onTabChange={vi.fn()}
        capitalizeLabels
      />,
    );
    expect(screen.getByText('lower')).toHaveClass('capitalize');
  });

  it('uses provided layoutId', () => {
    const { container } = render(
      <Tabs
        tabs={tabs}
        currentTab="tab1"
        onTabChange={vi.fn()}
        layoutId="custom-layout"
      />,
    );
    expect(container.querySelector('[data-layout-id="custom-layout"]')).toBeInTheDocument();
  });
});
