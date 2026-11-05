import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/widgets/header/Header';

// Мокируем роутер и хуки, используемые в Header
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/' }),
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

vi.mock('@/features/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}));

vi.mock('@/features/user-dropdown', () => ({
  UserDropdown: () => <div data-testid="user-dropdown">UserDropdown</div>,
}));

vi.mock('./components/WorkflowExecutionControl', () => ({
  WorkflowExecutionControl: () => (
    <div data-testid="workflow-control">WorkflowExecutionControl</div>
  ),
}));

vi.mock('@/widgets', () => ({
  ShareDialog: () => <div data-testid="share-dialog">ShareDialog</div>,
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => ({
    user: {
      currentPipeline: { name: 'Test Pipeline' },
    },
  }),
}));

vi.mock('@/entities', () => ({
  useStore: () => vi.fn(),
}));

vi.mock('@/assets/logo.svg', () => ({
  default: 'test-logo.svg',
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders application logo', () => {
    render(<Header />);

    const logoImg = screen.getByAltText('Pipeline logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', 'test-logo.svg');
  });

  it('renders current pipeline name and actions when pipeline is selected', () => {
    render(<Header />);

    expect(screen.getByText('Test Pipeline')).toBeInTheDocument();
    expect(screen.getByTestId('workflow-control')).toBeInTheDocument();
    expect(screen.getByTestId('share-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('user-dropdown')).toBeInTheDocument();
  });
});
