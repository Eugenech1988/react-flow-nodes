import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { useUser } from '@/shared/hooks';

vi.mock('@/shared/hooks', () => ({
  useUser: vi.fn(),
}));

vi.mock('@/shared/ui', () => ({
  GlobalLoader: () => <div data-testid="loader" />,
}));

const renderWithRouter = () =>
  render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<div data-testid="content" />} />
        </Route>
        <Route path="/login" element={<div data-testid="login" />} />
      </Routes>
    </MemoryRouter>,
  );

describe('ProtectedRoute', () => {
  it('renders loader when isLoading=true and isAuth=true', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: true, isAuth: true } as never);
    renderWithRouter();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('renders loader when isLoading=true and isAuth=false', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: true, isAuth: false } as never);
    renderWithRouter();
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('redirects to /login when isLoading=false and isAuth=false', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: false, isAuth: false } as never);
    renderWithRouter();
    expect(screen.getByTestId('login')).toBeInTheDocument();
  });

  it('renders content when isLoading=false and isAuth=true', () => {
    vi.mocked(useUser).mockReturnValue({ isLoading: false, isAuth: true } as never);
    renderWithRouter();
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });
});
