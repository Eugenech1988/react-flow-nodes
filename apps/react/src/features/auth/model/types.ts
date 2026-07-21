import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password is required'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const twoFactorSchema = z.object({
  code: z
    .string()
    .length(6, 'Verification code must be exactly 6 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CombinedFormData = LoginFormData & Partial<RegisterFormData>;
export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
export type FormMode = 'login' | 'register';

export interface LoginResponseData {
  isTwoFactorRequired?: boolean;
  tempToken?: string;
  qrCodeImage?: string;
  secret?: string;
}