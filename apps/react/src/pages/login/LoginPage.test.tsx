import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

const {
  mockNavigate,
  mockSetSearchParams,
  mockUseAuthStore,
  mockFetchQuery,
  mockInvalidate,
  mockLogin,
  mockRegister,
  mockVerify,
  mockRequestReset,
  mockResetPassword,
  mockSetRecoveryError,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockSetSearchParams: vi.fn(),
  mockUseAuthStore: vi.fn(),
  mockFetchQuery: vi.fn(),
  mockInvalidate: vi.fn(),
  mockLogin: vi.fn(),
  mockRegister: vi.fn(),
  mockVerify: vi.fn(),
  mockRequestReset: vi.fn(),
  mockResetPassword: vi.fn(),
  mockSetRecoveryError: vi.fn(),
}));

const mockSearchParamsStore = { current: new URLSearchParams() };

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [mockSearchParamsStore.current, mockSetSearchParams],
  };
});

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidate,
    fetchQuery: mockFetchQuery,
  }),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    auth: { me: { queryFilter: () => ({}), queryOptions: () => ({}) } },
  }),
}));

vi.mock('./model/authStore', () => ({
  useAuthStore: Object.assign(() => mockUseAuthStore(), {
    getState: () => ({ setRecoveryError: mockSetRecoveryError }),
  }),
}));

vi.mock('./components', () => ({
  AuthModeToggle: ({ mode, onToggle }: unknown) => (
    <button onClick={onToggle} data-testid="toggle-mode">
      {mode}
    </button>
  ),
  TwoFactorForm: ({ onVerify }: unknown) => (
    <button onClick={() => onVerify({ code: '123' })} data-testid="two-factor-form">
      Verify
    </button>
  ),
  RecoveryForm: ({ onRequestSubmit, onResetSubmit, onBack }: unknown) => (
    <div data-testid="recovery-form">
      <button onClick={() => onRequestSubmit({ email: 'a@b.com' })} data-testid="req-reset">
        Request
      </button>
      <button
        onClick={() => onResetSubmit({ password: 'x', confirmPassword: 'x' })}
        data-testid="do-reset"
      >
        Reset
      </button>
      <button onClick={onBack} data-testid="back">
        Back
      </button>
    </div>
  ),
  AuthForm: ({ onLogin, onRegister, onForgotPassword, onSocialLogin }: unknown) => (
    <div data-testid="auth-form">
      <button onClick={() => onLogin({ email: 'a@b.com', password: 'p' })} data-testid="login">
        Login
      </button>
      <button
        onClick={() => onRegister({ email: 'a@b.com', password: 'p', confirmPassword: 'p' })}
        data-testid="register"
      >
        Register
      </button>
      <button onClick={onForgotPassword} data-testid="forgot">
        Forgot
      </button>
      <button onClick={onSocialLogin('google')} data-testid="google">
        Google
      </button>
    </div>
  ),
}));

vi.mock('@/assets/logo.svg', () => ({ default: 'logo.svg' }));

const defaultStore = {
  mode: 'login',
  is2faRequired: false,
  isLoading: false,
  apiError: null,
  twoFactorError: null,
  recoveryError: null,
  isRecoverySuccess: false,
  isRegistrationSuccess: false,
  setRegistrationSuccess: vi.fn(),
  login: mockLogin,
  register: mockRegister,
  verifyTwoFactor: mockVerify,
  requestPasswordReset: mockRequestReset,
  resetPassword: mockResetPassword,
  toggleMode: vi.fn(),
  resetState: vi.fn(),
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsStore.current = new URLSearchParams();
    mockUseAuthStore.mockReturnValue(defaultStore);
    mockFetchQuery.mockResolvedValue({ role: 'USER' });
  });

  const renderPage = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);

  it('renders login view by default', () => {
    renderPage();
    expect(screen.getByText('Welcome to the Pipeline Studio')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('renders 2FA view when required', () => {
    mockUseAuthStore.mockReturnValue({ ...defaultStore, is2faRequired: true });
    renderPage();
    expect(screen.getByText('Two-Factor Auth')).toBeInTheDocument();
    expect(screen.getByTestId('two-factor-form')).toBeInTheDocument();
  });

  it('handles login and redirects based on role', async () => {
    renderPage();
    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });
    expect(mockLogin).toHaveBeenCalledWith('a@b.com', 'p', expect.any(Function));

    const onSuccess = mockLogin.mock.calls[0][2];
    await act(async () => {
      await onSuccess();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('redirects admin to /admin/jobs', async () => {
    mockFetchQuery.mockResolvedValue({ role: 'CONTENT_MANAGER' });
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });
    const onSuccess = mockLogin.mock.calls[0][2];
    await act(async () => {
      await onSuccess();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin/jobs', { replace: true });
  });

  it('switches to recovery mode and handles request', async () => {
    renderPage();
    fireEvent.click(screen.getByTestId('forgot'));

    expect(screen.getByText('Reset Password')).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId('req-reset'));
    });
    expect(mockRequestReset).toHaveBeenCalledWith('a@b.com');
  });

  it('handles social login', () => {
    const originalLocation = window.location;
    Object.defineProperty(window, 'location', { configurable: true, value: { href: '' } });

    renderPage();
    fireEvent.click(screen.getByTestId('google'));

    expect(window.location.href).toContain('/auth/google');
    Object.defineProperty(window, 'location', { configurable: true, value: originalLocation });
  });

  it('renders recovery directly when ?token= present', () => {
    mockSearchParamsStore.current = new URLSearchParams('?token=valid');
    renderPage();

    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByTestId('recovery-form')).toBeInTheDocument();
    expect(screen.queryByTestId('auth-form')).not.toBeInTheDocument();
  });

  it('handles reset password submission with token', async () => {
    mockSearchParamsStore.current = new URLSearchParams('?token=valid');
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByTestId('do-reset'));
    });

    expect(mockResetPassword).toHaveBeenCalledWith('valid', 'x', expect.any(Function));
  });

  it('handles reset password missing token', async () => {
    renderPage();
    fireEvent.click(screen.getByTestId('forgot'));

    await act(async () => {
      fireEvent.click(screen.getByTestId('do-reset'));
    });

    expect(mockResetPassword).not.toHaveBeenCalled();
    expect(mockSetRecoveryError).toHaveBeenCalledWith(
      'Password reset token is missing or invalid.',
    );
  });

  it('handles 2FA verify success', async () => {
    mockUseAuthStore.mockReturnValue({ ...defaultStore, is2faRequired: true });
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByTestId('two-factor-form'));
    });

    expect(mockVerify).toHaveBeenCalledWith({ code: '123' }, expect.any(Function));
  });

  it('handles recovery back button', () => {
    renderPage();
    fireEvent.click(screen.getByTestId('forgot'));
    fireEvent.click(screen.getByTestId('back'));

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('shows registration success banner', () => {
    mockUseAuthStore.mockReturnValue({ ...defaultStore, isRegistrationSuccess: true });
    renderPage();
    expect(screen.getByText('Registered successfully! Please sign in.')).toBeInTheDocument();
  });
});

describe('LoginPage — final branches', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsStore.current = new URLSearchParams();
    mockUseAuthStore.mockReturnValue(defaultStore);
    mockFetchQuery.mockResolvedValue({ role: 'USER' });
  });

  const renderPage = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);

  it('handleToggleMode resets registration success and toggles', () => {
    const setRegSuccess = vi.fn();
    const toggle = vi.fn();
    mockUseAuthStore.mockReturnValue({
      ...defaultStore,
      setRegistrationSuccess: setRegSuccess,
      toggleMode: toggle,
    });

    renderPage();
    fireEvent.click(screen.getByTestId('toggle-mode'));

    expect(setRegSuccess).toHaveBeenCalledWith(false);
    expect(toggle).toHaveBeenCalled();
  });

  it('redirects SUPER_ADMIN to /admin/jobs', async () => {
    mockFetchQuery.mockResolvedValue({ role: 'SUPER_ADMIN' });
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });
    const onSuccess = mockLogin.mock.calls[0][2];
    await act(async () => {
      await onSuccess();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin/jobs', { replace: true });
  });

  it('handles recovery back (no token) — resets and exits recovery', () => {
    renderPage();
    fireEvent.click(screen.getByTestId('forgot'));
    fireEvent.click(screen.getByTestId('back'));

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('handles recovery back (with token) — clears search params', () => {
    mockSearchParamsStore.current = new URLSearchParams('?token=valid');
    renderPage();

    fireEvent.click(screen.getByTestId('back'));

    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });
});
