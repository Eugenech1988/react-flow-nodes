import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

vi.mock('@/features/check-status', () => {
  const MockComponent = () => <div data-testid="server-status">ServerStatusBadge</div>;
  return {
    default: MockComponent,
    ServerStatusBadge: MockComponent,
  };
});

vi.mock('@/features/toggle-theme', () => {
  const MockComponent = () => <div data-testid="theme-toggle">ThemeToggle</div>;
  return {
    default: MockComponent,
    ThemeToggle: MockComponent,
  };
});

vi.mock('@/features/submit-pipeline', () => {
  const MockComponent = () => <div data-testid="submit-button">SubmitButton</div>;
  return {
    default: MockComponent,
    SubmitButton: MockComponent,
  };
});

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

    expect(screen.getByText('Checking backend…')).toBeInTheDocument();

    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
});