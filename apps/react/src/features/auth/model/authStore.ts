import { create } from 'zustand';
import { api } from '@/shared/api';
import type { FormMode, LoginResponseData, TwoFactorFormData } from './types';

interface AuthState {
  mode: FormMode;
  is2faRequired: boolean;
  tempToken: string | null;
  qrCodeImage: string | null;
  secretKey: string | null;
  apiError: string | null;
  twoFactorError: string | null;
  isLoading: boolean;

  // Actions
  setMode: (mode: FormMode) => void;
  toggleMode: () => void;
  setApiError: (error: string | null) => void;
  setTwoFactorError: (error: string | null) => void;
  resetState: () => void;
  handleLoginResponse: (data: LoginResponseData) => boolean;
  login: (email: string, password: string, onSuccess: () => void) => Promise<void>;
  register: (email: string, password: string, onSuccess: () => void) => Promise<void>;
  verifyTwoFactor: (data: TwoFactorFormData, onSuccess: () => void) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  mode: 'login',
  is2faRequired: false,
  tempToken: null,
  qrCodeImage: null,
  secretKey: null,
  apiError: null,
  twoFactorError: null,
  isLoading: false,

  setMode: (mode) => set({ mode }),
  toggleMode: () => {
    const { mode } = get();
    set({
      mode: mode === 'login' ? 'register' : 'login',
      apiError: null,
      twoFactorError: null,
      is2faRequired: false,
      tempToken: null,
      qrCodeImage: null,
      secretKey: null,
    });
  },
  setApiError: (error) => set({ apiError: error }),
  setTwoFactorError: (error) => set({ twoFactorError: error }),
  resetState: () => set({
    is2faRequired: false,
    tempToken: null,
    qrCodeImage: null,
    secretKey: null,
    twoFactorError: null,
    apiError: null,
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
      const response = await api.post<LoginResponseData>('/auth/login', { email, password });
      const requires2fa = get().handleLoginResponse(response);
      if (!requires2fa) {
        onSuccess();
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
      await api.post('/auth/register', { email, password });
      // после успешной регистрации переключаем на логин
      get().setMode('login');
      onSuccess();
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
      await api.post('/auth/login-2fa', { tempToken, code: data.code });
      onSuccess();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid verification code';
      set({ twoFactorError: message });
    } finally {
      set({ isLoading: false });
    }
  },
}));