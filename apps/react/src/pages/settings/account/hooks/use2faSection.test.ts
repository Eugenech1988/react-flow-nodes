import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { use2faSection } from './use2faSection';

const { mockGenerate, mockTurnOn, mockTurnOff, mockInvalidate, mockUseUser } = vi.hoisted(
  () => ({
    mockGenerate: vi.fn(),
    mockTurnOn: vi.fn(),
    mockTurnOff: vi.fn(),
    mockInvalidate: vi.fn(),
    mockUseUser: vi.fn(),
  }),
);

vi.mock('@tanstack/react-query', () => ({
  useMutation: (opts: unknown) => {
    let mockFn: ReturnType<typeof vi.fn> = vi.fn();
    if (opts?.mutationKey === 'generate') mockFn = mockGenerate;
    if (opts?.mutationKey === 'turnOn') mockFn = mockTurnOn;
    if (opts?.mutationKey === 'turnOff') mockFn = mockTurnOff;

    return {
      mutateAsync: async (vars?: unknown) => {
        try {
          const res = await mockFn(vars);
          opts.onSuccess?.(res);
          return res;
        } catch (e) {
          opts.onError?.(e);
          throw e;
        }
      },
      isPending: false,
    };
  },
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}));

vi.mock('@/shared/api', () => ({
  useTRPC: () => ({
    auth: {
      generate2fa: {
        mutationOptions: (o: unknown) => ({ ...o, mutationKey: 'generate' }),
      },
      turnOn2fa: {
        mutationOptions: (o: unknown) => ({ ...o, mutationKey: 'turnOn' }),
      },
      turnOff2fa: {
        mutationOptions: (o: unknown) => ({ ...o, mutationKey: 'turnOff' }),
      },
      me: { queryFilter: () => ({}) },
    },
  }),
}));

vi.mock('@/shared/hooks', () => ({
  useUser: () => mockUseUser(),
}));

describe('use2faSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { isTwoFactorEnabled: false } });
  });

  describe('initial state', () => {
    it('user2fa is false for user without 2FA', () => {
      const { result } = renderHook(() => use2faSection());
      expect(result.current.user2fa).toBe(false);
    });

    it('user2fa is true for user with 2FA', () => {
      mockUseUser.mockReturnValue({ user: { isTwoFactorEnabled: true } });
      const { result } = renderHook(() => use2faSection());
      expect(result.current.user2fa).toBe(true);
    });

    it('modal starts closed', () => {
      const { result } = renderHook(() => use2faSection());
      expect(result.current.modal2fa.isOpen).toBe(false);
    });
  });

  describe('enable flow', () => {
    it('opens modal and sets qrCodeImage on success', async () => {
      mockGenerate.mockResolvedValue({ qrCodeImage: 'data:image/png;base64,qr' });
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });

      expect(mockGenerate).toHaveBeenCalled();
      expect(result.current.modal2fa.isOpen).toBe(true);
      expect(result.current.modal2fa.mode).toBe('enable');
      expect(result.current.modal2fa.qrCodeImage).toBe('data:image/png;base64,qr');
      expect(result.current.modal2fa.error).toBeNull();
    });

    it('sets error when generate returns no qrCodeImage', async () => {
      mockGenerate.mockResolvedValue({});
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });

      expect(result.current.modal2fa.error).toBe(
        'Server did not return a QR code. Please try again.',
      );
    });

    it('sets error from thrown Error on generate failure', async () => {
      mockGenerate.mockRejectedValue(new Error('Network down'));
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });

      expect(result.current.modal2fa.error).toBe('Network down');
    });

    it('sets generic error on non-Error throw', async () => {
      mockGenerate.mockRejectedValue('string-error');
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });

      expect(result.current.modal2fa.error).toBe(
        'Failed to initialize 2FA. Please try again.',
      );
    });
  });

  describe('confirm flow', () => {
    it('returns recoveryCodes from turnOn2fa', async () => {
      mockGenerate.mockResolvedValue({ qrCodeImage: 'qr' });
      mockTurnOn.mockResolvedValue({ recoveryCodes: ['CODE-1', 'CODE-2'] });
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });

      let codes: string[] | undefined;
      await act(async () => {
        codes = await result.current.modal2fa.handleConfirm('123456');
      });

      expect(mockTurnOn).toHaveBeenCalledWith({ code: '123456' });
      expect(codes).toEqual(['CODE-1', 'CODE-2']);
      expect(mockInvalidate).toHaveBeenCalled();
    });

    it('closes modal and shows success when disabling', async () => {
      mockUseUser.mockReturnValue({ user: { isTwoFactorEnabled: true } });
      mockTurnOff.mockResolvedValue({});
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });
      expect(result.current.modal2fa.mode).toBe('disable');

      await act(async () => {
        await result.current.modal2fa.handleConfirm('123456');
      });

      expect(mockTurnOff).toHaveBeenCalledWith({ code: '123456' });
      expect(result.current.modal2fa.isOpen).toBe(false);
      expect(result.current.alert).toEqual({
        type: 'success',
        message: 'Two-factor authentication disabled.',
      });
    });
  });

  describe('toggle guards', () => {
    it('does nothing when already pending', async () => {
      mockGenerate.mockResolvedValue({ qrCodeImage: 'qr' });
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await Promise.all([
          result.current.modal2fa.handleToggleClick(),
          result.current.modal2fa.handleToggleClick(),
        ]);
      });

      expect(mockGenerate).toHaveBeenCalledTimes(2);
    });
  });

  describe('retry and close', () => {
    it('handleRetryGenerate clears error and calls toggle again', async () => {
      mockGenerate.mockRejectedValueOnce(new Error('first fail'));
      mockGenerate.mockResolvedValueOnce({ qrCodeImage: 'qr-retry' });
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });
      expect(result.current.modal2fa.error).toBe('first fail');

      await act(async () => {
        result.current.modal2fa.handleRetryGenerate();
      });

      expect(result.current.modal2fa.qrCodeImage).toBe('qr-retry');
      expect(result.current.modal2fa.error).toBeNull();
    });

    it('handleClose closes and clears error', async () => {
      mockGenerate.mockRejectedValue(new Error('error'));
      const { result } = renderHook(() => use2faSection());

      await act(async () => {
        await result.current.modal2fa.handleToggleClick();
      });

      act(() => {
        result.current.modal2fa.handleClose();
      });

      expect(result.current.modal2fa.isOpen).toBe(false);
      expect(result.current.modal2fa.error).toBeNull();
    });
  });
});
