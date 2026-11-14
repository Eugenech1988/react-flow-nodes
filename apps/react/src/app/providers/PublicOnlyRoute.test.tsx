import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { useUser } from '@/shared/hooks';

vi.mock('@/shared/hooks', () => ({
  useUser: vi.fn(),
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<div data-testid="login" />} />
        </Route>
        <Route path="/" element={<div data-testid="home" />} />
        <Route path="/admin/jobs" element={<div data-testid="admin" />} />
      </Routes>
    </MemoryRouter>,
  );

describe('PublicOnlyRoute', () => {
  it('renders children when not authenticated', () => {
    vi.mocked(useUser).mockReturnValue({ isAuth: false, role: null } as never);
    renderWithRouter();
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('redirects USER to home when authenticated', () => {
    vi.mocked(useUser).mockReturnValue({ isAuth: true, role: 'USER' } as never);
    renderWithRouter();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('redirects CONTENT_MANAGER to /admin/jobs', () => {
    vi.mocked(useUser).mockReturnValue({ isAuth: true, role: 'CONTENT_MANAGER' } as never);
    renderWithRouter();
    expect(screen.getByTestId('admin')).toBeInTheDocument();
  });

  it('redirects SUPER_ADMIN to /admin/jobs', () => {
    vi.mocked(useUser).mockReturnValue({ isAuth: true, role: 'SUPER_ADMIN' } as never);
    renderWithRouter();
    expect(screen.getByTestId('admin')).toBeInTheDocument();
  });

  it('redirects to / when authenticated but role is null', () => {
    vi.mocked(useUser).mockReturnValue({ isAuth: true, role: null } as never);
    renderWithRouter();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('redirects to / when authenticated but role is USER (not admin)', () => {
    vi.mocked(useUser).mockReturnValue({ isAuth: true, role: 'USER' } as never);
    renderWithRouter();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});
