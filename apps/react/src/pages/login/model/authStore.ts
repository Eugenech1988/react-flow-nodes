import { z } from 'zod';
import { create } from 'zustand';
import { trpcClient } from '@/shared/api';
import type { FormMode, LoginResponseData } from '@/pages/login/model/types';
import { twoFactorLoginInputSchema } from '@pipeline/contracts';

type TTwoFactorLoginInputData = z.infer<typeof twoFactorLoginInputSchema>;

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
  login: (email: string, password: string, onSuccess: () => Promise<void> | void) => Promise<void>;
  register: (email: string, password: string, onSuccess: () => Promise<void> | void) => Promise<void>;
  verifyTwoFactor: (data: TTwoFactorLoginInputData, onSuccess: () => Promise<void> | void) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string, onSuccess: () => void) => Promise<void>;
}

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
      if (!requires2fa) {
        await onSuccess();
      }
    } catch (error) {
      let message = 'Unable to sign in. Please verify your credentials and try again.';
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('invalid credentials') || error.message.toLowerCase().includes('wrong password') || error.message.toLowerCase().includes('user not found')) {
          message = 'Invalid email address or password.';
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
          message = 'Network error. Please check your internet connection.';
        } else {
          message = error.message;
        }
      }
      set({ apiError: message });
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
      let message = 'Registration failed. Please try again later.';
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('already exists') || error.message.toLowerCase().includes('conflict')) {
          message = 'An account with this email address already exists.';
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
          message = 'Network error. Please check your internet connection.';
        } else {
          message = error.message;
        }
      }
      set({ apiError: message });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyTwoFactor: async (data, onSuccess) => {
    const { tempToken } = get();
    if (!tempToken) {
      set({ twoFactorError: 'Verification session has expired. Please sign in again.' });
      return;
    }
    set({ isLoading: true, twoFactorError: null });
    try {
      await trpcClient.auth.loginWith2fa.mutate({ tempToken, code: data.code });
      await onSuccess();
    } catch (error) {
      let message = 'Invalid two-factor authentication code.';
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('expired')) {
          message = 'The verification code has expired. Please request a new one.';
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
          message = 'Network error. Please check your internet connection.';
        } else {
          message = error.message;
        }
      }
      set({ twoFactorError: message });
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
      let message = 'Failed to send password reset email. Please try again.';
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('not found') || error.message.toLowerCase().includes('does not exist')) {
          message = 'No account found with this email address.';
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
          message = 'Network error. Please check your internet connection.';
        } else {
          message = error.message;
        }
      }
      set({ recoveryError: message });
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
      let message = 'Failed to reset password. The link may have expired.';
      if (error instanceof Error) {
        if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('expired')) {
          message = 'The password reset link is invalid or has expired.';
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('failed to fetch')) {
          message = 'Network error. Please check your internet connection.';
        } else {
          message = error.message;
        }
      }
      set({ recoveryError: message });
    } finally {
      set({ isLoading: false });
    }
  },
}));