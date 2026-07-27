import { z } from 'zod';
import { loginInputSchema, passwordResetInputSchema } from '@pipeline/contracts';

export type FormMode = 'login' | 'register';

export interface LoginResponseData {
  isTwoFactorRequired?: boolean;
  tempToken?: string;
  qrCodeImage?: string;
  secret?: string;
}

export type TRecoveryMode = 'request' | 'reset';

export const requestSchema = loginInputSchema.pick({ email: true });

export const resetSchema = z
  .object({
    password: passwordResetInputSchema.shape.password,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type TRequestFormData = z.infer<typeof requestSchema>;
export type TResetFormData = z.infer<typeof resetSchema>;