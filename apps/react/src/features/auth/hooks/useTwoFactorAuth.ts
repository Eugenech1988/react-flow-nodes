import { useState } from 'react';
import { api } from '@/shared/api';
import * as z from 'zod';

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;

interface LoginResponseData {
  isTwoFactorRequired?: boolean;
  tempToken?: string;
  qrCodeImage?: string;
  secret?: string;
}

export function useTwoFactorAuth(onSuccessLogin: () => void) {
  const [is2faRequired, setIs2faRequired] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginResponse = (data: LoginResponseData): boolean => {
    if (data?.isTwoFactorRequired) {
      setIs2faRequired(true);
      setTempToken(data.tempToken || null);
      if (data.qrCodeImage) {
        setQrCodeImage(data.qrCodeImage);
        setSecretKey(data.secret || null);
      }
      return true;
    }
    return false;
  };

  const verifyTwoFactor = async (data: TwoFactorFormData) => {
    if (!tempToken) {
      setError('Missing temporary token');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/login-2fa', {
        tempToken,
        code: data.code,
      });
      onSuccessLogin();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid verification code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIs2faRequired(false);
    setTempToken(null);
    setQrCodeImage(null);
    setSecretKey(null);
    setError(null);
  };

  return {
    is2faRequired,
    qrCodeImage,
    secretKey,
    error,
    isLoading,
    handleLoginResponse,
    verifyTwoFactor,
    resetState,
  };
}