import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface IUserMock {
  isLoading: boolean;
  role: string | null;
}

interface ILogoutMock {
  isLoggingOut: boolean;
  logout: () => void;
}

const mockNavigate = vi.fn<(path: string) => void>();
const mockUser = vi.hoisted(() => ({ current: null as IUserMock | null }));
const mockLogout = vi.hoisted(() => ({ current: null as ILogoutMock | null }));
const mockSidebarOpen = vi.hoisted(() => ({ value: false }));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUser.current,
  useLogout: () => mockLogout.current,
}));

vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => mockNavigate,
}));

vi.mock('./model', () => ({
  useSidebarStore: (selector: (state: { isOpen: boolean }) => unknown) =>
    selector({ isOpen: mockSidebarOpen.value }),
}));

vi.mock('./components', () => ({
  SidebarToggle: () => <div data-testid="sidebar-toggle" />,
}));

import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSidebarOpen.value = true;
    mockUser.current = { isLoading: false, role: 'USER' };
    mockLogout.current = { isLoggingOut: false, logout: vi.fn() };
  });

  it('returns null when loading', () => {
    mockUser.current = { isLoading: true, role: null };
    const { container } = render(<Sidebar />);
    expect(container.firstChild).toBeNull();
  });

  it('renders product nav for USER', () => {
    render(<Sidebar />);
    expect(screen.getByText('Studio')).toBeInTheDocument();
    expect(screen.getByText('Pipelines')).toBeInTheDocument();
    expect(screen.getByText('Executions')).toBeInTheDocument();
    expect(screen.queryByText('Job Vacancies')).not.toBeInTheDocument();
  });

  it('renders only admin nav for CONTENT_MANAGER', () => {
    mockUser.current = { isLoading: false, role: 'CONTENT_MANAGER' };
    render(<Sidebar />);
    expect(screen.getByText('Job Vacancies')).toBeInTheDocument();
    expect(screen.queryByText('Studio')).not.toBeInTheDocument();
    expect(screen.queryByText('Pipelines')).not.toBeInTheDocument();
    expect(screen.queryByText('Executions')).not.toBeInTheDocument();
  });

  it('renders both product and admin nav for SUPER_ADMIN', () => {
    mockUser.current = { isLoading: false, role: 'SUPER_ADMIN' };
    render(<Sidebar />);
    expect(screen.getByText('Studio')).toBeInTheDocument();
    expect(screen.getByText('Job Vacancies')).toBeInTheDocument();
  });

  it('navigates on Studio click', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByText('Studio'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('navigates on Pipelines click', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByText('Pipelines'));
    expect(mockNavigate).toHaveBeenCalledWith('/pipelines');
  });

  it('navigates on Job Vacancies click for SUPER_ADMIN', () => {
    mockUser.current = { isLoading: false, role: 'SUPER_ADMIN' };
    render(<Sidebar />);
    fireEvent.click(screen.getByText('Job Vacancies'));
    expect(mockNavigate).toHaveBeenCalledWith('/admin/jobs');
  });

  it('calls logout on sign out click', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByText('Sign out'));
    expect(mockLogout.current?.logout).toHaveBeenCalledTimes(1);
  });

  it('shows signing-out label when isLoggingOut', () => {
    mockLogout.current = { isLoggingOut: true, logout: vi.fn() };
    render(<Sidebar />);
    expect(screen.getByText(/signing out/i)).toBeInTheDocument();
    const btn = screen.getByText(/signing out/i).closest('button');
    expect(btn).toBeDisabled();
  });

  it('shows sidebar toggle', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
  });

  it('applies open width class when isOpen', () => {
    const { container } = render(<Sidebar />);
    const aside = container.querySelector('aside');
    expect(aside?.className).toContain('w-64');
  });

  it('applies closed width class when closed', () => {
    mockSidebarOpen.value = false;
    const { container } = render(<Sidebar />);
    const aside = container.querySelector('aside');
    expect(aside?.className).toContain('w-15');
  });

  it('sets aria-current on active nav item', () => {
    render(<Sidebar />);
    const studioBtn = screen.getByText('Studio').closest('button');
    expect(studioBtn).toHaveAttribute('aria-current', 'page');
  });
});
