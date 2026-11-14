import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsageStats } from './UsageStats';

const { mockUseUser } = vi.hoisted(() => ({ mockUseUser: vi.fn() }));

vi.mock('@/shared/hooks', () => ({ useUser: () => mockUseUser() }));

describe('UsageStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders stats for free user', () => {
    mockUseUser.mockReturnValue({ isProActive: false });
    render(<UsageStats />);
    expect(screen.getByText('Pipeline Executions')).toBeInTheDocument();
    expect(screen.getByText('85 / 100')).toBeInTheDocument();
  });

  it('renders unlimited stats for pro user', () => {
    mockUseUser.mockReturnValue({ isProActive: true });
    render(<UsageStats />);
    expect(screen.getAllByText('Unlimited').length).toBeGreaterThan(0);
  });

  it('opens modal on click for pro user', () => {
    mockUseUser.mockReturnValue({ isProActive: true });
    render(<UsageStats />);
    fireEvent.click(screen.getByText('Pipeline Executions'));
    expect(screen.getByText(/No monthly execution cap/)).toBeInTheDocument();
  });
});
