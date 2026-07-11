import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

vi.mock('@/features/check-status', () => ({
  ServerStatusBadge: () => (
    <div data-testid="server-status">ServerStatusBadge</div>
  ),
}));

vi.mock('@/features/toggle-theme', () => ({
  ThemeToggle: () => (
    <div data-testid="theme-toggle">ThemeToggle</div>
  ),
}));

vi.mock('@/features/submit-pipeline', () => ({
  SubmitButton: () => (
    <div data-testid="submit-button">SubmitButton</div>
  ),
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders application title and subtitle', () => {
    render(<Header />);

    expect(screen.getByText('Pipeline Studio')).toBeInTheDocument();
    expect(
      screen.getByText('Drag, connect, and run your workflow')
    ).toBeInTheDocument();
  });

  it('renders application logo', () => {
    render(<Header />);

    const logo = screen.getByTestId('app-logo');
    expect(logo).toBeInTheDocument();

    const svg = logo.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders action components', () => {
    render(<Header />);

    expect(screen.getByTestId('server-status')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
});