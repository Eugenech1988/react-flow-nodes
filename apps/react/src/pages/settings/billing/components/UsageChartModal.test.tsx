import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { UsageChartModal } from './UsageChartModal';

interface IStatMock {
  label: string;
  value: string;
  percentage: number;
  barColor: string;
  sub: string;
  icon: ReactNode;
}

vi.mock('@pipeline/ui', () => ({
  Dialog: ({ children, open }: { children: ReactNode; open: boolean }) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/shared/ui', () => ({
  DialogHeader: ({
    title,
    onClose,
    icon,
  }: {
    title: string;
    onClose: () => void;
    icon?: ReactNode;
  }) => (
    <div>
      <h2>
        {icon}
        {title}
      </h2>
      <button onClick={onClose} data-testid="header-close">
        X
      </button>
    </div>
  ),
  DialogBody: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ onCancel }: { onCancel: () => void }) => (
    <button onClick={onCancel} data-testid="footer-close">
      Close
    </button>
  ),
}));

interface ITooltipContentArgs {
  active: boolean;
  payload: Array<{ value: unknown }>;
  label: string;
}

interface IActiveDotArgs {
  cx: number;
  cy: number;
  payload: { value: number };
}

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  AreaChart: ({ children }: { children: ReactNode }) => (
    <div data-testid="area-chart">{children}</div>
  ),
  Area: ({
    activeDot,
  }: {
    activeDot?: (props: IActiveDotArgs) => ReactNode;
  }) => {
    if (typeof activeDot !== 'function') {
      return <div data-testid="area" />;
    }
    return (
      <div data-testid="area">
        <div data-testid="active-dot-low">
          {activeDot({ cx: 10, cy: 20, payload: { value: 30 } })}
        </div>
        <div data-testid="active-dot-mid">
          {activeDot({ cx: 10, cy: 20, payload: { value: 45 } })}
        </div>
        <div data-testid="active-dot-high">
          {activeDot({ cx: 10, cy: 20, payload: { value: 65 } })}
        </div>
        <div data-testid="active-dot-critical">
          {activeDot({ cx: 10, cy: 20, payload: { value: 85 } })}
        </div>
      </div>
    );
  },
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: ({
    content,
  }: {
    content?: (props: ITooltipContentArgs) => ReactNode;
  }) => {
    if (typeof content !== 'function') return null;
    return (
      <div data-testid="tooltip">
        <div data-testid="tooltip-low">
          {content({ active: true, payload: [{ value: 30 }], label: 'Mon' })}
        </div>
        <div data-testid="tooltip-mid">
          {content({ active: true, payload: [{ value: 45 }], label: 'Tue' })}
        </div>
        <div data-testid="tooltip-high">
          {content({ active: true, payload: [{ value: 65 }], label: 'Wed' })}
        </div>
        <div data-testid="tooltip-critical">
          {content({ active: true, payload: [{ value: 85 }], label: 'Thu' })}
        </div>
        <div data-testid="tooltip-inactive">
          {content({ active: false, payload: [], label: 'Fri' })}
        </div>
      </div>
    );
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: ReactNode } & Record<string, unknown>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

const mockStat: IStatMock = {
  label: 'Pipeline Executions',
  value: '85 / 100',
  percentage: 85,
  barColor: 'bg-teal-500',
  sub: 'Resets on the 1st',
  icon: <span data-testid="stat-icon">icon</span>,
};

describe('UsageChartModal', () => {
  it('does not render when stat is null', () => {
    render(<UsageChartModal stat={null} onClose={vi.fn()} />);
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  it('renders correctly when stat is provided', () => {
    render(<UsageChartModal stat={mockStat} onClose={vi.fn()} />);

    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Pipeline Executions Usage/)).toBeInTheDocument();
    expect(screen.getByText('85 / 100')).toBeInTheDocument();
    expect(screen.getByTestId('stat-icon')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('toggles time range', () => {
    render(<UsageChartModal stat={mockStat} onClose={vi.fn()} />);

    const btn7d = screen.getByText('7D').closest('button')!;
    const btn30d = screen.getByText('30D').closest('button')!;

    expect(btn7d).toHaveClass('text-teal-600');
    expect(btn30d).not.toHaveClass('text-teal-600');

    fireEvent.click(btn30d);

    expect(btn7d).not.toHaveClass('text-teal-600');
    expect(btn30d).toHaveClass('text-teal-600');
  });

  it('switches to 90d range', () => {
    render(<UsageChartModal stat={mockStat} onClose={vi.fn()} />);
    fireEvent.click(screen.getByText('90D').closest('button')!);
    expect(screen.getByText('90D').closest('button')).toHaveClass('text-teal-600');
  });

  it('renders tooltip content for all thresholds', () => {
    render(<UsageChartModal stat={mockStat} onClose={vi.fn()} />);

    expect(screen.getByTestId('tooltip-low')).toHaveTextContent('Mon');
    expect(screen.getByTestId('tooltip-low')).toHaveTextContent('30%');
    expect(screen.getByTestId('tooltip-mid')).toHaveTextContent('45%');
    expect(screen.getByTestId('tooltip-high')).toHaveTextContent('65%');
    expect(screen.getByTestId('tooltip-critical')).toHaveTextContent('85%');
  });

  it('renders tooltip inactive as empty', () => {
    render(<UsageChartModal stat={mockStat} onClose={vi.fn()} />);
    expect(screen.getByTestId('tooltip-inactive').textContent).toBe('');
  });

  it('renders active dots for all thresholds', () => {
    render(<UsageChartModal stat={mockStat} onClose={vi.fn()} />);
    expect(screen.getByTestId('active-dot-low').querySelector('circle')).toBeInTheDocument();
    expect(screen.getByTestId('active-dot-critical').querySelector('circle')).toBeInTheDocument();
  });

  it('calls onClose via header close button', () => {
    const onClose = vi.fn();
    render(<UsageChartModal stat={mockStat} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('header-close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose via footer close button', () => {
    const onClose = vi.fn();
    render(<UsageChartModal stat={mockStat} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('footer-close'));
    expect(onClose).toHaveBeenCalled();
  });
});
