import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from './authStore';

interface IAuthMocks {
  login: ReturnType<typeof vi.fn>;
  register: ReturnType<typeof vi.fn>;
  loginWith2fa: ReturnType<typeof vi.fn>;
  requestPasswordReset: ReturnType<typeof vi.fn>;
  resetPassword: ReturnType<typeof vi.fn>;
}

const mocks = vi.hoisted<IAuthMocks>(() => ({
  login: vi.fn(),
  register: vi.fn(),
  loginWith2fa: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  trpcClient: {
    auth: {
      login: { mutate: mocks.login },
      register: { mutate: mocks.register },
      loginWith2fa: { mutate: mocks.loginWith2fa },
      requestPasswordReset: { mutate: mocks.requestPasswordReset },
      resetPassword: { mutate: mocks.resetPassword },
    },
  },
}));

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.getState().resetState();
    useAuthStore.setState({ mode: 'login', isLoading: false });
  });

  it('toggles mode', () => {
    useAuthStore.getState().toggleMode();
    expect(useAuthStore.getState().mode).toBe('register');
    useAuthStore.getState().toggleMode();
    expect(useAuthStore.getState().mode).toBe('login');
  });

  it('setMode sets explicit mode', () => {
    useAuthStore.getState().setMode('register');
    expect(useAuthStore.getState().mode).toBe('register');
  });

  it('setApiError sets apiError', () => {
    useAuthStore.getState().setApiError('boom');
    expect(useAuthStore.getState().apiError).toBe('boom');
  });

  it('setTwoFactorError sets twoFactorError', () => {
    useAuthStore.getState().setTwoFactorError('bad code');
    expect(useAuthStore.getState().twoFactorError).toBe('bad code');
  });

  it('setRecoveryError sets recoveryError', () => {
    useAuthStore.getState().setRecoveryError('invalid');
    expect(useAuthStore.getState().recoveryError).toBe('invalid');
  });

  it('setRegistrationSuccess sets flag', () => {
    useAuthStore.getState().setRegistrationSuccess(true);
    expect(useAuthStore.getState().isRegistrationSuccess).toBe(true);
  });

  it('handleLoginResponse sets 2FA state', () => {
    const result = useAuthStore.getState().handleLoginResponse({
      isTwoFactorRequired: true,
      tempToken: 'temp',
      qrCodeImage: 'qr',
      secret: 'sec',
    });
    expect(result).toBe(true);
    expect(useAuthStore.getState().is2faRequired).toBe(true);
    expect(useAuthStore.getState().tempToken).toBe('temp');
    expect(useAuthStore.getState().qrCodeImage).toBe('qr');
    expect(useAuthStore.getState().secretKey).toBe('sec');
  });

  it('handleLoginResponse returns false if no 2FA', () => {
    const result = useAuthStore.getState().handleLoginResponse({});
    expect(result).toBe(false);
  });

  describe('login', () => {
    it('handles successful login', async () => {
      mocks.login.mockResolvedValue({ user: { role: 'USER' } });
      const onSuccess = vi.fn();

      const result = await useAuthStore.getState().login('a@b.com', 'pass', onSuccess);

      expect(mocks.login).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' });
      expect(onSuccess).toHaveBeenCalled();
      expect(result).toEqual({ role: 'USER' });
      expect(useAuthStore.getState().isLoading).toBe(false);
    });

    it('handles 2FA required response', async () => {
      mocks.login.mockResolvedValue({ isTwoFactorRequired: true, tempToken: 't' });
      const onSuccess = vi.fn();

      const result = await useAuthStore.getState().login('a@b.com', 'pass', onSuccess);

      expect(result).toBeNull();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(useAuthStore.getState().is2faRequired).toBe(true);
    });

    it('maps invalid credentials to friendly message', async () => {
      mocks.login.mockRejectedValue(new Error('invalid credentials'));
      await useAuthStore.getState().login('a@b.com', 'pass', vi.fn());
      expect(useAuthStore.getState().apiError).toBe('Invalid email address or password.');
    });

    it('maps wrong password to same friendly message', async () => {
      mocks.login.mockRejectedValue(new Error('wrong password'));
      await useAuthStore.getState().login('a@b.com', 'pass', vi.fn());
      expect(useAuthStore.getState().apiError).toBe('Invalid email address or password.');
    });

    it('maps network error', async () => {
      mocks.login.mockRejectedValue(new Error('Failed to fetch'));
      await useAuthStore.getState().login('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'Network error. Please check your internet connection.',
      );
    });

    it('maps network keyword', async () => {
      mocks.login.mockRejectedValue(new Error('Network unreachable'));
      await useAuthStore.getState().login('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'Network error. Please check your internet connection.',
      );
    });

    it('returns null when response has no user', async () => {
      mocks.login.mockResolvedValue({});
      const result = await useAuthStore.getState().login('a@b.com', 'p', vi.fn());
      expect(result).toBeNull();
    });

    it('uses fallback for non-Error throw', async () => {
      mocks.login.mockRejectedValue('string-error');
      await useAuthStore.getState().login('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'Unable to sign in. Please verify your credentials and try again.',
      );
    });

    it('falls through to error.message for unmatched', async () => {
      mocks.login.mockRejectedValue(new Error('Custom message'));
      await useAuthStore.getState().login('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe('Custom message');
    });

    it('does not fail login when onSuccess throws', async () => {
      mocks.login.mockResolvedValue({ user: { role: 'USER' } });
      const onSuccess = vi.fn().mockRejectedValue(new Error('onSuccess failed'));
      vi.spyOn(console, 'error').mockImplementation(() => {});

      await useAuthStore.getState().login('a@b.com', 'pass', onSuccess);

      expect(console.error).toHaveBeenCalledWith('Post-auth step failed:', expect.any(Error));
    });
  });

  describe('register', () => {
    it('handles successful registration', async () => {
      mocks.register.mockResolvedValue({});
      const onSuccess = vi.fn();
      await useAuthStore.getState().register('a@b.com', 'pass', onSuccess);
      expect(mocks.register).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' });
      expect(useAuthStore.getState().isRegistrationSuccess).toBe(true);
      expect(useAuthStore.getState().mode).toBe('login');
      expect(onSuccess).toHaveBeenCalled();
    });

    it('maps "already exists" to friendly message', async () => {
      mocks.register.mockRejectedValue(new Error('User already exists'));
      await useAuthStore.getState().register('a@b.com', 'pass', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'An account with this email address already exists.',
      );
    });

    it('maps "conflict" to friendly message', async () => {
      mocks.register.mockRejectedValue(new Error('CONFLICT'));
      await useAuthStore.getState().register('a@b.com', 'pass', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'An account with this email address already exists.',
      );
    });

    it('maps network error', async () => {
      mocks.register.mockRejectedValue(new Error('Failed to fetch'));
      await useAuthStore.getState().register('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'Network error. Please check your internet connection.',
      );
    });

    it('uses fallback for non-Error throw', async () => {
      mocks.register.mockRejectedValue('string-error');
      await useAuthStore.getState().register('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe(
        'Registration failed. Please try again later.',
      );
    });

    it('falls through to error.message for unmatched', async () => {
      mocks.register.mockRejectedValue(new Error('Unexpected'));
      await useAuthStore.getState().register('a@b.com', 'p', vi.fn());
      expect(useAuthStore.getState().apiError).toBe('Unexpected');
    });
  });

  describe('verifyTwoFactor', () => {
    it('handles missing temp token', async () => {
      useAuthStore.setState({ tempToken: null });
      await useAuthStore.getState().verifyTwoFactor({ code: '123' }, vi.fn());
      expect(useAuthStore.getState().twoFactorError).toBe(
        'Verification session has expired. Please sign in again.',
      );
    });

    it('handles successful 2FA verification', async () => {
      useAuthStore.setState({ tempToken: 'token' });
      mocks.loginWith2fa.mockResolvedValue({});
      const onSuccess = vi.fn();

      await useAuthStore.getState().verifyTwoFactor({ code: '123456' }, onSuccess);

      expect(mocks.loginWith2fa).toHaveBeenCalledWith({
        tempToken: 'token',
        code: '123456',
      });
      expect(useAuthStore.getState().is2faRequired).toBe(false);
      expect(onSuccess).toHaveBeenCalled();
    });

    it('maps expired code', async () => {
      useAuthStore.setState({ tempToken: 'token' });
      mocks.loginWith2fa.mockRejectedValue(new Error('Code expired'));
      await useAuthStore.getState().verifyTwoFactor({ code: '123' }, vi.fn());
      expect(useAuthStore.getState().twoFactorError).toBe(
        'The verification code has expired. Please request a new one.',
      );
    });

    it('maps network error', async () => {
      useAuthStore.setState({ tempToken: 'token' });
      mocks.loginWith2fa.mockRejectedValue(new Error('Failed to fetch'));
      await useAuthStore.getState().verifyTwoFactor({ code: '123' }, vi.fn());
      expect(useAuthStore.getState().twoFactorError).toBe(
        'Network error. Please check your internet connection.',
      );
    });

    it('uses fallback for unmatched Error', async () => {
      useAuthStore.setState({ tempToken: 'token' });
      mocks.loginWith2fa.mockRejectedValue(new Error('whatever'));
      await useAuthStore.getState().verifyTwoFactor({ code: '123' }, vi.fn());
      expect(useAuthStore.getState().twoFactorError).toBe('whatever');
    });

    it('falls back to non-Error fallback message', async () => {
      useAuthStore.setState({ tempToken: 'token' });
      mocks.loginWith2fa.mockRejectedValue('string');
      await useAuthStore.getState().verifyTwoFactor({ code: '123' }, vi.fn());
      expect(useAuthStore.getState().twoFactorError).toBe(
        'Invalid two-factor authentication code.',
      );
    });

    it('handles onSuccess throw', async () => {
      useAuthStore.setState({ tempToken: 'token' });
      mocks.loginWith2fa.mockResolvedValue({});
      const onSuccess = vi.fn().mockRejectedValue(new Error('post2fa failed'));
      vi.spyOn(console, 'error').mockImplementation(() => {});
      await useAuthStore.getState().verifyTwoFactor({ code: '123' }, onSuccess);
      expect(console.error).toHaveBeenCalledWith('Post-2FA step failed:', expect.any(Error));
    });
  });

  describe('requestPasswordReset', () => {
    it('handles success', async () => {
      mocks.requestPasswordReset.mockResolvedValue({});
      await useAuthStore.getState().requestPasswordReset('a@b.com');
      expect(useAuthStore.getState().isRecoverySuccess).toBe(true);
    });

    it('maps "not found"', async () => {
      mocks.requestPasswordReset.mockRejectedValue(new Error('User not found'));
      await useAuthStore.getState().requestPasswordReset('a@b.com');
      expect(useAuthStore.getState().recoveryError).toBe(
        'No account found with this email address.',
      );
    });

    it('maps "does not exist"', async () => {
      mocks.requestPasswordReset.mockRejectedValue(new Error('Account does not exist'));
      await useAuthStore.getState().requestPasswordReset('a@b.com');
      expect(useAuthStore.getState().recoveryError).toBe(
        'No account found with this email address.',
      );
    });

    it('maps network error', async () => {
      mocks.requestPasswordReset.mockRejectedValue(new Error('Failed to fetch'));
      await useAuthStore.getState().requestPasswordReset('a@b.com');
      expect(useAuthStore.getState().recoveryError).toBe(
        'Network error. Please check your internet connection.',
      );
    });

    it('uses fallback for non-Error', async () => {
      mocks.requestPasswordReset.mockRejectedValue('string-error');
      await useAuthStore.getState().requestPasswordReset('a@b.com');
      expect(useAuthStore.getState().recoveryError).toBe(
        'Failed to send password reset email. Please try again.',
      );
    });

    it('falls through to error.message', async () => {
      mocks.requestPasswordReset.mockRejectedValue(new Error('Unexpected'));
      await useAuthStore.getState().requestPasswordReset('a@b.com');
      expect(useAuthStore.getState().recoveryError).toBe('Unexpected');
    });
  });

  describe('resetPassword', () => {
    it('handles reset success', async () => {
      mocks.resetPassword.mockResolvedValue({});
      const onSuccess = vi.fn();
      await useAuthStore.getState().resetPassword('token', 'newpass', onSuccess);
      expect(onSuccess).toHaveBeenCalled();
    });

    it('maps invalid token', async () => {
      mocks.resetPassword.mockRejectedValue(new Error('Invalid token'));
      await useAuthStore.getState().resetPassword('token', 'newpass', vi.fn());
      expect(useAuthStore.getState().recoveryError).toBe(
        'The password reset link is invalid or has expired.',
      );
    });

    it('maps expired token', async () => {
      mocks.resetPassword.mockRejectedValue(new Error('Token expired'));
      await useAuthStore.getState().resetPassword('token', 'newpass', vi.fn());
      expect(useAuthStore.getState().recoveryError).toBe(
        'The password reset link is invalid or has expired.',
      );
    });

    it('maps network error', async () => {
      mocks.resetPassword.mockRejectedValue(new Error('Failed to fetch'));
      await useAuthStore.getState().resetPassword('t', 'p', vi.fn());
      expect(useAuthStore.getState().recoveryError).toBe(
        'Network error. Please check your internet connection.',
      );
    });

    it('uses fallback for non-Error', async () => {
      mocks.resetPassword.mockRejectedValue('string-error');
      await useAuthStore.getState().resetPassword('t', 'p', vi.fn());
      expect(useAuthStore.getState().recoveryError).toBe(
        'Failed to reset password. The link may have expired.',
      );
    });

    it('falls through to error.message', async () => {
      mocks.resetPassword.mockRejectedValue(new Error('Unexpected'));
      await useAuthStore.getState().resetPassword('t', 'p', vi.fn());
      expect(useAuthStore.getState().recoveryError).toBe('Unexpected');
    });
  });

  describe('resetState', () => {
    it('clears all error and 2FA fields', () => {
      useAuthStore.setState({
        apiError: 'e1',
        twoFactorError: 'e2',
        recoveryError: 'e3',
        is2faRequired: true,
        tempToken: 'tt',
        qrCodeImage: 'qr',
        secretKey: 'sk',
        isRecoverySuccess: true,
        isRegistrationSuccess: true,
      });

      useAuthStore.getState().resetState();

      const state = useAuthStore.getState();
      expect(state.apiError).toBeNull();
      expect(state.twoFactorError).toBeNull();
      expect(state.recoveryError).toBeNull();
      expect(state.is2faRequired).toBe(false);
      expect(state.tempToken).toBeNull();
      expect(state.qrCodeImage).toBeNull();
      expect(state.secretKey).toBeNull();
      expect(state.isRecoverySuccess).toBe(false);
      expect(state.isRegistrationSuccess).toBe(false);
    });
  });
});
