import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthForm } from './AuthForm';

vi.mock('./SocialLoginButtons', () => ({
  SocialLoginButtons: ({ onGoogleClick, onGithubClick }: unknown) => (
    <div>
      <button onClick={onGoogleClick}>Google</button>
      <button onClick={onGithubClick}>GitHub</button>
    </div>
  ),
}));

vi.mock('./LoginFields', () => ({
  LoginFields: () => <div data-testid="login-fields" />,
}));

vi.mock('./RegisterFields', () => ({
  RegisterFields: () => <div data-testid="register-fields" />,
}));

vi.mock('@/shared/ui', () => ({
  AppButton: ({ text, type }: unknown) => <button type={type}>{text}</button>,
}));

describe('AuthForm', () => {
  const defaultProps = {
    mode: 'login' as const,
    currentApiError: null,
    onLogin: vi.fn(),
    onRegister: vi.fn(),
    onSocialLogin: vi.fn(() => vi.fn()),
    onForgotPassword: vi.fn(),
  };

  it('renders login form by default', () => {
    render(<AuthForm {...defaultProps} />);
    expect(screen.getByTestId('login-fields')).toBeInTheDocument();
    expect(screen.getByText('Authenticate Access')).toBeInTheDocument();
  });

  it('renders register form when mode is register', () => {
    render(<AuthForm {...defaultProps} mode="register" />);
    expect(screen.getByTestId('register-fields')).toBeInTheDocument();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  it('shows API error', () => {
    render(<AuthForm {...defaultProps} currentApiError="Invalid password" />);
    expect(screen.getByText('Invalid password')).toBeInTheDocument();
  });

  it('triggers onForgotPassword', () => {
    render(<AuthForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Forgot Password?'));
    expect(defaultProps.onForgotPassword).toHaveBeenCalled();
  });

  it('calls onSocialLogin factory', () => {
    render(<AuthForm {...defaultProps} />);
    fireEvent.click(screen.getByText('Google'));
    expect(defaultProps.onSocialLogin).toHaveBeenCalledWith('google');
  });
});
