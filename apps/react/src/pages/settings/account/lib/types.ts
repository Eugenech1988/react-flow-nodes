import { z } from 'zod';
import { updatePasswordInputSchema } from '@pipeline/contracts';

export const accountPasswordSchema = (hasPassword: boolean) =>
  updatePasswordInputSchema
    .extend({
      currentPassword: z.string().optional(),
      newPassword: z
        .string()
        .min(1, 'New password is required')
        .min(6, 'Password must be at least 6 characters long'),
      confirmPassword: z
        .string()
        .min(1, 'Please confirm your new password'),
    })
    .superRefine((data, ctx) => {
      if (hasPassword && (!data.currentPassword || data.currentPassword.trim() === '')) {
        ctx.addIssue({
          code: 'custom',
          message: 'Current password is required',
          path: ['currentPassword'],
        });
      }

      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: "Passwords don't match",
          path: ['confirmPassword'],
        });
      }

      if (hasPassword && data.currentPassword && data.currentPassword === data.newPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'New password must be different from current password',
          path: ['newPassword'],
        });
      }
    });

export type TAccountFormData = z.infer<ReturnType<typeof accountPasswordSchema>>;