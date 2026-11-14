import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NotFoundPage } from './NotFoundPage';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, onClick }: unknown) => <button onClick={onClick}>{text}</button>,
}));

vi.mock('@/assets/logo.svg', () => ({ default: 'logo.svg' }));

describe('NotFoundPage', () => {
  it('renders 404 text', () => {
    render(<NotFoundPage />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('navigates to home on button click', () => {
    render(<NotFoundPage />);
    fireEvent.click(screen.getByText('Back to App'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

describe('NotFoundPage — edge cases', () => {
  it('renders logo image', () => {
    render(<NotFoundPage />);
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });
});
