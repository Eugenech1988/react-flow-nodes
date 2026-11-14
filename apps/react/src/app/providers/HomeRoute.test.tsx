import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HomeRoute } from './HomeRoute';
import { useUser } from '@/shared/hooks';

vi.mock('@/shared/hooks', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/shared/ui', () => ({
  GlobalLoader: () => <div data-testid="loader" />,
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<HomeRoute />}>
          <Route path="/" element={<div data-testid="home" />} />
        </Route>
        <Route path="/admin/jobs" element={<div data-testid="admin" />} />
      </Routes>
    </MemoryRouter>,
  );

describe('HomeRoute', () => {
  it('renders loader when isLoading=true (role=null)', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: true, role: null } as never);
    renderWithRouter();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders loader when isLoading=true (role=CONTENT_MANAGER)', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: true, role: 'CONTENT_MANAGER' } as never);
    renderWithRouter();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('redirects CONTENT_MANAGER to /admin/jobs', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: false, role: 'CONTENT_MANAGER' } as never);
    renderWithRouter();
    expect(screen.getByTestId('admin')).toBeInTheDocument();
  });

  it('renders children for USER', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: false, role: 'USER' } as never);
    renderWithRouter();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('renders children for SUPER_ADMIN', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: false, role: 'SUPER_ADMIN' } as never);
    renderWithRouter();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('renders children when role is null', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: false, role: null } as never);
    renderWithRouter();
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });
});
