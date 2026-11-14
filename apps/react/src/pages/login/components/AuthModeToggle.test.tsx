import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthModeToggle } from './AuthModeToggle';

vi.mock('@pipeline/ui', () => ({
  Button: ({ children, onClick }: unknown) => <button onClick={onClick}>{children}</button>,
}));

describe('AuthModeToggle', () => {
  it('renders login mode', () => {
    render(<AuthModeToggle mode="login" onToggle={vi.fn()} />);
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it('renders register mode', () => {
    render(<AuthModeToggle mode="register" onToggle={vi.fn()} />);
    expect(screen.getByText('Already registered?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('calls onToggle', () => {
    const onToggle = vi.fn();
    render(<AuthModeToggle mode="login" onToggle={onToggle} />);
    fireEvent.click(screen.getByText('Sign up'));
    expect(onToggle).toHaveBeenCalled();
  });
});
