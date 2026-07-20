import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  company: z.string().optional(),
  location: z.string().optional(),
  jobTitle: z.string().optional(),
});

export type IProfileFormData = z.infer<typeof profileSchema>;

const emptyStringToUndefined = z.string().transform((val) => (val === '' ? undefined : val)).optional();

export const accountSchema = z
  .object({
    currentPassword: emptyStringToUndefined,
    newPassword: z
      .string()
      .transform((val) => (val === '' ? undefined : val))
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: 'Password must be at least 6 characters long',
      }),
    confirmPassword: emptyStringToUndefined,
    // twoFactorEnabled: z.boolean(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
  .refine((data) => !data.newPassword || data.currentPassword, {
    message: 'Current password is required to set a new one',
  });

export type IAccountFormData = z.infer<typeof accountSchema>;