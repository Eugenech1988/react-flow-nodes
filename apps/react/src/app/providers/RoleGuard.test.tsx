import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RoleGuard } from './RoleGuard';
import { useUser } from '@/shared/hooks';

vi.mock('@/shared/hooks', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/shared/ui', () => ({
  GlobalLoader: () => <div data-testid="loader" />,
}));

const renderWithRouter = (allowedRoles: Array<'USER' | 'CONTENT_MANAGER' | 'SUPER_ADMIN'>) =>
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<RoleGuard allowedRoles={allowedRoles} />}>
          <Route path="/protected" element={<div data-testid="content" />} />
        </Route>
        <Route path="/" element={<div data-testid="home" />} />
        <Route path="/login" element={<div data-testid="login" />} />
      </Routes>
    </MemoryRouter>,
  );

describe('RoleGuard', () => {
  it('renders loader when isLoading=true (isAuth=false)', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: true,
      isAuth: false,
      role: null,
    } as never);
    renderWithRouter(['SUPER_ADMIN']);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders loader when isLoading=true (isAuth=true)', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: true,
      isAuth: true,
      role: 'SUPER_ADMIN',
    } as never);
    renderWithRouter(['SUPER_ADMIN']);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: false,
      isAuth: false,
      role: null,
    } as never);
    renderWithRouter(['SUPER_ADMIN']);
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('redirects to / when role is null but authenticated', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: false,
      isAuth: true,
      role: null,
    } as never);
    renderWithRouter(['SUPER_ADMIN']);
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('redirects to / when role is not allowed', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: false,
      isAuth: true,
      role: 'USER',
    } as never);
    renderWithRouter(['SUPER_ADMIN']);
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('renders content when role is in allowedRoles (single)', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: false,
      isAuth: true,
      role: 'SUPER_ADMIN',
    } as never);
    renderWithRouter(['SUPER_ADMIN']);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders content when role is in allowedRoles (multiple)', () => {
    vi.mocked(useUser).mockReturnValue({
      isLoading: false,
      isAuth: true,
      role: 'CONTENT_MANAGER',
    } as never);
    renderWithRouter(['CONTENT_MANAGER', 'SUPER_ADMIN']);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
