import { z } from 'zod';

export const loginInputSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
export type LoginInputData = z.infer<typeof loginInputSchema>;

export const registerInputSchema = loginInputSchema.extend({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().optional(),
  nickName: z.string().min(3, 'Nickname must be at least 3 characters').optional(),
});
export type RegisterInputData = z.infer<typeof registerInputSchema>;

export const registerFormInputSchema = registerInputSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
export type RegisterFormInputData = z.infer<typeof registerFormInputSchema>;

export const twoFactorTotpOnlySchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .transform((val) => val.trim())
    .refine((val) => /^\d{6}$/.test(val), {
      message: 'Code must be exactly 6 digits',
    }),
});

export const twoFactorCodeOrBackupSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .transform((val) => val.trim().replace(/-/g, ''))
    .refine(
      (val) => /^\d{6}$/.test(val) || /^[a-zA-Z0-9]{8,10}$/.test(val),
      {
        message: 'Enter a valid 6-digit code or recovery code',
      }
    ),
});

export const twoFactorLoginInputSchema = z.object({
  tempToken: z.string().min(1, 'Temp token is required'),
  code: twoFactorCodeOrBackupSchema.shape.code,
});
export type TTwoFactorLoginInputData = z.infer<typeof twoFactorLoginInputSchema>;

export const passwordResetInputSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});
export type TPasswordResetInputData = z.infer<typeof passwordResetInputSchema>;

export const requestResetInputSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
});
export type TRequestResetInputData = z.infer<typeof requestResetInputSchema>;

export const updatePasswordInputSchema = z.object({
  currentPassword: z.string().optional().or(z.literal('')),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters'),
});
export type TUpdatePasswordInputData = z.infer<typeof updatePasswordInputSchema>;
