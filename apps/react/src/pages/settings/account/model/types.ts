import { z } from 'zod';
import { updatePasswordInputSchema } from '@pipeline/contracts';

const baseAccountPasswordSchema = updatePasswordInputSchema.extend({
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(1, 'New password is required')
    .min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your new password'),
});

export type TAccountFormData = z.infer<typeof baseAccountPasswordSchema>;

export const accountPasswordSchema = (hasPassword: boolean) =>
  baseAccountPasswordSchema.superRefine((data, ctx) => {
    if (hasPassword && (!data.currentPassword || data.currentPassword.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current password is required',
        path: ['currentPassword'],
      });
    }

    if (hasPassword && data.currentPassword && data.currentPassword.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current password must be at least 6 characters long',
        path: ['currentPassword'],
      });
    }

    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['confirmPassword'],
      });
    }

    if (hasPassword && data.currentPassword && data.currentPassword === data.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'New password must be different from current password',
        path: ['newPassword'],
      });
    }
  });