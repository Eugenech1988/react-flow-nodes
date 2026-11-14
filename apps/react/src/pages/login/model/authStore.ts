import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import type { FormMode, LoginResponseData } from './types';

type TMatcher = [RegExp, string];

interface AuthState {
  mode: FormMode;
  is2faRequired: boolean;
  tempToken: string | null;
  qrCodeImage: string | null;
  secretKey: string | null;
  apiError: string | null;
  twoFactorError: string | null;
  recoveryError: string | null;
  isRecoverySuccess: boolean;
  isRegistrationSuccess: boolean;
  isLoading: boolean;

  setMode: (mode: FormMode) => void;
  toggleMode: () => void;
  setApiError: (error: string | null) => void;
  setTwoFactorError: (error: string | null) => void;
  setRecoveryError: (error: string | null) => void;
  setRegistrationSuccess: (success: boolean) => void;
  resetState: () => void;
  handleLoginResponse: (data: LoginResponseData) => boolean;
  login: (
    email: string,
    password: string,
    onSuccess: () => Promise<void> | void,
  ) => Promise<{ role: string } | null>;
  register: (
    email: string,
    password: string,
    onSuccess: () => Promise<void> | void,
  ) => Promise<void>;
  verifyTwoFactor: (
    data: { code: string; tempToken?: string },
    onSuccess: () => Promise<void> | void,
  ) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, onSuccess: () => void) => Promise<void>;
}

const NETWORK_MESSAGE = 'Network error. Please check your internet connection.';
const NETWORK_MATCHERS: TMatcher[] = [[/network|failed to fetch/, NETWORK_MESSAGE]];

const LOGIN_SPECIFIC: TMatcher[] = [
  [/invalid credentials|wrong password|user not found/, 'Invalid email address or password.'],
];

const REGISTER_SPECIFIC: TMatcher[] = [
  [/already exists|conflict/, 'An account with this email address already exists.'],
];

const TWO_FA_SPECIFIC: TMatcher[] = [
  [/expired/, 'The verification code has expired. Please request a new one.'],
];

const REQUEST_RESET_SPECIFIC: TMatcher[] = [
  [/not found|does not exist/, 'No account found with this email address.'],
];

const RESET_PASSWORD_SPECIFIC: TMatcher[] = [
  [/invalid|expired/, 'The password reset link is invalid or has expired.'],
];

const mapAuthError = (error: unknown, fallback: string, matchers: TMatcher[]): string => {
  if (!(error instanceof Error)) return fallback;
  const msg = error.message.toLowerCase();
  for (const [re, text] of matchers) {
    if (re.test(msg)) return text;
  }
  return error.message || fallback;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  mode: 'login',
  is2faRequired: false,
  tempToken: null,
  qrCodeImage: null,
  secretKey: null,
  apiError: null,
  twoFactorError: null,
  recoveryError: null,
  isRecoverySuccess: false,
  isRegistrationSuccess: false,
  isLoading: false,

  setMode: (mode) => set({ mode }),
  toggleMode: () => {
    const { mode } = get();
    set({
      mode: mode === 'login' ? 'register' : 'login',
      apiError: null,
      twoFactorError: null,
      recoveryError: null,
      isRecoverySuccess: false,
      isRegistrationSuccess: false,
      is2faRequired: false,
      tempToken: null,
      qrCodeImage: null,
      secretKey: null,
    });
  },
  setApiError: (error) => set({ apiError: error }),
  setTwoFactorError: (error) => set({ twoFactorError: error }),
  setRecoveryError: (error) => set({ recoveryError: error }),
  setRegistrationSuccess: (success) => set({ isRegistrationSuccess: success }),

  resetState: () =>
    set({
      is2faRequired: false,
      tempToken: null,
      qrCodeImage: null,
      secretKey: null,
      twoFactorError: null,
      apiError: null,
      recoveryError: null,
      isRecoverySuccess: false,
      isRegistrationSuccess: false,
    }),

  handleLoginResponse: (data) => {
    if (data?.isTwoFactorRequired) {
      set({
        is2faRequired: true,
        tempToken: data.tempToken || null,
        qrCodeImage: data.qrCodeImage || null,
        secretKey: data.secret || null,
      });
      return true;
    }
    return false;
  },

  login: async (email, password, onSuccess) => {
    set({ isLoading: true, apiError: null, twoFactorError: null, isRegistrationSuccess: false });
    try {
      const response = await trpcClient.auth.login.mutate({ email, password });
      const requires2fa = get().handleLoginResponse(response);
      if (requires2fa) return null;

      try {
        await onSuccess();
      } catch (postAuthErr) {
        console.error('Post-auth step failed:', postAuthErr);
      }

      const user = (response as { user?: { role?: string } }).user;
      return user ? { role: user.role ?? 'USER' } : null;
    } catch (error) {
      set({
        apiError: mapAuthError(
          error,
          'Unable to sign in. Please verify your credentials and try again.',
          [...LOGIN_SPECIFIC, ...NETWORK_MATCHERS],
        ),
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, onSuccess) => {
    set({ isLoading: true, apiError: null, isRegistrationSuccess: false });
    try {
      await trpcClient.auth.register.mutate({ email, password });
      set({ isRegistrationSuccess: true });
      get().setMode('login');
      await onSuccess();
    } catch (error) {
      set({
        apiError: mapAuthError(error, 'Registration failed. Please try again later.', [
          ...REGISTER_SPECIFIC,
          ...NETWORK_MATCHERS,
        ]),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyTwoFactor: async (data, onSuccess) => {
    const effectiveTempToken = data.tempToken || get().tempToken;
    if (!effectiveTempToken) {
      set({ twoFactorError: 'Verification session has expired. Please sign in again.' });
      return;
    }
    set({ isLoading: true, twoFactorError: null });
    try {
      await trpcClient.auth.loginWith2fa.mutate({
        tempToken: effectiveTempToken,
        code: data.code,
      });
      set({ tempToken: null, is2faRequired: false, qrCodeImage: null, secretKey: null });
      try {
        await onSuccess();
      } catch (e) {
        console.error('Post-2FA step failed:', e);
      }
    } catch (error) {
      set({
        twoFactorError: mapAuthError(error, 'Invalid two-factor authentication code.', [
          ...TWO_FA_SPECIFIC,
          ...NETWORK_MATCHERS,
        ]),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  requestPasswordReset: async (email) => {
    set({ isLoading: true, recoveryError: null, isRecoverySuccess: false });
    try {
      await trpcClient.auth.requestPasswordReset.mutate({ email });
      set({ isRecoverySuccess: true });
    } catch (error) {
      set({
        recoveryError: mapAuthError(
          error,
          'Failed to send password reset email. Please try again.',
          [...REQUEST_RESET_SPECIFIC, ...NETWORK_MATCHERS],
        ),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (token, password, onSuccess) => {
    set({ isLoading: true, recoveryError: null });
    try {
      await trpcClient.auth.resetPassword.mutate({ token, password });
      onSuccess();
    } catch (error) {
      set({
        recoveryError: mapAuthError(error, 'Failed to reset password. The link may have expired.', [
          ...RESET_PASSWORD_SPECIFIC,
          ...NETWORK_MATCHERS,
        ]),
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
