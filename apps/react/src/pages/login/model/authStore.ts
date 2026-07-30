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
  isLoading: boolean;

  setMode: (mode: FormMode) => void;
  toggleMode: () => void;
  setApiError: (error: string | null) => void;
  setTwoFactorError: (error: string | null) => void;
  setRecoveryError: (error: string | null) => void;
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
      is2faRequired: false,
      tempToken: null,
      qrCodeImage: null,
      secretKey: null,
    });
  },
  setApiError: (error) => set({ apiError: error }),
  setTwoFactorError: (error) => set({ twoFactorError: error }),
  setRecoveryError: (error) => set({ recoveryError: error }),

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
    set({ isLoading: true, apiError: null, twoFactorError: null });
    try {
      const response = await trpcClient.auth.login.mutate({ email, password });
      const requires2fa = get().handleLoginResponse(response);
      if (!requires2fa) {
        await onSuccess();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      set({ apiError: message });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (email, password, onSuccess) => {
    set({ isLoading: true, apiError: null });
    try {
      await trpcClient.auth.register.mutate({ email, password });
      get().setMode('login');
      await onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong';
      set({ apiError: message });
    } finally {
      set({ isLoading: false });
    }
  },

  verifyTwoFactor: async (data, onSuccess) => {
    const { tempToken } = get();
    if (!tempToken) {
      set({ twoFactorError: 'Missing temporary token' });
      return;
    }
    set({ isLoading: true, twoFactorError: null });
    try {
      await trpcClient.auth.loginWith2fa.mutate({ tempToken, code: data.code });
      await onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid verification code';
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
      const message = error instanceof Error ? error.message : 'Failed to send recovery email';
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
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      set({ recoveryError: message });
    } finally {
      set({ isLoading: false });
    }
  },
}));