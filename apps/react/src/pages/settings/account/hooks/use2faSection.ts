import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AlertState } from '@/shared/lib';
import { useTRPC } from '@/shared/api';
import { useUser } from '@/shared/hooks';

export const use2faSection = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [alert, setAlert] = useState<AlertState>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'enable' | 'disable'>('enable');
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const user2fa = user?.isTwoFactorEnabled ?? false;

  const generate2faMutation = useMutation(
    trpc.auth.generate2fa.mutationOptions({
      onError: (error) => {
        setModalError(error.message || 'Failed to generate 2FA secret.');
      },
    })
  );

  const turnOn2faMutation = useMutation(
    trpc.auth.turnOn2fa.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.me.queryFilter());
        setAlert({ type: 'success', message: 'Two-factor authentication enabled.' });
        setIsOpen(false);
      },
      onError: (error) => {
        setModalError(error.message || 'Invalid code. Failed to enable 2FA.');
      },
    })
  );

  const turnOff2faMutation = useMutation(
    trpc.auth.turnOff2fa.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.auth.me.queryFilter());
        setAlert({ type: 'success', message: 'Two-factor authentication disabled.' });
        setIsOpen(false);
      },
      onError: (error) => {
        setModalError(error.message || 'Invalid code. Failed to disable 2FA.');
      },
    })
  );

  const is2faPending = turnOn2faMutation.isPending || turnOff2faMutation.isPending;
  const isGenerating = generate2faMutation.isPending;

  const handleToggleClick = async () => {
    if (is2faPending || isGenerating) return;

    setModalError(null);

    if (!user2fa) {
      setMode('enable');
      setQrCodeImage(null);
      setIsOpen(true);

      try {
        const res = await generate2faMutation.mutateAsync();
        if (res?.qrCodeImage) {
          setQrCodeImage(res.qrCodeImage);
        }
      } catch {
        // Ошибка обрабатывается в onError мутации generate2faMutation
      }
    } else {
      setMode('disable');
      setQrCodeImage(null);
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setModalError(null);
  };

  const handleConfirm = async (code: string) => {
    setModalError(null);
    setAlert(null);

    if (mode === 'enable') {
      const res = await turnOn2faMutation.mutateAsync({ code });
      return res?.recoveryCodes;
    }

    await turnOff2faMutation.mutateAsync({ code });
  };

  return {
    user2fa,
    is2faPending,
    alert,
    modal2fa: {
      isOpen,
      mode,
      qrCodeImage,
      error: modalError,
      isGenerating,
      handleToggleClick,
      handleClose,
      handleConfirm,
    },
  };
};