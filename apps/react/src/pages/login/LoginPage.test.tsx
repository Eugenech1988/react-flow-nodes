import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

interface IAuthStoreMock {
  mode: 'login' | 'register';
  is2faRequired: boolean;
  isLoading: boolean;
  apiError: string | null;
  twoFactorError: string | null;
  recoveryError: string | null;
  isRecoverySuccess: boolean;
  isRegistrationSuccess: boolean;
  setRegistrationSuccess: ReturnType<typeof vi.fn>;
  login: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  verifyTwoFactor: ReturnType<typeof vi.fn>;
  requestPasswordReset: ReturnType<typeof vi.fn>;
  resetPassword: ReturnType<typeof vi.fn>;
  toggleMode: ReturnType<typeof vi.fn>;
  resetState: ReturnType<typeof vi.fn>;
}

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
  mockNavigate: vi.fn<(path: string, opts: { replace: boolean }) => void>(),
  mockSetSearchParams: vi.fn<(params: URLSearchParams, opts: { replace: boolean }) => void>(),
  mockUseAuthStore: vi.fn<() => IAuthStoreMock>(),
  mockFetchQuery: vi.fn<() => Promise<{ role: string }>>(),
  mockInvalidate: vi.fn<() => void>(),
  mockLogin: vi.fn<(email: string, password: string, onSuccess: () => Promise<void>) => void>(),
  mockRegister: vi.fn<(email: string, password: string, onSuccess: () => void) => void>(),
  mockVerify: vi.fn<(data: { code: string }, onSuccess: () => Promise<void>) => void>(),
  mockRequestReset: vi.fn<(email: string) => Promise<void>>(),
  mockResetPassword: vi.fn<(token: string, pwd: string, onSuccess: () => void) => void>(),
  mockSetRecoveryError: vi.fn<(message: string) => void>(),
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
  AuthModeToggle: ({ mode, onToggle }: { mode: string; onToggle: () => void }) => (
    <button onClick={onToggle} data-testid="toggle-mode">
      {mode}
    </button>
  ),
  TwoFactorForm: ({ onVerify }: { onVerify: (d: { code: string }) => void }) => (
    <button onClick={() => onVerify({ code: '123' })} data-testid="two-factor-form">
      Verify
    </button>
  ),
  RecoveryForm: ({
    onRequestSubmit,
    onResetSubmit,
    onBack,
  }: {
    onRequestSubmit: (d: { email: string }) => void;
    onResetSubmit: (d: { password: string; confirmPassword: string }) => void;
    onBack: () => void;
  }) => (
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
  AuthForm: ({
    onLogin,
    onRegister,
    onForgotPassword,
    onSocialLogin,
  }: {
    onLogin: (d: { email: string; password: string }) => void;
    onRegister: (d: { email: string; password: string; confirmPassword: string }) => void;
    onForgotPassword: () => void;
    onSocialLogin: (p: 'google' | 'github') => (e: React.MouseEvent) => void;
  }) => (
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

const createDefaultStore = (overrides: Partial<IAuthStoreMock> = {}): IAuthStoreMock => ({
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
  ...overrides,
});

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParamsStore.current = new URLSearchParams();
    mockUseAuthStore.mockReturnValue(createDefaultStore());
    mockFetchQuery.mockResolvedValue({ role: 'USER' });
  });

  const renderPage = () => render(<MemoryRouter><LoginPage /></MemoryRouter>);

  it('renders login view by default', () => {
    renderPage();
    expect(screen.getByText('Welcome to the Pipeline Studio')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });

  it('renders 2FA view when required', () => {
    mockUseAuthStore.mockReturnValue(createDefaultStore({ is2faRequired: true }));
    renderPage();
    expect(screen.getByText('Two-Factor Auth')).toBeInTheDocument();
    expect(screen.getByTestId('two-factor-form')).toBeInTheDocument();
  });

  it('handles login and redirects USER to /', async () => {
    renderPage();
    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });
    const onSuccess = mockLogin.mock.calls[0][2];
    await act(async () => {
      await onSuccess();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('redirects CONTENT_MANAGER to /admin/jobs', async () => {
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

  it('redirects SUPER_ADMIN to / (unified with HomeRoute)', async () => {
    mockFetchQuery.mockResolvedValue({ role: 'SUPER_ADMIN' });
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });
    const onSuccess = mockLogin.mock.calls[0][2];
    await act(async () => {
      await onSuccess();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
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
    mockUseAuthStore.mockReturnValue(createDefaultStore({ is2faRequired: true }));
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
    mockUseAuthStore.mockReturnValue(
      createDefaultStore({ isRegistrationSuccess: true }),
    );
    renderPage();
    expect(screen.getByText('Registered successfully! Please sign in.')).toBeInTheDocument();
  });

  it('handleToggleMode resets registration success and toggles', () => {
    const setRegSuccess = vi.fn();
    const toggle = vi.fn();
    mockUseAuthStore.mockReturnValue(
      createDefaultStore({ setRegistrationSuccess: setRegSuccess, toggleMode: toggle }),
    );

    renderPage();
    fireEvent.click(screen.getByTestId('toggle-mode'));

    expect(setRegSuccess).toHaveBeenCalledWith(false);
    expect(toggle).toHaveBeenCalled();
  });

  it('handles recovery back (with token) — clears search params', () => {
    mockSearchParamsStore.current = new URLSearchParams('?token=valid');
    renderPage();

    fireEvent.click(screen.getByTestId('back'));

    expect(mockSetSearchParams).toHaveBeenCalledWith({}, { replace: true });
  });

  it('calls resetState on successful redirect', async () => {
    const resetState = vi.fn();
    mockUseAuthStore.mockReturnValue(createDefaultStore({ resetState }));
    renderPage();

    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });
    const onSuccess = mockLogin.mock.calls[0][2];
    await act(async () => {
      await onSuccess();
    });

    expect(resetState).toHaveBeenCalled();
  });
});
